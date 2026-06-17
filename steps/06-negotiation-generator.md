# Step 06 — Negotiation-script generator (templates, headless)

**Phase:** Engine · **Status:** done · **Depends on:** 05

## Goal
The **signature feature**, built headless and pure: a findings-aware, polite-but-firm, **sendable**
Hebrew WhatsApp message from the `ScoreResult` — **100% template assembly, no AI, no server**
(PRD §5, ARCHITECTURE §7).

## Do
- `src/lib/engine/negotiation.js` — `buildNegotiationScript(result, input, refs) -> string`.
  - A small library of **hand-written Hebrew clause templates** with `{slots}` + a fixed
    intro/outro (e.g. *"שמתי לב שטווח השכירות המקובל ב{neighborhood} הוא בערך ₪{min}–{max} לחדר,
    וכאן זה יוצא ₪{perRoom} לחדר."*).
  - **Select clauses by findings** — over-market price, top-floor / no-elevator, hefty or early
    deposit, missing details — and **fill the numbers**: benchmark range, true monthly cost, and a
    **proposed counter-offer** derived from the price-vs-benchmark math.
  - Register: polite, firm, *"לא נאיבי"*; reads like a real student wrote it; **sendable as-is**.
  - Pure + deterministic: same result → same text.
- Extend the Step-05 fixtures: assert the script **cites the right numbers** and selects the right
  clauses per scenario (drops the price clause when price is fair, etc.).

## Files
- `src/lib/engine/negotiation.js`, fixture assertions

## Done-when
- [ ] Each fixture yields a coherent, sendable Hebrew message citing that listing's real findings.
- [ ] No AI / no network; deterministic; templates centralized (final wording reviewed at Step 12).

## Verify
- Run fixtures; read each generated message aloud — would a real student send it as-is? Commit
  `step 06: negotiation generator`.
