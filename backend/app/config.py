from functools import lru_cache
from typing import List

from typing_extensions import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Cyber Heights Gym Lead API"
    app_env: str = "development"
    database_url: str = "sqlite:///./leads.db"
    cors_origins: Annotated[List[str], NoDecode] = ["http://localhost:4176", "http://127.0.0.1:4176"]
    admin_api_key: str = ""
    rate_limit_per_minute: int = 10
    trust_proxy: bool = False
    # Ignore identical submissions (same phone + interest + form) within this window.
    duplicate_window_minutes: int = 10

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    notify_emails: Annotated[List[str], NoDecode] = []
    crm_webhook_url: str = ""

    @field_validator("cors_origins", "notify_emails", mode="before")
    @classmethod
    def split_csv(cls, v):
        if isinstance(v, str):
            return [x.strip() for x in v.split(",") if x.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
