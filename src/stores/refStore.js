// ============================================================================
// Reference store (read-only). Loads the three static JSON files ONCE at init
// via same-origin fetch (no CORS, no connect-src issue). After this the app
// makes no network calls — fully offline. base:'./' keeps the paths sandbox-
// friendly, so we fetch relative to the document.
// ============================================================================

let cache = null;

export async function loadRefs() {
  if (cache) return cache;
  const base = import.meta.env.BASE_URL || './';
  const [benchmarks, config, redFlagRules] = await Promise.all([
    fetch(`${base}benchmarks.json`).then((r) => r.json()),
    fetch(`${base}scoring-config.json`).then((r) => r.json()),
    fetch(`${base}red-flags.json`).then((r) => r.json()),
  ]);
  cache = { benchmarks, config, redFlagRules };
  return cache;
}

/** The neighborhood picker options (the five areas + "אחר"). */
export function neighborhoodOptions(benchmarks) {
  if (!benchmarks) return [];
  const opts = Object.entries(benchmarks.neighborhoods).map(([key, v]) => ({
    key,
    name: v.name,
    emoji: '📍',
    walkMin: v.walkMin,
  }));
  opts.push({ key: 'other', name: 'אחר', emoji: '❓', walkMin: benchmarks.fallback.walkMin });
  return opts;
}

/** Walk-minutes prefill for a neighborhood (midpoint of its range). */
export function walkPrefill(benchmarks, key) {
  if (!benchmarks) return 12;
  const hood = benchmarks.neighborhoods[key] || benchmarks.fallback;
  const { min, max } = hood.walkMin;
  return Math.round((min + max) / 2);
}

/**
 * Match free text / a pasted address against a benchmark neighborhood.
 * Checks each neighborhood's display name + optional `aliases` (Hebrew variants,
 * street names). Returns the matching key, or 'other' (→ general estimator).
 */
export function resolveNeighborhoodFromText(benchmarks, text) {
  if (!benchmarks?.neighborhoods || !text) return 'other';
  const t = String(text);
  // longest names first so "שכונה ג'" beats a bare "ג'"
  const entries = Object.entries(benchmarks.neighborhoods)
    .map(([key, v]) => ({ key, names: [v.name, ...(v.aliases || [])].filter(Boolean) }))
    .sort((a, b) => Math.max(...b.names.map((n) => n.length)) - Math.max(...a.names.map((n) => n.length)));
  for (const { key, names } of entries) {
    if (names.some((n) => n && t.includes(n))) return key;
  }
  return 'other';
}
