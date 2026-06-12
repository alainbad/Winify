# Tick-Pick — Project Summary

> A $5-a-ticket gift-card prize-draw mobile app. Pick a pool, grab a ticket, win premium gift cards (Amazon, Apple, Steam, Nike, Sephora, Netflix, PlayStation, Airbnb, Disney+…). Every draw is cryptographically random and (when an API key is set) signed by RANDOM.ORG.

---

## 1. Concept

| | |
|---|---|
| **Name** | Tick-Pick |
| **Bundle ID** | `com.tickpick.app` (iOS + Android) |
| **Type** | React Native (Expo SDK 54) mobile app, file-based routing |
| **Ticket price** | Flat **$5** per entry |
| **Payment** | Gumroad redirect (in-app browser) — no card data ever touches the app |
| **Winner picking** | RANDOM.ORG signed integers (with cryptographically secure fallback via Python `secrets`) |
| **Identity colors** | Purple `#6D28D9`, Shell `#2D1B69`, Gold `#F59E0B`, BG `#FAF8FF` |

---

## 2. Stack

```
┌─ React Native (Expo Router, SDK 54)      → /app/frontend
│   ├─ Auth context with expo-secure-store
│   ├─ expo-image  ·  expo-linear-gradient
│   ├─ expo-web-browser (Gumroad redirect)
│   └─ @expo/vector-icons (Ionicons)
│
├─ FastAPI + motor (MongoDB async)         → /app/backend
│   ├─ bcrypt + python-jose (JWT)
│   ├─ httpx (RANDOM.ORG signed-integer API)
│   └─ Pydantic models — every response strips _id
│
└─ MongoDB (local, persistent)             → collections: users, pools, entries, draws
```

---

## 3. Features shipped

### User-facing
- **Home** — hero, live-draws counter, featured pools grid, How-It-Works, trust pillars
- **Browse** — category chips (All / Gift Cards / Gaming / Entertainment / Lifestyle / Travel), search, 2-column card grid
- **Competition Detail** — large rotated gift-card visual, countdown timer (D/H/M/S), tier badge, progress bar, +/− quantity selector with 1/3/5 presets, sticky bottom CTA
- **Checkout** — pool summary, fee breakdown, "Confirm entry" (creates DB entry → reserves ticket numbers) → Gumroad redirect for payment
- **My Entries** — list of past entries with brand, qty, total, date
- **Winners** — verified-draws table (real draws + showcase winner feed)
- **Account** — profile (display name, avatar, sign out), spend stats
- **Auth** — email + password (signup / signin toggle)

### Admin (behind `is_admin` flag)
- **Dashboard** — totals (pools, active/drawn, tickets sold, revenue), top pools, recent entries
- **Run Draw** — one-tap per-pool draw → picks winning ticket → resolves entry holder → closes pool

### Backend specifics
- Tickets get **consecutive integer numbers** assigned at entry time (atomic increment on the pool)
- Draw runs by picking a random integer in `[1, tickets_sold]` and finding the entry that holds that number
- Idempotent seeding (12 pools + admin user) — survives container restarts safely
- All `datetime` uses `timezone.utc`; all collection responses strip MongoDB `_id`

---

## 4. API surface (all routes prefixed `/api`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Create user, return JWT |
| `POST` | `/auth/signin` | — | Email+password, return JWT |
| `GET`  | `/auth/me` | Bearer | Current user |
| `PATCH`| `/auth/me` | Bearer | Update display_name / avatar_url |
| `GET`  | `/pools` | — | List 12 seeded pools |
| `GET`  | `/pools/{id}` | — | Single pool |
| `POST` | `/entries` | Bearer | Buy `qty` tickets (1–10) for a pool |
| `GET`  | `/entries/mine` | Bearer | Current user's entries (newest first) |
| `GET`  | `/draws` | — | Public draw history |
| `POST` | `/admin/draws/{pid}` | Admin | Run a draw on a pool |
| `GET`  | `/admin/overview` | Admin | Dashboard totals + top pools + recent entries |

