from datetime import date, timedelta

from tests.conftest import ADMIN

VALID = {
    "form": "enquiry", "name": "Rohit Malhotra", "country_code": "+91", "phone": "98765 43210",
    "email": "Rohit@Example.com", "interest": "Strength Training", "consent": True,
    "page": "/programs/strength-training/", "utm_source": "google", "utm_campaign": "launch",
}


def post(client, **over):
    return client.post("/api/leads", json={**VALID, **over})


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_create_lead_normalises_and_stores(client):
    r = post(client)
    assert r.status_code == 201, r.text
    lead_id = r.json()["id"]
    got = client.get(f"/api/leads/{lead_id}", headers=ADMIN).json()
    assert got["phone"] == "9876543210"
    assert got["phone_e164"] == "+919876543210"
    assert got["email"] == "rohit@example.com"
    assert got["status"] == "new"
    assert got["utm_source"] == "google"


def test_indian_phone_prefixes_accepted(client):
    assert post(client, phone="+91 98765-43211").status_code == 201
    assert post(client, phone="09876543212").status_code == 201


def test_invalid_phone_rejected_with_friendly_message(client):
    r = post(client, phone="12345")
    assert r.status_code == 422
    assert r.json()["detail"] == "Enter a valid 10-digit Indian mobile number"


def test_international_number(client):
    assert post(client, country_code="+971", phone="501234567").status_code == 201


def test_invalid_email(client):
    r = post(client, email="not-an-email")
    assert r.status_code == 422
    assert r.json()["errors"][0] == {"field": "email", "message": "Enter a valid email address"}


def test_consent_required(client):
    assert post(client, consent=False).status_code == 422


def test_free_trial_requires_date_and_slot(client):
    r = post(client, form="free-trial")
    assert r.status_code == 422 and "date" in r.json()["detail"]
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    assert post(client, form="free-trial", trial_date=tomorrow, trial_time="5:00 PM – 8:00 PM").status_code == 201
    assert post(client, form="free-trial", trial_date=tomorrow, trial_time="midnight", phone="9876500000").status_code == 422
    past = (date.today() - timedelta(days=2)).isoformat()
    assert post(client, form="free-trial", trial_date=past, trial_time="5:00 PM – 8:00 PM", phone="9876500001").status_code == 422
    far = (date.today() + timedelta(days=45)).isoformat()
    assert post(client, form="free-trial", trial_date=far, trial_time="5:00 PM – 8:00 PM", phone="9876500002").status_code == 422


def test_unknown_form_type_rejected(client):
    assert post(client, form="site-visit").status_code == 422


def test_duplicate_within_window_is_not_stored_twice(client):
    a = post(client).json()
    b = post(client)
    assert b.status_code == 200 and b.json()["duplicate"] is True and b.json()["id"] == a["id"]
    assert client.get("/api/leads", headers=ADMIN).json()["total"] == 1


def test_honeypot_is_silently_dropped(client):
    r = post(client, website="http://spam.example")
    assert r.status_code == 201 and r.json()["id"] is None
    assert client.get("/api/leads", headers=ADMIN).json()["total"] == 0


def test_rate_limit(client):
    codes = [post(client, phone=f"98765000{i:02d}").status_code for i in range(6)]
    assert codes[:5] == [201] * 5 and codes[5] == 429


def test_admin_requires_key(client):
    assert client.get("/api/leads").status_code == 401
    assert client.get("/api/leads", headers={"X-API-Key": "wrong"}).status_code == 401


def test_list_filter_update_stats_export_delete(client):
    post(client)
    post(client, interest="Annual membership", phone="9123456789", form="membership")
    r = client.get("/api/leads", params={"interest": "Annual membership"}, headers=ADMIN).json()
    assert r["total"] == 1 and r["items"][0]["form_type"] == "membership"
    assert client.get("/api/leads", params={"q": "rohit"}, headers=ADMIN).json()["total"] == 2
    assert client.get("/api/leads", params={"date_from": date.today().isoformat()}, headers=ADMIN).json()["total"] == 2

    lead_id = r["items"][0]["id"]
    u = client.patch(f"/api/leads/{lead_id}", json={"status": "trial_scheduled", "notes": "Trial Sat 6 PM"}, headers=ADMIN)
    assert u.status_code == 200 and u.json()["status"] == "trial_scheduled"
    assert client.patch(f"/api/leads/{lead_id}", json={"status": "bogus"}, headers=ADMIN).status_code == 422

    s = client.get("/api/leads/stats", headers=ADMIN).json()
    assert s["total"] == 2 and s["today"] == 2 and s["by_form"] == {"enquiry": 1, "membership": 1}

    csv = client.get("/api/leads/export.csv", headers=ADMIN)
    assert csv.status_code == 200 and "attachment" in csv.headers["content-disposition"]
    assert csv.text.count("\n") == 3 and "+919123456789" in csv.text

    assert client.delete(f"/api/leads/{lead_id}", headers=ADMIN).status_code == 204
    assert client.get(f"/api/leads/{lead_id}", headers=ADMIN).status_code == 404


def test_cors_preflight(client):
    r = client.options("/api/leads", headers={"Origin": "http://localhost:4176", "Access-Control-Request-Method": "POST",
                                              "Access-Control-Request-Headers": "content-type"})
    assert r.status_code == 200 and r.headers["access-control-allow-origin"] == "http://localhost:4176"
    bad = client.options("/api/leads", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in bad.headers
