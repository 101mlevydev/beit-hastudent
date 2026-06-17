# PRD — בית הסטודנט (Beit HaStudent · The BGU Apartment Scorer & Anti-Scam Helper)

**Document owner:** Product
**Status:** Draft for review
**Phase:** Pre-build (planning)
**Suite:** Fourth app in the BGU student-life suite (alongside `daf-nuschaot`, `bgu-gold-miner`,
`under-the-desk`). Standalone repo, light shared umbrella.

---

## 1. Problem & opportunity

Every September, thousands of BGU students arrive in Be'er Sheva and hunt for an apartment in the
same handful of areas — **שכונה ג' (Gimel), שכונה ד' (Dalet), רינגלבלום (Ringelblum), מצדה
(Masada), and העיר העתיקה (the Old City)** — with almost no information. They don't know that
this street is a 25-minute walk to campus while that one is 8 minutes. They don't know that a
listed rent of ₪3,400 is fine for a 4-room flat but a rip-off for a 2-room one. They don't know
that **ארנונה and ועד בית** can quietly add hundreds of shekels a month on top of "the rent."
They don't know that a demand for a **three-month deposit in cash, before viewing** is a flashing
red flag. The landlord knows all of this. The student knows none of it.

**The core problem is information asymmetry.** The seller has hyper-local knowledge accumulated
over years; the buyer is a stressed 20-year-old who moved to the Negev three weeks ago. Price,
total monthly cost, commute, summer heat, deposit norms, and contract terms are all *legible to
locals and opaque to newcomers*. That gap is where students overpay, get burned on a deposit, and
sign a year-long lease they regret.

