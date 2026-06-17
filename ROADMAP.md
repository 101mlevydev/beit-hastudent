# ROADMAP — בית הסטודנט (Beit HaStudent) · Hackathon Execution Plan

**Status:** Draft for review
**Assumption:** small team, time-compressed hackathon. Times are relative effort blocks, not
wall-clock guarantees. Build the **spine that produces the scores** first; the UI and the reveal
wrap around a working engine, never the other way round.

---

## 0. Pre-flight (before the clock)
- [ ] Confirm the data belt: **שכונה ג' · שכונה ד' · רינגלבלום · מצדה · העיר העתיקה** and the
      campus-gate anchor used for walk-time.
- [ ] Confirm the output surface: **value score + risk level + red-flags checklist + cost
      breakdown + benchmark + negotiation script**, **all shown, nothing gated** (the hub owns
      access; "in the app = paid").
- [ ] Scaffold: `npm create vite@latest beit-hastudent -- --template react`. **No UI kit, no
      router lib, no state lib (start with Context), and crucially no AI/LLM SDK** — the engine is
      plain JS and the script is template assembly. Vanilla CSS with RTL logical properties.

---

## Phase 1 — Static data + the core rubric engine (headless)

> The engine is the credibility of the whole pitch. Build and **unit-test it headless first**,
> before any UI exists. If the numbers feel wrong, nothing downstream matters.

### 1.1 — Author the static data
- [ ] `public/benchmarks.json` — for each of the five areas: a typical ₪/room **range**
      (min/typical/max), a walk-time range, sun/notes; plus a city-student fallback. Mark
      `dataDate` / `version` / `disclaimer` ("טווחים משוערים לעיון בלבד").
- [ ] `public/scoring-config.json` — base value, the value adjusts (price/distance/floor/
      furnished), value bands, red-flag severity weights, risk bands.
- [ ] `public/red-flags.json` — declarative checklist triggers (deposit size & timing, cash-only,
      no contract, pressure, too-good-to-be-true) + Hebrew ad-text patterns, each with severity +
      a "question to ask" phrasing.
- **Exit check:** files validate; an unknown area resolves to the fallback range.

### 1.2 — Build the rubric engine (pure functions, no AI)
- [ ] `value.js` — true monthly cost (rent + ארנונה + ועד בית) → per-room → vs range; +
      distance/floor/furnished adjusts; returns score + verdict + breakdown (§ARCH 3.2).
- [ ] `redFlags.js` — a generic matcher over `red-flags.json` (checklist answers + ad-text scan).
- [ ] `risk.js` — severity-weighted red flags → נמוך/בינוני/גבוה.
- [ ] `index.js` — `scoreListing(input, refs)` composes value + risk + flags into one flat
      `ScoreResult`.
- [ ] `negotiation.js` — **template-based** Hebrew WhatsApp script from the result (clause
      selection + number filling; **no AI**).
- **Exit check:** hand-made fixtures (a great deal, an over-market flat, a top-floor no-elevator
  oven, a deposit-before-viewing trap) produce value/risk/flags/scripts that *feel right* in a
  plain Node test — **no UI yet**.

---

## Phase 2 — The guided input form

> Multi-step, one section at a time, big and friendly, mobile-first. Feels like under a minute,
> not a tax form. It only collects `input`; it calls the Phase-1 engine on finish.

- [ ] RTL Vite+React shell; `<html dir="rtl" lang="he">`; load the 3 JSON files into the read-only
      reference store; vanilla-CSS design tokens.
- [ ] Form framework: section-per-screen, progress bar, back/next, validation.
- [ ] Sections: **neighborhood** → **costs** (rent · ארנונה · ועד בית) → **property** (rooms/size ·
      floor · elevator · furnished · walk-minutes, prefilled from neighborhood) → **terms**
      (deposit amount + timing) → **red-flag checklist** (+ optional ad-text paste).
- [ ] On finish: run `scoreListing(...)`, store the result, persist a draft, route to Results.
- [ ] Short "מחשבים…" beat before the reveal.
- **Exit check:** complete the form on a phone viewport in well under a minute; the result lands
  in the store; refresh restores the draft.

---

## Phase 3 — Results + the negotiation script (the wow)

> The scores inform; the script *arms*. Everything is shown — no blur, no paywall, no upsell.

