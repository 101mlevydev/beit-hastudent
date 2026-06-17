import { useState } from 'react'

// Tiny screen-state switch (no router lib): Form → Results → Negotiation → Saved.
// Fleshed out across steps 07–10; this scaffold proves the RTL React shell builds.
export default function App() {
  const [screen] = useState('form')

  return (
    <div className="app-shell">
      <header className="appbar">
        <div className="mark" aria-hidden="true">🏠</div>
        <div className="wm">
          בית הסטודנט
          <small>בודקים דירה לפני שחותמים</small>
        </div>
      </header>
      <main className="screen-host">
        <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
          מסך נוכחי: {screen}
        </p>
      </main>
    </div>
  )
}
