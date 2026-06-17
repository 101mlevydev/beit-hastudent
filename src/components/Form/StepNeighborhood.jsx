import { useApp } from '../../stores/appStore.jsx';
import { neighborhoodOptions } from '../../stores/refStore.js';

export default function StepNeighborhood() {
  const { refs, input, setNeighborhood } = useApp();
  const options = neighborhoodOptions(refs?.benchmarks);

  return (
    <div>
      <div className="step-h">איפה הדירה?</div>
      <div className="step-s">השכונה קובעת את טווח המחירים שאליו נשווה.</div>

      <div className="hoods">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`hood${input.neighborhood === o.key ? ' sel' : ''}`}
            onClick={() => setNeighborhood(o.key)}
          >
            <span className="e">{o.emoji}</span>
            {o.name}
          </button>
        ))}
      </div>
      <div className="formnote">
        לא בטוחים? בחרו "אחר" ונשתמש בטווח כללי לסטודנטים בבאר שבע.
      </div>
    </div>
  );
}
