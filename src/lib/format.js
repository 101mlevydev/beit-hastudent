// Pure formatting helpers. These return plain strings (no JSX, no DOM) so the
// headless engine and unit tests can use them too. The UI wraps the output in a
// <span dir="ltr" class="ltr"> island (see components/Ltr.jsx) so ₪ amounts,
// walk-minutes, and the wa.me URL never reorder inside RTL Hebrew text.

/** Group an integer with thousands separators, e.g. 3400 -> "3,400". */
export function num(n) {
  if (n == null || Number.isNaN(Number(n))) return '0';
  return Math.round(Number(n)).toLocaleString('en-US');
}

/** Money as a bare grouped number (the ₪ sign is rendered separately in copy). */
export function nis(n) {
  return num(n);
}

/** "3,400 ₪" — the shekel sign trails (Hebrew reading order keeps ₪ after). */
export function nisLabel(n) {
  return `${num(n)} ₪`;
}

/** Walk-minutes label, e.g. "14 דק'". */
export function minutes(n) {
  return `${num(n)} דק'`;
}

/** A min–max range as an LTR-safe string, e.g. "1,400–1,750". */
export function range(min, max) {
  return `${num(min)}–${num(max)}`;
}
