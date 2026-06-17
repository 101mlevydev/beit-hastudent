# Step 09 — Negotiation screen + hand-off (copy + wa.me)

**Phase:** UI · **Status:** todo · **Depends on:** 08

## Goal
Surface the signature feature as its own polished view — the wow beat. **Polish this hardest**
(DESIGN-SPEC §9: the "wow").

## Do
- `components/Negotiation/NegotiationCard.jsx` — renders the generated Hebrew script (from Step 06)
  in a readable message bubble.
- **Primary — clipboard:** `navigator.clipboard.writeText(script)` on a big **"📋 העתק"** button →
  satisfying press + **"הועתק ✓"** confirmation (accessible, keyboard-focusable).
- **Secondary — WhatsApp:** **"שלח בוואטסאפ"** → `https://wa.me/?text=${encodeURIComponent(script)}`;
  **degrades gracefully** if a sandboxed iframe blocks top-level navigation (copy always remains).
  No phone number required or stored.
- Reachable both straight from Results (the prominent CTA) and as its own focused view.

## Files
- `src/components/Negotiation/NegotiationCard.jsx`

## Done-when
- [ ] Tap "📋 העתק" → clipboard holds the exact Hebrew script + "הועתק ✓" shows; "שלח בוואטסאפ"
      opens `wa.me` with the message prefilled (or no-ops gracefully if blocked).
- [ ] ₪ amounts and the `wa.me` URL stay LTR islands; no console errors.

## Verify
- Browser MCP: copy in a sandboxed iframe, paste back, assert match; click the wa.me link.
  Commit `step 09: negotiation screen`.
