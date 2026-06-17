import { useApp } from '../../stores/appStore.jsx';
import { NumberField, FieldLabel } from './fields.jsx';

export default function StepCosts() {
  const { input, setField } = useApp();

  return (
    <div>
      <div className="step-h">העלויות החודשיות</div>
      <div className="step-s">לא רק השכירות — גם מה שמסתתר מתחתיה.</div>

      <FieldLabel hint="חודשי">שכר דירה</FieldLabel>
      <div className="inrow">
        <NumberField
          value={input.rentILS}
          onChange={(v) => setField('rentILS', v)}
          unit="₪ / חודש"
          placeholder="3,400"
          ariaLabel="שכר דירה חודשי"
        />
      </div>

      <FieldLabel hint="חלק הדייר">ארנונה</FieldLabel>
      <div className="inrow">
        <NumberField
          value={input.arnonaILS}
          onChange={(v) => setField('arnonaILS', v)}
          unit="₪ / חודש"
          placeholder="250"
          ariaLabel="ארנונה חודשית"
        />
      </div>

      <FieldLabel hint="אם יש">ועד בית</FieldLabel>
      <div className="inrow">
        <NumberField
          value={input.vaadBayitILS}
          onChange={(v) => setField('vaadBayitILS', v)}
          unit="₪ / חודש"
          placeholder="120"
          ariaLabel="ועד בית חודשי"
        />
      </div>

      <div className="formnote">
        אלה מצטרפים יחד לעלות החודשית האמיתית — נחשב אותה בשבילכם.
      </div>
    </div>
  );
}
