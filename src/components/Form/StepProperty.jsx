import { useApp } from '../../stores/appStore.jsx';
import { NumberField, Seg, FieldLabel } from './fields.jsx';

export default function StepProperty() {
  const { input, setField } = useApp();

  return (
    <div>
      <div className="step-h">על הדירה</div>
      <div className="step-s">כמה פרטים שמשפיעים על הערך — ועל החיים במדבר.</div>

      <div className="inrow">
        <div style={{ flex: 1 }}>
          <FieldLabel>מספר חדרים</FieldLabel>
          <NumberField
            value={input.rooms}
            onChange={(v) => setField('rooms', v)}
            unit="חדרים"
            placeholder="2"
            min={1}
            ariaLabel="מספר חדרים"
          />
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel hint="לא חובה">גודל</FieldLabel>
          <NumberField
            value={input.sizeSqm}
            onChange={(v) => setField('sizeSqm', v)}
            unit='מ"ר'
            placeholder="55"
            ariaLabel="גודל במטרים"
          />
        </div>
      </div>

      <div className="inrow">
        <div style={{ flex: 1 }}>
          <FieldLabel>קומה</FieldLabel>
          <NumberField
            value={input.floor}
            onChange={(v) => setField('floor', v)}
            unit="קומה"
            placeholder="3"
            ariaLabel="קומה"
          />
        </div>
        <div style={{ flex: 1 }}>
          <FieldLabel>מרחק מהקמפוס</FieldLabel>
          <NumberField
            value={input.walkMinutes}
            onChange={(v) => setField('walkMinutes', v)}
            unit="דק' הליכה"
            placeholder="12"
            ariaLabel="דקות הליכה לקמפוס"
          />
        </div>
      </div>

      <FieldLabel>מעלית?</FieldLabel>
      <Seg
        options={[
          { value: true, label: 'יש מעלית' },
          { value: false, label: 'אין מעלית' },
        ]}
        value={input.hasElevator}
        onChange={(v) => setField('hasElevator', v)}
      />

      <FieldLabel>מרוהטת?</FieldLabel>
      <Seg
        options={[
          { value: 'full', label: 'מרוהטת' },
          { value: 'partial', label: 'חלקי' },
          { value: 'none', label: 'לא מרוהטת' },
        ]}
        value={input.furnished}
        onChange={(v) => setField('furnished', v)}
      />
    </div>
  );
}
