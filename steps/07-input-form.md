# Step 07 — RTL shell + guided multi-step input form

**Phase:** UI · **Status:** done · **Depends on:** 03, 06

## Goal
A friendly, guided, one-section-at-a-time intake that collects the **full input set** and calls the
headless engine on finish. Feels like under a minute, not a tax form (PRD §3, DESIGN-SPEC §3).

## Do
- `src/stores/refStore.js` — load the three JSON files **once** at init (read-only); provide the
  neighborhood picker + walk-time prefill.
- `src/stores/appStore.js` — the form `input`, current screen, computed `ScoreResult`, saved list.
  **No entitlement/`unlocked` flag — nothing is gated.**
- `components/Form/ProgressBar.jsx` + steps:
  - `StepNeighborhood` (the five areas + "אחר").
  - `StepCosts` — rent · **ארנונה** · **ועד בית**.
  - `StepProperty` — rooms/size · floor · elevator · furnished (כן/חלקי/לא) · walk-minutes
    (prefilled from neighborhood, editable).
  - `StepTerms` — deposit amount (months/₪) + **timing** (before viewing / before signing / on
    signing).
  - `StepFlags` — the structured red-flag **checklist** + optional **ad-text paste**.
- Validation, back/next, ≥44px tap targets, ₪ / minutes as LTR islands.
- On finish: short **"מחשבים…"** beat → `scoreListing(input, refs)` → store result → persist a
  draft → route to Results.

## Files
- `src/stores/{refStore,appStore}.js`, `src/components/Form/*`

## Done-when
- [ ] The form completes on a phone viewport in well under a minute; result lands in the store;
      refresh restores the draft.

## Verify
- Browser MCP at a phone width; fill the ROADMAP §6 demo listing; confirm the result object.
  Commit `step 07: input form`.
