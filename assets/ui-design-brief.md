# Tick Pick — Web UI Design Brief

> Hand this to Lovable (or any designer) to redesign the full site. Backend/auth logic is excluded — this covers visual design, layout, and UX only.

---

## Brand Identity

- **Name**: Tick Pick
- **Logo**: "Tick" in purple + "Pick" in gold, bold/black weight
- **Tagline**: Prize competitions — $5 a ticket, win gift vouchers up to $1,000
- **Feel**: Premium, trustworthy, exciting — like a high-end raffle meets a modern fintech app

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#6D28D9` | Brand color, CTAs, accents |
| Primary Dark | `#4C1D95` | Hero gradient, section headers |
| Primary Light | `#F5F0FF` | Backgrounds, badges |
| Gold | `#F59E0B` | Accents, "Pick" in logo, highlights |
| Gold BG | `#FFFBEB` | Light gold backgrounds |
| Background | `#FAF8FF` | Page background (off-white, slight purple tint) |
| Surface | `#FFFFFF` | Cards, modals |
| Text | `#1A0A2E` | Primary text (dark navy) |
| Text Secondary | `#7B6A98` | Muted labels, metadata |
| Border | `#E8DEFF` | Card borders (pale lavender) |
| Shell | `#2D1B69` | Dark hero/header backgrounds |
| Success | `#059669` | Confirmed entries, checkmarks |
| Error | `#EF4444` | Validation, warnings |

---

## Typography

| Use | Size (desktop) | Weight | Notes |
|---|---|---|---|
| Hero headline | 64px | 900 | Tight letter-spacing (-1px) |
| Section title | 36px | 800 | |
| Page title | 40px | 800 | |
| Card title | 18–20px | 700 | |
| Body | 14px | 400–500 | |
| Labels / badges | 10–11px | 700 | Uppercase, +0.5–1.5px letter-spacing |

No external fonts specified — system sans-serif stack. Designer may upgrade to a custom typeface.

---

## Pages

### 1. Home (`/`)
**Purpose**: Landing / marketing page

**Sections (top to bottom):**
- **Sticky Navbar**: Logo left, nav links center (Browse, Winners, Blog), Profile avatar or Login button right. White bg, 1280px max-width.
- **Hero**: Dark purple gradient (`#2D1B69` → `#6D28D9`). White headline (large, bold). Two CTAs — solid white button + outlined button. Stat boxes showing platform numbers (draws run, winners paid, etc.)
- **Winners Ticker**: Dark strip below hero. Gold "WINNERS" pill. Horizontal auto-scroll of recent winner names + prize amounts (white names, gold amounts).
- **Featured Competitions**: 4-column card grid. Section title + "View All" link.
- **How It Works**: 3-step process (numbered, icon per step). Light purple background section.
- **Trust / Why Us**: 3–4 trust pillars (RANDOM.ORG verified, fast payout, secure payments). Icon + heading + text layout.
- **Footer**: Logo, nav links, social links, legal links, copyright.

---

### 2. Browse (`/browse`)
**Purpose**: Discovery — all active competition pools

**Layout (desktop)**: 260px left sidebar + main content grid
**Layout (mobile)**: Horizontal scrollable filter chips at top, then grid

**Sidebar sections**:
- Search input
- CATEGORY filter (radio chips: All, Gift Cards, Gaming, Fashion, etc.)
- SORT BY (Ending Soon, Most Popular, Newest, Price Low–High)
- BRANDS multi-select
- WHY TICK PICK trust block (static, 3 bullet points)

**Competition card** (4-col desktop / 2-col mobile):
- Brand gift card image (square, branded gradient bg with logo)
- Tier badge (MICRO / VOLUME / MEGA — pill, colored)
- Card title + prize value
- Progress bar (fill % sold) with "XX% SOLD" badge
- Tickets left + price
- "HOT 🔥" pill overlay (top-right, for popular pools)
- "ENDING SOON" red chip (when >80% full)
- "Enter Now →" CTA button

---

### 3. Competition Detail (`/competition/[id]`)
**Purpose**: Pool info + entry flow start

**Layout (desktop)**: 2-column — image left (45%), details right (55%)
**Layout (mobile)**: Stacked single column

**Left / top**:
- Large branded gift card visual
- Countdown timer (4 boxes: Days / Hours / Mins / Secs)

**Right / bottom**:
- Brand name + pool title
- Tier badge + "RANDOM.ORG Verified" green badge
- Prize description
- Progress bar (tickets sold vs total)
- Ticket quantity selector (− / + buttons with count)
- Total price display
- "Enter Now" primary CTA → leads to payment page
- Terms notice (small, below CTA)

---

### 4. Payment (`/competition/[id]/payment`)
**Purpose**: Checkout page

**Layout**: Centered single column, max 520px

**Content**:
- Back button (top left)
- Order summary card (pool name, prize, ticket count, total)
- Payment method selector (Gumroad / Apple Pay / Google Pay — radio buttons with logos)
- Agree to terms checkbox
- "Complete Purchase" primary CTA
- Security badges below (Secure Checkout, RANDOM.ORG, Refund Policy)

---

