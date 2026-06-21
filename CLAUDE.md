# CLAUDE.md — Goldstar Landscaping site

Phase 1 marketing site for Goldstar Landscaping (Georgetown, TX). Built from
`../PROJECT_BRIEF.md`; asset/content decisions recorded in `../SCRAPE_NOTES.md`.

## Stack
- **Astro 6**, `output: 'server'` (SSR) — see `astro.config.mjs`
- **Cloudflare adapter** (`@astrojs/cloudflare`) — deploy target is Cloudflare Pages
- **Tailwind v4** via `@tailwindcss/vite` — brand tokens live in `src/styles/global.css`
  under `@theme` (NOT a `tailwind.config.*`). Utilities: `bg-brand-green`,
  `text-brand-gold`, `font-heading`, etc.
- TypeScript strict.

## The one rule that matters: the content layer
All editable content lives in `src/content/site/*.ts`. Each module exports a type,
a private `const`, and an **async getter** (`getBusiness`, `getServices`, …).

**Components and pages must only ever call the getter — never import the raw data.**
Phase 2 swaps each getter's body from the static const to a Cloudflare D1 query;
if components only use getters, nothing else changes. (PROJECT_BRIEF §9)

## Structure
- `src/content/site/` — business, hero, services, portfolio, reviews, about
- `src/components/` — Header, Hero, TrustBar, Services, Portfolio, About, Reviews, Contact, Footer
- `src/layouts/Base.astro` — html shell, fonts, SEO meta, LocalBusiness JSON-LD
- `src/pages/` — index.astro (single-page site), privacy.astro, terms.astro
- `public/images/{brand,portfolio}` — Goldstar's own logo + 21 project photos

## Run
```bash
npm run dev      # http://localhost:4321
npm run build    # validates SSR + Cloudflare bundle
```

## Known TODOs (Phase 1 polish)
- **Hero video:** `public/video/hero.{webm,mp4}` not yet added — the poster
  (`public/images/hero-poster.jpg`, a real project photo) carries the hero and
  reduced-motion users see it regardless. Drop in license-clean stock (Pexels/
  Coverr/Mixkit), 1080p, <5 MB, ~10s loop, no audio. Wired in `content/site/hero.ts`.
- **Contact form:** posts to `#` (placeholder). Wire to a Cloudflare Worker or
  form service before launch.
- **Images:** served as plain `<img>` from `/public` (not Astro `<Image>`) to avoid
  the SSR/Cloudflare image-service setup. Revisit for optimization (R2 in Phase 2).
- **Unconfirmed facts** (see `../SCRAPE_NOTES.md §6):** business hours, licensed/
  insured claim (intentionally omitted), exact years, owner story.

## Phase 2 — CMS (built)
The owner-editable admin is implemented. See `ADMIN.md`. Content now comes from
Cloudflare D1 via the getters (with const fallback); images upload to R2. Key files:
`src/middleware.ts`, `src/lib/{auth,db,cf,upload,editor}.ts`, `src/pages/admin/**`,
`src/pages/media/[...key].ts`, `migrations/0001_init.sql`. Run `npm run db:migrate:local`
once, then `npm run dev`; first `/admin` visit goes to `/admin/setup`.

## Do NOT (per brief)
- Invent reviews or business facts. Reviews in `reviews.ts` are real, transcribed
  from Goldstar's verified review screenshots.
- Borrow any text/images/branding from LEAF Landscaping (structural reference only).
