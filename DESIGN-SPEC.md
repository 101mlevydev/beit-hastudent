# DESIGN-SPEC — בית הסטודנט (Beit HaStudent)

> The deep build spec: **what it takes, the components, how it works, how it's designed, and the
> finalized stack.** Builds on PRD.md / ARCHITECTURE.md and folds in the DISCOVERY answers. This
> is the document to hand a developer.

---

## 0. Locked decisions (from discovery + the brief)

- **Identity:** a confident, helpful local-insider voice — direct about a bad deal, never cruel.
  Directness targets the **listing/terms**; empathy targets the **student**. Never a named
  landlord, building, or person.
- **Two scores, not one:** a **value score** (ציון ערך · 0–100) and a **risk level** (רמת סיכון ·
  נמוך/בינוני/גבוה), plus a **red-flags checklist**. Both are a transparent local rubric — **no
  AI** — with every weight in `scoring-config.json`.
- **No paywall, no gating, no blur.** The hub gates entry; "in the app = paid." Every user sees
  the full result, including the negotiation script. Nothing payment-shaped in the code.
- **Inputs (the full brief):** neighborhood (the five areas) · rent · rooms/size · floor
  (+elevator) · **ארנונה** · **ועד בית** · **deposit demanded** (amount + timing) · **furnished?**
  · distance-to-campus (prefilled, editable) · contract/listing **red-flag checklist** (+ optional
  ad-text paste).
- **Demo-critical two:** the **dual-score reveal** (credible, fast, transparent) + the **WhatsApp
  negotiation script** (sendable, findings-aware, one-tap copy, **template-based — no AI**).
- **Data:** hyper-local seed ranges for **שכונה ג' / ד' · רינגלבלום · מצדה · העיר העתיקה**;
  unknown area → city-student fallback range with an "approximate" note; ranges, not false
  precision.
- **Persistence:** `localStorage` **save & compare** multiple listings (not just last-result).
- **Visual:** "report card" base + a warning system (green→amber→red for value, a calm→alarm risk
  badge), warm desert palette tying it to the suite.
- **Legal framing:** red flags worded as *questions to ask*; a standing "מדריך זהירות — אינו
  ייעוץ משפטי או פיננסי" line near any risk surface.
- **Responsive:** mobile-first; tablet/laptop friendly (compare view shines on a wide screen).

---

## 1. The finalized stack

| Layer | Choice | Role |
|---|---|---|
| Build/dev | **Vite** | static output, CSP-safe (no runtime `eval`) |
| UI | **React 18** | the multi-step form + reactive results + compare, on one shell |
| Styling | **Vanilla CSS** (CSS variables + logical props, RTL) | a small, fully-owned report-card design system; zero CDN; clean RTL |
| Engine | **plain-JS pure functions** (`lib/engine`) | the value rubric + checklist risk model + template negotiation generator; unit-testable, no DOM, **no AI** |
| Data | **static JSON in `/public`** | `benchmarks.json` · `scoring-config.json` · `red-flags.json` |
| Persistence | **localStorage** | save & compare listings (`beit:saved:v1`, `beit:draft:v1`) |
| Hand-off | **clipboard** (primary) + `wa.me` link (secondary) | copy the negotiation script to WhatsApp |

> **No real-estate API, no backend, no AI/LLM, no payment SDK.** The only fetches are the three
> same-origin static JSON files at init; after load the app is fully offline. See ARCHITECTURE §2
> for the Vite+React justification (multi-step form + reactive cards + compare = stateful UI React
> keeps clean; engine is plain JS regardless).

---

## 2. The scoring engine (centerpiece)

`scoreListing(input, refs) -> ScoreResult` — a transparent **rubric**, not a model. Two
independent outputs plus a checklist (full shapes in ARCHITECTURE §3):

```
VALUE (0–100):  base 70
  ± price vs neighborhood ₪/room RANGE   (dominant; true cost = rent + ארנונה + ועד בית, per room)
  ± distance to campus (walk minutes)
  ± floor / heat & elevator (desert livability)
  ± furnished
  → verdict band + a per-factor breakdown ("איפה ירד הערך")

RISK (low/med/high):  checklist-based
  Σ severity-weighted red flags (deposit size & timing, cash-only, no contract,
    pressure, too-good-to-be-true, missing details) → band

RED FLAGS:  each matched item, worded as a QUESTION to ask, with a severity + disclaimer

NEGOTIATION SCRIPT:  template assembly from the above (no AI)
```

**Why pure functions:** deterministic, headless-testable (fixtures: a great deal, an over-market
flat, a top-floor no-elevator oven, a deposit-before-viewing trap), independent of UI/network —
the demo can never break on a fetch.

