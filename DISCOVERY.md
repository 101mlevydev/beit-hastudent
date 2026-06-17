# DISCOVERY — בית הסטודנט (Beit HaStudent) · Product & UX/UI

> **How to use this doc.** Product-vision & UX/UI questions only (no tech). Each has my
> **Recommendation + why**, and an **Answer** slot — confirm ("✅") or redirect. Unanswered =
> agreed. Your answers drive the deep design/spec pass (DESIGN-SPEC.md).

**The app in one line:** enter a listing's details (neighborhood, rent, rooms, floor, ארנונה +
ועד בית, deposit demanded, furnished?, distance to campus, contract red-flags) → get a **value
score + risk level** with clear red flags, benchmarked against typical local ranges, plus the
hidden true monthly cost — and a one-tap **WhatsApp negotiation script**. **Scoring is a local
rubric (no AI); the script is template-based (no AI).** **Emotional target: clarity → empowerment
("I'm not getting played").** **Context: phone, scrolling listings late at night.** **No
paywall — the hub gates entry; everyone's a free premium user.**

---

## A. Vision & positioning

🎯 *Changes:* how hard we lean into the "anti-scam, ruthless local insider" identity.

**QA.1 — Core identity — "ruthless anti-scam scorer with attitude," or a neutral "apartment
helper"?**
- *Recommendation:* **Lean all the way into the ruthless cynical-insider voice** — the older
  sibling who's rented here and won't let you get played. — *why:* it's funnier, more shareable,
  and the personality is the differentiator over a generic checklist.
- **Answer:** ▮

**QA.2 — Who is the snark aimed at — the apartment/landlord, or never anyone?**
- *Recommendation:* **Snark targets the apartment and shady-listing behavior; empathy always
  targets the student.** Never a named landlord or building. — *why:* relatable and safe; naming
  real people/places is a defamation risk (see QG.2).
- **Answer:** ▮

**QA.3 — What is it explicitly NOT?**
- *Recommendation:* Not a listings marketplace, not a Yad2 competitor, not legal advice — a
  **fast gut-check + negotiation leverage** for a listing you already found. — *why:* matches the
  zero-backend, static-data reality and keeps scope tight.
- **Answer:** ▮

---

## B. User & context

🎯 *Changes:* density, glanceability, how much we explain.

**QB.1 — Primary moment of use?**
- *Recommendation:* **Phone, late at night, mid-scroll** through Yad2 / Facebook groups /
  WhatsApp listings — a quick "should I even bother viewing this?" check. — *why:* honest to when
  the anxiety actually hits; drives mobile-first, fast-input design.
- **Answer:** ▮

**QB.2 — How much does the user already know about the apartment when they arrive?**
- *Recommendation:* **They have a listing in front of them** (street, rent, floor, ad text) and
  paste it in. — *why:* we score a known listing; we don't help them search.
- **Answer:** ▮

**QB.3 — Geographic scope for the demo?**
- *Recommendation:* **The student belt — שכונה ג' / שכונה ד' / רינגלבלום / מצדה / העיר העתיקה.**
  Unknown areas fall back to a broad city-student range with an "approximate" note. — *why:*
  hyper-local credibility is the whole pitch; better to be deep on the five student areas than
  shallow everywhere.
- **Answer:** ▮

---

## C. The magic moment

🎯 *Changes:* whether the wow is the *score* or the *negotiation script*.

**QC.1 — The single best beat — the **score reveal** (value + risk), or the **WhatsApp
negotiation script**?**
- *Recommendation:* **The negotiation script.** The scores hook; the script *arms* — "it wrote
  my message to the landlord, with the neighborhood's typical rent baked in." — *why:* turning
  insight into a sendable action is more memorable and more useful than a number.
- **Answer:** ▮

**QC.2 — How theatrical should the score reveal be (a dramatic "calculating…" beat, a needle
sweep), vs. instant?**
- *Recommendation:* **A short theatrical beat** before the number lands — the ruthlessness is
  part of the brand. — *why:* the math is instant; the drama earns the "verdict" feeling.
- **Answer:** ▮

