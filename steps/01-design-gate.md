# Step 01 — Design gate (visual mockup) ⛔ APPROVAL

**Phase:** Gate · **Status:** todo · **Depends on:** none

## Goal
Produce an approvable visual of the app's look BEFORE any app source code. Owner signs off on the
calm/trustworthy "report-card" palette, type, the **dual-score reveal**, and the screen layouts.

## Do
- Create `design/mockup.html` — a single self-contained static page (inline CSS, no build) showing
  the key screens in the locked style (warm desert "report card", calm + credible, **RTL**, ₪ /
  numbers as LTR islands):
  - **(a) Input form** — neighborhood · rent · rooms · floor · ארנונה · ועד בית · deposit ·
    furnished · distance, multi-step with a progress bar.
  - **(b) Results** — big **ציון ערך** dial (green→amber→red) + **רמת סיכון** badge + **red-flags
    checklist** (each a question) + **"עלות חודשית אמיתית"** breakdown + per-room benchmark bar.
  - **(c) Negotiation script** — a ready Hebrew message + **"📋 העתק"** / **"שלח בוואטסאפ"** buttons.
  - **(d) Saved / compare** — a list / side-by-side of scored listings.
- Include **phone + tablet + laptop** framings (compare shines wide).
- Add the standing **"אינו ייעוץ משפטי"** disclaimer near any risk surface.
- Emoji/CSS placeholders are fine for icons; the **dial, badge, and benchmark bar** must look
  crafted, not default. Credible, never gimmicky.

## Files
- `design/mockup.html` (+ optional `design/palette.md` with hex tokens)

## Done-when
- [ ] Mockup opens in a browser and shows all four screens, RTL, in one consistent style.
- [ ] **Owner has approved** the look (palette / type / dual-score reveal / layout).

## Verify
- Open `design/mockup.html` via browser MCP; screenshot phone + laptop widths; present to owner.

## ⛔ STOP — do not write any app source code (Step 02+) until the owner approves.