**Tunability:** every number shaping the "feel" lives in `scoring-config.json` (ARCHITECTURE
§4.2). Balancing is a data edit, not a code change.

---

## 3. Screens (information architecture)

The four screens the brief calls for, on one responsive React shell (a tiny screen-state switch,
no router lib):

| Screen | Job |
|---|---|
| **Input form** | guided, multi-step: **neighborhood** → **costs** (rent · ארנונה · ועד בית) → **property** (rooms/size · floor · elevator · furnished · walk-minutes) → **terms** (deposit amount + timing) → **red-flag checklist** (+ optional ad-text paste). Progress bar; one section at a time; validation. |
| **Results / Score** | **ValueScore** dial + verdict, **RiskBadge** (נמוך/בינוני/גבוה), **CostBreakdown** (rent + ארנונה + ועד בית = true monthly), **BenchmarkBar** (your ₪/room vs the neighborhood range), **RedFlagsList** (questions + disclaimer), expandable value **breakdown**. Everything shown — no gates. |
| **Negotiation script** | the signature surface: the generated Hebrew message, **one-tap "העתק"** ("הועתק ✓") + secondary "פתח ב-WhatsApp" (`wa.me`). Reachable straight from Results (a prominent CTA) and as its own focused view. |
| **Saved / Compare** | the `localStorage` list of saved listings; **CompareTable** lines up value, risk, true monthly cost, and commute side by side. "שמור דירה" / "בדוק דירה אחרת" / delete. |

---

## 4. Responsive / adaptive design

- **Phone (primary):** the listing-in-hand device — big tap targets (≥44px), single-column scroll,
  one form section per screen, the two scores above the fold on Results, the negotiation CTA a
  thumb-scroll away.
- **Tablet/iPad:** same UI scaled; comfortable for pasting long ad text and for filling the form
  two fields per row.
- **Laptop/desktop:** great for the **compare** view (multi-column table) and for demo projection;
  Results widens to a two-column card grid above a breakpoint. Click = tap.
- One responsive shell; cards use a fluid grid; no separate mobile build. Breakpoints (approx):
  **phone < 640 · tablet 640–1024 · laptop > 1024**.

---

## 5. Component inventory

**Engine (the seam)** — `lib/engine/`
- `index.js` — `scoreListing()` orchestrator.
- `value.js` · `risk.js` · `redFlags.js` — the rubric pieces (value adjusts, checklist risk,
  declarative flag matcher).
- `negotiation.js` — the template-based WhatsApp-script generator.

**Stores**
- `refStore` — read-only; loads the three JSON files; provides the neighborhood picker, walk-time
  prefill, and engine inputs.
- `appStore` — the form `input`, current screen, computed `ScoreResult`, and the **saved-listings
  list** (no entitlement state — nothing is gated).

**Shell & flow**
- `App` — screen switch Input → Results → Negotiation → Saved/Compare; handles draft resume.

**Input form** — `components/Form/`
- `ProgressBar`, and steps: `StepNeighborhood` · `StepCosts` (rent · ארנונה · ועד בית) ·
  `StepProperty` (rooms/size · floor · elevator · furnished · walk-minutes) · `StepTerms` (deposit
  amount + timing) · `StepFlags` (checklist + ad-text paste).

**Results** — `components/Results/`
- `ValueScore` — the 0–100 dial, green→amber→red, verdict line.
- `RiskBadge` — נמוך / בינוני / גבוה, calm→alarm.
- `CostBreakdown` — rent + ארנונה + ועד בית = **true monthly** (the "hidden cost" reveal).
- `BenchmarkBar` — a range bar showing where your ₪/room sits (below / within / above).
- `RedFlagsList` — each flag as a question to ask, severity dot, standing disclaimer.
- `Breakdown` — expandable "איפה ירד הערך" per value factor.

**Negotiation** — `components/Negotiation/`
- `NegotiationCard` — the script + one-tap copy ("הועתק ✓") + secondary `wa.me`.

**Saved/Compare** — `components/Saved/`
- `SavedList` — saved cards (value, risk, cost) + delete.
- `CompareTable` — side-by-side columns.

**Lib (non-UI):** `persistence` (localStorage save/compare/draft), `copy` (Hebrew strings, verdict
lines, disclaimers, script templates), `format` (₪ / minutes as LTR islands).

---

## 6. How it works — key flows

**Score → arm (the demo path):** Input form (5 short sections) → "מחשבים…" beat →
`scoreListing()` → **Results** renders both scores + cost + benchmark + flags → tap "כתוב לי
הודעה" → **Negotiation script** → **one tap copies** the Hebrew message → paste/send in WhatsApp.

