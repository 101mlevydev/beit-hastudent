import { useState } from 'react';
import { useApp } from '../../stores/appStore.jsx';
import ProgressBar from './ProgressBar.jsx';
import StepNeighborhood from './StepNeighborhood.jsx';
import StepCosts from './StepCosts.jsx';
import StepProperty from './StepProperty.jsx';
import StepTerms from './StepTerms.jsx';
import StepFlags from './StepFlags.jsx';

const STEPS = [StepNeighborhood, StepCosts, StepProperty, StepTerms, StepFlags];

function validate(step, input) {
  switch (step) {
    case 0:
      return input.neighborhood ? null : 'בחרו שכונה כדי להמשיך.';
    case 1:
      return Number(input.rentILS) > 0 ? null : 'הזינו שכר דירה חודשי.';
    case 2:
      if (!(Number(input.rooms) >= 1)) return 'כמה חדרים יש בדירה?';
      if (input.walkMinutes === '' || input.walkMinutes == null) return 'כמה דקות הליכה לקמפוס?';
      return null;
    default:
      return null;
  }
}

export default function Form() {
  const { step, input, goStep, compute, FORM_STEPS } = useApp();
  const [err, setErr] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const Current = STEPS[step];
  const isLast = step === FORM_STEPS - 1;

  const next = () => {
    const v = validate(step, input);
    if (v) {
      setErr(v);
      return;
    }
    setErr(null);
    if (isLast) {
      setCalculating(true);
      // a short, honest "מחשבים…" beat before the reveal
      setTimeout(() => {
        compute();
        setCalculating(false);
      }, 650);
    } else {
      goStep(step + 1);
    }
  };

  const back = () => {
    setErr(null);
    goStep(step - 1);
  };

  if (calculating) {
    return (
      <div className="calc">
        <div className="calc-dial" aria-hidden="true" />
        <p className="calc-txt">מחשבים…</p>
      </div>
    );
  }

  return (
    <div className="form-flow">
      <ProgressBar step={step} total={FORM_STEPS} />
      <div className="form-step" key={step}>
        <Current />
      </div>
      {err && <div className="fielderr" role="alert">{err}</div>}
      <div className="spacer" />
      <div className="form-nav">
        {step > 0 && (
          <button type="button" className="btn ghost" style={{ flex: '0 0 38%' }} onClick={back}>
            ‹ חזרה
          </button>
        )}
        <button type="button" className="btn primary" onClick={next}>
          {isLast ? '🔎 בדקו את הדירה' : 'המשך ›'}
        </button>
      </div>
    </div>
  );
}
