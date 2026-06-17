# Step 05 — Scoring engine — value + risk + red-flags (headless rubric)

**Phase:** Engine · **Status:** todo · **Depends on:** 04

## Goal
The technical heart: a pure, deterministic, JSON-tunable **rubric** that produces both scores +
the red-flags checklist — built and unit-tested **headless, before any UI** (ROADMAP Phase 1,
DESIGN-SPEC §9 critical path). **No AI, no model.**

## Do
- `src/lib/engine/value.js` — true monthly cost = `rent + ארנונה + ועד בית` → per-room → placed in
  the neighborhood range; + distance / floor+elevator (desert livability) / furnished adjusts.
  Returns `{ score 0–100, verdict, costMonthly, perRoom, benchmark{...,position}, breakdown[] }`;
  each adjust emits a `{factor, delta, note}` breakdown entry ("איפה ירד הערך"). (ARCH §3.2.)
- `src/lib/engine/redFlags.js` — a **generic matcher** over `red-flags.json` (checklist answers +
  ad-text keyword scan); no rule logic in code, only the matcher. Returns `RedFlag[]` (each with
  `label`, `ask`, `severity`).
- `src/lib/engine/risk.js` — severity-weighted red-flags → `{ level: low|med|high, score, flags }`.
  Risk is **separate** from value (good value + sketchy terms = good value, high risk).
- `src/lib/engine/index.js` — `scoreListing(input, refs)` composes value + risk + flags into one
  flat `ScoreResult` (+ `meta.approximate` for fallback areas).
- Fixtures (plain Node, no DOM): **a great deal · an over-market flat · a top-floor no-elevator
  oven · a deposit-before-viewing trap** — assert score + band, risk level, the flags, and the
  cost breakdown.

## Files
- `src/lib/engine/{value,risk,redFlags,index}.js`, `src/lib/engine/__tests__/fixtures.*`

## Done-when
- [ ] All four fixtures produce value/risk/flags/cost that *feel right* in a plain Node test.
- [ ] Engine is pure — no DOM, no network; unknown area → fallback + `approximate: true`.

## Verify
- Run the fixture tests in Node; eyeball the numbers for fairness. Commit `step 05: scoring engine`.
