# Step 04 — Static data (benchmarks · scoring-config · red-flags)

**Phase:** Content · **Status:** todo · **Depends on:** 02

## Goal
Populate the three static JSON catalogs — the reference "database" + the tunable feel — with
**editable ranges**, not false precision (ARCHITECTURE §4, PRD §8). Seed values are reviewed at
the Step 12 content gate.

## Do
- `public/benchmarks.json` — for each of the five areas (**שכונה ג' · שכונה ד' · רינגלבלום · מצדה ·
  העיר העתיקה**): a typical **₪/room range** `{min, typical, max}`, a walk-time range
  `{min, max}`, `sun`/`notes`; plus a broad **city-student fallback** range. Surface `version`,
  `dataDate`, and a `disclaimer` ("טווחים מקומיים משוערים לעיון בלבד — לא מדד רשמי. ניתן לעריכה.").
- `public/scoring-config.json` — `baseValue`; value adjusts (price / distance / floor / furnished);
  `valueBands` (≤40 "עדיף לוותר." · 41–70 "סביר — אפשר לנסות לשפר." · 71+ "עסקה טובה."); red-flag
  `severityWeight` + `maxRiskPoints`; `riskBands` (low/med/high). Every number that shapes the
  "feel" lives here.
- `public/red-flags.json` — **declarative** checklist triggers (deposit size & timing, cash-only,
  no contract, no receipts, refuses viewing, pressure-to-close, too-good-to-be-true) + Hebrew
  ad-text patterns, each with a `severity` and a **"question to ask"** phrasing (never an
  accusation).

## Files
- `public/benchmarks.json`, `public/scoring-config.json`, `public/red-flags.json`

## Done-when
- [ ] All three parse as valid JSON; the five areas + fallback present; an unknown area resolves to
      the fallback; bands/weights match ARCHITECTURE §4.2; ranges (not point values) throughout.

## Verify
- Lint/parse the JSON; spot-check the five areas + fallback. Commit `step 04: static data`.
