import Ltr from '../Ltr.jsx';
import { num } from '../../lib/format.js';
import { UI, POSITION } from '../../lib/copy.js';

// A number line (laid out LTR so the quantitative axis never mirrors): low on
// the left → high on the right. Green = below the local range, amber = within,
// red = above. The dot marks YOUR ₪/room.
export default function BenchmarkBar({ perRoom, benchmark, hoodName }) {
  const { min, max, position } = benchmark;
  const domainMin = min * 0.75;
  const domainMax = max * 1.25;
  const span = domainMax - domainMin;
  const toPct = (v) => Math.max(2, Math.min(98, ((v - domainMin) / span) * 100));

  const minPct = toPct(min);
  const maxPct = toPct(max);
  const youPct = toPct(perRoom);
  const pos = POSITION[position] || POSITION.within;

  const gradient =
    `linear-gradient(90deg, var(--good-soft) 0 ${minPct}%, ` +
    `var(--mid-soft) ${minPct}% ${maxPct}%, var(--bad-soft) ${maxPct}% 100%)`;

  return (
    <div className="card">
      <div className="ch"><span className="e">📊</span>{UI.perRoomVsHood}</div>
      <div className="bm" dir="ltr" style={{ background: gradient }}>
        <div
          className="rng"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%`, background: 'linear-gradient(90deg,#bfe2cc,#f0d59a)' }}
        />
        <div className={`youlab ${position}`} style={{ left: `${youPct}%` }}>
          אתם · <Ltr>{num(perRoom)}</Ltr> ₪
        </div>
        <div className={`you ${position}`} style={{ left: `${youPct}%`, right: 'auto' }} />
      </div>
      <div className="bmscale" dir="ltr">
        <span><Ltr>{num(min)}</Ltr></span>
        <span>{UI.rangeLabel}</span>
        <span><Ltr>{num(max)}</Ltr></span>
      </div>
      <div className="costhint" style={{ marginTop: 9 }}>
        <Ltr>{num(perRoom)}</Ltr> ₪ לחדר — <b>{pos.label}</b> ב{hoodName}
      </div>
    </div>
  );
}
