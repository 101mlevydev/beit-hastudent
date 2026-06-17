import { RISK } from '../../lib/copy.js';

// רמת סיכון — calm → alarm. Expressive, not gimmicky (no sirens). Scores the
// TERMS, never a person.
export default function RiskBadge({ level }) {
  const r = RISK[level] || RISK.med;
  return (
    <div className={`riskcard pop risk-${level}`}>
      <div className="cap">רמת סיכון</div>
      <div className="riskbadge">
        <div className="ring" aria-hidden="true">{r.emoji}</div>
        <div className="lvl">{r.label}</div>
        <div className="sub">
          {r.sub.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
