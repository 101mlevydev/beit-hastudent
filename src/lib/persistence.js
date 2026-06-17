// ============================================================================
// localStorage persistence — save & compare listings + a mid-flow draft.
// Versioned; restore is gated on the version so a schema bump can't crash a
// returning user. Payloads are tiny → localStorage (not IndexedDB), which is
// reliably available in sandboxed iframes that allow scripts.
// ============================================================================

const VERSION = 1;
const KEY_SAVED = 'beit:saved:v1';
const KEY_DRAFT = 'beit:draft:v1';

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === VERSION) return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ version: VERSION, ...value }));
  } catch {
    /* storage full / blocked — fail silently, app still works in-memory */
  }
}

// ---- Saved listings ---------------------------------------------------------
export function loadSaved() {
  const data = readJSON(KEY_SAVED);
  return data?.list ?? [];
}

export function persistSaved(list) {
  writeJSON(KEY_SAVED, { list });
}

/** Append a listing (or update by id). Returns the new list. */
export function addSaved(list, entry) {
  const id = entry.id || `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const withId = { ...entry, id, savedAt: entry.savedAt || Date.now() };
  const idx = list.findIndex((x) => x.id === id);
  const next = idx >= 0 ? list.map((x) => (x.id === id ? withId : x)) : [...list, withId];
  persistSaved(next);
  return next;
}

export function removeSaved(list, id) {
  const next = list.filter((x) => x.id !== id);
  persistSaved(next);
  return next;
}

// ---- Draft (mid-flow + last result) ----------------------------------------
export function loadDraft() {
  const data = readJSON(KEY_DRAFT);
  if (!data) return null;
  return { input: data.input, screen: data.screen, result: data.result };
}

export function saveDraft(draft) {
  writeJSON(KEY_DRAFT, draft);
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY_DRAFT);
  } catch {
    /* ignore */
  }
}
