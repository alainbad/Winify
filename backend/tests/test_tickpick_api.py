"""
TickPick backend API tests.
Covers: auth (signup/signin/me), pools, entries, admin overview, admin run-draw.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://mobile-studio-289.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@tickpick.com"
ADMIN_PASSWORD = "AdminPass123!"
REG_EMAIL = "test@example.com"
REG_PASSWORD = "Test1234"

# ---------- fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s

@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/signin", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin signin failed: {r.status_code} {r.text}"
    j = r.json()
    assert j["user"]["is_admin"] is True
    return j["access_token"]

@pytest.fixture(scope="session")
def user_token(session):
    # try signin first; if fails, signup
    r = session.post(f"{API}/auth/signin", json={"email": REG_EMAIL, "password": REG_PASSWORD})
    if r.status_code == 200:
        return r.json()["access_token"]
    r = session.post(f"{API}/auth/signup", json={"email": REG_EMAIL, "password": REG_PASSWORD, "display_name": "Tester"})
    assert r.status_code == 200, f"signup failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


# ---------- auth ----------
class TestAuth:
    def test_signup_new_user(self, session):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        r = session.post(f"{API}/auth/signup", json={"email": email, "password": "Pass1234", "display_name": "Bob"})
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["token_type"] == "bearer"
        assert j["access_token"]
        # backend lowercases the email
        assert j["user"]["email"] == email.lower()
        assert j["user"]["is_admin"] is False
        assert "id" in j["user"] and j["user"]["display_name"] == "Bob"

    def test_signup_duplicate_returns_400(self, session):
        r = session.post(f"{API}/auth/signup", json={"email": ADMIN_EMAIL, "password": "anything123", "display_name": "x"})
        assert r.status_code == 400

    def test_signin_admin(self, session):
        r = session.post(f"{API}/auth/signin", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        j = r.json()
        assert j["user"]["is_admin"] is True
        assert j["user"]["email"] == ADMIN_EMAIL

    def test_signin_regular_user(self, session, user_token):
        # user_token fixture ensures user exists
        r = session.post(f"{API}/auth/signin", json={"email": REG_EMAIL, "password": REG_PASSWORD})
        assert r.status_code == 200
        j = r.json()
        assert j["user"]["is_admin"] is False
        assert j["user"]["email"] == REG_EMAIL

    def test_signin_bad_password(self, session):
        r = session.post(f"{API}/auth/signin", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_without_token(self, session):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, session, user_token):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {user_token}"})
        assert r.status_code == 200
        j = r.json()
        assert j["email"] == REG_EMAIL
        assert "id" in j and "display_name" in j


# ---------- pools ----------
class TestPools:
    def test_list_pools_count_and_fields(self, session):
        r = session.get(f"{API}/pools")
        assert r.status_code == 200
        pools = r.json()
        assert isinstance(pools, list)
        assert len(pools) >= 12, f"expected >=12 seeded pools, got {len(pools)}"
        sample = pools[0]
        for k in ["id", "brand", "title", "tier", "prize", "ticket_price",
                  "tickets_total", "tickets_sold", "accent", "image_key"]:
            assert k in sample, f"missing field {k}"

    def test_get_pool_by_id(self, session):
        r = session.get(f"{API}/pools")
        pid = r.json()[0]["id"]
        r2 = session.get(f"{API}/pools/{pid}")
        assert r2.status_code == 200
        assert r2.json()["id"] == pid

    def test_get_pool_invalid_id_404(self, session):
        r = session.get(f"{API}/pools/nonexistent-id-xyz")
        assert r.status_code == 404


# ---------- entries ----------
class TestEntries:
    def test_create_entry_no_token_401(self, session):
        r = requests.post(f"{API}/entries", json={"competition_id": "x", "qty": 1})
        assert r.status_code == 401

    def test_create_entry_success_and_increments_sold(self, session, user_token):
        pools = session.get(f"{API}/pools").json()
        # pick a pool with plenty of room
        pool = next((p for p in pools if p["tickets_total"] - p["tickets_sold"] >= 2 and p["status"] == "active"), None)
        assert pool is not None, "no pool with capacity"
        before_sold = pool["tickets_sold"]
        qty = 2
        r = requests.post(
            f"{API}/entries",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"competition_id": pool["id"], "qty": qty},
        )
        assert r.status_code == 200, r.text
        entry = r.json()
        assert entry["qty"] == qty
        assert entry["total"] == qty * pool["ticket_price"]
        assert len(entry["ticket_numbers"]) == qty
        assert entry["status"] == "confirmed"
        # verify pool sold incremented
        after = session.get(f"{API}/pools/{pool['id']}").json()
        assert after["tickets_sold"] == before_sold + qty

    def test_create_entry_too_many_tickets_400(self, session, user_token):
        pools = session.get(f"{API}/pools").json()
        pool = next((p for p in pools if p["status"] == "active"), None)
        assert pool is not None
        left = pool["tickets_total"] - pool["tickets_sold"]
        # qty schema accepts max 10; if left < 10 attempt left+1 (must be <=10)
        oversize = min(10, left + 1) if left < 10 else None
        if oversize is None or oversize <= left:
            pytest.skip("cannot construct oversize qty within schema bounds")
        r = requests.post(
            f"{API}/entries",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"competition_id": pool["id"], "qty": oversize},
        )
        assert r.status_code == 400

    def test_entries_mine_returns_only_user_entries(self, session, user_token):
        r = requests.get(f"{API}/entries/mine", headers={"Authorization": f"Bearer {user_token}"})
        assert r.status_code == 200
        entries = r.json()
        assert isinstance(entries, list)
        # all entries should belong to REG_EMAIL
        for e in entries:
            assert e["email"] == REG_EMAIL


# ---------- admin ----------
class TestAdmin:
    def test_overview_admin(self, session, admin_token):
        r = requests.get(f"{API}/admin/overview", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        j = r.json()
        assert "totals" in j and "top_pools" in j and "recent_entries" in j
        t = j["totals"]
        for k in ["pools", "pools_active", "pools_drawn", "tickets", "revenue"]:
            assert k in t

    def test_overview_non_admin_403(self, session, user_token):
        r = requests.get(f"{API}/admin/overview", headers={"Authorization": f"Bearer {user_token}"})
        assert r.status_code == 403

    def test_run_draw_non_admin_403(self, session, user_token):
        pools = session.get(f"{API}/pools").json()
        pid = pools[0]["id"]
        r = requests.post(f"{API}/admin/draws/{pid}", headers={"Authorization": f"Bearer {user_token}"})
        assert r.status_code == 403

    def test_run_draw_admin_and_duplicate_400(self, session, admin_token):
        # pick a pool with entries (tickets_sold > 0) AND active
        pools = session.get(f"{API}/pools").json()
        target = next((p for p in pools if p["tickets_sold"] > 0 and p["status"] == "active"), None)
        if not target:
            pytest.skip("no active pool with entries available to draw")
        r = requests.post(f"{API}/admin/draws/{target['id']}", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200, r.text
        draw = r.json()
        assert 1 <= draw["winning_ticket"] <= target["tickets_sold"]
        assert draw["competition_id"] == target["id"]
        assert "has_signature" in draw
        # pool should now be 'drawn'
        p2 = session.get(f"{API}/pools/{target['id']}").json()
        assert p2["status"] == "drawn"
        # second call -> 400 already drawn
        r2 = requests.post(f"{API}/admin/draws/{target['id']}", headers={"Authorization": f"Bearer {admin_token}"})
        assert r2.status_code == 400
