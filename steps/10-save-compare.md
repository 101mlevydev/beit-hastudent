# Step 10 — Save & compare (localStorage)

**Phase:** UI · **Status:** todo · **Depends on:** 08

## Goal
Persist and line up multiple listings — value, risk, true monthly cost, and commute side by side
(PRD §3.6, ARCHITECTURE §6). The compare view shines on a laptop / projector.

## Do
- `src/lib/persistence.js` — `localStorage["beit:saved:v1"] = [{ id, input, result, savedAt }, …]`
  (append / update-by-id / delete) + `localStorage["beit:draft:v1"]` for mid-flow + last-result
  resume. Versioned; gate restore on `version`.
- `components/Saved/SavedList.jsx` — saved cards (value · risk · true monthly cost) + delete.
- `components/Saved/CompareTable.jsx` — side-by-side columns: value, risk, ₪ true monthly, commute.
- Wire **"שמור דירה"** (Results) and **"בדוק דירה אחרת"** (reset draft).

## Files
- `src/lib/persistence.js`, `src/components/Saved/*`

## Done-when
- [ ] Score two listings, save both, compare side by side; refresh restores the draft + saved list;
      delete works.

## Verify
- Browser MCP: save two, refresh, compare, delete one. Commit `step 10: save & compare`.
