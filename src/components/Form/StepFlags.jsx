import { useApp } from '../../stores/appStore.jsx';
import { FieldLabel } from './fields.jsx';

// Checklist worded as plain yes/no questions about the TERMS (not the person).
const CHECKS = [
  { key: 'cashOnly', label: 'ביקשו תשלום במזומן בלבד?' },
  { key: 'noContract', label: 'אין חוזה שכירות כתוב?' },
  { key: 'noReceipts', label: 'לא נותנים קבלות על תשלומים?' },
  { key: 'refusesViewing', label: 'מסרבים להראות את הדירה לפני סגירה?' },
  { key: 'pressureToCloseToday', label: 'מפעילים לחץ לסגור מהר ("יש המון מתעניינים")?' },
];

export default function StepFlags() {
  const { input, setChecklist, setField } = useApp();

  return (
    <div>
      <div className="step-h">סימני אזהרה</div>
      <div className="step-s">סמנו מה שמתאים — אלה שאלות לבדוק, לא האשמות.</div>

      {CHECKS.map((c) => {
        const on = input.checklist[c.key] === true;
        return (
          <button
            key={c.key}
            type="button"
            className={`check${on ? ' on' : ''}`}
            aria-pressed={on}
            onClick={() => setChecklist(c.key, !on)}
          >
            <span className="box">{on ? '✓' : ''}</span>
            <span className="ct">{c.label}</span>
          </button>
        );
      })}

      <FieldLabel hint="לא חובה">הדביקו את טקסט המודעה</FieldLabel>
      <textarea
        className="area"
        value={input.adText}
        placeholder="נסרוק את הטקסט אחרי ביטויים כמו 'מזומן בלבד', 'מיידי', 'יש המון מתעניינים'…"
        onChange={(e) => setField('adText', e.target.value)}
      />

      <div className="disclaimer" style={{ marginTop: 12 }}>
        <span className="e">⚖️</span>
        <div>
          מדריך זהירות — <b>אינו ייעוץ משפטי או פיננסי</b>. אלו שאלות לבדוק מול בעל הדירה.
        </div>
      </div>
    </div>
  );
}
