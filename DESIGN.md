# Goldstar Landscaping — Design System

Brand + component reference for **Claude Design** (upload under "Add assets" or sync via
`/design-sync`). Source of truth is `src/styles/global.css` (`@theme`) + `src/components/*.astro`.
Tone: premium, trustworthy, outdoorsy — a high-craft Central-Texas landscaper.

---

## Colors

| Token | Hex | Use |
|---|---|---|
| `brand-green` | `#244435` | Primary. Dark sections, headings, footer, trust bar, nav background-on-scroll |
| `brand-green-700` | `#1C3729` | Deeper green — footer, button hover-press |
| `brand-green-300` | `#4A7D63` | Muted green accents |
| `brand-gold` | `#D7AB00` | Accent. Primary CTAs, the logo star, section eyebrows, stars, focus rings |
| `brand-gold-300` | `#E9C64A` | Gold hover / lighter accent |
| `brand-cream` | `#F7F5EF` | Soft section background (alternating with white) |
| `brand-ink` | `#1A1F1C` | Body text (near-black, slightly green) |
| white | `#FFFFFF` | Default section background |

**Pairings:** green section → white/gold text. Light (white/cream) section → green headings,
ink body, gold eyebrow + CTAs. Always keep ≥ AA contrast.

## Typography
- **Headings:** Montserrat — 600 / 700 / **800** (extrabold for h1/h2). Tight leading.
- **Body:** Open Sans — 400 / 600 / 700. Relaxed leading (`leading-relaxed`).
- **Eyebrow label:** Montserrat, `text-sm`, **bold**, `uppercase`, `tracking-widest`, gold.
- Scale: h1 `text-4xl→6xl`, h2 `text-3xl→4xl`, body `text-base`, small `text-sm`.

## Spacing & shape
- Base unit 4px (Tailwind). Section padding `py-20 md:py-28`. Max width `max-w-7xl`, gutter `px-5 md:px-8`.
- **Cards:** `rounded-2xl`, `bg-white`, `shadow-sm`, `ring-1 ring-black/5`; hover `-translate-y-1` + `shadow-xl`.
- **Buttons:** `rounded-full`, bold. Primary = `bg-brand-gold text-brand-green-700`; secondary = outlined white-on-image or green outline. Generous `px-6/7 py-3`.
- **Chips/badges:** `rounded-full`, tiny uppercase tracking (e.g. gold category chip, green "Verified" chip).
- **Images:** `rounded-xl/2xl`, `object-cover`; portfolio = square, service cards = 4:3.
- **Focus:** 3px `brand-gold` outline, 2px offset (accessibility).
- Respect `prefers-reduced-motion` (no autoplay video, no transitions).

## Layout / section patterns (single-page marketing site)
1. **Header** — transparent over hero; white logo chip + nav links + gold "Call" pill (rounded-full).
2. **Hero** — full-viewport (`100svh`) background video with poster fallback + dark-green→black gradient overlay; centered white extrabold headline, subhead, gold primary CTA + outlined secondary (click-to-call).
3. **Trust bar** — thin `brand-green` strip, white text, 3 columns (years · ★ rating+count · service area).
4. **Services** — `brand-cream` bg; centered eyebrow+heading; 3-col grid of white cards (image, name, short description).
5. **Portfolio** — white bg; responsive grid (1 / 2 / 3 / 4 cols by breakpoint) of square photos; hover = dark gradient overlay + gold category chip + caption.
6. **About** — `brand-green` bg, white text; two columns (image + copy) with a 3-up highlight-stat row (gold numbers).
7. **Reviews** — `brand-cream`; aggregate rating line with gold stars; masonry columns of white quote cards (★ + "Verified" chip + text + name).
8. **Contact** — white; two columns: contact details (phone/email/hours/area) + a form (name, email, phone, message) with gold submit.
9. **Footer** — `brand-green-700`, white/muted; 3 columns (logo+tagline, contact+socials, service area) + legal bar (privacy/terms).

## Component inventory (reusable)
- `Eyebrow` (gold uppercase label) · `SectionHeading` (green extrabold)
- `Button` primary (gold) / secondary (outline) · `Pill` (call CTA)
- `Card` (white rounded-2xl ring) · `StatBlock` (big gold number + label)
- `ReviewCard` (stars + verified chip + quote + author)
- `PhotoTile` (square image + hover overlay + category chip)
- `Nav` (sticky/over-hero) · `Footer`

## Voice & content rules
- Confident, plain, benefit-led ("built to last," "done right the first time"). No jargon, no hype.
- **Never fabricate** reviews, ratings, or credentials. Reviews are real; rating is sourced.
- Imagery = real project photos (hardscape, stone edging, drainage, sod), not generic stock.

## Responsiveness
- Mobile-first; test 360 / 768 / 1280. Grids collapse: portfolio 4→3→2→**1** on phones; services 3→2→1; two-column sections stack (image above text).