**QC.3 — First 20 seconds for a brand-new user?**
- *Recommendation:* **Big "דרג את הדירה" → a Typeform-style one-question-per-screen intake** with
  street autocomplete, so they're typing real answers in seconds with no setup. — *why:* form
  friction is the #1 drop-off risk; one question at a time feels like 30 seconds.
- **Answer:** ▮

---

## D. Journey, screen by screen

🎯 *Changes:* the intake → calculating → dashboard flow.

**QD.1 — Intake style: one long form, or Typeform-style one-question-per-screen?**
- *Recommendation:* **One question per screen, big and friendly, with a progress bar.** — *why:*
  lowest cognitive load on a phone; matches the playful suite tone.
- **Answer:** ▮

**QD.2 — What do we ask? Confirm the fields.**
- *Recommendation:* **neighborhood (the five areas) · monthly rent (₪) · rooms/size · floor
  (+ elevator?) · ארנונה (₪/mo) · ועד בית (₪/mo) · deposit demanded (months + when) · furnished?
  · distance to campus (prefilled, editable) · a contract/listing red-flag checklist + optional ad
  paste.** — *why:* the rubric needs the true monthly cost (rent + ארנונה + ועד בית) and the
  terms; the checklist + ad paste power the red-flags scan.
- **Answer:** ▮

**QD.3 — After scoring — single scrolling dashboard, or tabbed/sectioned?**
- *Recommendation:* **One scrolling dashboard:** score dial on top, then commute, AC cost, red
  flags, and the negotiation script as the climactic last card. — *why:* a single narrative
  scroll that builds to the script reads better than tabs on mobile.
- **Answer:** ▮

---

## E. The scores — value, risk, and the red-flags checklist

🎯 *Changes:* how transparent and how honest the scoring feels.

**QE.0 — One blended score, or two — value + risk?**
- *Recommendation:* **Two independent outputs: a value score ("good deal?") and a risk level
  ("likely a trap?"), plus a red-flags checklist.** — *why:* a fairly-priced flat with sketchy
  terms is *good value, high risk* — one number would hide that, and it serves the legal framing
  (risk = checklist-based).
- **Answer:** ▮

**QE.1 — Should we show **why** value points were lost (a per-factor breakdown), or just the
number + verdict?**
- *Recommendation:* **Show the verdict prominently; offer an expandable "איפה ירד הערך"
  breakdown.** — *why:* transparency builds trust in the rubric without cluttering the headline.
- **Answer:** ▮

**QE.2 — How honest is the value curve — should a "perfect 100" be basically impossible?**
- *Recommendation:* **Yes — a high score is rare and earned.** Most real listings land 50–75. —
  *why:* a tool that calls everything great is useless; the brand is honest, not flattering.
- **Answer:** ▮

