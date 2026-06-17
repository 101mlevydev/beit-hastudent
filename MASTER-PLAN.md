# MASTER-PLAN — בית הסטודנט (Beit HaStudent)

> The orchestrator. Build this app from empty repo → finished product by executing the step files
> in `./steps/` **in order, one at a time**. Each step file is a small, self-contained task with
> its own done-when + verify. This plan is the index + the rules; the steps are the work.

**Source of truth for detail:** `DESIGN-SPEC.md` · `PRD.md` · `ARCHITECTURE.md` · `ROADMAP.md`.

---

## Locked context (decided with the owner)
- Build **fourth** of the suite. **Full execution** (scaffold, run builds, browser-verify, git
  branch per app). **Proceed on assumptions**; owner reviews at the two **gates** below.
- **Two outputs, never one blended number:** a **value score** (ציון ערך · 0–100, green→amber→red)
  and a **risk level** (רמת סיכון · נמוך/בינוני/גבוה), plus a **red-flags checklist**. Both are a
  transparent local **rubric** — every weight in `scoring-config.json`. **No AI, no model.**
- **The full input set:** neighborhood (the five areas) · rent · rooms/size · floor (+elevator) ·
  **ארנונה** · **ועד בית** · **deposit demanded** (amount + timing) · **furnished?** ·
  distance-to-campus (prefilled, editable) · contract/listing **red-flag checklist** (+ optional
  ad-text paste).
- **Five neighborhoods:** שכונה ג' · שכונה ד' · רינגלבלום · מצדה · העיר העתיקה; unknown area →
  city-student **fallback** range labelled "נתונים משוערים".
- **Signature moment:** the **template-based WhatsApp negotiation script** — hand-written Hebrew
  clause templates + slots, findings-aware, one-tap **copy** (primary) + `wa.me` (secondary).
  **No AI** — string assembly only. "It wrote my message *for* me" is the wow.
- **Hidden-cost reveal:** the **true monthly cost** = rent + ארנונה + ועד בית, normalized per room
  against the neighborhood range ("not ₪3,400 — ₪3,770").
- Assumptions until told otherwise: BGU hub serves static files in a **sandboxed iframe** under a
  **strict CSP**; **"in app = paid"** (no paywall, no gating, no blur, no entitlement code). Hebrew
  **RTL**, mobile-first.
- **Stack:** Vite + **React 18** + vanilla CSS (RTL logical props) + pure-JS engine (`lib/engine`)
  + static JSON in `/public` + localStorage. **No backend, no real-estate API, no AI/LLM SDK, no
  payment SDK.** (ARCHITECTURE §2.)
- **Legal framing (binding):** red flags are worded as *questions to ask*, score **terms/listings,
  never a person**; a standing **"מדריך זהירות — אינו ייעוץ משפטי או פיננסי"** line sits near every
  risk surface. We never store/show a landlord's name or phone.
- **Look:** calm, **trustworthy** "report card" — warm desert palette, intentional type/spacing,
  green→amber→red value dial + calm→alarm risk badge. Credible, **not gimmicky**; a bad result is
  screenshot-worthy, never a prank.

## Approval gates (these pause the run)
- **Step 01 — DESIGN GATE** ⛔ produce a visual mockup → owner approves the look (palette, type,
  the dual-score reveal, layout) BEFORE any app source code is written.
- **Step 12 — CONTENT & COPY GATE** ⛔ the seed **benchmarks** (₪/room ranges + walk-times for the
  five areas) and **all Hebrew copy** — verdict lines, red-flag question phrasings, disclaimers,
  and the **negotiation-script templates** — drafted → owner / native speaker approves (must read
  as a real, savvy student, never as AI; the script must be sendable as-is).
Everything else runs autonomously between/after the gates.

## How to execute (rules)
1. Do steps **in numeric order**. Open the step file, do it, run its **Verify**, tick its
   **Done-when**, mark its `Status: done`, then move on.
2. At a **GATE**, produce the artifact and **STOP for owner approval**; resume only when approved.
   No app source code (beyond `design/mockup.html`) until **Step 01 is approved**.
