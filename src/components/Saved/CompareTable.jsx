import { useApp } from '../../stores/appStore.jsx';
import Ltr from '../Ltr.jsx';
import { num } from '../../lib/format.js';
import { RISK, DISCLAIMER } from '../../lib/copy.js';

const BAND_COLOR = { good: 'var(--good)', mid: 'var(--mid)', bad: 'var(--bad)' };
const LEVEL_RB = { low: 'low', med: 'med', high: 'high' };

function summary(input) {
  const parts = [`${num(input.rooms)} חד'`, `קומה ${num(input.floor)}`];
  if (input.hasElevator === false) parts.push('ללא מעלית');
  return parts.join(' · ');
}

// Side-by-side comparison — value, risk, true monthly cost, commute, per-room.
// The best (highest value score) row is highlighted.
export default function CompareTable() {
  const { saved, goto } = useApp();
  if (saved.length === 0) return null;

  const bestId = saved.reduce((best, s) => (s.result.value.score > best.result.value.score ? s : best), saved[0]).id;

  return (
    <div>
      <div className="appbar">
        <div className="mark" aria-hidden="true">⚖️</div>
        <div className="wm">
          השוואת דירות
          <small>ערך · סיכון · עלות אמיתית · מרחק</small>
        </div>
      </div>

      <button type="button" className="btn ghost" style={{ width: 'auto', marginBottom: 12 }} onClick={() => goto('saved')}>
        ‹ חזרה לרשימה
      </button>

      <div className="cmp-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>דירה</th>
              <th>ציון ערך</th>
              <th>רמת סיכון</th>
              <th>עלות / חודש</th>
              <th>מרחק</th>
              <th>מחיר לחדר</th>
            </tr>
          </thead>
          <tbody>
            {saved.map((s) => {
              const { value, risk } = s.result;
              const r = RISK[risk.level] || RISK.med;
              const isBest = s.id === bestId;
              return (
                <tr key={s.id} className={isBest ? 'best' : ''}>
                  <td className="cmp-hood">
                    {s.result.meta.hoodName}
                    {isBest && <span className="tag-best">★ הכי משתלמת</span>}
                    <span>{summary(s.input)}</span>
                  </td>
                  <td><span className="cmp-score" style={{ color: BAND_COLOR[value.band] }}>{value.score}</span></td>
                  <td><span className={`rbsm rb ${LEVEL_RB[risk.level]}`}>{r.label}</span></td>
                  <td className="cmp-cost"><Ltr>{num(value.costMonthly)}</Ltr> ₪</td>
                  <td><Ltr>{num(s.input.walkMinutes || 0)}</Ltr> דק'</td>
                  <td className="cmp-cost"><Ltr>{num(value.perRoom)}</Ltr> ₪</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="disclaimer" style={{ marginTop: 12 }}>
        <span className="e">⚖️</span>
        <div>{DISCLAIMER.ranges}</div>
      </div>
    </div>
  );
}
