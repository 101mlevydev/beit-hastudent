// Small, reusable form primitives for the guided intake. ≥44px tap targets;
// numbers typed LTR; ₪ units shown as muted suffixes.

export function NumberField({ value, onChange, unit, placeholder, min = 0, ariaLabel }) {
  return (
    <div className="input">
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value === '' || value == null ? '' : value}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === '' ? '' : Math.max(min, Number(raw)));
        }}
      />
      {unit && <span className="un">{unit}</span>}
    </div>
  );
}

export function Seg({ options, value, onChange }) {
  return (
    <div className="seg" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function FieldLabel({ children, hint }) {
  return (
    <div className="fieldlabel">
      <span>{children}</span>
      {hint && <small>{hint}</small>}
    </div>
  );
}
