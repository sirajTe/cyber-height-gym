import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from .config import get_settings
from .database import Base, SessionLocal, engine
from .routers import leads

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # use Alembic migrations once the schema starts evolving
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Captures enquiry, free-trial, membership, contact and callback leads from the gym website. "
    "Admin endpoints require the `X-API-Key` header.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-API-Key"],
    max_age=86400,
)


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    """Return friendly, form-ready messages: {detail, errors: [{field, message}]}."""
    errors = []
    for e in exc.errors():
        loc = [str(p) for p in e.get("loc", []) if p != "body"]
        msg = e.get("msg", "Invalid value").removeprefix("Value error, ")
        if e.get("type") == "missing":
            msg = "This field is required"
        elif loc and loc[-1] == "email":
            msg = "Enter a valid email address"
        errors.append({"field": loc[-1] if loc else None, "message": msg})
    return JSONResponse(status_code=422, content={"detail": errors[0]["message"] if errors else "Invalid request", "errors": errors})


app.include_router(leads.router)


@app.get("/api/health", tags=["system"])
def health():
    with SessionLocal() as db:
        db.execute(text("SELECT 1"))
    return {"status": "ok", "env": settings.app_env}
