"""Optional side effects for a new lead: email the front desk / sales team and/or forward to a CRM webhook.
Both run as FastAPI background tasks, so a slow SMTP server or CRM never delays the visitor's response."""
import logging
import smtplib
from email.message import EmailMessage

import httpx

from .config import get_settings
from .schemas import LeadOut

log = logging.getLogger("leads.notify")


def _summary(lead: LeadOut) -> str:
    rows = [
        ("Form", lead.form_type), ("Name", lead.name), ("Phone", lead.phone_e164), ("Email", lead.email),
        ("Interest", lead.interest), ("Trial", f"{lead.trial_date} {lead.trial_time}" if lead.trial_date else "—"),
        ("Page", lead.page or "—"), ("Source", " / ".join(filter(None, [lead.utm_source, lead.utm_medium, lead.utm_campaign])) or "direct"),
        ("Received", lead.created_at.isoformat()),
    ]
    return "\n".join(f"{k}: {v}" for k, v in rows)


def send_email(lead: LeadOut) -> None:
    s = get_settings()
    if not (s.smtp_host and s.notify_emails):
        return
    msg = EmailMessage()
    msg["Subject"] = f"New {lead.form_type} lead — {lead.interest} — {lead.name}"
    msg["From"] = s.smtp_from or s.smtp_user
    msg["To"] = ", ".join(s.notify_emails)
    msg.set_content(_summary(lead) + f"\n\nCall now: tel:{lead.phone_e164}\nWhatsApp: https://wa.me/{lead.phone_e164.lstrip('+')}")
    try:
        with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15) as smtp:
            smtp.starttls()
            if s.smtp_user:
                smtp.login(s.smtp_user, s.smtp_password)
            smtp.send_message(msg)
    except Exception:  # never let notification failures affect lead capture
        log.exception("Failed to send lead email for lead %s", lead.id)


def post_webhook(lead: LeadOut) -> None:
    s = get_settings()
    if not s.crm_webhook_url:
        return
    try:
        r = httpx.post(s.crm_webhook_url, json=lead.model_dump(mode="json", exclude={"ip_address"}), timeout=10)
        r.raise_for_status()
    except Exception:
        log.exception("Failed to forward lead %s to CRM webhook", lead.id)


def notify_new_lead(lead: LeadOut) -> None:
    send_email(lead)
    post_webhook(lead)