**בית הסטודנט closes the gap.** It's a 100% client-side web app: the student enters a listing's
details, and we run them through a **local, hyper-local rubric** built from bundled reference
data. Out come **two honest scores** — a **value score** ("is this a fair deal for what you
get?") and a **risk score** ("how likely is this a trap?") — a clear **red-flags checklist**
benchmarked against typical local ranges, and the payoff: a ready-to-send **WhatsApp negotiation
script** that turns the findings into polite, specific leverage.

### Why this wins the hackathon
- **Authentic, sharp pain.** Every BGU judge has rented in Gimel/Dalet/Ringelblum/Masada/the Old
  City, or watched a friend get burned. Zero explanation needed.
- **A confident, helpful personality.** The app reads like the savvy older sibling who's rented
  here before — direct about a bad deal, never cruel. Memorable and quotable.
- **Real, scoped engineering.** A transparent multi-factor rubric over curated static data, a
  checklist-based risk model, and a template-driven negotiation message — substantive yet
  shippable, with **no AI and no backend**.
- **The negotiation script is the wow.** The scores inform; the script *arms*. "Wait — it wrote
  my WhatsApp message to the landlord, with the neighborhood's typical rent baked in?" is the
  moment a judge remembers.

---

## 2. Ideal Customer Profile (ICP)

**Primary:** A BGU undergraduate, 19–25, apartment-hunting for the coming academic year in the
dense student-housing belt around campus — **שכונה ג', שכונה ד', רינגלבלום, מצדה, or העיר
העתיקה**. Phone-first, Hebrew-native, time-pressured, budget-constrained, and (critically) **new
to Be'er Sheva** with no local intuition for streets, prices, deposit norms, or summer heat.
They're scrolling Yad2 / Facebook groups / WhatsApp listings at 1 AM and need a gut-check *now*.

**Jobs to be done**
- "Is this apartment actually a good deal, or am I about to get played?"
- "What will this *really* cost me per month — rent **plus** ארנונה **plus** ועד בית?"
- "How far is this *really* from campus — not in km, in minutes I'll walk every morning?"
- "Is this deposit demand / this contract clause normal, or a warning sign?"
- "Help me push back on the price without sounding clueless."

**Secondary:** roommates vetting a place together; parents helping from afar; second-year
students re-renting who want to confirm they're not overpaying again.

**Anti-persona:** families renting long-term outside the student belt; anyone outside Be'er Sheva
(the reference data is hyper-local by design); students wanting a full real-estate marketplace
(we score listings, we don't host them).

---

## 3. User journey (happy path)

1. **Land.** Hebrew RTL home screen with a confident one-liner. One primary action: **"בדוק את
   הדירה"** (Check the apartment). If a previously-saved listing exists, a quiet "המשך מהדירה
   הקודמת" / "ההשוואות שלי" entry point too.
2. **Input the listing.** A friendly, guided form (one section at a time, progress shown):
   **neighborhood** (the five areas) · **monthly rent** (₪) · **rooms / size** · **floor**
   (+ elevator?) · **ארנונה** (₪/mo) · **ועד בית** (₪/mo) · **deposit demanded** (months / ₪,
   and *when* — before viewing?) · **furnished?** (כן / חלקי / לא) · **distance to campus** (walk
   minutes — prefilled from the neighborhood, editable) · and a quick **contract / listing
   red-flags** step (a checklist of common clauses + an optional paste of the ad text). Feels
   like under a minute, not a tax form.
3. **Score (a short, intentional beat).** All math is local and instant; a brief "מחשבים…" pause
   sells the verdict. No network, ever.
4. **Results.** Two scores land side by side — the **value score** (0–100, color-coded, with a
   verdict line like *"מחיר סביר, אבל הקומה והמרחק מורידים."*) and the **risk level**
   (נמוך / בינוני / גבוה). Below: the **cost breakdown** (true monthly = rent + ארנונה + ועד
   בית), the **per-room benchmark** (where you sit in the neighborhood range), the **red-flags
   checklist**, and a "where did the value points go?" expandable breakdown. All present, all
   readable — no gates, no blur, no upsell.
5. **The negotiation script (the signature moment).** The scores inform; the script *arms*. A
   ready-to-send, Hebrew, polite-but-firm message that cites *the app's own findings* ("ראיתי
   שטווח השכירות המקובל ב[שכונה] הוא בערך ₪X–Y לחדר, והדירה בקומה 4 ללא מעלית…") and proposes a
   specific number. **One tap to copy** (or open WhatsApp via `wa.me`) → send. We didn't just
   judge the listing; we **armed the student**.
6. **Save & compare.** "שמור דירה" stores the listing + result in `localStorage`. The student can
   score a second and third listing and open a **side-by-side compare** — value, risk, true
   monthly cost, and commute, lined up.

**Recovery paths:** "בדוק דירה אחרת" resets the form; saved listings persist across refreshes;
an unknown / un-benchmarked area falls back to a broad city-student range with an explicit
"נתונים משוערים" note.

---

## 4. The scoring model (overview)

The app produces **two independent scores plus a red-flags checklist.** Both scores and the
checklist are computed by a transparent, tunable **rubric** — pure functions over the user's
input joined with the bundled `benchmarks.json` and `red-flags.json`. **No AI, no model, no
server**: every number is explainable and every weight lives in one editable config (see
ARCHITECTURE §3–4).

### 4.1 Value score (ציון ערך · 0–100) — "is this a fair deal?"
Starts from a neutral baseline and is adjusted by:

- **Price vs benchmark (dominant factor).** Compute the **true monthly cost** = rent + ארנונה +
  ועד בית, normalize **per room**, and place it in the neighborhood's typical ₪/room **range**
  (`benchmarks.json`). Comfortably below range → strong value; within range → fair; above →
  value drops, steeply past the top of the range.
- **Distance to campus.** Walk-minutes; closer is better. ≤10 min prime, rising penalty past
  ~18–25 min ("you'll Bolt this every winter morning").
- **Floor / heat & elevator.** Be'er Sheva is a desert; **top floor ("דירת גג")** and **floor ≥ 3
  with no elevator** cost livability points. (We surface this as livability, not a guaranteed ₪
  figure — see Risks.)
- **Furnished.** Furnished / partly furnished adds value (saves a real setup cost); unfurnished
  is neutral.

Output: a 0–100 value score, a one-line verdict, and an expandable **breakdown** ("איפה ירד
הערך") so the number is never a black box.

### 4.2 Risk score (רמת סיכון · נמוך / בינוני / גבוה) — "how likely is this a trap?"
A **checklist-based** model, deliberately kept separate from value so a fairly-priced flat with
sketchy terms still reads as risky. Risk rises with matched red-flags (§4.3); severity-weighted
into three plain bands. Critically, risk scores the **terms and the listing**, never a person.

### 4.3 Red flags (דגלים אדומים) — the checklist
Two sources feed the checklist:

- **Structured checklist** the user answers directly — e.g. **deposit > ~1–2 months**, **deposit
  / "דמי רצינות" demanded before viewing or signing**, **cash-only**, **no written contract**,
  **no receipts/invoice**, **refuses an in-person viewing**, **pressure to "close today"**,
  **price far below the local range** (too-good-to-be-true).
- **Optional ad-text scan** — a simple keyword/heuristic pass over pasted listing text for the
  same patterns ("מזומן בלבד", "מיידי", "יש המון מתעניינים", "ללא חוזה").

Each matched flag becomes a checklist entry **worded as a question to ask** ("מבוקש פיקדון של 3
חודשים — בקש/י לעגן את תנאי ההחזר בחוזה"), with a severity tag and a standing **"מדריך זהירות,
לא ייעוץ משפטי"** disclaimer. We never assert that a specific listing *is* a scam — we flag
patterns worth asking about. (See §10 Risks — legal framing.)

> **Both scores and every red flag are free and shown in full.** The hub gates entry; once a
> student is *in the app, they're in.* No freemium tier, no blur, no upsell (see §6).

---

## 5. The signature feature — the WhatsApp negotiation script

With nothing gated, the climax of the experience is the **WhatsApp negotiation script**, and it
must *over-deliver* to earn the "wow". It is **100% template-based string assembly — no AI, no
server.**

- **Template, not generation.** A small set of hand-written Hebrew templates with slots. The
  generator selects clauses based on the findings (over-market rent? top floor? hefty deposit?
  missing details?) and fills the numbers (the neighborhood's typical range, the true monthly
  cost, a proposed counter-offer derived from the price-vs-benchmark math).
- **The right register.** Polite but firm — *"לא נאיבי"*. It reads like a real, savvy student
  wrote it; it is **sendable as-is**, no editing required.
- **Findings-aware.** It cites the app's own outputs: the benchmark range, the cost breakdown,
  the specific red-flags it chose to raise diplomatically.
- **One tap.** Primary action: **copy to clipboard** ("הועתק ✓"). Secondary: open WhatsApp via
  `https://wa.me/?text=…` (degrades gracefully if a sandboxed iframe blocks navigation — see
  ARCHITECTURE §9).

The emotional arc: *anxiety → clarity → empowerment.* The student walks away not just informed
but **armed**. That's the moment a judge remembers and the reason the app is worth opening.

---

## 6. Access model — everyone is premium, we handle no payments

This app ships **no paywall, no gating, and no payment logic of any kind.** It follows the same
posture as the rest of the BGU suite:

- **The hub owns the gate.** The BGU hub wraps the app and is the single point where access (and
  any payment) is decided. By the time a student reaches us, *they're already in.*
- **"In the app = already paid."** We assume access implies entitlement. There is no "is paid"
  flag, no locked features, no blur, no paywall hook — none of it exists in our code.
- **Every user is a free premium user.** The full result — both scores, the cost breakdown, the
  benchmark, the red flags, and the WhatsApp negotiation script — is always computed and always
  shown.

**For the pitch only** (we code none of it): the *conceptual* "pay at peak intent" gate the hub
would own is the **high-value insights** — the true-cost breakdown, the red-flags checklist, and
the negotiation script. We name it to show the monetization thinking; we never implement it.

---

## 7. Feature set

### Must-have (MVP — demo-critical)
- Guided listing-input form: neighborhood · rent · rooms/size · floor (+elevator) · ארנונה · ועד
  בית · deposit (amount + timing) · furnished · distance-to-campus · contract/listing red-flag
  checklist (+ optional ad-text paste).
- The **value-score + risk-score + red-flags** rubric engine over `benchmarks.json` /
  `red-flags.json`, fully tunable via one config.
- Results screen: both scores + verdict lines + **true monthly cost** (rent + ארנונה + ועד בית) +
  **per-room benchmark position** + red-flags checklist — all shown, nothing gated.
- The **WhatsApp negotiation script** (template-based) with one-tap copy + `wa.me` fallback.
- `localStorage` **save & compare** multiple listings; Hebrew RTL throughout; mobile-first layout.

### Should-have
- Graceful unknown/low-data area fallback (broad city-student range + "approximate" note).
- Value-score **breakdown** ("איפה ירד הערך?") expandable per factor.
- Summer-AC livability hint for top-floor / no-elevator flats (qualitative, not a hard ₪ claim).
- Shareable result image / summary.

### Could-have (stretch / post-hackathon)
- Map view of scored areas; per-area night-safety / noise notes.
- Bike/scooter commute alongside walk time.
- Richer ad-text NLP (beyond keyword heuristics).
- More neighborhoods / finer street-level benchmarks.

### Won't-have (explicitly out of scope)
- Any backend, database, real-estate API, or live price scraping.
- **Any AI / LLM call** — the script is template assembly; scoring is a static rubric.
- **Any payment, paywall, gating, blur, or entitlement logic** (the hub owns access; see §6).
- Hosting listings / a marketplace — we score, we don't list.
- Legally binding advice (red flags are heuristic guidance only; see §10).

---

## 8. Content plan — the benchmark data

The rubric is only as credible as its data. We ship curated static JSON (see ARCHITECTURE §4):

- **`benchmarks.json`** — for each of the five areas: a **typical ₪/room range** (min · typical ·
  max), a typical walk-time-to-campus range, and notes (sun exposure / floor stock where known);
  plus a broad city-student fallback range. Explicitly labeled **rough local reference, editable,
  not an authoritative index**, with a surfaced `dataDate` / `version`.
- **`red-flags.json`** — the checklist items and the Hebrew keyword/pattern dictionary, each with
  a severity and a "question to ask" phrasing.
- **`scoring-config.json`** — every weight, threshold, and band for both scores, so balancing the
  "feel" is a data edit, not a code change.

Seed data is **plausible, hand-curated local knowledge** for the demo, explicitly marked as a
seed set that's trivially expandable by editing JSON. Full data authoring is a tracked,
non-blocking TODO (see ROADMAP).

---

## 9. Success & judging criteria

| Judging dimension | How this app scores |
|---|---|
| **Real-world value** | Directly attacks a painful, universal BGU experience — high. |
| **Polish / UX** | Friendly guided intake + dual-score reveal + a usable result; strong RTL mobile feel. |
| **Technical depth** | A transparent multi-factor rubric + checklist risk model + template negotiation generator, all client-side, no AI/backend. |
| **Demo wow** | The full reveal culminating in "it wrote my WhatsApp message." |
| **Feasibility** | No network/backend → near-zero live-demo risk; works offline. |

**Internal success metric for the demo:** a judge enters a real-feeling listing and reaches the
negotiation script — and *laughs / nods* at how usable it is — in **under 60 seconds**.

---

## 10. Risks (product) — including the legal framing

- **Legal / defamation risk (the big one).** Risk and red flags must never read as an accusation
  against a named landlord, building, or listing author. *Mitigation:* we frame everything as a
  **renter's due-diligence checklist** — patterns and questions to ask, scored against the
  **terms**, never against a person. The risk score is explicitly **checklist-based**, not a
  verdict on anyone. Every red-flags surface carries a standing **"מדריך זהירות — אינו ייעוץ
  משפטי או פיננסי"** disclaimer. We never store or display a landlord's name/phone as part of any
  "risk" claim. This framing is binding, not optional.
- **Data credibility.** Wrong ranges / walk-times undercut the whole pitch. *Mitigation:* curate
  the seed areas carefully; show price as **ranges** (not false precision); surface `dataDate`;
  fall back gracefully and label approximations.
- **Tone alienates.** *Mitigation:* confident-but-helpful, never mean about the *student*; the
  directness targets the listing/terms, the empathy targets the user.
- **Thin payoff without a paywall reveal.** With nothing gated, the negotiation script carries
  the "wow." *Mitigation:* invest in making it genuinely sendable and findings-aware (§5).
- **Over-claiming the AC cost.** Promising an exact ₪ summer bill is a credibility trap.
  *Mitigation:* keep heat/floor a **qualitative livability** factor (and a range if shown), not a
  guaranteed number.
