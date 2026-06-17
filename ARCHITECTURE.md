# ARCHITECTURE — בית הסטודנט (Beit HaStudent)

**Status:** Draft for review
**Constraint envelope:** zero backend · no DB · no real-estate API · no server-side code · no AI/
LLM call · no payment/paywall logic · static hosting in the BGU sandbox (cloned via Git) · Hebrew
RTL · mobile-first.

---

## 1. System overview

A single-page static web app. Everything runs in the browser. The only "I/O" is reading bundled
static JSON files and reading/writing `localStorage`. There is **no network call after the
initial static asset load** — the app is fully offline-capable, which is also the lowest
demo-risk posture.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Browser (only runtime)                                                     │
│                                                                            │
│  benchmarks.json ─────┐                                                    │
│  scoring-config.json  ├─fetch(once)─▶ Reference Store (read-only)          │
│  red-flags.json ──────┘                     │                              │
│                                             ▼                              │
│   Input Form ──listing──▶ Scoring Engine (pure functions, a local rubric)  │
│   (guided, multi-step)        │  valueScore() · riskScore() · redFlags()   │
│                               ▼                                            │
│                          ScoreResult ──▶ Negotiation Generator (templates) │
│                               │                                            │
│              ┌────────────────┼─────────────────┐                          │
│              ▼                ▼                 ▼                          │
│        Results screen   Negotiation script   Saved/Compare                 │
│        (both scores,    (clipboard + wa.me)  (localStorage list)           │
│         cost, flags)                                                       │
│              (everything rendered in full — no gating)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech stack & rationale

| Concern | Choice | Why |
|---|---|---|
| Build / dev | **Vite** | Instant HMR, static output, no runtime `eval` → CSP-friendly for the sandbox. |
| UI | **React 18** | Declarative state for the multi-step form + reactive results; clean component reuse. |
| Styling | **Vanilla CSS** (CSS variables + logical properties) | A small, fully-owned design system; zero CDN; trivially RTL via logical props; nothing for a strict `style-src` to choke on. |
| State | **React state + a light store (Context / Zustand)** | One read-only reference store + one app-flow store. Small surface; no Redux ceremony. |
| Scoring engine | **Plain-JS pure functions** (a local rubric) | Deterministic, unit-testable, explainable, **no AI**, no framework lock-in; lives in `lib/engine`. |
| Negotiation script | **Plain-JS template assembly** | `wa.me` text / clipboard string built from hand-written Hebrew templates + slots. **No AI, no server.** |
| Persistence | **localStorage** | Save & compare multiple listings; no DB needed. |
| Data | **Static JSON in `/public`** | `benchmarks.json` · `scoring-config.json` · `red-flags.json`. |

> **Stack choice — Vite + React (justified).** The intake is a genuine multi-step form with
> validation and conditional fields, and the results screen is several reactive cards plus a
> save/compare list — exactly the stateful UI React keeps clean. The cost (a build step, a
> runtime) is repaid in component reuse (the result cards are reused in compare) and in matching
> the suite convention (`daf-nuschaot` is Vite+React). **Vanilla JS was considered** and would be
> fine for the engine (which is plain JS regardless), but hand-rolling form state, routing
> between four screens, and a compare view in vanilla costs more than React saves. We keep React
> *light*: vanilla CSS (no UI kit), no router lib (a tiny screen-state switch), no state lib
> unless Context gets noisy.

> **No real-estate API, no AI, ever.** Ranges, walk-times, and red-flag rules are *baked into
> static data and a static rubric*, not fetched or generated. This is a hard architectural
> constraint, not a temporary shortcut — it's what lets the app live in a strict sandbox and run
> offline.

> **No payment/paywall layer.** No entitlement state, no gating, no blur, no paywall hook anywhere
> in the code. The hub owns access; we assume "in the app = already paid" and render the full
> result to everyone (see §8).

---

## 3. The scoring engine (a local rubric — pure, deterministic, tunable)

The engine is the technical heart and is built as **pure functions** with no UI/DOM coupling, so
it's unit-testable and demo-safe. Signature shape:

```
scoreListing(input, refs) -> ScoreResult
```

- `input` — the user's answers (see §3.1).
- `refs` — the loaded reference data: `{ benchmarks, config, redFlagRules }`.

The engine is a **rubric**: explicit, additive, explainable. There is no opaque model — every
point gained or lost can be traced to a config-driven rule. Two scores are computed independently
and a red-flag checklist is assembled:

