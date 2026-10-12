from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy import Date, DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    form_type: Mapped[str] = mapped_column(String(20), index=True)
    name: Mapped[str] = mapped_column(String(80))
    country_code: Mapped[str] = mapped_column(String(5))
    phone: Mapped[str] = mapped_column(String(15))  # national number, digits only
    phone_e164: Mapped[str] = mapped_column(String(20), index=True)
    email: Mapped[str] = mapped_column(String(254), index=True)
    interest: Mapped[str] = mapped_column(String(120), index=True)
    trial_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    trial_time: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)

    status: Mapped[str] = mapped_column(String(30), default="new", index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Attribution
    page: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    referrer: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    utm_source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    utm_medium: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    utm_campaign: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    utm_term: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    utm_content: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    gclid: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    fbclid: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(400), nullable=True)

    __table_args__ = (Index("ix_leads_dedupe", "phone_e164", "interest", "form_type", "created_at"),)
