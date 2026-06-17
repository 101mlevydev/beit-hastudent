import { useState } from 'react';
import { useApp } from '../../stores/appStore.jsx';
import { UI } from '../../lib/copy.js';

// Robust clipboard copy: the async Clipboard API first (works on a user gesture
// inside a sandboxed iframe), with a hidden-textarea + execCommand fallback for
// older / restricted contexts. Always resolves to true/false.
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// The signature surface: the generated Hebrew message in a WhatsApp-style
// bubble + one-tap copy (primary) + a graceful wa.me deep link (secondary).
// No phone number is required or stored.
export default function NegotiationCard() {
  const { result, goto } = useApp();
  const [copied, setCopied] = useState(false);
  const script = result?.negotiationScript || '';

  const onCopy = async () => {
    const ok = await copyText(script);
    setCopied(ok ? 'ok' : 'fail');
    setTimeout(() => setCopied(false), 2400);
  };

  const onWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(script)}`;
    try {
      window.open(url, '_blank', 'noopener');
    } catch {
      // top-level navigation blocked in the sandbox — copy path remains the robust default
      copyText(script).then(() => setCopied('ok'));
    }
  };

  const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="stagger">
      <button type="button" className="btn ghost" style={{ width: 'auto', marginBottom: 12 }} onClick={() => goto('results')}>
        ‹ חזרה לתוצאה
      </button>

      <div className="negintro">
        ניסחנו בשבילך הודעה <b>מנומסת אבל לא נאיבית</b>, עם המספרים של השכונה בפנים. מוכנה לשליחה כמו שהיא.
      </div>

      <div className="bubblewrap">
        <div className="bubble">
          {script}
          <div className="time">מוכן להעתקה · <span className="ltr">{now}</span></div>
        </div>
      </div>

      <div className="negactions">
        <button type="button" className="btn primary" onClick={onCopy}>
          {UI.copy}
        </button>
        <div className="copied" role="status">
          {copied === 'ok' && UI.copied}
          {copied === 'fail' && 'בחרו והעתיקו ידנית 🙏'}
        </div>
        <button type="button" className="btn wa" onClick={onWhatsApp}>
          {UI.sendWa}
        </button>
      </div>

      <div className="disclaimer" style={{ marginTop: 12 }}>
        <span className="e">⚖️</span>
        <div>
          מדריך זהירות — <b>אינו ייעוץ משפטי</b>. נוסח לעריכה חופשית לפני שליחה.
        </div>
      </div>
    </div>
  );
}
