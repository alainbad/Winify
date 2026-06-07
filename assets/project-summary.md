# Tick Pick — Project Summary & Analysis

---

## What It Is
A prize competition platform where users pay $5 to enter pools. When a pool fills, a winner is picked automatically by RANDOM.ORG and paid out within 24 hours. Live at **tick-pick.com**, built in roughly one development sprint.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React Native + Expo (cross-platform: iOS, Android, Web) |
| Routing | expo-router (file-based) |
| Backend | Supabase (Postgres + Edge Functions) |
| Auth | Custom fetch-based auth (no Supabase Auth SDK) |
| Payments | Gumroad (web redirect) |
| Randomness | RANDOM.ORG API (certified atmospheric noise) |
| Email | Resend (winner + admin notifications) |
| Business email | Zoho Mail (support@tick-pick.com) |
| Deployment | Cloudflare Pages (static export) |
| Domain | tick-pick.com |

---

## How the Business Works

**The model is simple and margin-locked by design:**

- Every ticket is $5, always
- Every pool has a fixed ticket count set above the prize value
- Example: $100 prize → 25 tickets × $5 = $125 collected → **$25 guaranteed profit per cycle**
- Pools reset and restart after every draw — infinite repeating revenue

**Three tiers:**
- **MICRO** ($50–$100 prizes, 15–25 tickets) — lowest barrier, fastest to fill
- **VOLUME** ($150–$300 prizes, 45–90 tickets) — mid-tier
- **MEGA** ($500–$1,000 prizes, 150–300 tickets) — flagship draws

**Minimum margin: 33% on every pool, every time.**

---

## The Automation Edge

This is the most important technical insight: **the entire draw process requires zero human intervention.**

1. User pays → entry recorded in Supabase
2. Postgres trigger fires when pool is full
3. Edge Function calls RANDOM.ORG → gets verified random number
4. Winner inserted into database
5. Winner email sent via Resend
6. Admin notified
7. Pool resets

From last ticket sold to winner notified: **under 60 seconds.** This is a genuine operational moat — most competitors still draw manually.

---

## Current State (as of June 2026)

**What's built and live:**
- Full web app (desktop + mobile responsive)
- 28 pools defined across all 3 tiers — ready to activate
- User accounts, entry tracking, winners page
- Payment flow (Gumroad redirect on web)
- Automated draw engine (Supabase trigger + Edge Function)
- Email system (Resend for outbound, Zoho for support inbox)
- OG/social share images (WhatsApp, iMessage previews working)
- SEO pages: blog (4 posts), help centre, about, terms, privacy, contact
- Investor pitch deck (HTML interactive + PDF + PowerPoint)

**What's not yet live:**
- Pools are using **hardcoded/fake data** for entries and occupancy — real Supabase data not wired up yet
- No payment webhook confirming actual Gumroad purchases before recording entries
- No mobile app published (App Store / Play Store)
- Native payment flows (Apple Pay / Google Pay) — referenced but incomplete

---

## Key Risks & Observations

**1. Payments are not verified**
Gumroad redirects users to a payment page, but there's no webhook confirming payment before an entry is recorded. This is the single biggest gap before going live — someone could potentially enter without paying.

**2. Credentials are hardcoded**
The Supabase URL and anon key are in source code, which is normal for the anon key but worth noting. Admin email is also in source code.

**3. Pool data is static**
All 28 pools are defined in `lib/data.ts` as a static array. Entry counts and fill percentages shown on the browse page are fake/hardcoded. Going live requires wiring these to real Supabase data.

**4. No analytics or funnel tracking**
There's no Google Analytics, Mixpanel, or similar installed. The marketing plan mentions setting up GA in Month 1 — this should be done before launch.

**5. Single person operational dependency**
The draw and payout flow is automated, but prize delivery (Gumroad vouchers via Tremendous) still requires manual action. This is flagged as a post-launch integration.

---

## Financial Picture

| Scenario | Monthly Revenue | Monthly Profit |
|---|---|---|
| 28 pools × 1 cycle/month | ~$14,800 | ~$4,900 |
| 28 pools × 3 cycles/month | ~$44,400 | ~$14,700 |
| + membership + sponsors (Month 9) | ~$85,000 | — |

These numbers are achievable because infrastructure cost doesn't scale with pool count — it's already built.

---

## Biggest Opportunity

The GCC market (UAE, Saudi, Kuwait) is the right fit: high smartphone penetration, young population, strong disposable income, and no credible competitor offering verified automated draws. The trust layer — RANDOM.ORG certification + public winners page — is a genuine differentiator that should be front and centre in all marketing.

**The platform is essentially ready. The main work before launch is:**
1. Wire up real Supabase data to the browse page
2. Verify Gumroad payments before recording entries
3. Set up Tremendous for automated voucher delivery
4. Launch with MICRO pools first (fill fastest, lowest risk)
