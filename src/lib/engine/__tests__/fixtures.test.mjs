// ============================================================================
// Headless engine fixtures — plain Node, no DOM, no bundler.
//   node src/lib/engine/__tests__/fixtures.test.mjs
// Loads the real public/*.json reference data and asserts the value score,
// risk level, red-flags, and the true-cost breakdown for four hand-picked
// scenarios. The numbers are eyeballed for fairness here; the Step 12 content
// gate re-balances scoring-config.json against these same fixtures.
// ============================================================================

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scoreListing } from '../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (f) => JSON.parse(readFileSync(resolve(__dirname, '../../../../public', f), 'utf8'));

const refs = {
  benchmarks: pub('benchmarks.json'),
  config: pub('scoring-config.json'),
  redFlagRules: pub('red-flags.json'),
};

let pass = 0;
let fail = 0;
function check(name, fn) {
  try {
    fn();
    pass++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    fail++;
    console.log(`  ✗ ${name}\n      ${e.message}`);
  }
}

const codes = (r) => r.risk.flags.map((f) => f.code).sort();

// ----------------------------------------------------------------------------
// Fixture A — the DEMO listing (שכונה ג'): fair-ish price slightly over range,
// floor 4 no elevator, sketchy terms. Should read amber value + HIGH risk.
// ----------------------------------------------------------------------------
const demo = {
  neighborhood: 'gimel',
  rentILS: 3400, arnonaILS: 250, vaadBayitILS: 120,
  rooms: 2, sizeSqm: 55, floor: 4, hasElevator: false,
  furnished: 'none', walkMinutes: 9,
  deposit: { months: 3, timing: 'before_signing' },
  checklist: { cashOnly: true, pressureToCloseToday: true },
  adText: '',
};

console.log("\nFixture A — demo listing (Gimel):");
const ra = scoreListing(demo, refs);
console.log(`    value=${ra.value.score} (${ra.value.band}) "${ra.value.verdict}"  risk=${ra.risk.level}(${ra.risk.score})  cost=${ra.value.costMonthly} perRoom=${ra.value.perRoom} pos=${ra.value.benchmark.position}  flags=[${codes(ra)}]`);
check('true monthly cost = rent+arnona+vaad', () => assert.equal(ra.value.costMonthly, 3770));
check('per-room = cost/rooms', () => assert.equal(ra.value.perRoom, 1885));
check('per-room is above the range', () => assert.equal(ra.value.benchmark.position, 'above'));
check('value lands in the amber band', () => assert.equal(ra.value.band, 'mid'));
check('risk is HIGH (deposit + cash + pressure)', () => assert.equal(ra.risk.level, 'high'));
check('flags include deposit_high, cash_only, pressure', () => {
  for (const c of ['deposit_high', 'cash_only', 'pressure']) assert.ok(codes(ra).includes(c), `missing ${c}`);
});

// ----------------------------------------------------------------------------
// Fixture B — a GREAT deal: cheap per-room, very close, low floor, furnished,
// clean terms. High value, LOW risk.
// ----------------------------------------------------------------------------
const great = {
  neighborhood: 'dalet',
  rentILS: 2400, arnonaILS: 150, vaadBayitILS: 0,
  rooms: 2, floor: 1, hasElevator: false,
  furnished: 'full', walkMinutes: 8,
  deposit: { months: 1, timing: 'on_signing' },
  checklist: {},
  adText: '',
};
console.log("\nFixture B — a great deal (Dalet):");
const rb = scoreListing(great, refs);
console.log(`    value=${rb.value.score} (${rb.value.band}) "${rb.value.verdict}"  risk=${rb.risk.level}(${rb.risk.score})  cost=${rb.value.costMonthly} perRoom=${rb.value.perRoom} pos=${rb.value.benchmark.position}  flags=[${codes(rb)}]`);
check('great deal → high value (good band)', () => assert.equal(rb.value.band, 'good'));
check('great deal → low risk', () => assert.equal(rb.risk.level, 'low'));
check('per-room below the range', () => assert.equal(rb.value.benchmark.position, 'below'));

