// ============================================================================
// App-flow store — one light React context (no Redux, no zustand). Holds the
// form `input`, the current screen + form step, the computed ScoreResult, and
// the saved-listings list. There is NO entitlement/`unlocked` flag — nothing
// is ever gated; the full result renders as soon as it exists.
// ============================================================================

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { loadRefs, walkPrefill } from './refStore.js';
import { scoreListing } from '../lib/engine/index.js';
import { parseAdText } from '../lib/engine/adParser.js';
import * as store from '../lib/persistence.js';

const AppCtx = createContext(null);

export const DEFAULT_INPUT = {
  neighborhood: null,
  rentILS: '',
  arnonaILS: '',
  vaadBayitILS: '',
  rooms: 2,
  sizeSqm: '',
  floor: 1,
  hasElevator: false,
  furnished: 'none',
  walkMinutes: '',
  deposit: { months: 1, timing: 'on_signing' },
  checklist: {},
  adText: '',
};

const FORM_STEPS = 5; // neighborhood/costs · property · terms · flags (grouped into 5 sections)

function reducer(state, action) {
  switch (action.type) {
    case 'field':
      return { ...state, input: { ...state.input, [action.key]: action.value } };
    case 'deposit':
      return { ...state, input: { ...state.input, deposit: { ...state.input.deposit, ...action.patch } } };
    case 'checklist':
      return {
        ...state,
        input: {
          ...state.input,
          checklist: { ...state.input.checklist, [action.key]: action.value },
        },
      };
    case 'prefill':
      return {
        ...state,
        input: { ...state.input, ...action.patch },
        extracted: action.extracted || [],
      };
    case 'step':
      return { ...state, step: Math.max(0, Math.min(FORM_STEPS - 1, action.step)) };
    case 'screen':
      return { ...state, screen: action.screen };
    case 'result':
      return { ...state, result: action.result, screen: 'results' };
    case 'saved':
      return { ...state, saved: action.list };
    case 'reset':
      return { ...state, input: { ...DEFAULT_INPUT }, step: 0, result: null, screen: 'form', extracted: [] };
    case 'restore':
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [refs, setRefs] = useState(null);
  const [refsError, setRefsError] = useState(null);

  const [state, dispatch] = useReducer(reducer, {
    input: { ...DEFAULT_INPUT },
    step: 0,
    screen: 'form',
    result: null,
    saved: [],
    extracted: [],
  });

  // Load reference data once, then restore any saved list + draft.
  useEffect(() => {
    let alive = true;
    loadRefs()
      .then((r) => {
        if (!alive) return;
        setRefs(r);
        const saved = store.loadSaved();
        const draft = store.loadDraft();
        const patch = {};
        if (saved.length) patch.saved = saved;
        if (draft?.input) {
          patch.input = { ...DEFAULT_INPUT, ...draft.input };
          if (draft.result) {
            patch.result = draft.result;
            patch.screen = draft.screen || 'results';
          }
        }
        if (Object.keys(patch).length) dispatch({ type: 'restore', patch });
      })
      .catch((e) => alive && setRefsError(e));
    return () => {
      alive = false;
    };
  }, []);

  const api = useMemo(() => {
    const setField = (key, value) => dispatch({ type: 'field', key, value });
    const setDeposit = (patch) => dispatch({ type: 'deposit', patch });
    const setChecklist = (key, value) => dispatch({ type: 'checklist', key, value });

    const setNeighborhood = (key) => {
      dispatch({ type: 'field', key: 'neighborhood', value: key });
      // prefill the walk-minutes from the neighborhood (still editable)
      if (refs?.benchmarks) {
        dispatch({ type: 'field', key: 'walkMinutes', value: walkPrefill(refs.benchmarks, key) });
      }
    };

    // Parse a pasted listing and auto-fill the form (all fields stay editable).
    const prefillFromAd = (text) => {
      const { input: patch, extracted } = parseAdText(text, refs?.benchmarks);
      patch.adText = text;
      if (patch.neighborhood && !patch.walkMinutes && refs?.benchmarks) {
        patch.walkMinutes = walkPrefill(refs.benchmarks, patch.neighborhood);
      }
      dispatch({ type: 'prefill', patch, extracted });
      return extracted.length;
    };

    const goStep = (step) => dispatch({ type: 'step', step });
    const goto = (screen) => {
      dispatch({ type: 'screen', screen });
      store.saveDraft({ input: state.input, screen, result: state.result });
    };

    const compute = () => {
      if (!refs) return;
      const result = scoreListing(state.input, refs);
      dispatch({ type: 'result', result });
      store.saveDraft({ input: state.input, screen: 'results', result });
      return result;
    };

    const saveListing = () => {
      if (!state.result) return;
      const next = store.addSaved(state.saved, { input: state.input, result: state.result });
      dispatch({ type: 'saved', list: next });
    };

    const deleteListing = (id) => {
      const next = store.removeSaved(state.saved, id);
      dispatch({ type: 'saved', list: next });
    };

    const resetDraft = () => {
      store.clearDraft();
      dispatch({ type: 'reset' });
    };

    return {
      setField, setDeposit, setChecklist, setNeighborhood, prefillFromAd,
      goStep, goto, compute, saveListing, deleteListing, resetDraft,
      FORM_STEPS,
    };
  }, [refs, state.input, state.result, state.saved]);

  const value = { ...state, ...api, refs, refsError, refsLoading: !refs && !refsError };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