3. After each step: `git add -A && git commit` on the app branch with `step NN: <title>`.
4. **Engine-first:** build and unit-test the rubric + negotiation generator **headless** (Steps
   04–06) before any UI. If the numbers and the script don't *feel* fair-but-honest, nothing
   downstream matters (DESIGN-SPEC §9 critical path).
5. Self-verify with the **`run`/`verify`** skills + browser MCP (Playwright/Chrome). Simulate the
   sandbox with a **strict-CSP local serve**; confirm the app runs **offline** after first load.
6. If a Verify fails → fix → re-verify before advancing. If blocked → stop and report.
7. **When time is tight, cut scope, never craft** (QUALITY-BAR). Protect the demo path: form →
   dual-score reveal → copy the WhatsApp script.

## Definition of Done
> **Inherits [QUALITY-BAR.md](../QUALITY-BAR.md).** "Builds and runs" is the floor. Craft, motion,
> feel, native-Hebrew copy, and a flawless rehearsed demo are **gates**, not extras.
- [ ] Meets the QUALITY-BAR standard (cohesive desert "report-card" design system · motion/juice ·
      no console errors · responsive · accessible).
- [ ] `npm run build` → static output; loads with no console errors; runs under **strict CSP** &
      **offline** after first load (only same-origin JSON fetched at init).
- [ ] Guided multi-step form collects the **full input set** (neighborhood · rent · rooms/size ·
      floor+elevator · ארנונה · ועד בית · deposit amount+timing · furnished · walk-minutes ·
      red-flag checklist + optional ad-text) on a phone in well under a minute.
- [ ] Results show **both scores** + verdict lines + **true monthly cost** (rent + ארנונה + ועד
      בית) + **per-room benchmark position** + **red-flags checklist** — **all shown, nothing
      gated, no blur, no upsell**.
- [ ] The **WhatsApp negotiation script** is template-assembled, findings-aware, sendable as-is,
      with one-tap **copy** ("הועתק ✓") + graceful `wa.me` fallback; no phone number required/stored.
- [ ] **Save & compare** multiple listings via `localStorage`; refresh restores draft + saved list.
- [ ] The engine is a pure, unit-tested, JSON-tunable **rubric** (no AI); the script is **template
      assembly** (no AI); **zero backend, zero payment code**.
- [ ] Red flags read as due-diligence **questions**, never accusations; the **"אינו ייעוץ משפטי"**
      disclaimer is present on every risk surface; risk scores terms, not people.
- [ ] Seed `benchmarks.json` / `scoring-config.json` / `red-flags.json` populated with reviewed
      content; all Hebrew **native-reviewed** (Step 12).
- [ ] Demo script runs in **< 60s**, judge unaided, reaching the WhatsApp script (ROADMAP §6).

## Step index
| # | Step | Gate |
|---|---|---|
| 01 | Design gate — visual mockup | ⛔ approve |
| 02 | Scaffold (Vite + React) + git + env check | |
| 03 | Design tokens + RTL base (desert report-card system) | |
| 04 | Static data (benchmarks · scoring-config · red-flags) | |
| 05 | Scoring engine — value + risk + red-flags (headless rubric) | |
| 06 | Negotiation-script generator (templates, headless) | |
| 07 | RTL shell + guided multi-step input form | |
| 08 | Results screen — dual score + cost reveal + benchmark + flags | |
| 09 | Negotiation screen + hand-off (copy + wa.me) | |
| 10 | Save & compare (localStorage) | |
| 11 | Responsive + motion polish (phone / tablet / laptop) | |
| 12 | Content & copy gate — benchmarks + Hebrew script | ⛔ approve |
| 13 | Final — CSP/offline acceptance + demo | |

## What the owner must do
- **Approve Step 01 mockup** (the look) and **Step 12 content+copy** (the seed ₪/room ranges,
  walk-times, red-flag phrasings, disclaimers, and the negotiation-script templates — they must
  read as a real student, not AI). Everything else is autonomous.
- Optional later: supply verified per-room **ranges** / walk-times from real local knowledge to
  replace the seed set; provide the BGU hub's real CSP/iframe facts if they differ from the
  assumptions.
