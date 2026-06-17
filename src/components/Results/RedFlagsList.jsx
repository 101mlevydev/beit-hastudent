import { UI, DISCLAIMER } from '../../lib/copy.js';

// Each matched flag is worded as a QUESTION TO ASK (the `ask` line), never an
// accusation. The "אינו ייעוץ משפטי" disclaimer is part of this surface.
export default function RedFlagsList({ flags }) {
  return (
    <div className="card">
      <div className="ch"><span className="e">🚩</span>{UI.flagsTitle}</div>

      {flags.length === 0 ? (
        <div className="flags-clear">
          <span aria-hidden="true">✓</span>{UI.noFlags}
        </div>
      ) : (
        flags.map((f) => (
          <div className="flag" key={f.code}>
            <span className={`sev ${f.severity}`} aria-hidden="true" />
            <div className="ft">
              <b>{f.label}</b>
              <span className="ask">{f.ask}</span>
            </div>
          </div>
        ))
      )}

      <div className="disclaimer">
        <span className="e">⚖️</span>
        <div>
          מדריך זהירות — <b>אינו ייעוץ משפטי או פיננסי</b>. אלו שאלות לבדוק מול בעל הדירה, לא קביעה על אדם או מודעה.
        </div>
      </div>
    </div>
  );
}