// ----------------------------------------------------------------------------
// Fixture C — an OVER-MARKET flat: well above range, otherwise fine terms.
// Low-ish value, low risk (price is not a "scam" flag on its own).
// ----------------------------------------------------------------------------
const over = {
  neighborhood: 'masada',
  rentILS: 5200, arnonaILS: 300, vaadBayitILS: 200,
  rooms: 2, floor: 2, hasElevator: true,
  furnished: 'none', walkMinutes: 15,
  deposit: { months: 1, timing: 'on_signing' },
  checklist: {},
  adText: '',
};
console.log('\nFixture C — over-market flat (מצדה):');
const rc = scoreListing(over, refs);
console.log(`    value=${rc.value.score} (${rc.value.band}) "${rc.value.verdict}"  risk=${rc.risk.level}(${rc.risk.score})  cost=${rc.value.costMonthly} perRoom=${rc.value.perRoom} pos=${rc.value.benchmark.position}  flags=[${codes(rc)}]`);
check('over-market → per-room above range', () => assert.equal(rc.value.benchmark.position, 'above'));
check('over-market → value below the demo (price hurts)', () => assert.ok(rc.value.score < ra.value.score));
check('over-market with clean terms → low risk', () => assert.equal(rc.risk.level, 'low'));

// ----------------------------------------------------------------------------
// Fixture D — a top-floor, no-elevator OVEN with a deposit-before-viewing trap
// and ad-text scam signals. Floor drags value; risk is HIGH from terms+ad.
// ----------------------------------------------------------------------------
const trap = {
  neighborhood: 'ringelblum',
  rentILS: 2900, arnonaILS: 200, vaadBayitILS: 100,
  rooms: 2, floor: 6, hasElevator: false,
  furnished: 'none', walkMinutes: 22,
  deposit: { months: 3, timing: 'before_viewing' },
  checklist: { noContract: true },
  adText: 'דירה מהממת, מיידי, מזומן בלבד, יש המון מתעניינים',
};
console.log('\nFixture D — top-floor no-elevator + deposit-before-viewing trap (רינגלבלום):');
const rd = scoreListing(trap, refs);
console.log(`    value=${rd.value.score} (${rd.value.band}) "${rd.value.verdict}"  risk=${rd.risk.level}(${rd.risk.score})  cost=${rd.value.costMonthly} perRoom=${rd.value.perRoom} pos=${rd.value.benchmark.position}  flags=[${codes(rd)}]`);
check('floor penalty applied (floor entry negative)', () => {
  const floorEntry = rd.value.breakdown.find((b) => b.factor === 'floor');
  assert.ok(floorEntry.delta < 0, 'expected a negative floor delta');
});
check('risk is HIGH (early deposit + cash + no-contract + pressure)', () => assert.equal(rd.risk.level, 'high'));
check('ad-text scan fires cash_only + pressure', () => {
  assert.ok(codes(rd).includes('cash_only'));
  assert.ok(codes(rd).includes('pressure'));
});
check('deposit_early fires on before_viewing', () => assert.ok(codes(rd).includes('deposit_early')));
check('no_contract fires from checklist', () => assert.ok(codes(rd).includes('no_contract')));

// ----------------------------------------------------------------------------
// Fixture E — unknown neighborhood → city fallback + approximate flag.
// ----------------------------------------------------------------------------
console.log('\nFixture E — unknown area → fallback:');
const re = scoreListing({ ...great, neighborhood: 'other' }, refs);
console.log(`    approximate=${re.meta.approximate} hood="${re.meta.hoodName}"`);
check('unknown area resolves to fallback + approximate:true', () => {
  assert.equal(re.meta.approximate, true);
  assert.ok(re.meta.hoodName.includes('כללי'));
});

console.log(`\n${fail === 0 ? '✅' : '❌'} engine fixtures: ${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
