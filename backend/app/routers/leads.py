import csv
import io
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..config import Settings, get_settings
from ..database import get_db
from ..models import Lead
from ..notify import notify_new_lead
from ..schemas import IST, as_utc, LeadCreate, LeadCreated, LeadList, LeadOut, LeadStats, LeadUpdate
from ..security import client_ip, lead_limiter, require_admin

router = APIRouter(prefix="/api/leads", tags=["leads"])

SUCCESS_MSG = {
    "free-trial": "Your free trial is booked. We'll call you to confirm.",
    "membership": "Thank you! Our membership team will call you shortly.",
}


@router.post("", response_model=LeadCreated, status_code=status.HTTP_201_CREATED, summary="Submit a lead from any website form")
def create_lead(
    payload: LeadCreate,
    request: Request,
    response: Response,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    ip = client_ip(request, settings)
    lead_limiter.check(ip, settings.rate_limit_per_minute)
    message = SUCCESS_MSG.get(payload.form, "Thank you! Our team will call you back shortly.")

    if payload.website:  # honeypot tripped — pretend success, store nothing
        return LeadCreated(id=None, message=message)

    since = datetime.now(timezone.utc) - timedelta(minutes=settings.duplicate_window_minutes)
    existing = db.scalar(
        select(Lead).where(
            Lead.phone_e164 == payload.phone_e164, Lead.interest == payload.interest,
            Lead.form_type == payload.form, Lead.created_at >= since,
        ).limit(1)
    )
    if existing:
        response.status_code = status.HTTP_200_OK
        return LeadCreated(id=existing.id, duplicate=True, message=message)

    lead = Lead(
        form_type=payload.form,
        phone_e164=payload.phone_e164,
        ip_address=ip,
        user_agent=(request.headers.get("user-agent") or "")[:400] or None,
        **payload.model_dump(exclude={"form", "consent", "website"}),
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    background.add_task(notify_new_lead, LeadOut.model_validate(lead))
    return LeadCreated(id=lead.id, message=message)


# ---------------- Admin (requires X-API-Key) ----------------

def _ist_midnight_utc(d: date) -> datetime:
    """Start of an IST calendar day, expressed in UTC (timestamps are stored in UTC)."""
    return datetime.combine(d, time.min, IST).astimezone(timezone.utc)


def _filtered(stmt, form, interest, status_, source, q, date_from, date_to):
    if form:
        stmt = stmt.where(Lead.form_type == form)
    if interest:
        stmt = stmt.where(Lead.interest == interest)
    if status_:
        stmt = stmt.where(Lead.status == status_)
    if source:
        stmt = stmt.where(Lead.utm_source == source)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(or_(func.lower(Lead.name).like(like), Lead.email.like(like), Lead.phone_e164.like(f"%{q}%")))
    if date_from:
        stmt = stmt.where(Lead.created_at >= _ist_midnight_utc(date_from))
    if date_to:
        stmt = stmt.where(Lead.created_at < _ist_midnight_utc(date_to + timedelta(days=1)))
    return stmt


class _Filters:
    def __init__(
        self,
        form: Optional[str] = None,
        interest: Optional[str] = None,
        status: Optional[str] = None,
        source: Optional[str] = Query(None, description="utm_source"),
        q: Optional[str] = Query(None, description="Search name, email or phone"),
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
    ):
        self.args = (form, interest, status, source, q, date_from, date_to)


@router.get("", response_model=LeadList, dependencies=[Depends(require_admin)], summary="List leads (admin)")
def list_leads(
    f: _Filters = Depends(),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    base = _filtered(select(Lead), *f.args)
    total = db.scalar(select(func.count()).select_from(base.subquery()))
    items = db.scalars(base.order_by(Lead.created_at.desc(), Lead.id.desc()).limit(limit).offset(offset)).all()
    return LeadList(total=total, limit=limit, offset=offset, items=items)


EXPORT_COLUMNS = [
    "id", "created_at", "form_type", "name", "phone_e164", "email", "interest", "trial_date", "trial_time", "status",
    "notes", "page", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid",
]


@router.get("/export.csv", dependencies=[Depends(require_admin)], summary="Export leads as CSV (admin)")
def export_leads(f: _Filters = Depends(), db: Session = Depends(get_db)):
    rows = db.scalars(_filtered(select(Lead), *f.args).order_by(Lead.created_at.desc())).all()
    buf = io.StringIO()
    buf.write("﻿")  # BOM so Excel opens UTF-8 (₹, Hindi names) correctly
    w = csv.writer(buf)
    w.writerow(EXPORT_COLUMNS)
    for r in rows:
        w.writerow([as_utc(r.created_at).astimezone(IST).strftime("%Y-%m-%d %H:%M") if c == "created_at" else getattr(r, c) for c in EXPORT_COLUMNS])
    filename = f"leads-{datetime.now(IST):%Y%m%d-%H%M}.csv"
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv; charset=utf-8",
                             headers={"Content-Disposition": f'attachment; filename="{filename}"'})


@router.get("/stats", response_model=LeadStats, dependencies=[Depends(require_admin)], summary="Lead counts (admin)")
def lead_stats(db: Session = Depends(get_db)):
    def group(col):
        return {k or "direct": v for k, v in db.execute(select(col, func.count()).group_by(col).order_by(func.count().desc())).all()}

    start_today = _ist_midnight_utc(datetime.now(IST).date())
    return LeadStats(
        total=db.scalar(select(func.count(Lead.id))),
        today=db.scalar(select(func.count(Lead.id)).where(Lead.created_at >= start_today)),
        last_7_days=db.scalar(select(func.count(Lead.id)).where(Lead.created_at >= start_today - timedelta(days=6))),
        by_form=group(Lead.form_type),
        by_interest=group(Lead.interest),
        by_status=group(Lead.status),
        by_source=group(Lead.utm_source),
    )


def _get_or_404(db: Session, lead_id: int) -> Lead:
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Lead not found")
    return lead


@router.get("/{lead_id}", response_model=LeadOut, dependencies=[Depends(require_admin)], summary="Get one lead (admin)")
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, lead_id)


@router.patch("/{lead_id}", response_model=LeadOut, dependencies=[Depends(require_admin)], summary="Update status / notes (admin)")
def update_lead(lead_id: int, body: LeadUpdate, db: Session = Depends(get_db)):
    lead = _get_or_404(db, lead_id)
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(lead, k, v)
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)], summary="Delete a lead (admin, e.g. data-erasure request)")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    db.delete(_get_or_404(db, lead_id))
    db.commit()