```
valueScore(input, refs)  -> { score: 0..100, verdict, breakdown[], costMonthly, perRoom, benchmark }
riskScore(input, refs)   -> { level: 'low'|'med'|'high', score, flags[] }
redFlags(input, refs)    -> RedFlag[]    // feeds riskScore and the negotiation generator
```

### 3.1 Input shape

```jsonc
{
  "neighborhood": "gimel",        // gimel|dalet|ringelblum|masada|old-city|other
  "rentILS": 3400,                // monthly rent
  "rooms": 2,                     // number of rooms (for per-room normalization)
  "sizeSqm": 55,                  // optional
  "floor": 4,
  "hasElevator": false,
  "arnonaILS": 250,               // ₪/mo (municipal tax share)
  "vaadBayitILS": 120,            // ₪/mo (building committee)
  "deposit": { "months": 3, "timing": "before_signing" },  // before_viewing|before_signing|on_signing
  "furnished": "none",            // full|partial|none
  "walkMinutes": 14,              // prefilled from neighborhood, user-editable
  "checklist": {                  // the structured red-flag answers
    "cashOnly": true,
    "noContract": false,
    "noReceipts": false,
    "refusesViewing": false,
    "pressureToCloseToday": true
  },
  "adText": "מיידי, מזומן בלבד, יש המון מתעניינים…"   // optional, scanned for patterns
}
```

### 3.2 Value rubric (0–100)

```
costMonthly = rentILS + arnonaILS + vaadBayitILS          // the TRUE monthly cost
perRoom     = costMonthly / max(rooms, 1)
benchmark   = benchmarks[neighborhood].perRoom            // { min, typical, max }

value = config.baseValue                                  // e.g. 70 (neutral-fair baseline)
value += priceAdjust(perRoom, benchmark, config.price)    // dominant: below range ↑, above ↓ (steep past max)
value += distanceAdjust(walkMinutes, config.distance)     // closer ↑
value += floorHeatAdjust(floor, hasElevator, config.floor)// top-floor / 3+ no-elevator ↓ (desert livability)
value += furnishedAdjust(furnished, config.furnished)     // full/partial ↑
value  = clamp(value, 0, 100)
verdict = band(value, config.valueBands)                  // copy line per band
```

Every `*Adjust` returns a signed number **and** a breakdown entry `{ factor, delta, note }`, so
the UI can render "איפה ירד הערך" with full transparency.

### 3.3 Risk model (checklist-based)

```
flags = redFlags(input, refs)                 // structured checklist + ad-text scan (§4.3)
riskPoints = Σ severityWeight(flag)           // config.redFlags weights, capped
level = riskBand(riskPoints, config.riskBands)// 'low' | 'med' | 'high'
```

Risk is deliberately **separate** from value: a fairly-priced flat with a cash-only,
deposit-before-viewing demand should read **good value, high risk**. Risk scores the **terms and
the listing**, never a person (see §8 / PRD §10).

### 3.4 `ScoreResult` (single flat object — nothing is gated)

```jsonc
{
  "value": {
    "score": 64,
    "verdict": "מחיר סביר, אבל הקומה והמרחק מורידים.",
    "costMonthly": 3770,                       // rent + arnona + vaad bayit
    "perRoom": 1885,
    "benchmark": { "min": 1400, "typical": 1600, "max": 1750, "position": "above" },
    "breakdown": [
      { "factor": "price",    "delta": -10, "note": "₪1,885 לחדר — מעל הטווח (₪1,400–1,750)" },
      { "factor": "distance", "delta":  -4, "note": "14 דק' הליכה" },
      { "factor": "floor",    "delta":  -8, "note": "קומה 4 ללא מעלית" },
      { "factor": "furnished","delta":   0, "note": "לא מרוהט" }
    ]
  },
  "risk": {
    "level": "high",
    "score": 22,
    "flags": [
      { "code": "cash_only",   "label": "מבוקש תשלום במזומן בלבד", "ask": "בקש/י לשלם בהעברה ולקבל קבלה", "severity": "high" },
      { "code": "deposit_high","label": "פיקדון של 3 חודשים לפני חתימה", "ask": "בקש/י לעגן את תנאי ההחזר בחוזה", "severity": "high" },
      { "code": "pressure",    "label": "לחץ לסגור היום", "ask": "אל תמהר/י — בקש/י זמן לעבור על החוזה", "severity": "medium" }
    ]
  },
  "negotiationScript": "היי! ראיתי את המודעה…",   // generated Hebrew WhatsApp text (template-based)
  "meta": { "dataDate": "2026-06", "approximate": false }
}
```