- [ ] **Results:** `ValueScore` dial (0–100, color-coded) + verdict; `RiskBadge`
      (נמוך/בינוני/גבוה); `CostBreakdown` (rent + ארנונה + ועד בית = true monthly); `BenchmarkBar`
      (₪/room vs the neighborhood range); `RedFlagsList` (each flag as a question + "אינו ייעוץ
      משפטי" disclaimer); expandable `Breakdown` ("איפה ירד הערך"). All render their data directly.
- [ ] **The aha:** `NegotiationCard` shows the generated Hebrew script with **one-tap copy** (clear
      "הועתק ✓") and a secondary `wa.me` deep link that degrades gracefully. No phone number
      required or stored.
- [ ] Polish: empty/unknown-area state, "נתונים משוערים · מעודכן ל-…" note, "בדוק דירה אחרת" reset,
      the score-dial sweep.
- **Exit check:** full flow on mobile — form → both scores → read the cost/benchmark/flags → copy
  the WhatsApp script. The "it wrote my message" moment lands with nothing standing in the way.

---

## Phase 4 — Save & compare

- [ ] "שמור דירה" appends `{ input, result, savedAt }` to `localStorage["beit:saved:v1"]`.
- [ ] `SavedList` + `CompareTable`: line up value, risk, true monthly cost, and commute across
      saved listings (the compare view shines on a laptop / projector).
- **Exit check:** score two listings, save both, compare side by side; refresh restores everything.

---

## 5. Testing strategy (sandbox-aware)
- **Engine unit tests (Phase 1):** fixtures for great-deal / over-market / oven / deposit-trap;
  assert value score + band, risk level, the red-flags list, the cost breakdown, and that the
  negotiation script cites the right numbers. The most important test surface.
- **Local CSP rehearsal:** serve `vite build` behind a strict CSP
  (`default-src 'self'; style-src 'self'; font-src 'self'`); confirm fonts load and nothing breaks.
- **Offline test:** load once, kill network, confirm the entire flow still works (no API by design).
- **Clipboard / wa.me:** verify copy works in a sandboxed iframe; confirm the deep link degrades
  gracefully if top-level navigation is blocked.
- **RTL/number islands:** ₪ amounts, walk-minutes, and links never reorder inside Hebrew text.
- **Persistence:** refresh mid-flow and post-result, and across multiple saved listings.

---

## 6. Demo script (target: < 60s, judge does it unassisted)
1. Open → confident welcome → **"בדוק את הדירה"**.
2. Pick **שכונה ג'**, rent ₪3,400, 2 rooms, floor 4 / no elevator, ארנונה ₪250, ועד בית ₪120,
   deposit 3 months **before signing**, unfurnished; check "מזומן בלבד" + "לחץ לסגור היום".
3. "מחשבים…" beat → **ציון ערך 64**, **רמת סיכון: גבוה**, true monthly **₪3,770** (not ₪3,400!),
   ₪1,885/room **above** the ₪1,400–1,750 range, red flags listed — all on screen.
4. Tap **"כתוב לי הודעה"** → the **WhatsApp negotiation script** → **tap "העתק"** → paste into
   WhatsApp.
5. *"It just wrote my message to the landlord, with the neighborhood's typical rent baked in."*
   **Mic drop.**
6. One-liner: "All client-side, no backend, no AI — a local rubric + templates. Works offline.
   Everything's free; the hub gates entry, once you're in, you're in."

---

## 7. Risk register
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scoring "feel" is off / unconvincing | Med | High | Tune via `scoring-config.json` against fixtures in Phase 1, before UI. |
| Seed ranges wrong (rent/walk-times) | Med | High | Curate the five areas carefully; show **ranges** + `dataDate`; flag approximations. |
| Red flags read as accusation (legal) | Low | **High** | Frame as "ask about this," score terms not people; standing "אינו ייעוץ משפטי" disclaimer; never store/show a landlord's name. |
| Thin payoff (nothing gated to "reveal") | Med | Med | The negotiation script carries the wow — make it genuinely sendable & findings-aware. |
| Over-claiming AC ₪ cost | Med | Med | Keep heat/floor qualitative (or a range), not a guaranteed number. |
| Clipboard / wa.me blocked in iframe | Low | Med | Copy is primary and robust; wa.me is secondary and degrades gracefully. |
| Scope creep (map, compare, NLP) | Med | Med | Compare is a should-have; map/NLP are stretch; protect Phases 1–3. |

---

## 8. Definition of done (hackathon)
- A judge enters a believable listing and reaches the **WhatsApp negotiation script** in under
  60 seconds, on a phone.
- The **value score, risk level, true monthly cost, benchmark, and red flags** are real,
  trustworthy, and **all shown in full** — no gating, blur, or upsell anywhere.
- The engine is a pure, unit-tested, JSON-tunable **rubric** (no AI); the script is **template
  assembly** (no AI); the whole app runs **offline, under a strict CSP, fully RTL**, with **zero
  backend and zero payment code**.
- Red flags read as due-diligence questions, never accusations; the "אינו ייעוץ משפטי" disclaimer
  is present on every risk surface.
