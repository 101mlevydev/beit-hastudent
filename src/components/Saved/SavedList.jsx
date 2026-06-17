import { useApp } from '../../stores/appStore.jsx';
import Ltr from '../Ltr.jsx';
import { num } from '../../lib/format.js';
import { RISK, UI } from '../../lib/copy.js';

const BAND_MINI = { good: 'g', mid: 'm', bad: 'b' };
const LEVEL_RB = { low: 'low', med: 'med', high: 'high' };

function summary(input) {
  const parts = [`${num(input.rooms)} חד'`, `קומה ${num(input.floor)}`];
  if (input.walkMinutes !== '' && input.walkMinutes != null) parts.push(`${num(input.walkMinutes)} דק' הליכה`);
  return parts.join(' · ');
}

export default function SavedList() {
  const { saved, deleteListing, resetDraft, goto } = useApp();

  return (
    <div>
      <div className="appbar">
        <div className="mark" aria-hidden="true">🗂️</div>
        <div className="wm">
          {UI.myListings}
          <small><span className="ltr">{saved.length}</span> דירות שמורות</small>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="empty">
          <span className="e">🗂️</span>
          עוד לא שמרתם דירות.<br />בדקו דירה ולחצו "שמור דירה" כדי להשוות אחר כך.
        </div>
      ) : (
        <div className="stagger">
          {saved.map((s) => {
            const { value, risk } = s.result;
            const r = RISK[risk.level] || RISK.med;
            return (
              <div className="savecard" key={s.id}>
                <div className={`mini ${BAND_MINI[value.band]}`}>
                  <b>{value.score}</b>
                  <span>ערך</span>
                </div>
                <div className="sc-t">
                  <b>{s.result.meta.hoodName}</b>
                  <span>{summary(s.input)}</span>
                </div>
                <div className="sc-r">
                  <span className={`rb ${LEVEL_RB[risk.level]}`}>סיכון {r.label}</span>
                  <div className="cost"><Ltr>{num(value.costMonthly)}</Ltr> ₪</div>
                </div>
                <button type="button" className="del" aria-label="מחק דירה" onClick={() => deleteListing(s.id)}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="disclaimer" style={{ marginTop: 6 }}>
        <span className="e">💡</span>
        <div>במסך רחב יותר הדירות נפרשות זו לצד זו בטבלת השוואה.</div>
      </div>

      <div className="spacer" />
      {saved.length >= 2 && (
        <button type="button" className="btn primary" style={{ marginTop: 11 }} onClick={() => goto('compare')}>
          {UI.compare}
        </button>
      )}
      <button type="button" className="btn ghost" style={{ marginTop: 9 }} onClick={resetDraft}>
        {UI.newListing}
      </button>
    </div>
  );
}