The **negotiation generator** (§7) is a pure template function consuming this same result. Being
pure, both scores and the script are trivially unit-testable and depend on no network or runtime
state.

---

## 4. Static data schema (the reference "database")

We mimic a database with curated static JSON. Three files in `/public`, loaded once at init via
same-origin `fetch` (no CORS, no CSP `connect-src` issue).

### 4.1 `benchmarks.json` — neighborhood → typical ₪/room ranges

```jsonc
{
  "version": "1.0",
  "dataDate": "2026-06",
  "disclaimer": "טווחים מקומיים משוערים לעיון בלבד — לא מדד מחירים רשמי. ניתן לעריכה.",
  "campusAnchor": "שער ראשי, אוניברסיטת בן-גוריון",
  "neighborhoods": {
    "gimel":     { "name": "שכונה ג'",    "perRoom": { "min": 1400, "typical": 1600, "max": 1750 }, "walkMin": { "min": 6,  "max": 16 }, "sun": "mixed",   "notes": "ביקוש גבוה, קרוב לקמפוס" },
    "dalet":     { "name": "שכונה ד'",    "perRoom": { "min": 1300, "typical": 1500, "max": 1650 }, "walkMin": { "min": 10, "max": 22 }, "sun": "mixed",   "notes": "" },
    "ringelblum":{ "name": "רינגלבלום",   "perRoom": { "min": 1300, "typical": 1450, "max": 1600 }, "walkMin": { "min": 12, "max": 25 }, "sun": "exposed", "notes": "" },
    "masada":    { "name": "מצדה",        "perRoom": { "min": 1350, "typical": 1500, "max": 1650 }, "walkMin": { "min": 8,  "max": 18 }, "sun": "mixed",   "notes": "" },
    "old-city":  { "name": "העיר העתיקה", "perRoom": { "min": 1250, "typical": 1450, "max": 1650 }, "walkMin": { "min": 10, "max": 20 }, "sun": "mixed",   "notes": "מבנים ישנים — בדוק/י תחזוקה" }
  },
  "fallback": { "name": "סטודנטים בב\"ש (כללי)", "perRoom": { "min": 1250, "typical": 1500, "max": 1750 }, "walkMin": { "min": 8, "max": 25 } }
}
```

### 4.2 `scoring-config.json` — the tunable "feel" (both scores)

```jsonc
{
  "baseValue": 70,
  "price":    { "belowMinBonus": 14, "withinRange": 0, "abovePerPct": -0.8, "maxPricePenalty": -26,
                "tooLowFlagPct": -0.25 },
  "distance": { "freeUntilMin": 10, "perMinAfter": -0.8, "maxPenalty": -16 },
  "floor":    { "perFloorAbove2": -1, "topFloorPenalty": -6, "noElevatorFrom": 3, "noElevatorPenalty": -6 },
  "furnished":{ "full": 6, "partial": 3, "none": 0 },
  "valueBands": [ { "max": 40, "verdict": "עדיף לוותר." },
                  { "max": 70, "verdict": "סביר — אפשר לנסות לשפר." },
                  { "max": 100,"verdict": "עסקה טובה." } ],
  "redFlags": { "severityWeight": { "high": 10, "medium": 5, "low": 2 }, "maxRiskPoints": 40 },
  "riskBands": [ { "max": 5, "level": "low" }, { "max": 15, "level": "med" }, { "max": 999, "level": "high" } ]
}
```

### 4.3 `red-flags.json` — the checklist + heuristic dictionary

