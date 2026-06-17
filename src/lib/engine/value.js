// ============================================================================
// Value rubric (ציון ערך · 0–100) — a transparent, additive, JSON-tunable
// scorer. NOT a model, NO AI. Every point gained or lost traces to a rule in
// scoring-config.json and emits a { factor, delta, note } breakdown entry so
// the UI can render "איפה ירד הערך" with full honesty.
//
//   value = baseValue
//         ± price vs neighborhood ₪/room RANGE   (dominant)
//         ± distance to campus (walk minutes)
//         ± floor / no-elevator (desert livability)
//         ± furnished
//
// True monthly cost = rent + ארנונה + ועד בית; per-room normalizes it against
// the neighborhood range.
// ============================================================================

import { num, range } from '../format.js';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const r = Math.round;

/** Where the per-room figure sits relative to the range. */
function positionOf(perRoom, bm) {
  if (perRoom < bm.min) return 'below';
  if (perRoom > bm.max) return 'above';
  return 'within';
}

function priceAdjust(perRoom, bm, cfg, hoodName) {
  const pos = positionOf(perRoom, bm);
  const rangeTxt = `₪${range(bm.min, bm.max)}`;
  if (pos === 'below') {
    const pctBelow = (bm.min - perRoom) / bm.min; // fraction
    const delta = clamp(
      r(cfg.belowMinBonus + pctBelow * 100 * cfg.belowGoodPerPct),
      0,
      cfg.maxBelowBonus
    );
    return { factor: 'price', delta, position: pos,
      note: `₪${num(perRoom)} לחדר — מתחת לטווח ב${hoodName} (${rangeTxt})` };
  }
  if (pos === 'above') {
    const pctAbove = (perRoom - bm.max) / bm.max;
    const delta = clamp(r(pctAbove * 100 * cfg.abovePerPct), cfg.maxPricePenalty, 0);
    return { factor: 'price', delta, position: pos,
      note: `₪${num(perRoom)} לחדר — מעל הטווח ב${hoodName} (${rangeTxt})` };
  }
  return { factor: 'price', delta: cfg.withinRange, position: pos,
    note: `₪${num(perRoom)} לחדר — בתוך הטווח המקובל ב${hoodName} (${rangeTxt})` };
}

function distanceAdjust(walkMinutes, cfg) {
  const w = Number(walkMinutes) || 0;
  if (w <= cfg.freeUntilMin) {
    return { factor: 'distance', delta: 0, note: `${num(w)} דק' הליכה — קרוב לקמפוס` };
  }
  const extra = w - cfg.freeUntilMin;
  const delta = clamp(r(extra * cfg.perMinAfter), cfg.maxPenalty, 0);
  return { factor: 'distance', delta, note: `${num(w)} דק' הליכה לקמפוס` };
}

function floorHeatAdjust(floor, hasElevator, cfg) {
  const f = Number(floor) || 0;
  let delta = 0;
  const parts = [`קומה ${num(f)}`];
  const above2 = Math.max(0, f - 2);
  if (above2 > 0) delta += above2 * cfg.perFloorAbove2;
  if (!hasElevator && f >= cfg.noElevatorFrom) {
    delta += cfg.noElevatorPenalty;
    parts.push('ללא מעלית');
  } else if (hasElevator) {
    parts.push('עם מעלית');
  }
  return { factor: 'floor', delta: r(delta), note: parts.join(' ') };
}

function furnishedAdjust(furnished, cfg) {
  const delta = cfg[furnished] ?? 0;
  const label = furnished === 'full' ? 'מרוהטת' : furnished === 'partial' ? 'מרוהטת חלקית' : 'לא מרוהטת';
  return { factor: 'furnished', delta, note: label };
}

function verdictFor(score, bands) {
  for (const b of bands) if (score <= b.max) return b;
  return bands[bands.length - 1];
}

/**
 * @param {object} input  the user's listing answers
 * @param {object} bm     the resolved neighborhood perRoom range { min, typical, max }
 * @param {string} hoodName  display name of the neighborhood
 * @param {object} config  scoring-config.json
 * @returns {{score, verdict, band, costMonthly, perRoom, benchmark, breakdown}}
 */
export function valueScore(input, bm, hoodName, config) {
  const rent = Number(input.rentILS) || 0;
  const arnona = Number(input.arnonaILS) || 0;
  const vaad = Number(input.vaadBayitILS) || 0;
  const rooms = Math.max(1, Number(input.rooms) || 1);

  const costMonthly = rent + arnona + vaad; // the TRUE monthly cost
  const perRoom = Math.round(costMonthly / rooms);

  const breakdown = [
    priceAdjust(perRoom, bm, config.price, hoodName),
    distanceAdjust(input.walkMinutes, config.distance),
    floorHeatAdjust(input.floor, input.hasElevator, config.floor),
    furnishedAdjust(input.furnished, config.furnished),
  ];

  const raw = config.baseValue + breakdown.reduce((s, b) => s + b.delta, 0);
  const score = clamp(Math.round(raw), 0, 100);
  const v = verdictFor(score, config.valueBands);

  const priceEntry = breakdown[0];
  return {
    score,
    verdict: v.verdict,
    band: v.band, // 'good' | 'mid' | 'bad'
    costMonthly,
    perRoom,
    benchmark: { ...bm, position: priceEntry.position },
    breakdown,
  };
}
