# Tick Pick — Mobile App (Expo)

## Overview
A React Native Expo mobile app for **Tick Pick** — a $5-ticket gift-card prize-draw platform. Adapted from the original Lovable web project (Golden Ticket Hub) into a native mobile experience with file-based Expo Router navigation, FastAPI + MongoDB backend, JWT auth, and RANDOM.ORG-ready draw engine.

## Tech stack
- **Frontend:** Expo (SDK 54) + Expo Router (file-based), React Native, expo-linear-gradient, expo-image, expo-web-browser, @expo/vector-icons (Ionicons)
- **Backend:** FastAPI + Motor (async MongoDB), bcrypt, python-jose (JWT), httpx (RANDOM.ORG API)
- **Storage:** expo-secure-store for JWT on device

## Screens
| Route | Purpose |
|---|---|
| `/(tabs)` | **Home** — hero, live draws stat, featured pool grid, how-it-works, trust pillars |
| `/(tabs)/browse` | **Browse** — search + category chips (Gift Cards/Gaming/Entertainment/Lifestyle/Travel) + 2-col grid |
| `/(tabs)/winners` | **Winners** — verified RANDOM.ORG draws table + winner feed |
| `/(tabs)/account` | **Account** — profile, stats, my entries, admin shortcut, sign out |
| `/competition/[id]` | **Detail** — hero card, countdown DD:HH:MM:SS, progress bar, qty selector, sticky Enter-draw CTA |
| `/checkout/[id]` | **Checkout** — order summary, confirm entry → success screen → Pay on Gumroad |
| `/auth` | Sign in / sign up toggle |
| `/admin` | **Admin** — totals dashboard, per-pool RUN draw button, recent entries (is_admin only) |

## Backend endpoints
- `POST /api/auth/signup` · `POST /api/auth/signin` · `GET /api/auth/me` · `PATCH /api/auth/me`
- `GET /api/pools` · `GET /api/pools/{id}`
- `POST /api/entries` · `GET /api/entries/mine`
- `GET /api/draws`
- `GET /api/admin/overview` · `POST /api/admin/draws/{pid}` (admin only)

## Seeded data on first run
- 1 admin user `admin@tickpick.com` / `AdminPass123!` (see `/app/memory/test_credentials.md`)
- 12 live pools across all 5 categories (Amazon $1000, Apple $500, Steam $250, Nike $200, Sephora $150, Uber Eats $75, Netflix $200, Spotify $100, PlayStation $150, Xbox $100, Airbnb $300, Disney+ $100). Most have non-zero `tickets_sold` for realism.

## Payment & draws
- **Payment** → Gumroad redirect (no Stripe). Confirm-entry creates a server-side `entries` record and then opens Gumroad in the in-app browser.
- **Draws** → `RANDOM_ORG_API_KEY` (env) → signed integer call. Empty key → falls back to Python `secrets.randbelow`. Either way, every draw records `winning_ticket`, `total_tickets`, `drawn_at`, `serial_number` (when signed), `has_signature` boolean.

## Test report
All backend (17/17 pytest passed) and all frontend flows green via testing_agent — see `/app/test_reports/iteration_1.json`.
