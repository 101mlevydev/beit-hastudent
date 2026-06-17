import { AppProvider, useApp } from './stores/appStore.jsx';
import { APP } from './lib/copy.js';
import Form from './components/Form/Form.jsx';
import Results from './components/Results/Results.jsx';
import NegotiationCard from './components/Negotiation/NegotiationCard.jsx';

function Shell() {
  const { screen, refsLoading, refsError } = useApp();

  if (refsError) {
    return (
      <div className="app-shell">
        <div className="empty">
          <span className="e">⚠️</span>
          לא הצלחנו לטעון את נתוני העזר. נסו לרענן את הדף.
        </div>
      </div>
    );
  }

  if (refsLoading) {
    return (
      <div className="app-shell">
        <div className="calc">
          <div className="calc-dial" aria-hidden="true" />
          <p className="calc-txt">טוען…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="appbar">
        <div className="mark" aria-hidden="true">🏠</div>
        <div className="wm">
          {APP.name}
          <small>{APP.tagline}</small>
        </div>
      </header>
      <main className="screen-host">
        {screen === 'form' && <Form />}
        {screen === 'results' && <Results />}
        {screen === 'negotiation' && <NegotiationCard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