Backend testing: **19/20 PASS, 0 FAIL, 1 SKIP** (skipped branch requires a zero-entry pool which isn't seeded — code path verified manually).

---

## 5. File map

```
/app
├── backend/
│   ├── server.py          # one-file FastAPI app
│   ├── requirements.txt
│   └── .env               # MONGO_URL, JWT_SECRET, INITIAL_ADMIN_PASSWORD, RANDOM_ORG_API_KEY, CORS_ORIGINS
│
├── frontend/
│   ├── app/
│   │   ├── _layout.tsx              # SafeAreaProvider + AuthProvider + StatusBar
│   │   ├── index.tsx                # Redirect → /(tabs)
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx          # Bottom tabs: Home · Browse · Winners · Account
│   │   │   ├── index.tsx            # Home
│   │   │   ├── browse.tsx
│   │   │   ├── winners.tsx
│   │   │   └── account.tsx
│   │   ├── competition/[id].tsx     # Detail
│   │   ├── checkout/[id].tsx
│   │   ├── auth.tsx
│   │   └── admin.tsx
│   ├── src/
│   │   ├── api.ts          # fetch wrapper + token store
│   │   ├── auth.tsx        # AuthProvider / useAuth
│   │   ├── components.tsx  # CompetitionCard, TierBadge, ProgressBar
│   │   └── theme.ts        # COLORS, SPACING, RADIUS, BRAND_IMAGES (local PNGs)
│   ├── assets/
│   │   ├── cards/          # 19 gift-card PNGs copied from the original web design
│   │   └── images/         # icon.png · adaptive-icon.png · favicon.png · splash-icon.png (all generated)
│   └── app.json            # name="Tick-Pick", bundleIdentifier="com.tickpick.app"
│
└── memory/
    ├── test_credentials.md
    └── PRD.md              # ← this file
```

---

## 6. Brand assets

- **Gift-card visuals** — 19 PNGs (`/app/frontend/assets/cards/card-*.png`) copied **directly from the original Lovable web app** so mobile matches web 1-for-1.
  > Replace with your own licensed artwork before App Store submission.
- **App icon / splash / favicon** — generated locally with Pillow: purple-gradient stub with gold accent stripe + dual-tone "TP" wordmark + gold ticket-stub dot.
- **Typography** — system fonts (Outfit/Figtree intentionally not loaded via `@expo-google-fonts` per platform policy; visual hierarchy preserved through weights + tracking).

---

## 7. Test credentials

| Role | Email | Password |
|---|---|---|
| Admin (auto-seeded) | `admin@tickpick.com` | `AdminPass123!` |
| Test user | sign up any email | min 6 chars |

Source of truth: `/app/memory/test_credentials.md`.

---

## 8. Deployment

- **Health check (deployment_agent): PASS** — zero blockers.
- Supervisor runs Expo with `--tunnel` (ngrok) for device preview.
- Backend binds `0.0.0.0:8001`, all routes under `/api`. CORS `*`.
- Seeding is idempotent (upsert by stable `seed_id = brand|title`), so pod restarts never duplicate or drop pools.

### Publishing the first iOS beta
1. Create the app shell in **App Store Connect** with bundle ID `com.tickpick.app`.
2. Get an **app-specific Apple password**, **Team ID**, and (optional) **App Store Connect API key**.
3. Click **Publish (top-right of Emergent editor)** → iOS → TestFlight → paste credentials.
4. After 10–20 min, build lands in App Store Connect → TestFlight; add internal testers immediately.

> Apple §5.3 (Gaming, Gambling, and Lotteries) will scrutinise production submission. TestFlight internal testing is unaffected.

---

## 9. Known caveats / to-do before public launch

| | What | Where |
|---|---|---|
| ⚠️ | One shared Gumroad URL across all pools — should be per-pool | `pools.gumroad_url` already in schema; admin to override |
| ⚠️ | RANDOM.ORG runs in fallback (no key) → claim "verified by RANDOM.ORG" only after key is set | `backend/.env` → `RANDOM_ORG_API_KEY` |
| ⚠️ | Brand card PNGs are reused from the original design — relicense before public release | `/app/frontend/assets/cards/` |
| 💡 | High-LTV add-on: **referral codes** that drop 1 free ticket into a friend's first paid entry. Adds `referred_by` to users + `bonus_tickets` to entries. | TBD |
| 💡 | **Email on win** via SendGrid or Resend after admin runs a draw | TBD |

---

## 10. Quick local smoke test

```bash
# Backend
B=http://localhost:8001/api
curl -s $B/pools | python3 -c "import sys,json; print(len(json.load(sys.stdin)),'pools')"

# Sign in as admin
TOK=$(curl -s -X POST $B/auth/signin -H 'Content-Type: application/json' \
  -d '{"email":"admin@tickpick.com","password":"AdminPass123!"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

curl -s $B/admin/overview -H "Authorization: Bearer $TOK" | python3 -m json.tool | head
```

```bash
# Frontend (preview URL — open in browser or scan the QR for Expo Go)
open https://mobile-studio-289.preview.emergentagent.com
```
