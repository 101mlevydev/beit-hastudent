// ============================================================================
// buildNegotiationScript(result, input, refs) -> string
//
// The SIGNATURE feature: a polite-but-firm, findings-aware Hebrew WhatsApp
// message, assembled from hand-written clause TEMPLATES + filled slots.
// 100% template string assembly — NO AI, NO model, NO network. Given the same
// ScoreResult it always produces the same text (pure & deterministic).
//
// The generator SELECTS clauses by the findings (over-market price, top-floor /
// no-elevator, hefty / early deposit, missing details) and FILLS the numbers
// (benchmark range, true monthly cost, a proposed counter-offer derived from
// the price-vs-benchmark math). Register: a real, savvy student — "לא נאיבי".
//
// ⚠️ CONTENT-GATE NOTE (Step 12): the Hebrew clause wording below is a careful
// first draft, NOT final — awaiting the native-speaker review so the message
// reads as a real student and is sendable as-is. Templates are centralized
// here on purpose so that review is a single edit.
// ============================================================================

import { num, range } from '../format.js';

const round50 = (n) => Math.round(n / 50) * 50;

/**
 * @param {object} result  the ScoreResult (value + risk + meta)
 * @param {object} input   the listing answers
 * @param {object} refs    reference data (unused today; kept for future clauses)
 * @returns {string} a ready-to-send Hebrew WhatsApp message
 */
export function buildNegotiationScript(result, input, refs) {
  const { value, risk } = result;
  const hood = result.meta?.hoodName || 'האזור';
  const bm = value.benchmark;
  const rooms = Math.max(1, Number(input.rooms) || 1);
  const arnona = Number(input.arnonaILS) || 0;
  const vaad = Number(input.vaadBayitILS) || 0;
  const flagCodes = new Set(risk.flags.map((f) => f.code));

  const paras = [];

  // --- Intro -----------------------------------------------------------------
  paras.push(`היי 🙂 ראיתי את המודעה לדירה ב${hood} ומאוד התעניינתי.`);

  // --- Price clause (only when above the local range) ------------------------
  let counterRent = null;
  if (bm.position === 'above') {
    // homework line: cite the local range + the TRUE per-room (incl. arnona+vaad)
    paras.push(
      `עשיתי קצת שיעורי בית — טווח השכירות המקובל ב${hood} הוא בערך ₪${range(bm.min, bm.max)} לחדר, ` +
      `וכאן עם הארנונה וועד הבית זה יוצא בערך ₪${num(value.perRoom)} לחדר — מעט מעל הטווח.`
    );
    // counter-offer: nudge the rent so the per-room lands at the top of the range
    const targetRent = round50(bm.max * rooms - arnona - vaad);
    if (targetRent > 0 && targetRent < (Number(input.rentILS) || 0)) {
      counterRent = targetRent;
    }
  } else if (bm.position === 'below') {
    // a fair / good price — don't haggle it; stay warm and move things forward
    paras.push(`המחיר נראה לי הוגן ביחס לאזור, אז מבחינתי זה נשמע מעניין מאוד.`);
  }

  // --- Floor / no-elevator clause -------------------------------------------
  const floorEntry = value.breakdown.find((b) => b.factor === 'floor');
  const noElevator = input.hasElevator === false && Number(input.floor) >= 3;
  if (noElevator) {
    paras.push(`שמתי לב שמדובר בקומה ${num(input.floor)} ללא מעלית, מה שקצת משפיע בשבילי.`);
  } else if (floorEntry && floorEntry.delta < 0) {
    paras.push(`הקומה הגבוהה קצת משפיעה בשבילי בשיקול.`);
  }

  // --- The ask (counter-offer) ----------------------------------------------
  if (counterRent) {
    paras.push(`אשמח אם נוכל לדבר על שכר דירה של ₪${num(counterRent)} לחודש — נראה לי הוגן לשני הצדדים.`);
  }

  // --- Terms / red-flag clauses (worded as polite requests, never accusations) -
  if (flagCodes.has('deposit_high') || flagCodes.has('deposit_early')) {
    paras.push(`ולגבי הפיקדון — אשמח לעגן בחוזה את גובהו ואת מועד ההחזר המלא בסוף השכירות.`);
  }
  if (flagCodes.has('no_contract')) {
    paras.push(`חשוב לי שנעבוד עם חוזה שכירות כתוב וחתום — זה מסדר את הציפיות לשנינו.`);
  }
  if (flagCodes.has('cash_only')) {
    paras.push(`לגבי התשלומים, אני מעדיף/ה העברה בנקאית עם קבלה — ככה לשנינו יש תיעוד מסודר.`);
  }

  // --- Outro -----------------------------------------------------------------
  paras.push(`תודה רבה, ואשמח לתאם צפייה! 🙂`);

  return paras.join('\n\n');
}
