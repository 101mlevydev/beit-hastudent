import { useState } from 'react';
import { useApp } from '../../stores/appStore.jsx';

// "Paste whatever you saw" → client-side parse → auto-fill the form.
// Everything it fills stays editable; the user reviews as they walk the steps.
export default function AdPasteBox() {
  const { prefillFromAd } = useApp();
  const [text, setText] = useState('');
  const [msg, setMsg] = useState(null);

  const fill = () => {
    if (!text.trim()) return;
    const n = prefillFromAd(text);
    setMsg(
      n > 0
        ? `מילאנו ${n} שדות מהמודעה ✓ עברו עליהם בשלבים ותקנו אם צריך.`
        : 'לא הצלחנו לחלץ פרטים מהטקסט — אפשר פשוט למלא ידנית 🙂'
    );
  };

  return (
    <div
      style={{
        background: '#fff7ee',
        border: '1px solid #eadbc6',
        borderRadius: 14,
        padding: '12px 14px',
        marginBottom: 18,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 2 }}>📋 ראיתם מודעה? הדביקו אותה</div>
      <div className="step-s" style={{ marginBottom: 8 }}>
        נחלץ מחיר, חדרים, קומה, שכונה ועוד — ונמלא את הטופס בשבילכם.
      </div>
      <textarea
        dir="auto"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'הדביקו כאן את טקסט המודעה (יד2 / פייסבוק)…'}
        style={{
          width: '100%',
          resize: 'vertical',
          borderRadius: 10,
          border: '1px solid #ddd',
          padding: 10,
          fontFamily: 'inherit',
          fontSize: 15,
          boxSizing: 'border-box',
        }}
      />
      <button type="button" className="btn primary" style={{ marginTop: 8, width: '100%' }} onClick={fill}>
        ✨ מלאו לי אוטומטית מהמודעה
      </button>
      {msg && (
        <div className="formnote" style={{ marginTop: 8, color: '#2e7d52' }}>
          {msg}
        </div>
      )}
    </div>
  );
}
