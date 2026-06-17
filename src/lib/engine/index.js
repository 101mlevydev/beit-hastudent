// ============================================================================
// scoreListing(input, refs) — the engine orchestrator.
// Composes the value rubric + the checklist risk model + the red-flags list
// into one flat ScoreResult. Pure & deterministic: no DOM, no network, no AI.
// The negotiation script (template assembly) is attached in step 06.
// ============================================================================

import { valueScore } from './value.js';
import { riskScore } from './risk.js';
// buildNegotiationScript is wired in step 06 (the signature feature).

/**
 * Resolve the neighborhood's per-room range. Unknown / "other" → city fallback,
 * and the result is flagged approximate.
 */
function resolveBenchmark(neighborhood, benchmarks) {
  const hood = benchmarks?.neighborhoods?.[neighborhood];
  if (hood) {
    return { bm: hood.perRoom, name: hood.name, walkMin: hood.walkMin, approximate: false };
  }
  const fb = benchmarks.fallback;
  return { bm: fb.perRoom, name: fb.name, walkMin: fb.walkMin, approximate: true };
}

/**
 * @param {object} input  the listing answers (ARCHITECTURE §3.1)
 * @param {{benchmarks:object, config:object, redFlagRules:object}} refs
 * @returns {object} ScoreResult
 */
export function scoreListing(input, refs) {
  const { benchmarks, config } = refs;
  const { bm, name, approximate } = resolveBenchmark(input.neighborhood, benchmarks);

  const value = valueScore(input, bm, name, config);

  const ctx = { perRoom: value.perRoom, benchmark: bm };
  const risk = riskScore(input, refs, ctx);

  const result = {
    value,
    risk,
    negotiationScript: '', // filled by the negotiation generator (step 06)
    meta: {
      dataDate: benchmarks.dataDate,
      approximate,
      hoodName: name,
    },
  };

  return result;
}
