import { useMemo, useState } from 'react';
import { useApp } from '../../stores/appStore.jsx';
import { neighborhoodOptions, resolveNeighborhoodFromText } from '../../stores/refStore.js';
import AdPasteBox from './AdPasteBox.jsx';

export default function StepNeighborhood() {
  const { refs, input, setNeighborhood, extracted } = useApp();
  const all = neighborhoodOptions(refs?.benchmarks); // includes 'other'
  const hoods = all.filter((o) => o.key !== 'other');
  const bm = refs?.benchmarks?.neighborhoods || {};
  const [q, setQ] = useState('');

  const fromAd = extracted?.includes('neighborhood');

  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return hoods;
    return hoods.filter((o) => {
      const names = [o.name, ...((bm[o.key]?.aliases) || [])];
      return names.some((n) => n && n.includes(t));
    });
  }, [q, hoods, bm]);

  const selectedName =
    input.neighborhood && input.neighborhood !== 'other'
      ? all.find((o) => o.key === input.neighborhood)?.name
      : input.neighborhood === 'other'
      ? 'אחר (טווח כללי)'
      : null;

  const useTyped = () => {
    if (!q.trim()) return;
    setNeighborhood(resolveNeighborhoodFromText(refs?.benchmarks, q)); // key or 'other'
  };

  return (
    <div>
      <AdPasteBox />

      <div className="step-h">איפה הדירה?</div>
      <div className="step-s">חפשו שכונה או הקלידו כתובת — נשווה לטווח המחירים המקומי.</div>

      {fromAd && (
        <div className="formnote" style={{ color: '#2e7d52' }}>
          ✨ זוהתה מהמודעה — אפשר לשנות.
        </div>
      )}

      <input
        type="text"
        dir="auto"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            useTyped();
          }
        }}
        placeholder="חיפוש שכונה / כתובת בבאר שבע…"
        style={{
          width: '100%',
          borderRadius: 10,
          border: '1px solid #ddd',
          padding: '11px 12px',
          fontFamily: 'inherit',
          fontSize: 16,
          marginBottom: 10,
          boxSizing: 'border-box',
        }}
      />

      <div className="hoods">
        {filtered.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`hood${input.neighborhood === o.key ? ' sel' : ''}`}
            onClick={() => setNeighborhood(o.key)}
          >
            <span className="e">📍</span>
            {o.name}
          </button>
        ))}
        <button
          type="button"
          className={`hood${input.neighborhood === 'other' ? ' sel' : ''}`}
          onClick={() => setNeighborhood('other')}
        >
          <span className="e">❓</span>
          אחר / לא ברשימה
        </button>
      </div>

      {q.trim() && filtered.length === 0 && (
        <div className="formnote">
          לא נמצאה שכונה תואמת — לחצו Enter כדי להשתמש ב"{q}" עם טווח כללי, או בחרו "אחר".
        </div>
      )}

      <div className="formnote">
        {selectedName
          ? `נבחר: ${selectedName}`
          : 'לא בטוחים? בחרו "אחר" ונשתמש בטווח כללי לסטודנטים בבאר שבע.'}
      </div>
    </div>
  );
}
