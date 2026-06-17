import { AppProvider, useApp } from './stores/appStore.jsx';
import { APP } from './lib/copy.js';
import Form from './components/Form/Form.jsx';

function Shell() {
  const { screen, refsLoading, refsError, result } = useApp();

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
        {screen === 'results' && (
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, direction: 'ltr' }}>
            {JSON.stringify(result?.value, null, 2)}
            {'\n\n'}
            {result?.negotiationScript}
          </pre>
        )}
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
