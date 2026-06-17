import { useApp } from '../../stores/appStore.jsx';
import { NumberField, Seg, FieldLabel } from './fields.jsx';

export default function StepTerms() {
  const { input, setField, setDeposit } = useApp();

  return (
    <div>
      <div className="step-h">הפיקדון והתנאים</div>
      <div className="step-s">כאן מסתתרים רוב הסיכונים — נבדוק אותם בעדינות.</div>

      <FieldLabel hint="כמה חודשי שכירות">גובה הפיקדון</FieldLabel>
      <div className="inrow">
        <NumberField
          value={input.deposit.months}
          onChange={(v) => setDeposit({ months: v === '' ? 0 : v })}
          unit="חודשים"
          placeholder="1"
          ariaLabel="גובה הפיקדון בחודשים"
        />
      </div>

      <FieldLabel>מתי משלמים את הפיקדון?</FieldLabel>
      <Seg
        options={[
          { value: 'before_viewing', label: 'לפני צפייה' },
          { value: 'before_signing', label: 'לפני חתימה' },
          { value: 'on_signing', label: 'בחתימה' },
        ]}
        value={input.deposit.timing}
        onChange={(v) => setDeposit({ timing: v })}
      />

      <div className="formnote">
        בקשה להעביר פיקדון עוד לפני שראיתם את הדירה היא דגל אדום מוכר.
      </div>
    </div>
  );
}
