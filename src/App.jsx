import { AppProvider, useApp } from './stores/appStore.jsx';
import { APP } from './lib/copy.js';
import Form from './components/Form/Form.jsx';
import Results from './components/Results/Results.jsx';
import NegotiationCard from './components/Negotiation/NegotiationCard.jsx';
import SavedList from './components/Saved/SavedList.jsx';
import CompareTable from './components/Saved/CompareTable.jsx';

function Shell() {
  const { screen, refsLoading, refsError, saved, goto } = useApp();

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

  const ownsHeader = screen === 'saved' || screen === 'compare';
  const shellClass =
    screen === 'compare' ? ' wide' : screen === 'results' ? ' res' : '';

  return (
    <div className={`app-shell${shellClass}`}>
      {!ownsHeader && (
        <header className="appbar">
          <div className="mark" aria-hidden="true">🏠</div>
          <div className="wm">
            {APP.name}
            <small>{APP.tagline}</small>
          </div>
          {saved.length > 0 && (
            <button
              type="button"
              className="appbar-saved"
              onClick={() => goto('saved')}
              aria-label={`הדירות שלי, ${saved.length} שמורות`}
            >
              🗂️ <span className="ltr">{saved.length}</span>
            </button>
          )}
        </header>
      )}
      <main className="screen-host">
        {screen === 'form' && <Form />}
        {screen === 'results' && <Results />}
        {screen === 'negotiation' && <NegotiationCard />}
        {screen === 'saved' && <SavedList />}
        {screen === 'compare' && <CompareTable />}
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
