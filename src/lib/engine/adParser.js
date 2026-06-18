// ============================================================================
// Heuristic parser for a pasted Hebrew apartment listing (Yad2 / Facebook / etc).
// Extracts what it can — rent, rooms, floor, size, furnished, elevator,
// neighborhood — into a partial form-input. 100% client-side, no AI, no network.
// Everything it returns is editable + marked as auto-filled in the UI, so an
// imperfect extraction never breaks the score.
// ============================================================================

import { resolveNeighborhoodFromText } from '../../stores/refStore.js';

const toNum = (s) => Number(String(s).replace(/[,\s₪]/g, ''));

/**
 * @returns {{ input: Partial<input>, extracted: string[] }}
 *   `extracted` lists which field keys were found (for the "הוחלץ מהמודעה" badge).
 */
export function parseAdText(text, benchmarks) {
  const t = String(text || '');
  const input = {};
  const extracted = [];
  const mark = (key, value) => {
    if (value !== null && value !== undefined && value !== '' && !Number.isNaN(value)) {
      input[key] = value;
      extracted.push(key);
    }
  };

  // rooms — "3 חדרים", "דירת 2.5 חד'", "חדר וחצי"
  let rooms = null;
  let m = t.match(/(\d+(?:\.5)?)\s*(?:חד(?:רים|'|״)?|rooms?)\b/);
  if (m) rooms = parseFloat(m[1]);
  else if (/חדר\s*וחצי/.test(t)) rooms = 1.5;
  mark('rooms', rooms);

  // size — "55 מ"ר", "60 מטר"
  m = t.match(/(\d{2,3})\s*(?:מ(?:["׳״'])?ר|מטר(?:ים)?)/);
  mark('sizeSqm', m ? toNum(m[1]) : null);

  // floor — "קומה 3", "קומה קרקע", "ק' 2"
  m = t.match(/קומה\s*(קרקע|\d{1,2})/) || t.match(/ק['׳]\s*(\d{1,2})/);
  if (m) mark('floor', /קרקע/.test(m[1]) ? 0 : parseInt(m[1], 10));

  // furnished
  if (/(לא|ללא|בלי)\s*(מרוהט|ריהוט)/.test(t)) mark('furnished', 'none');
  else if (/(מרוהט\w*\s*חלקית|ריהוט\s*חלקי|חלקית\s*מרוהט)/.test(t)) mark('furnished', 'partial');
  else if (/מרוהט/.test(t)) mark('furnished', 'full');

  // elevator
  if (/(אין|ללא|בלי)\s*מעלית/.test(t)) mark('hasElevator', false);
  else if (/מעלית/.test(t)) mark('hasElevator', true);

  // arnona / vaad bayit (only when explicitly named)
  m = t.match(/ארנונה[^\d]{0,14}(\d{2,4})/); if (m) mark('arnonaILS', toNum(m[1]));
  m = t.match(/ועד\s*(?:בית)?[^\d]{0,14}(\d{2,4})/); if (m) mark('vaadBayitILS', toNum(m[1]));

  // rent — the trickiest; score numeric candidates by surrounding context
  mark('rentILS', extractRent(t, input.sizeSqm, input.arnonaILS, input.vaadBayitILS));

  // neighborhood (name/alias match → benchmark key, else 'other')
  const hood = resolveNeighborhoodFromText(benchmarks, t);
  if (hood && hood !== 'other') mark('neighborhood', hood);

  return { input, extracted };
}

function extractRent(t, size, arnona, vaad) {
  const re = /(\d{1,2}[,.]?\d{3}|\d{4,5})/g; // 3,500 · 3500 · 12000
  const cands = [];
  let m;
  while ((m = re.exec(t))) {
    const val = toNum(m[1]);
    if (val < 1200 || val > 20000) continue;
    const ctx = t.slice(Math.max(0, m.index - 16), m.index + m[0].length + 12);
    let score = 0;
    if (/(שכ(?:["׳״'])?ד|שכירות|שכר\s*דירה|מחיר|דמי)/.test(ctx)) score += 5;
    if (/(₪|ש(?:["׳״'])?ח|שקל|לחודש|בחודש|לחו['׳])/.test(ctx)) score += 3;
    if (/(מ(?:["׳״'])?ר|מטר)/.test(ctx)) score -= 7; // it's a size
    if (/חד(?:רים|'|״)?/.test(ctx)) score -= 7; // it's rooms
    if (/(פיקדון|בטחונות|דמי\s*כניסה|טלפון|נייד|05\d)/.test(ctx)) score -= 8;
    if (val === size || val === arnona || val === vaad) score -= 8;
    cands.push({ val, score });
  }
  if (!cands.length) return null;
  cands.sort((a, b) => b.score - a.score || b.val - a.val);
  const best = cands[0];
  // accept if there's a positive signal, or it's a plausible standalone monthly rent
  return best.score >= 1 || best.val >= 1800 ? best.val : null;
}