**Hidden-cost reveal:** `CostBreakdown` adds rent + ארנונה + ועד בית into the **true monthly**
number and feeds the per-room benchmark — the "wait, it's not ₪3,400, it's ₪3,770" beat.

**Unknown area:** neighborhood = "אחר" → engine uses the city-student fallback range → result
flagged "נתונים משוערים".

**Save & compare:** "שמור דירה" appends to `localStorage` → **Saved/Compare** lines up several
listings; refresh restores the draft and the saved list.

**WhatsApp hand-off:** clipboard copy is the robust primary path (works in a sandboxed iframe);
the `wa.me/?text=…` deep link is a secondary affordance that degrades gracefully if top-level
navigation is blocked. No phone number is required or stored.

---

## 7. Visual & motion design

- **Design system:** report-card metaphor — two prominent score readouts (a **value dial** and a
  **risk badge**), a clean card stack, a warm desert palette (sand / terracotta) with a
  green→amber→red **value** accent and a calm→alarm **risk** accent. Intentional type scale,
  spacing, radii, soft shadows — per QUALITY-BAR.
- **Motion:** the value dial **sweeps** to its number on reveal (anticipation + ease, not a hard
  cut); the risk badge settles in; cards stagger-in on scroll; the copy button gives a satisfying
  press + "הועתק ✓" pop. Respect `prefers-reduced-motion`.
- **Value states:** ≤40 red ("עדיף לוותר."), 41–70 amber ("סביר — אפשר לנסות לשפר."), 71+ green
  ("עסקה טובה.") — dial color and verdict copy driven by the same band.
- **Risk states:** נמוך (green/calm) · בינוני (amber) · גבוה (red) — expressive, not gimmicky; no
  sirens. A bad result should be screenshot-worthy, not a prank.
- **RTL:** flawless mirroring; **₪ amounts, walk-minutes, and the wa.me URL are LTR islands** so
  they never reorder inside Hebrew text.

---

## 8. Content & copy

- **Seed data** (`public/benchmarks.json`): the five areas with typical ₪/room **ranges**,
  walk-time ranges, sun/notes, and a city fallback; `dataDate` / `version` / `disclaimer`
  surfaced for honesty ("טווחים משוערים לעיון בלבד").
- **Red-flag dictionary** (`public/red-flags.json`): structured checklist triggers (deposit size &
  timing, cash-only, no contract, pressure, too-good-to-be-true) + Hebrew ad-text patterns; each
  worded as a *question to ask*, not an accusation; "אינו ייעוץ משפטי" disclaimer near the list.
- **Voice:** confident headline + a constructive second line; the negotiation script polite-but-
  firm and sendable as-is. Central `copy` module; **native-Hebrew pass required** (must never read
  as AI-generated, per QUALITY-BAR §6).
- **The negotiation templates** are hand-written Hebrew with `{slots}`; the generator picks
  clauses by findings and fills the numbers. No AI anywhere.

---

## 9. What it will take (build breakdown)

| # | Block | Components | Risk |
|---|---|---|---|
| 1 | **Static data + engine (headless)** | the 3 JSON files, `lib/engine/*`, `negotiation.js`, fixtures | **high** (the "feel") |
| 2 | RTL shell + multi-step input form | App switch, Form steps, ProgressBar, refStore picker/prefill | med |
| 3 | Results screen (full reveal) | ValueScore, RiskBadge, CostBreakdown, BenchmarkBar, RedFlagsList, Breakdown | med |
| 4 | Negotiation screen + hand-off | NegotiationCard, copy, `wa.me` | med (the **wow** — polish hardest) |
| 5 | Persistence — save & compare | persistence, SavedList, CompareTable, draft resume | low |
| 6 | Polish + responsive + motion | dial sweep, stagger, desert design system, large-screen compare/grid | med |

**Critical path:** Block 1 → Block 4. If the rubric doesn't *feel* fair-but-honest and the script
isn't genuinely sendable, nothing downstream matters. Build and tune the engine headless before
any UI; treat the negotiation copy as a first-class deliverable, not a footnote.

---

## 10. Open items
- Confirm the per-room **ranges** and walk-times for all five seed areas with real local knowledge.
- Native-Hebrew copy pass (verdict lines + negotiation templates + red-flag question phrasings +
  disclaimers).
- Final `scoring-config.json` balance pass against the Block-1 fixtures (value curve + risk bands).
- Decide whether floor/heat shows a **qualitative** summer-livability note or a cautious ₪ range
  (avoid false precision — PRD §10).
- Confirm "compare" makes the demo (it shines on a laptop) vs stays a should-have.