```jsonc
{
  "items": [
    { "code": "deposit_high",  "trigger": { "depositMonthsGte": 3 },
      "label": "פיקדון גבוה (3+ חודשים)", "ask": "בקש/י לעגן את גובה ומועד החזר הפיקדון בחוזה", "severity": "high" },
    { "code": "deposit_early", "trigger": { "depositTiming": "before_viewing" },
      "label": "פיקדון נדרש לפני צפייה", "ask": "אל תעביר/י כסף לפני שראית את הדירה וחתמת חוזה", "severity": "high" },
    { "code": "cash_only",     "trigger": { "checklist": "cashOnly", "adAny": ["מזומן בלבד", "רק מזומן"] },
      "label": "תשלום במזומן בלבד", "ask": "בקש/י העברה בנקאית וקבלה", "severity": "high" },
    { "code": "no_contract",   "trigger": { "checklist": "noContract", "adAny": ["ללא חוזה", "בלי חוזה"] },
      "label": "ללא חוזה כתוב", "ask": "התעקש/י על חוזה שכירות כתוב וחתום", "severity": "high" },
    { "code": "pressure",      "trigger": { "checklist": "pressureToCloseToday", "adAny": ["מיידי", "חייב לסגור היום", "יש המון מתעניינים"] },
      "label": "לחץ זמן", "ask": "קח/י זמן לעבור על התנאים — לחץ הוא דגל אדום", "severity": "medium" },
    { "code": "too_good",      "trigger": { "priceBelowPct": 0.25 },
      "label": "מחיר נמוך בצורה חריגה", "ask": "מחיר טוב מדי? ודא/י שהדירה והבעלים אמיתיים לפני תשלום", "severity": "medium" }
  ]
}
```

**Design notes**
- The neighborhood → range mapping *is* the local-knowledge database; the engine joins user input
  against it like a query against a table.
- **Append-only friendly:** add an area, tweak a weight, or add a red-flag rule by editing JSON —
  no code change. This is how content scales post-hackathon (matches the suite convention).
- `dataDate` + `version` + `disclaimer` are surfaced in the UI ("טווחים משוערים, מעודכן ל-…") for
  honesty.
- Unknown / `other` neighborhood → fall back to `fallback` and flag the result `approximate: true`.
- Red-flag triggers are **declarative data**, evaluated by a small generic matcher — no rule logic
  lives in code, only the matcher.

---

## 5. State management flow

Two intentionally-separate stores plus a derived result:

- **Reference store (read-only).** Loaded once from the three JSON files at app init. Feeds the
  neighborhood picker, walk-time prefill, and the engine inputs. Never mutated.
- **App-flow store (mutable).** Holds the form's collected `input`, the current screen, the
  computed `ScoreResult`, and the **saved-listings list**. There is **no `unlocked`/entitlement
  flag** — the result renders in full as soon as it exists.

```
Form section N ──setField(k,v)──▶ appStore.input
Form "finish" ──▶ result = scoreListing(input, refs) ──▶ appStore.result
                  goto Results → Negotiation
"שמור דירה" ──▶ appStore.saved.push({ input, result, savedAt }) ──▶ localStorage
Compare ──▶ render N saved results' cards side by side
```

---

## 6. Persistence — save & compare

- **Saved listings:** `localStorage["beit:saved:v1"] = [{ id, input, result, savedAt }, …]`.
  Saving a listing appends (or updates by id); the compare screen reads the array.
- **Last draft:** `localStorage["beit:draft:v1"]` keeps the in-progress / last result so a refresh
  mid-flow restores it ("המשך מהדירה הקודמת").
- **Reset / delete:** "בדוק דירה אחרת" clears the draft; each saved card has a delete.
- **Versioned:** a `version` field gates restore; bump + migrate on schema change.
- localStorage (not IndexedDB) — payloads are tiny and localStorage is universally allowed in
  sandboxed iframes that permit scripts.

---

## 7. The WhatsApp negotiation generator (template approach)

The signature feature, and explicitly **template-based string assembly — no AI, no server.**

```
buildNegotiationScript(result, input, refs) -> string
```

- A small library of **hand-written Hebrew clause templates** with `{slots}`, plus a fixed
  intro/outro. Example clause:
  `"שמתי לב שטווח השכירות המקובל ב{neighborhood} הוא בערך ₪{rangeMin}–{rangeMax} לחדר, וכאן זה יוצא ₪{perRoom} לחדר."`
