from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, secrets, hashlib
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt, JWTError
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ.get('JWT_SECRET', 'changeme')
JWT_ALG = 'HS256'
JWT_EXPIRE_MIN = 60 * 24 * 7  # 7 days
ADMIN_EMAIL = 'admin@tickpick.com'
ADMIN_PASSWORD = os.environ.get('INITIAL_ADMIN_PASSWORD', 'AdminPass123!')
RANDOM_ORG_API_KEY = os.environ.get('RANDOM_ORG_API_KEY', '')

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()
api = APIRouter(prefix="/api")
oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/signin", auto_error=False)
log = logging.getLogger("tickpick")

# ============ MODELS ============
class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    display_name: str

class SigninIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    display_name: str
    is_admin: bool
    avatar_url: Optional[str] = None
    created_at: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None

class PoolOut(BaseModel):
    id: str
    brand: str
    title: str
    category: str
    tier: str
    prize: int
    ticket_price: int
    tickets_total: int
    tickets_sold: int
    ends_at: int
    accent: str
    image_key: str
    hot: bool = False
    desc: str = ""
    gumroad_url: Optional[str] = None
    status: str = "active"

class EntryCreate(BaseModel):
    competition_id: str
    qty: int = Field(ge=1, le=10)

class EntryOut(BaseModel):
    id: str
    competition_id: str
    user_id: str
    email: str
    brand: str
    title: str
    qty: int
    total: float
    status: str
    created_at: str
    ticket_numbers: List[int] = []

class DrawOut(BaseModel):
    id: str
    competition_id: str
    winner_email: Optional[str]
    winning_ticket: int
    total_tickets: int
    drawn_at: int
    serial_number: Optional[int] = None
    has_signature: bool = False