**QE.3 — The verdict line tone — deadpan-brutal ("ברח."), or constructive ("בינוני, אפשר טוב
יותר")?**
- *Recommendation:* **Brutal headline + a constructive second line.** ("ברח. — או לפחות תוריד
  ₪300.") — *why:* the laugh lands, then we actually help.
- **Answer:** ▮

---

## F. UI look & feel

🎯 *Changes:* the visual personality.

**QF.1 — Visual vibe: clean fintech "report card," gritty street/warning aesthetic, or playful
desert?**
- *Recommendation:* **A confident "report card" base with warning-system accents** (green→amber→
  red score states, red-flag badges) and a warm desert palette tying it to the suite. — *why:*
  the report-card metaphor sells credibility; the warning colors carry the anti-scam energy.
- **Answer:** ▮

**QF.2 — How loud is a bad score — full red-alert treatment, or restrained?**
- *Recommendation:* **Expressive but not gimmicky** — a red score dial, a couple of flag badges,
  a sharp verdict line; no sirens. — *why:* impactful and screenshot-worthy without feeling like
  a prank.
- **Answer:** ▮

**QF.3 — Reference apps for the feel?**
- *Recommendation:* **A credit-score / "how healthy is this" report card** crossed with a
  **Rotten-Tomatoes-style single verdict number.** — *why:* both are instantly legible patterns
  that map onto a single ruthless score.
- **Answer:** ▮ *(name any)*

---

## G. Content & tone

🎯 *Changes:* the data credibility and the copy voice.

**QG.1 — The negotiation script voice — polite-firm, or cheeky?**
- *Recommendation:* **Polite but firm, "לא נאיבי"** — citing real numbers (street average,
  AC reality) and proposing a specific counter-offer. Sendable as-is, no editing needed. — *why:*
  it has to be something the student would actually send to a landlord.
- **Answer:** ▮

**QG.2 — Red flags wording — accusatory ("this is a scam"), or cautionary ("ask about this")?**
- *Recommendation:* **Cautionary, framed as questions to ask** ("מזומן בלבד? בקש חוזה כתוב"),
  with an explicit "guidance, not legal advice" line. — *why:* protects us from defamation/false-
  accusation risk while still being useful.
- **Answer:** ▮

**QG.3 — Seed data honesty — do we surface that prices/walk-times are approximate?**
- *Recommendation:* **Yes — a quiet "נתונים משוערים · מעודכן ל-..." note** and ranges where
  unsure. — *why:* one wrong number kills trust; honesty about approximation protects credibility.
- **Answer:** ▮

---

## H. Access & the suite's freemium story

🎯 *Changes:* nothing in the build — but worth confirming the framing.

**QH.1 — Confirm: no paywall, no gating, no blur — everyone sees the full result?**
- *Recommendation:* **Confirmed.** The hub gates entry; "in the app = paid." Every user is a free
  premium user; the engine's full result (incl. the negotiation script) always renders. — *why:*
  matches the whole suite; keeps our code honest and the demo frictionless.
- **Answer:** ▮

**QH.2 — In the *pitch* (not the build), which insights do we name as the "natural paywall"?**
- *Recommendation:* **The high-value insights** — summer-AC cost, landlord red flags, the
  negotiation script — as the conceptual "pay at peak intent" gate the hub would own. — *why:*
  shows the monetization thinking judges want, without us coding any of it.
- **Answer:** ▮

---

## I. Scope & priorities

🎯 *Changes:* what must be perfect vs. nice.

**QI.1 — Of everything, which TWO must be flawless for the demo?**
- *Recommendation:* **The score reveal** (credible, ruthless, fast) **+ the WhatsApp negotiation
  script** (sendable, findings-aware, one-tap copy). — *why:* the score is the hook, the script
  is the wow; everything else supports them.
- **Answer:** ▮

**QI.2 — Rank the stretch features to cut first (1=keep, 4=cut first): compare-two-apartments ·
map view · bike/scooter commute · richer ad-text matching (rules, not AI).**
- *Recommendation:* keep **compare-two-apartments** (great demo — and `localStorage` save/compare
  is already in the MVP), then **richer ad-text matching**, then **bike commute**, cut **map view**
  first. — *why:* compare is high-payoff and cheap; a map is costly polish that doesn't change the
  verdict.
- **Answer:** ▮

**QI.3 — Is "compare two apartments" worth building for the demo, or post-hackathon?**
- *Recommendation:* **Stretch — only if Phases 1–3 are flawless first.** — *why:* the single-
  apartment flow must be perfect before we add a second column.
- **Answer:** ▮

---

## J. Success & demo feel

🎯 *Changes:* the demo script and the beat we rehearse.

**QJ.1 — The demo "wow" — the brutal score, or copying the negotiation script live?**
- *Recommendation:* **Copy the negotiation script live and "send" it** — the judges see a real,
  Hebrew, numbers-backed message appear ready to go. — *why:* a tangible, useful artifact beats a
  number on screen.
- **Answer:** ▮

**QJ.2 — One sentence: how should a judge feel after the demo?**
- *Recommendation:* "Every BGU student needs this before they sign a lease — and it just *wrote
  my negotiation for me*." — *why:* the real-utility + the wow in one breath.
- **Answer:** ▮

---

### Done? Confirm/edit above. Pair with `PRODUCT-VISION.md` and the other three `DISCOVERY.md`
files; answers flow into `DESIGN-SPEC.md`.
