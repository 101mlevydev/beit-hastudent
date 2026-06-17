import { useState } from 'react';
import { UI } from '../../lib/copy.js';

const FACTOR_LABEL = {
  price: 'מחיר לחדר',
  distance: 'מרחק מהקמפוס',
  floor: 'קומה ומעלית',
  furnished: 'ריהוט',
};

// Expandable "איפה ירד הערך" — full per-factor transparency. Every delta traces
// to a rule; nothing is hidden.
export default function Breakdown({ breakdown }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="breakdown-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {UI.whereValueDropped} {open ? '▲ סגרו' : '❯ פתחו לפירוט מלא'}
      </button>
      {open && (
        <div className="card" style={{ marginTop: -4 }}>
          <ul className="breakdown-list">
            {breakdown.map((b) => {
              const sign = b.delta > 0 ? 'pos' : b.delta < 0 ? 'neg' : 'zero';
              const txt = b.delta > 0 ? `+${b.delta}` : `${b.delta}`;
              return (
                <li key={b.factor}>
                  <span className="bd-note">
                    <b>{FACTOR_LABEL[b.factor] || b.factor}:</b> {b.note}
                  </span>
                  <span className={`bd-delta ${sign}`}>{txt}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
