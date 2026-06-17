# Step 08 — Results screen — dual score + cost reveal + benchmark + flags

**Phase:** UI · **Status:** todo · **Depends on:** 07

## Goal
The credible reveal: **both scores** + the hidden-cost reveal + benchmark + red-flags — **all
shown, nothing gated, no blur, no upsell** (PRD §4, DESIGN-SPEC §3).

## Do
- `components/Results/ValueScore.jsx` — the **0–100 dial**, green→amber→red, with the verdict line;
  the dial **sweeps** to its number on reveal (respect `prefers-reduced-motion`).
- `RiskBadge.jsx` — **נמוך / בינוני / גבוה**, calm→alarm; expressive, not gimmicky (no sirens).
- `CostBreakdown.jsx` — rent + ארנונה + ועד בית = **"עלות חודשית אמיתית"** (the "not ₪3,400 —
  ₪3,770" beat).
- `BenchmarkBar.jsx` — a range bar showing where your **₪/room** sits (below / within / above the
  neighborhood range).
- `RedFlagsList.jsx` — each flag as a **question to ask** + severity dot + the standing
  **"מדריך זהירות — אינו ייעוץ משפטי או פיננסי"** disclaimer.
- `Breakdown.jsx` — expandable **"איפה ירד הערך"** per value factor.
- A prominent CTA to the Negotiation screen ("כתוב לי הודעה"); a "נתונים משוערים · מעודכן ל-…" note
  for fallback areas; a "בדוק דירה אחרת" reset.

## Files
- `src/components/Results/*`

## Done-when
- [ ] Both scores, the true monthly cost, the benchmark position, and the red-flags all render
      their real data; nothing is gated/blurred; the dial sweep eases (and is disabled under
      reduced-motion).

## Verify
- Browser MCP: the demo listing renders ציון ערך + רמת סיכון + ₪3,770 + above-range + flags.
  Commit `step 08: results screen`.
