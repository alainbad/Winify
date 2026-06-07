# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tick Pick** — a cross-platform (iOS, Android, Web) prize competition app. Users enter pools for $5 to win gift vouchers ($50–$1,000). When a pool fills, RANDOM.ORG picks the winner automatically via a Supabase Edge Function. Live at **tick-pick.com**.

## Commands

```bash
# Development
npm start              # Expo dev server (all platforms)
npm run web            # Web only dev server

# Build & Deploy (web)
npm run build          # expo export -p web && node scripts/patch-html.js
# Output goes to dist/ — deploy to Cloudflare Pages
```

No test or lint scripts are configured.

## Architecture

### Platform-Specific Files
Expo Router resolves `.web.tsx` over `.tsx` for web builds. Every route that has different web/native behaviour has both files:
- `index.tsx` — native (iOS/Android)
- `index.web.tsx` — web (used by Cloudflare Pages build)

When adding a new route, create both files. The web version typically uses raw HTML elements (`<a>`, `<img>`) and different layout/styling.

### Routing
File-based routing via expo-router:
- `app/(tabs)/` — main tab navigation: home, browse, entries, account
- `app/competition/[id]/` — dynamic pool detail flow: index → skill-gate → payment → success
- `app/blog/[slug]/` — individual blog post pages
- Static pages: `about/`, `contact/`, `help/`, `privacy/`, `terms/`, `winners/`

### Data Layer (`lib/`)
- **`lib/data.ts`** — All 28 pool definitions (`POOLS[]`), the `Pool` type, Gumroad URLs, and mock recent-winner data for toasts. This is the source of truth for pool content.
- **`lib/supabase.ts`** — Supabase client (URL + anon key hardcoded). Tables: `profiles`, `entries`, `pools`, `winners`.
- **`lib/auth.ts`** — Custom fetch-based auth (not `@supabase/auth`). Handles `signUp`/`signIn`/`signOut` with session in `localStorage` (web) or `AsyncStorage` (native). Also exports `dbQuery()`, `dbInsert()`, `rpc()` helpers.
- **`lib/useAuth.ts`** — React hook with cross-tab storage sync.

### Backend (Supabase)
- **Project**: `dwjghqslnrkcjhaoaneq.supabase.co`
- **Edge Function** (`supabase/functions/draw-winner/`): Called by a Postgres trigger when a pool fills. Calls RANDOM.ORG, inserts into `winners`, sends email via Resend.
- **Trigger** (`supabase/migrations/auto_draw_trigger.sql`): Fires after `entries` insert; uses `pg_net` to POST to the edge function.
- **Secrets stored in Supabase**: `RANDOM_ORG_API_KEY`, `RESEND_API_KEY`.

### Post-Build HTML Patching
`scripts/patch-html.js` runs after `expo export -p web` and:
1. Injects OG meta tags, favicon, theme colour into `dist/index.html`
2. Copies everything from `public/` into `dist/`

Cloudflare Pages build command must be `npm run build` (not `expo export` directly).

### Key Constants
- `constants/theme.ts` — colour tokens (`Colors.primary` = `#6D28D9` purple, etc.)
- `@/` path alias maps to repo root (configured in `tsconfig.json`)
- Pool tiers: `MICRO` ($50–$100), `VOLUME` ($150–$300), `MEGA` ($500–$1,000)
- Ticket price: always $5
- Payment processor: Gumroad (web redirect); Apple/Google Pay on native

### Metro Config
`metro.config.js` replaces the `ws` package with an empty shim on web (Supabase uses `ws` on Node; the browser has native WebSockets).