- The generator **selects clauses** based on the findings — over-market price, top-floor/no-
  elevator, a hefty/early deposit, missing details — and **fills the numbers** (benchmark range,
  true monthly cost, and a **proposed counter-offer** derived from the price-vs-benchmark math,
  e.g. nudging toward the range's typical/max).
- Output is one polite-but-firm, sendable Hebrew message. The whole function is pure and
  unit-testable; given the same result it always produces the same text.

**Hand-off (two paths):**
- **Primary — clipboard.** `navigator.clipboard.writeText(script)` → "הועתק ✓". Works inside a
  sandboxed iframe and is the robust default.
- **Secondary — WhatsApp deep link.** `https://wa.me/?text=${encodeURIComponent(script)}` opens
  WhatsApp with the message prefilled. Must **degrade gracefully** if the sandbox blocks top-level
  navigation (the copy path always remains).

No phone number is required or stored — the student pastes/sends to whichever chat they choose,
which also keeps us clear of holding any landlord's contact data (see §8 / PRD §10).

---

## 8. Access model — zero backend, zero AI, zero payment code

- **No server, no DB, no real-estate API, no AI/LLM, no auth.** The only fetches are same-origin
  static JSON at init. After load the app is fully offline.
- **No payment, paywall, gating, blur, or entitlement logic — none of it exists in our code.**
  The BGU hub wraps the app and owns access/payment. We assume **"in the app = already paid"**:
  every user is effectively a free premium user and the full result is always rendered.
- **Legal/ethical posture in code:** the app scores **listings and terms**, not people. We do not
  require, store, or display a landlord's name/phone as part of any risk claim; risk is a
  **checklist score**; every red-flags surface ships a "מדריך זהירות — אינו ייעוץ משפטי או
  פיננסי" string from the copy module.

---

## 9. Sandbox / CSP considerations

- Vite build = static HTML/CSS/JS, **no runtime `eval`** → friendly to a strict `script-src
  'self'`.
- **Bundle all assets locally** (CSS, fonts, icons) — **no CDN** — to survive strict `style-src` /
  `font-src`. Vanilla CSS means no inline-style injection to special-case.
- No WebSocket, no outbound fetch after init → nothing for `connect-src` to block.
- `localStorage` and `navigator.clipboard` are standard and allowed in sandboxed iframes that
  permit scripts. Clipboard may require a user gesture (it always fires from a button tap — fine).
- **WhatsApp deep link:** `wa.me` is the only outbound navigation and is optional; the clipboard
  path is the robust primary if navigation is blocked.

---

## 10. Proposed project structure

```
beit-hastudent/
  public/
    benchmarks.json         # neighborhood → typical ₪/room ranges + walk-time + notes
    scoring-config.json     # weights / thresholds / bands for value + risk (tunable feel)
    red-flags.json          # checklist items + Hebrew heuristic dictionary
    fonts/                  # locally bundled (no CDN)
  src/
    main.jsx
    App.jsx                 # screen switch: Form → Results → Negotiation → Saved/Compare
    stores/
      refStore.js           # read-only: loads the 3 JSON files
      appStore.js           # input + result + saved list (no entitlement state)
    lib/
      engine/
        index.js            # scoreListing(input, refs)
        value.js            # value rubric (§3.2)  + breakdown
        risk.js             # checklist risk model (§3.3)
        redFlags.js         # declarative matcher over red-flags.json (§4.3)
        negotiation.js      # template-based WhatsApp script generator (the signature)
      persistence.js        # localStorage save/compare/draft
      format.js             # ₪ / minutes as LTR islands
      copy.js               # Hebrew strings, verdict lines, disclaimers
    components/
      Form/                 # guided multi-step listing input
        StepNeighborhood.jsx StepCosts.jsx StepProperty.jsx StepTerms.jsx StepFlags.jsx
        ProgressBar.jsx
      Results/
        ValueScore.jsx      # the value dial + verdict + breakdown
        RiskBadge.jsx       # low/med/high
        CostBreakdown.jsx   # rent + arnona + vaad bayit = true monthly
        BenchmarkBar.jsx    # where you sit in the neighborhood range
        RedFlagsList.jsx    # checklist items as questions + disclaimer
      Negotiation/
        NegotiationCard.jsx # the script + one-tap copy ("הועתק ✓") + wa.me
      Saved/
        SavedList.jsx CompareTable.jsx
    styles/
      app.css               # RTL base + design-system tokens (CSS variables)
  index.html                # <html dir="rtl" lang="he">
```

---

## 11. Accessibility & RTL specifics

- `<html dir="rtl" lang="he">`; layout via logical CSS properties (`margin-inline`, `inset-*`).
- **Numbers, ₪ amounts, walk-minutes, and the wa.me URL are LTR islands** inside RTL text (wrap in
  `dir="ltr"` spans) so prices and links never reorder.
- Sufficient contrast; **≥ 44px tap targets** (this is a phone-in-the-apartment-viewing app);
  respect `prefers-reduced-motion` for the score-dial sweep.
- The copy action has a clear, accessible confirmation ("הועתק ✓") and keyboard focusability.
