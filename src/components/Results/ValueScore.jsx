import { useEffect, useRef, useState } from 'react';

const BAND_COLOR = { good: 'var(--good)', mid: 'var(--mid)', bad: 'var(--bad)' };
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The 0–100 value dial. On reveal it SWEEPS (conic-gradient angle + count-up)
// from 0 to the score, eased — anticipation + follow-through, not a hard cut.
// Respects prefers-reduced-motion (jumps straight to the final value).
export default function ValueScore({ score, band, verdict, subline }) {
  const [shown, setShown] = useState(prefersReduced() ? score : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (prefersReduced()) {
      setShown(score);
      return;
    }
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setShown(Math.round(eased * score));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [score]);

  const color = BAND_COLOR[band] || 'var(--mid)';
  const pct = shown; // 0..100 maps directly to the dial fill percentage

  return (
    <div className={`dialcard val-${band}`}>
      <div className="cap">ציון ערך</div>
      <div
        className="dial"
        role="img"
        aria-label={`ציון ערך ${score} מתוך 100`}
        style={{ background: `conic-gradient(${color} 0 ${pct}%, var(--track) ${pct}% 100%)` }}
      >
        <div className="num">
          <b style={{ color }}>{shown}</b>
          <span>מתוך 100</span>
        </div>
      </div>
      <div className="verdict" style={{ color }}>
        {verdict}
        {subline && <small>{subline}</small>}
      </div>
    </div>
  );
}
