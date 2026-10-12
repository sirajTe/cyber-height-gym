import os
import tempfile

_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ.update({
    "DATABASE_URL": f"sqlite:///{_db.name}",
    "ADMIN_API_KEY": "test-key",
    "RATE_LIMIT_PER_MINUTE": "5",
    "CORS_ORIGINS": "http://localhost:4176,https://www.example.com",
    "SMTP_HOST": "",
    "CRM_WEBHOOK_URL": "",
})

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.security import lead_limiter  # noqa: E402


@pytest.fixture()
def client():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    lead_limiter.reset()
    with TestClient(app) as c:
        yield c


ADMIN = {"X-API-Key": "test-key"}
