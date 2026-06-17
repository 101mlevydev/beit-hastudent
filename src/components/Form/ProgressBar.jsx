export default function ProgressBar({ step, total }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="prog">
      <div className="bar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <span className="pc">
        <span className="ltr">{step + 1} / {total}</span>
      </span>
    </div>
  );
}
