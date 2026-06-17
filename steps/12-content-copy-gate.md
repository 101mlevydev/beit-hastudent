# Step 12 — Content & copy gate (benchmarks + Hebrew script) ⛔ APPROVAL

**Phase:** Gate · **Status:** todo · **Depends on:** 11

## Goal
The data must be credible and **all Hebrew must read as a real, savvy student — never as AI**
(QUALITY-BAR §6; PRD §8, §10; DESIGN-SPEC §8). Two things gate here: the **seed benchmarks** and
the **negotiation-script + copy**.

## Do
- **Benchmarks review:** confirm the per-room **ranges** + walk-times for **שכונה ג' · שכונה ד' ·
  רינגלבלום · מצדה · העיר העתיקה** + the city fallback against real local knowledge; keep them
  **ranges**, surface `dataDate`. Re-balance `scoring-config.json` against the Step-05 fixtures.
- **Copy review:** centralize and present every Hebrew string for owner / native-speaker edit —
  verdict lines, red-flag **question** phrasings, the **"מדריך זהירות — אינו ייעוץ משפטי או פיננסי"**
  disclaimer, and the **negotiation-script templates** (must be polite-but-firm, *"לא נאיבי"*, and
  **sendable as-is**).
- Produce `design/content-review.md` listing the seed ranges + every string for sign-off.

## Files
- `design/content-review.md`, edits to `public/*.json`, `src/lib/copy.js`,
  `src/lib/engine/negotiation.js`

## Done-when
- [ ] Ranges + walk-times reviewed; all strings centralized; **owner / native speaker approved**
      the Hebrew (copy + script reads natural, the negotiation message is sendable as-is).

## Verify
- Present `content-review.md`; apply edits; re-run engine fixtures after any config change.
  ⛔ STOP for approval before final acceptance. Commit `step 12: content & copy gate`.