### 5. Success (`/competition/[id]/success`)
**Purpose**: Post-payment confirmation

**Layout**: Centered, single column

**Content**:
- Animated green checkmark (scale-in spring animation)
- "Entry Confirmed!" headline
- Entry number / ticket number
- Competition summary card
- Share CTA + "Browse More" secondary CTA
- Trust message ("Winner drawn automatically when pool fills")

---

### 6. My Entries (`/entries`)
**Purpose**: User's active entries (requires login)

**Layout**: Single column, max 800px centered

**Content**:
- Page title + entry count
- Entry cards (list):
  - Brand image thumbnail (small, left)
  - Pool name + prize
  - Entry date + ticket number
  - Progress bar (pool fill status)
  - Status badge (Active / Draw Complete / Won)
- Empty state: illustration + "No entries yet" + Browse CTA

---

### 7. Winners (`/winners`)
**Purpose**: Social proof — public hall of winners

**Layout**: Centered, max 960px

**Content**:
- Page title + subtitle
- Filter by month/tier (optional)
- Winner cards grid (3-col desktop / 1-col mobile):
  - Brand logo
  - Winner first name + city (anonymised)
  - Prize won
  - Date
  - "Verified by RANDOM.ORG" badge
- Ticker strip (same as home — repeating winners)

---

### 8. Login / Signup (`/(auth)/login`, `/(auth)/signup`)
**Purpose**: Auth flow

**Layout**: Centered card on light gray background, max 420px

**Content**:
- Logo at top
- Toggle between Login / Sign Up tabs
- Form fields: Email, Password (+ Full Name on signup)
- Primary submit button
- Forgot password link
- Error/success alert boxes (colored)
- "Don't have an account? Sign up" toggle link

---

### 9. Account (`/account`)
**Purpose**: User profile + settings

**Layout (desktop)**: Left sidebar (240px) + main content
**Layout (mobile)**: Dark purple header strip + stacked sections

**Sidebar / header**:
- Profile avatar (initials circle, purple)
- Display name + email
- Navigation: My Entries, Notifications, Help, Sign Out

**Main content**:
- Stat boxes: Total Entries / Wins / Amount Spent
- Recent entries list
- Account settings (display name, email)
- Legal links (Terms, Privacy)

---

## UI Component Patterns

### Cards
- 14px border-radius
- 1px border (`#E8DEFF`)
- Subtle box-shadow (0 2px 6px rgba(0,0,0,0.06))
- White background

### Buttons
| Type | Style |
|---|---|
| Primary | Solid `#6D28D9` bg, white text, 8–12px border-radius |
| Secondary | Outlined — `#6D28D9` border + text, transparent bg |
| Destructive | Red bg or red text |
| Disabled | 0.5 opacity |

### Badges / Pills
- Border-radius: 999px (full pill)
- MICRO: Blue tones
- VOLUME: Purple tones
- MEGA: Gold/amber tones
- "HOT 🔥": Orange, semi-transparent dark bg
- "ENDING SOON": Red

### Progress Bar
- Height: 5–6px
- Track: `#F0EBFF`
- Fill: Purple gradient
- "XX% SOLD" badge overlaid at fill end

### Countdown Timer
- 4 equal boxes (Days / Hours / Mins / Secs)
- Light purple bg, dark bold numbers, small label below
- Monospace or tabular number font preferred

### Forms
- Input: 1px gray border, light bg (`#FAFAFA`), 14px font
- Labels: 11px, uppercase, 700 weight
- Checkboxes: 16px square, 4px radius; active = solid purple + white tick

---

## Layout System

| Property | Desktop | Mobile |
|---|---|---|
| Max container width | 1280px | 100% |
| Horizontal padding | 32px | 16–20px |
| Section vertical padding | 48–80px | 32–48px |
| Card gap | 16–24px | 12px |
| Grid columns (browse) | 4 | 2 |
| Mobile breakpoint | 768px | — |

---

## Trust & Urgency Signals (must preserve in redesign)

- "RANDOM.ORG Verified" green badge — appears on competition cards and detail page
- Countdown timer — urgency on detail page
- Progress bar with % sold — urgency on browse + detail
- "HOT 🔥" / "ENDING SOON" overlays
- Winners ticker — social proof on home
- Public winners page — transparency
- Security badges on payment page

---

## What to Redesign / Improve (notes for Lovable)

The current site is functional but built in React Native (StyleSheet-based). A full redesign should:

1. Use modern web UI (Tailwind, shadcn, or similar) — not React Native primitives
2. Upgrade typography — consider a geometric sans (e.g. Inter, Plus Jakarta Sans, or Sora)
3. Add micro-animations: card hover lifts, button press feedback, progress bar transitions, countdown number flip
4. Improve the hero — make it more cinematic (dark gradient with floating card mockups or confetti)
5. Add skeleton loading states for competition cards
6. Better mobile nav — bottom tab bar instead of hidden nav
7. Improve the winners page — add confetti, make it more celebratory
8. Make the competition card image fill more space — current thumbnails feel small
9. Add a "how it works" interactive section (animated 3-step flow)
10. Keep the purple + gold brand colors — they work well and are distinctive
