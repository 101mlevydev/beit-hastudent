import { useState } from 'react';
import { useApp } from '../../stores/appStore.jsx';
import Ltr from '../Ltr.jsx';
import { num } from '../../lib/format.js';
import { UI } from '../../lib/copy.js';
import ValueScore from './ValueScore.jsx';
import RiskBadge from './RiskBadge.jsx';
import CostBreakdown from './CostBreakdown.jsx';
import BenchmarkBar from './BenchmarkBar.jsx';
import RedFlagsList from './RedFlagsList.jsx';
import Breakdown from './Breakdown.jsx';

const NEG_NAME = { price: 'המחיר', distance: 'המרחק', floor: 'הקומה', furnished: 'הריהוט' };

// A short, honest verdict subline derived from the breakdown's biggest drags.
function buildSubline(value) {
  const negs = value.breakdown.filter((b) => b.delta < 0).sort((a, b) => a.delta - b.delta);
  if (negs.length === 0) {
    return value.band === 'good' ? 'מחיר טוב והתנאים מאוזנים.' : 'אין מורידים בולטים.';
  }
  const names = negs.slice(0, 2).map((b) => NEG_NAME[b.factor] || b.factor);
  return `${names.join(' ו')} מורידים את הערך.`;
}

function propertySummary(input) {
  const parts = [`${num(input.rooms)} חד'`, `קומה ${num(input.floor)}`];
  if (input.hasElevator === false && Number(input.floor) >= 1) parts.push('ללא מעלית');
  return parts.join(" · ");
}

export default function Results() {
  const { result, input, goto, saveListing, resetDraft } = useApp();
  const [saved, setSaved] = useState(false);
  if (!result) return null;

  const { value, risk, meta } = result;
  const subline = buildSubline(value);

  const onSave = () => {
    saveListing();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="stagger">
      <div className="reslead">
        הדירה ב<b>{meta.hoodName}</b> · <span dir="ltr">{propertySummary(input)}</span>
        {meta.approximate && (
          <div style={{ marginTop: 4 }}>
            <span className="rb med">{UI.approximate}</span>{' '}
            <span style={{ fontSize: 10, color: 'var(--faint)' }}>
              מעודכן ל-<Ltr>{meta.dataDate}</Ltr>
            </span>
          </div>
        )}
      </div>

      <div className="scorewrap">
        <ValueScore score={value.score} band={value.band} verdict={value.verdict} subline={subline} />
        <RiskBadge level={risk.level} />
      </div>

      <Breakdown breakdown={value.breakdown} />

      <div className="results-grid">
        <CostBreakdown
          rent={Number(input.rentILS) || 0}
          arnona={Number(input.arnonaILS) || 0}
          vaad={Number(input.vaadBayitILS) || 0}
          total={value.costMonthly}
        />
        <BenchmarkBar perRoom={value.perRoom} benchmark={value.benchmark} hoodName={meta.hoodName} />
      </div>

      <RedFlagsList flags={risk.flags} />

      <button type="button" className="btn primary" onClick={() => goto('negotiation')}>
        {UI.toNegotiation}
      </button>
      <div className="btn-row" style={{ marginTop: 9 }}>
        <button type="button" className="btn ghost" onClick={onSave}>
          {saved ? '✓ נשמרה' : `💾 ${UI.save}`}
        </button>
        <button type="button" className="btn ghost" onClick={resetDraft}>
          {UI.checkAnother}
        </button>
      </div>
    </div>
  );
}