# ============ HELPERS ============
def hash_pw(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def verify_pw(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except Exception:
        return False

def make_token(uid: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MIN)
    return jwt.encode({"sub": uid, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG)

def user_to_out(u: dict) -> UserOut:
    return UserOut(
        id=u["id"], email=u["email"], display_name=u["display_name"],
        is_admin=u.get("is_admin", False), avatar_url=u.get("avatar_url"),
        created_at=u.get("created_at", ""),
    )

async def current_user(token: Optional[str] = Depends(oauth2)) -> dict:
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        uid = payload.get("sub")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    u = await db.users.find_one({"id": uid}, {"_id": 0, "password_hash": 0})
    if not u:
        raise HTTPException(401, "User not found")
    return u

async def admin_only(u: dict = Depends(current_user)) -> dict:
    if not u.get("is_admin"):
        raise HTTPException(403, "Admin required")
    return u

# ============ AUTH ROUTES ============
@api.post("/auth/signup", response_model=TokenOut)
async def signup(d: SignupIn):
    if await db.users.find_one({"email": d.email.lower()}):
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid, "email": d.email.lower(), "password_hash": hash_pw(d.password),
        "display_name": d.display_name, "is_admin": False, "avatar_url": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    doc.pop("password_hash", None); doc.pop("_id", None)
    return TokenOut(access_token=make_token(uid), user=user_to_out(doc))

@api.post("/auth/signin", response_model=TokenOut)
async def signin(d: SigninIn):
    u = await db.users.find_one({"email": d.email.lower()}, {"_id": 0})
    if not u or not verify_pw(d.password, u["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    return TokenOut(access_token=make_token(u["id"]), user=user_to_out(u))

@api.get("/auth/me", response_model=UserOut)
async def me(u: dict = Depends(current_user)):
    return user_to_out(u)

@api.patch("/auth/me", response_model=UserOut)
async def update_me(p: ProfileUpdate, u: dict = Depends(current_user)):
    upd = {k: v for k, v in p.dict(exclude_none=True).items()}
    if upd:
        await db.users.update_one({"id": u["id"]}, {"$set": upd})
    u2 = await db.users.find_one({"id": u["id"]}, {"_id": 0, "password_hash": 0})
    return user_to_out(u2)

# ============ POOLS ROUTES ============
@api.get("/pools", response_model=List[PoolOut])
async def list_pools():
    docs = await db.pools.find({}, {"_id": 0}).to_list(500)
    return [PoolOut(**d) for d in docs]

@api.get("/pools/{pid}", response_model=PoolOut)
async def get_pool(pid: str):
    d = await db.pools.find_one({"id": pid}, {"_id": 0})
    if not d:
        raise HTTPException(404, "Pool not found")
    return PoolOut(**d)

# ============ ENTRIES ROUTES ============
@api.post("/entries", response_model=EntryOut)
async def create_entry(e: EntryCreate, u: dict = Depends(current_user)):
    pool = await db.pools.find_one({"id": e.competition_id}, {"_id": 0})
    if not pool:
        raise HTTPException(404, "Pool not found")
    if pool.get("status") != "active":
        raise HTTPException(400, "Pool closed")
    left = pool["tickets_total"] - pool["tickets_sold"]
    if e.qty > left:
        raise HTTPException(400, f"Only {left} tickets left")
    # assign ticket numbers
    start = pool["tickets_sold"] + 1
    ticket_nums = list(range(start, start + e.qty))
    eid = str(uuid.uuid4())
    total = e.qty * pool["ticket_price"]
    doc = {
        "id": eid, "competition_id": e.competition_id, "user_id": u["id"],
        "email": u["email"], "brand": pool["brand"], "title": pool["title"],
        "qty": e.qty, "total": total, "status": "confirmed",
        "ticket_numbers": ticket_nums,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.entries.insert_one(doc)
    await db.pools.update_one({"id": e.competition_id}, {"$inc": {"tickets_sold": e.qty}})
    doc.pop("_id", None)
    return EntryOut(**doc)

@api.get("/entries/mine", response_model=List[EntryOut])
async def my_entries(u: dict = Depends(current_user)):
    docs = await db.entries.find({"user_id": u["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [EntryOut(**d) for d in docs]

# ============ DRAWS ROUTES ============
@api.get("/draws", response_model=List[DrawOut])
async def list_draws():
    docs = await db.draws.find({}, {"_id": 0}).sort("drawn_at", -1).to_list(500)
    return [DrawOut(**d) for d in docs]

async def random_org_pick(min_v: int, max_v: int) -> tuple[int, Optional[int], bool]:
    """Returns (number, serial, has_signature). Falls back to secrets.randbelow."""
    if RANDOM_ORG_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as cl:
                r = await cl.post(
                    "https://api.random.org/json-rpc/4/invoke",
                    json={
                        "jsonrpc": "2.0", "method": "generateSignedIntegers",
                        "params": {"apiKey": RANDOM_ORG_API_KEY, "n": 1, "min": min_v, "max": max_v},
                        "id": 1,
                    },
                )
                j = r.json()
                result = j.get("result", {})
                random_data = result.get("random", {})
                n = random_data.get("data", [None])[0]
                serial = result.get("bitsUsed") and result.get("signatureCount") or result.get("random", {}).get("serialNumber")
                # Actual serial in random.org v4 is in result['random']['serialNumber'] or 'serialNumber' top-level
                serial = random_data.get("serialNumber") or result.get("signatureCount")
                if n is not None:
                    return n, serial, True
        except Exception as ex:
            log.warning(f"RANDOM.ORG failed, falling back: {ex}")
    return secrets.randbelow(max_v - min_v + 1) + min_v, None, False

@api.post("/admin/draws/{pid}", response_model=DrawOut)
async def run_draw(pid: str, u: dict = Depends(admin_only)):
    pool = await db.pools.find_one({"id": pid}, {"_id": 0})
    if not pool:
        raise HTTPException(404, "Pool not found")
    if await db.draws.find_one({"competition_id": pid}):
        raise HTTPException(400, "Pool already drawn")
    if pool["tickets_sold"] == 0:
        raise HTTPException(400, "No entries")
    winning, serial, has_sig = await random_org_pick(1, pool["tickets_sold"])
    # find winner entry
    entries = await db.entries.find({"competition_id": pid}, {"_id": 0}).to_list(10000)
    winner_email = None
    for e in entries:
        if winning in e.get("ticket_numbers", []):
            winner_email = e["email"]
            break
    did = str(uuid.uuid4())
    draw_doc = {
        "id": did, "competition_id": pid, "winner_email": winner_email,
        "winning_ticket": winning, "total_tickets": pool["tickets_sold"],
        "drawn_at": int(datetime.now(timezone.utc).timestamp() * 1000),
        "serial_number": serial, "has_signature": has_sig,
    }
    await db.draws.insert_one(draw_doc)
    await db.pools.update_one({"id": pid}, {"$set": {"status": "drawn"}})
    draw_doc.pop("_id", None)
    return DrawOut(**draw_doc)

# ============ ADMIN ROUTES ============
@api.get("/admin/overview")
async def admin_overview(u: dict = Depends(admin_only)):
    pools = await db.pools.find({}, {"_id": 0}).to_list(500)
    entries = await db.entries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    draws = await db.draws.find({}, {"_id": 0}).to_list(500)
    drawn_ids = {d["competition_id"] for d in draws}
    revenue = sum(e["total"] for e in entries)
    tickets = sum(e["qty"] for e in entries)
    pools_active = sum(1 for p in pools if p.get("status") == "active")
    top = sorted(pools, key=lambda p: -(p["tickets_sold"] / max(1, p["tickets_total"])))[:5]
    return {
        "totals": {
            "pools": len(pools),
            "pools_active": pools_active,
            "pools_drawn": len(drawn_ids),
            "tickets": tickets,
            "revenue": revenue,
        },
        "top_pools": [{
            "id": p["id"], "brand": p["brand"], "prize": p["title"],
            "tickets_sold": p["tickets_sold"], "tickets_total": p["tickets_total"],
            "fill_pct": p["tickets_sold"] / max(1, p["tickets_total"]),
            "revenue": p["tickets_sold"] * p["ticket_price"],
            "status": "drawn" if p["id"] in drawn_ids else p.get("status", "active"),
        } for p in top],
        "recent_entries": [{
            "id": e["id"], "competition_id": e["competition_id"],
            "email": e.get("email"), "brand": e["brand"], "prize": e["title"],
            "qty": e["qty"], "total": e["total"], "created_at": e["created_at"],
        } for e in entries[:10]],
    }

# ============ SEED ============
SEED_POOLS = [
    {"brand": "Amazon", "title": "$1000 Amazon Gift Card", "category": "Gift Cards", "tier": "MEGA", "prize": 1000, "ticket_price": 5, "tickets_total": 250, "tickets_sold": 187, "accent": "#FF9900", "image_key": "amazon", "hot": True, "desc": "Spend on millions of items, fast delivery."},
    {"brand": "Apple", "title": "$500 Apple Gift Card", "category": "Lifestyle", "tier": "VOLUME", "prize": 500, "ticket_price": 5, "tickets_total": 150, "tickets_sold": 89, "accent": "#A6A6A6", "image_key": "apple", "hot": True, "desc": "Apps, music, hardware credit."},
    {"brand": "Steam", "title": "$250 Steam Wallet", "category": "Gaming", "tier": "VOLUME", "prize": 250, "ticket_price": 5, "tickets_total": 100, "tickets_sold": 78, "accent": "#1B2838", "image_key": "steam", "desc": "Top up your Steam library."},
    {"brand": "Nike", "title": "$200 Nike Gift Card", "category": "Lifestyle", "tier": "VOLUME", "prize": 200, "ticket_price": 5, "tickets_total": 80, "tickets_sold": 42, "accent": "#111111", "image_key": "nike", "desc": "Just do it — kicks and gear."},
    {"brand": "Sephora", "title": "$150 Sephora Card", "category": "Lifestyle", "tier": "MICRO", "prize": 150, "ticket_price": 5, "tickets_total": 60, "tickets_sold": 51, "accent": "#111111", "image_key": "sephora", "hot": True, "desc": "Beauty, skincare, fragrance."},
    {"brand": "Uber Eats", "title": "$75 Uber Eats Credit", "category": "Lifestyle", "tier": "MICRO", "prize": 75, "ticket_price": 5, "tickets_total": 30, "tickets_sold": 19, "accent": "#06C167", "image_key": "ubereats", "desc": "Order in tonight."},
    {"brand": "Netflix", "title": "$200 Netflix Voucher", "category": "Entertainment", "tier": "VOLUME", "prize": 200, "ticket_price": 5, "tickets_total": 80, "tickets_sold": 64, "accent": "#E50914", "image_key": "netflix", "desc": "Stream all you want."},
    {"brand": "Spotify", "title": "$100 Spotify Premium", "category": "Entertainment", "tier": "MICRO", "prize": 100, "ticket_price": 5, "tickets_total": 40, "tickets_sold": 12, "accent": "#1DB954", "image_key": "spotify", "desc": "Ad-free music for months."},
    {"brand": "PlayStation", "title": "$150 PSN Wallet", "category": "Gaming", "tier": "MICRO", "prize": 150, "ticket_price": 5, "tickets_total": 60, "tickets_sold": 35, "accent": "#003791", "image_key": "playstation", "desc": "Games, DLC, subscriptions."},
    {"brand": "Xbox", "title": "$100 Xbox Card", "category": "Gaming", "tier": "MICRO", "prize": 100, "ticket_price": 5, "tickets_total": 40, "tickets_sold": 28, "accent": "#107C10", "image_key": "xbox", "desc": "Game Pass, store credit."},
    {"brand": "Airbnb", "title": "$300 Airbnb Credit", "category": "Travel", "tier": "VOLUME", "prize": 300, "ticket_price": 5, "tickets_total": 120, "tickets_sold": 73, "accent": "#FF5A5F", "image_key": "airbnb", "desc": "Your next getaway."},
    {"brand": "Disney+", "title": "$100 Disney+ Card", "category": "Entertainment", "tier": "MICRO", "prize": 100, "ticket_price": 5, "tickets_total": 40, "tickets_sold": 9, "accent": "#0061D5", "image_key": "disneyplus", "desc": "Stream Disney, Marvel, Star Wars."},
]

@app.on_event("startup")
async def seed():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.pools.create_index("id", unique=True)
    await db.pools.create_index("seed_id", unique=True, sparse=True)
    # Seed admin — idempotent upsert (never overrides a manually-changed password)
    await db.users.update_one(
        {"email": ADMIN_EMAIL},
        {"$setOnInsert": {
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_pw(ADMIN_PASSWORD),
            "display_name": "Admin",
            "is_admin": True,
            "avatar_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    log.info("Admin user ensured (idempotent)")
    # Seed pools — idempotent upsert by stable seed_id (brand+title)
    now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    for i, p in enumerate(SEED_POOLS):
        seed_id = f"{p['brand']}|{p['title']}"
        await db.pools.update_one(
            {"seed_id": seed_id},
            {"$setOnInsert": {
                **p,
                "seed_id": seed_id,
                "id": str(uuid.uuid4()),
                "ends_at": now_ms + (24 + i * 6) * 3600 * 1000,
                "gumroad_url": "https://badranalain.gumroad.com/l/spjrva",
                "status": "active",
            }},
            upsert=True,
        )
    log.info(f"{len(SEED_POOLS)} pools ensured (idempotent)")

@app.on_event("shutdown")
async def shutdown():
    client.close()

app.include_router(api)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
