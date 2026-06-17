# בית הסטודנט — Beit HaStudent

> A 100% client-side **apartment scorer & anti-scam helper** for BGU students renting in Be'er
> Sheva. Enter a listing's details — rent, rooms, neighborhood, floor, ארנונה + ועד בית, the
> deposit demanded, furnished?, distance to campus, contract red-flags — and get a **value score
> + risk score** with clear, plain-Hebrew red flags, benchmarked against rough local ranges. Then
> the signature move: **one tap copies a ready-to-send Hebrew WhatsApp message** to the landlord,
> citing your findings and proposing terms.

**Role in the suite:** the "surviving Be'er Sheva" piece — the app that makes the suite tagline
literally true (exams · lectures · **the rental market**). It's a signature-moment app, not the
hero: it nails **one flawless wow** — the **WhatsApp negotiation script** ("it wrote my message
*for* me") — and earns the relatable "רגע, מנסים לעבוד עלינו" laugh that makes it a strong
early-demo hook.

---

## At a glance

| | |
|---|---|
| **Audience** | BGU students apartment-hunting in **שכונה ג' / ד' · רינגלבלום · מצדה · העיר העתיקה** |
| **Language / direction** | Hebrew, **RTL**. Numbers, ₪ amounts, phone numbers & links stay LTR. |
| **Backend** | **None.** Static site, all logic in-browser; no real-estate API, ever. |
| **Scoring** | A local **rubric / heuristic** — static config + plain-JS pure functions. **No AI, no server.** |
| **Benchmarks** | Bundled static `benchmarks.json` — neighborhood → typical ₪/room **ranges**, clearly labeled a rough, editable local reference. |
| **WhatsApp script** | **Template-based string assembly** (no AI) → clipboard copy + `https://wa.me/?text=…` |
| **Persistence** | `localStorage` — **save & compare** multiple listings |
| **Core stack** | Vite + React · vanilla CSS (RTL) · plain-JS scoring engine · localStorage |
| **The output** | **Value score + Risk score** + a red-flags checklist + the negotiation script |
| **Deploy** | `vite build` → static files, cloned & hosted by the BGU hub sandbox |
| **Paywall** | **None.** The hub gates entry; "in the app = paid" — every user is a free premium user. |
| **Legal stance** | A **renter's due-diligence helper.** Scores the **listing & terms**, never named people. Guidance, not legal/financial advice. |

---

## The two scores (+ red flags)

The app never hides behind one mystery number. It reports two independent, plain-Hebrew scores
plus a checklist — all computed locally from your input joined against bundled benchmark data:

| Output | Hebrew | Asks | Driven by |
|---|---|---|---|
| **Value score** (0–100) | ציון ערך | *"Is this a fair deal for what you get?"* | effective monthly cost (rent + ארנונה + ועד בית) per room **vs the neighborhood range**, distance to campus, floor/heat & elevator, furnished |
| **Risk score** (low/med/high) | רמת סיכון | *"How likely is this a trap?"* | a **checklist** of contract / deposit / listing red-flags — never an accusation against a person |
| **Red flags** | דגלים אדומים | *"What should I ask about before I sign?"* | the matched checklist items, each worded as a question, with a "not legal advice" note |

> **Everything is shown — nothing is gated.** The hub owns access; once a student is in the app
> they see the full result, including the WhatsApp negotiation script. No blur, no upsell, no
> payment code anywhere.

---

> 🏆 **Built to win.** Held to the suite-wide **[QUALITY-BAR.md](../QUALITY-BAR.md)** —
> top-quality, demo-flawless, zero rough edges. This app's job is **one signature moment done
> perfectly**: the one-tap, findings-aware Hebrew WhatsApp negotiation script.

## Documents

Read in this order:

1. **[PRD.md](./PRD.md)** — what we're building and for whom: problem, ICP, user journey, the
   feature set (must/should/could/won't), the value + risk scoring model, the WhatsApp-script
   feature, judging fit, the paywall note, and the legal/ethical framing.
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — zero-backend client-side design: the scoring
   rubric/engine, the benchmark data schema, the red-flag rule set, the localStorage save/compare
   model, the template-based WhatsApp generator, stack choice, CSP/sandbox notes, project
   structure, RTL specifics.
3. **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** — the deep build spec: finalized stack, the four screens
   (input form → results/score → negotiation script → saved/compare), component inventory,
   responsive behavior, key flows, the scoring + benchmark data shapes, build breakdown, open
   items.
4. **[ROADMAP.md](./ROADMAP.md)** — hackathon execution: build order (data + engine first), demo
   script, testing strategy, risk register, definition of done.

---

## The one-sentence pitch

> "Be'er Sheva's student rental market runs on confusion — inflated rent, mystery ארנונה + ועד
> בית, sketchy deposit demands, shady clauses. Enter the listing, we score its **value** and its
> **risk** against what's normal *here*, flag the traps, and write the WhatsApp message to the
> landlord *for you*."

---

## Status

📄 **Design phase.** This repo currently contains design documents only — no code yet. Build
begins after doc review and approval (see ROADMAP.md).

## Open TODOs (tracked, non-blocking)
- Populate `benchmarks.json` with real rough ₪/room **ranges** per neighborhood across all five
  areas (docs ship a seed set + schema; numbers are a labeled, editable reference — *not* an
  authoritative price index).
- Finalize the red-flag rule list, severities, and weights with a couple of students who've
  actually rented here.
- Native-speaker pass on every WhatsApp template variant — must read as a real student wrote it.
- Confirm neighborhood names/aliases (שכונה ג' / גימל, שכונה ד' / דלת, רינגלבלום, מצדה, העיר
  העתיקה) and the campus-gate anchor used for walk-time.
