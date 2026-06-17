# Step 13 — Final: CSP/offline acceptance + demo

**Phase:** Acceptance · **Status:** todo · **Depends on:** all (12 approved)

## Goal
Prove the finished product against the Definition of Done (MASTER-PLAN; ROADMAP §5–6, §8).

## Do
- Build (`npm run build`); serve `dist/` behind a **strict CSP**
  (`default-src 'self'; style-src 'self'; font-src 'self'; connect-src 'self'`); confirm fonts +
  the three JSON load (no CDN) and nothing breaks.
- **Offline test:** load once, kill network, run the entire flow (form → both scores → cost /
  benchmark / flags → copy the WhatsApp script → save & compare) — no API by design.
- **Clipboard / wa.me:** verify copy works in a sandboxed iframe; the deep link degrades gracefully.
- **RTL / number islands:** ₪ amounts, walk-minutes, and links never reorder.
- **Legal:** the "אינו ייעוץ משפטי" disclaimer is present on every risk surface; no landlord
  name/phone stored or shown.
- Walk the **demo script** (ROADMAP §6): שכונה ג' listing → ציון ערך 64 · סיכון גבוה · ₪3,770 ·
  above-range · flags → tap "כתוב לי הודעה" → **copy the script** → "it wrote my message." < 60s.

## Files
- (config) CSP serve script; any final tuning in `public/scoring-config.json`

## Done-when
- [ ] Every **MASTER-PLAN Definition of Done** box is checked.

## Verify
- Browser MCP under strict CSP + offline; run the full < 60s demo unaided. Final commit
  `step 13: acceptance`.
