// ============================================================================
// Red-flags matcher — a GENERIC, declarative evaluator over red-flags.json.
// No rule logic lives in code: each rule's `trigger` object is data, and this
// matcher just checks it against the listing. A flag fires if ANY of its
// trigger conditions match (OR semantics — e.g. the checklist box OR the
// ad-text keyword). Output feeds both the risk score and the negotiation
// generator. Flags are worded as QUESTIONS TO ASK, never accusations.
// ============================================================================

function adMatches(adText, needles) {
  if (!adText || !Array.isArray(needles)) return false;
  const hay = String(adText);
  return needles.some((n) => hay.includes(n));
}

/**
 * Evaluate one declarative trigger object against the listing.
 * @param {object} trigger
 * @param {object} input  the listing answers (incl. checklist + adText)
 * @param {{perRoom:number, benchmark:object}} ctx  price context for priceBelowPct
 * @returns {boolean}
 */
function triggerFires(trigger, input, ctx) {
  if (!trigger) return false;

  if (trigger.depositMonthsGte != null) {
    const m = Number(input?.deposit?.months) || 0;
    if (m >= trigger.depositMonthsGte) return true;
  }
  if (trigger.depositTiming != null) {
    if (input?.deposit?.timing === trigger.depositTiming) return true;
  }
  if (trigger.checklist != null) {
    if (input?.checklist?.[trigger.checklist] === true) return true;
  }
  if (trigger.adAny != null) {
    if (adMatches(input?.adText, trigger.adAny)) return true;
  }
  if (trigger.priceBelowPct != null && ctx?.benchmark?.typical) {
    const threshold = ctx.benchmark.typical * (1 - trigger.priceBelowPct);
    if (ctx.perRoom > 0 && ctx.perRoom < threshold) return true;
  }
  return false;
}

/**
 * @param {object} input
 * @param {{redFlagRules:{items:Array}}} refs
 * @param {{perRoom:number, benchmark:object}} ctx
 * @returns {Array<{code,label,ask,severity}>}
 */
export function redFlags(input, refs, ctx) {
  const items = refs?.redFlagRules?.items || [];
  const out = [];
  for (const item of items) {
    if (triggerFires(item.trigger, input, ctx)) {
      out.push({ code: item.code, label: item.label, ask: item.ask, severity: item.severity });
    }
  }
  return out;
}
