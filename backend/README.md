# Lead API (FastAPI)

Receives every form on the gym website (free-trial booking, offer popup, membership enquiry, contact, personal-training callback), validates it, stores it, and optionally emails the front desk / forwards it to your CRM.

## Run locally
```bash
npm run api:setup   # first time (run from Frontend/): creates backend/.venv, installs deps, creates backend/.env
npm run api         # http://localhost:8003  — interactive docs at http://localhost:8003/docs
npm run api:test    # 15 tests
```
The website (`npm run dev`, port 4176) posts to `http://localhost:8003/api/leads` by default.

## Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/leads` | public (rate-limited) | Submit a lead |
| GET | `/api/leads` | `X-API-Key` | List/search — `?form=&interest=&status=&source=&q=&date_from=&date_to=&limit=&offset=` |
| GET | `/api/leads/stats` | `X-API-Key` | Totals, today, last 7 days, by form/interest/status/source |
| GET | `/api/leads/export.csv` | `X-API-Key` | CSV export (Excel-friendly, same filters) |
| GET | `/api/leads/{id}` | `X-API-Key` | One lead |
| PATCH | `/api/leads/{id}` | `X-API-Key` | Update `status` / `notes` |
| DELETE | `/api/leads/{id}` | `X-API-Key` | Delete (data-erasure requests) |
| GET | `/api/health` | public | Health check (includes DB) |

Form types: `enquiry, free-trial, membership, contact, callback`.
Statuses: `new, contacted, trial_scheduled, trial_done, follow_up, joined, lost`.

```bash
curl -H "X-API-Key: dev-admin-key" http://localhost:8003/api/leads/stats
curl -H "X-API-Key: dev-admin-key" -o leads.csv "http://localhost:8003/api/leads/export.csv?form=free-trial&date_from=2026-10-01"
```

## What the API does with a submission
- Validates name, phone (Indian mobiles must be 10 digits starting 6–9; `0`/`91` prefixes are stripped), email, consent, and for free trials a date within the next 30 days and a valid slot (slots must match `TRIAL_SLOTS` in `Frontend/src/layout.js`). Errors come back as `{detail, errors:[{field, message}]}`, which the website shows next to the field.
- Drops spam silently via a hidden honeypot field, and rate-limits each IP (`RATE_LIMIT_PER_MINUTE`).
- Ignores double-submits: same phone + interest + form within 10 minutes returns the existing lead.
- Stores page and UTM/gclid/fbclid attribution, IP and user agent.
- In the background: emails `NOTIFY_EMAILS` (if SMTP is set) and POSTs the lead to `CRM_WEBHOOK_URL` (if set). Failures there never affect the visitor.

## Configuration (`backend/.env`)
See `.env.example`. The essentials for production:
- `ADMIN_API_KEY` — long random string (admin endpoints are disabled when empty).
- `DATABASE_URL` — Postgres recommended, e.g. `postgresql+psycopg://user:pass@host/db` (`pip install "psycopg[binary]"`).
- `CORS_ORIGINS` — your live site, e.g. `https://www.yourdomain.com`.
- `TRUST_PROXY=true` behind Nginx/a load balancer so rate limits use the real client IP.

Then build the website pointing at the live API:
```bash
LEAD_ENDPOINT=https://api.yourdomain.com/api/leads npm run build
```

Production run: `uvicorn app.main:app --host 0.0.0.0 --port 8003 --workers 2` (the in-memory rate limiter is per worker — use Redis if you scale out). Tables are created on startup; add Alembic once you start changing the schema.
