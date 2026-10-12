import re
from datetime import date, datetime, timedelta, timezone
from typing import List, Literal, Optional
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

IST = ZoneInfo("Asia/Kolkata")


def as_utc(dt: datetime) -> datetime:
    """SQLite returns naive datetimes; all timestamps are stored in UTC."""
    return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt

FormType = Literal["enquiry", "free-trial", "membership", "contact", "callback"]
LeadStatus = Literal["new", "contacted", "trial_scheduled", "trial_done", "follow_up", "joined", "lost"]

# Must match TRIAL_SLOTS in the website's lead form (Frontend/src/layout.js).
TRIAL_SLOTS = (
    "6:00 AM – 9:00 AM",
    "9:00 AM – 12:00 PM",
    "12:00 PM – 5:00 PM",
    "5:00 PM – 8:00 PM",
    "8:00 PM – 11:00 PM",
)

NAME_RE = re.compile(r"^[A-Za-zÀ-ɏऀ-ॿ .'\-]{2,80}$")


def normalise_phone(country_code: str, raw: str) -> str:
    digits = re.sub(r"\D", "", raw or "")
    if country_code == "+91":
        # Accept 098xxxxxxxx / 9198xxxxxxxx / 98xxxxxxxx
        if len(digits) == 11 and digits.startswith("0"):
            digits = digits[1:]
        elif len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        if not re.fullmatch(r"[6-9]\d{9}", digits):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return digits
    if not re.fullmatch(r"\d{6,12}", digits):
        raise ValueError("Enter a valid phone number")
    return digits


class LeadCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    form: FormType = "enquiry"
    name: str = Field(min_length=2, max_length=80)
    country_code: str = Field(default="+91", pattern=r"^\+\d{1,4}$")
    phone: str = Field(max_length=20)
    email: EmailStr
    interest: str = Field(min_length=1, max_length=120, description="Programme or membership plan of interest")
    trial_date: Optional[date] = None
    trial_time: Optional[str] = Field(default=None, max_length=40)
    consent: bool = Field(description="User authorised contact by call/SMS/email/WhatsApp")

    page: Optional[str] = Field(default=None, max_length=300)
    referrer: Optional[str] = Field(default=None, max_length=500)
    utm_source: Optional[str] = Field(default=None, max_length=100)
    utm_medium: Optional[str] = Field(default=None, max_length=100)
    utm_campaign: Optional[str] = Field(default=None, max_length=150)
    utm_term: Optional[str] = Field(default=None, max_length=150)
    utm_content: Optional[str] = Field(default=None, max_length=150)
    gclid: Optional[str] = Field(default=None, max_length=200)
    fbclid: Optional[str] = Field(default=None, max_length=200)

    # Honeypot: a hidden field real users never fill in. Bots that do are silently ignored.
    website: Optional[str] = Field(default=None, max_length=200)

    @field_validator("name")
    @classmethod
    def valid_name(cls, v: str) -> str:
        v = re.sub(r"\s+", " ", v)
        if not NAME_RE.fullmatch(v):
            raise ValueError("Please enter your name using letters only")
        return v

    @field_validator("email")
    @classmethod
    def lower_email(cls, v: str) -> str:
        return v.lower()

    @field_validator("consent")
    @classmethod
    def must_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent is required so we can contact you")
        return v

    @model_validator(mode="after")
    def cross_checks(self) -> "LeadCreate":
        self.phone = normalise_phone(self.country_code, self.phone)
        if self.form == "free-trial":
            if not self.trial_date:
                raise ValueError("Please choose a date for your free trial")
            if not self.trial_time:
                raise ValueError("Please choose a time slot for your free trial")
        if self.trial_date:
            today = datetime.now(IST).date()
            if self.trial_date < today:
                raise ValueError("Trial date must be today or later")
            if self.trial_date > today + timedelta(days=30):
                raise ValueError("Trial date must be within the next 30 days")
        if self.trial_time and self.trial_time not in TRIAL_SLOTS:
            raise ValueError("Please choose a valid time slot")
        return self

    @property
    def phone_e164(self) -> str:
        return f"{self.country_code}{self.phone}"


class LeadCreated(BaseModel):
    id: Optional[int]
    status: Literal["received"] = "received"
    duplicate: bool = False
    message: str


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    form_type: str
    name: str
    country_code: str
    phone: str
    phone_e164: str
    email: str
    interest: str
    trial_date: Optional[date]
    trial_time: Optional[str]
    status: str
    notes: Optional[str]
    page: Optional[str]
    referrer: Optional[str]
    utm_source: Optional[str]
    utm_medium: Optional[str]
    utm_campaign: Optional[str]
    utm_term: Optional[str]
    utm_content: Optional[str]
    gclid: Optional[str]
    fbclid: Optional[str]
    ip_address: Optional[str]

    @field_validator("created_at", "updated_at")
    @classmethod
    def tz_aware(cls, v: datetime) -> datetime:
        return as_utc(v)


class LeadUpdate(BaseModel):
    status: Optional[LeadStatus] = None
    notes: Optional[str] = Field(default=None, max_length=5000)


class LeadList(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[LeadOut]


class LeadStats(BaseModel):
    total: int
    today: int
    last_7_days: int
    by_form: dict
    by_interest: dict
    by_status: dict
    by_source: dict
