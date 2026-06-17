# Step 03 — Design tokens + RTL base (desert report-card system)

**Phase:** Setup · **Status:** done · **Depends on:** 02

## Goal
Encode the approved mockup into reusable tokens; set the RTL base; bundle fonts locally (no CDN).

## Do
- `src/styles/tokens.css` — palette (warm desert sand/terracotta + a green→amber→red **value**
  ramp + a calm→alarm **risk** ramp), type scale, spacing, radii, soft shadows from the approved
  mockup.
- `src/styles/app.css` — RTL base via **logical properties** (`margin-inline`, `inset-*`); card
  stack primitives; `.ltr` island helper for ₪ / minutes / `wa.me`.
- Bundle the Hebrew UI font in `public/fonts/` (no CDN) — survives strict `font-src 'self'`.
- `src/lib/format.js` — `₪` amounts and walk-minutes rendered as **LTR islands** so they never
  reorder inside Hebrew text.
- `src/lib/copy.js` — central Hebrew-strings stub (filled/reviewed at Step 12), incl. the
  **"מדריך זהירות — אינו ייעוץ משפטי או פיננסי"** disclaimer string.

## Files
- `src/styles/tokens.css`, `src/styles/app.css`, `src/lib/format.js`, `src/lib/copy.js`,
  `public/fonts/`

## Done-when
- [ ] Tokens match the approved mockup; a sample card + dial swatch + ₪ island render in the chosen
      palette, fully RTL, with the local font.

## Verify
- Browser MCP screenshot vs the mockup; colors/type/RTL match. Commit `step 03: design tokens`.
