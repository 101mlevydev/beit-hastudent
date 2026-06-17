# Step 11 — Responsive + motion polish (phone / tablet / laptop)

**Phase:** Polish · **Status:** done · **Depends on:** 09, 10

## Goal
Flawless across phone / tablet / laptop, with the desert report-card motion that earns the
"shipped" feel (QUALITY-BAR §2–3, §8; DESIGN-SPEC §4, §7).

## Do
- One responsive shell, fluid card grid; breakpoints ~ **phone < 640 · tablet 640–1024 · laptop
  > 1024**. Phone: single-column, the two scores above the fold, the negotiation CTA a thumb-scroll
  away. Laptop: Results widens to a two-column card grid; **compare** becomes a multi-column table.
- Motion: dial **sweep** (anticipation + ease), risk badge settle-in, cards stagger-in on scroll,
  the copy-button press + "הועתק ✓" pop. **Respect `prefers-reduced-motion`** everywhere.
- ≥44px tap targets; safe-area aware; ₪ / minutes / `wa.me` stay LTR islands; strong contrast.

## Files
- `src/styles/app.css` (media/container queries + motion), component tweaks

## Done-when
- [ ] No layout breakage or RTL mirroring bugs at phone / tablet / laptop widths; 60fps, no jank;
      reduced-motion disables sweeps/staggers.

## Verify
- Browser MCP at 390 / 820 / 1440 px; screenshot each; toggle reduced-motion. Commit
  `step 11: responsive + motion`.
