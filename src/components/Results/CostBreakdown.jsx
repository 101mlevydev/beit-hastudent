import Ltr from '../Ltr.jsx';
import { num } from '../../lib/format.js';
import { UI } from '../../lib/copy.js';

// The hidden-cost reveal: rent + ארנונה + ועד בית = the TRUE monthly cost.
// "not ₪3,400 — in practice ₪3,770".
export default function CostBreakdown({ rent, arnona, vaad, total }) {
  return (
    <div className="card">
      <div className="ch"><span className="e">🧾</span>{UI.trueCost}</div>
      <div className="costrow"><span>שכר דירה</span><b><Ltr>{num(rent)}</Ltr> ₪</b></div>
      <div className="costrow"><span>ארנונה</span><b><Ltr>{num(arnona)}</Ltr> ₪</b></div>
      <div className="costrow"><span>ועד בית</span><b><Ltr>{num(vaad)}</Ltr> ₪</b></div>
      <div className="costrow total"><span>סה"כ בפועל</span><b><Ltr>{num(total)}</Ltr> ₪</b></div>
      {total !== rent && (
        <div className="costhint">
          לא <Ltr>{num(rent)}</Ltr> ₪ — בפועל <b><Ltr>{num(total)}</Ltr> ₪</b> בחודש
        </div>
      )}
    </div>
  );
}
