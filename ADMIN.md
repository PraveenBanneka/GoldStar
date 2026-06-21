# Goldstar CMS (Phase 2) — admin guide

The site is owner-editable through a `/admin` area backed by Cloudflare **D1**
(content + users) and **R2** (uploaded images). The public site is unchanged: every
component still reads through the `getXxx()` getters in `src/content/site/*.ts`, which
now prefer D1 and fall back to the built-in defaults when a section hasn't been edited.

## Run locally

```bash
npm run db:migrate:local   # one-time: create local D1 tables
npm run dev                # http://localhost:4321  (local D1/R2 via platformProxy)
```

First visit to **/admin** → redirected to **/admin/setup** to create the first admin
account (one-time). After that, **/admin/login**.

## What you can edit

| Section | Edit |
|---|---|
| Hero | headline, subhead, both CTAs, poster path |
| Services | add/remove/reorder cards, name, description, **photo upload** |
| Portfolio | add/remove/reorder photos, **upload**, alt text, category |
| Reviews | add/remove/reorder, author, stars, text, verified badge |
| About | heading, lead, body paragraphs, highlights |
| Business info | name, phone, email, hours, service area, rating, socials |
| Users | add/remove users, change passwords |

## Draft → Publish model

- **Save draft** stores changes privately; the live site does not change.
- **Preview draft ↗** opens the public site with `?preview=1` (only visible while
  logged in) so you can see drafts before they go live.
- **Publish** promotes the draft to live. "Publish all changes" on the dashboard
  publishes every section at once.

## How it works (for developers)

- `src/middleware.ts` guards `/admin/**`; `src/lib/auth.ts` does PBKDF2 hashing +
  D1-backed sessions (cookie `gs_session`).
- `src/lib/db.ts` stores one JSON document per section (`content` table) with
  `draft_json` + `published_json`.
- `src/lib/cf.ts` exposes the D1/R2 bindings via `cloudflare:workers` (Astro v6 way).
- Uploads: `src/lib/upload.ts` → R2; served by `src/pages/media/[...key].ts` at
  `/media/<key>`. Existing static photos under `/images/...` still work.
- Schema: `migrations/0001_init.sql`.

## Deploy to Cloudflare (when ready — needs your Cloudflare login)

```bash
npx wrangler login
npx wrangler d1 create goldstar           # copy the database_id into wrangler.jsonc
npx wrangler r2 bucket create goldstar-media
npm run db:migrate                        # apply migrations to the REMOTE D1
npm run build && npx wrangler deploy
```

Then visit `https://<your-domain>/admin/setup` to create the production admin account.

### Hardening still to do (noted, not yet done)
- CSRF tokens on admin forms (currently relying on SameSite=Lax + Astro origin check).
- Image resizing/optimization on upload.
- Rate-limiting login attempts.
