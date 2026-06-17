// LTR island: prices, walk-minutes, ranges, and the wa.me URL stay left-to-right
// inside RTL Hebrew text so digits never reorder. Mirrors the mockup's
// <span class="ltr">…</span>.
export default function Ltr({ children }) {
  return <span className="ltr">{children}</span>;
}
