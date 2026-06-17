// ============================================================================
// Risk model (רמת סיכון · נמוך / בינוני / גבוה) — checklist-based, kept
// DELIBERATELY SEPARATE from value. A fairly-priced flat with a cash-only,
// deposit-before-viewing demand reads "good value, HIGH risk" — one blended
// number would hide that. Risk scores the TERMS and the LISTING, never a
// person.
// ============================================================================

import { redFlags } from './redFlags.js';

function levelFor(points, bands) {
  for (const b of bands) if (points <= b.max) return b.level;
  return bands[bands.length - 1].level;
}

/**
 * @param {object} input
 * @param {object} refs   { config, redFlagRules }
 * @param {{perRoom:number, benchmark:object}} ctx
 * @returns {{level:'low'|'med'|'high', score:number, flags:Array}}
 */
export function riskScore(input, refs, ctx) {
  const flags = redFlags(input, refs, ctx);
  const cfg = refs.config.redFlags;
  const weights = cfg.severityWeight;

  let points = flags.reduce((s, f) => s + (weights[f.severity] || 0), 0);
  points = Math.min(points, cfg.maxRiskPoints);

  const level = levelFor(points, refs.config.riskBands);
  return { level, score: points, flags };
}
