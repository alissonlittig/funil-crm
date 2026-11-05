import { NavLink, Route, Routes, Link } from 'react-router-dom'
import { Icon, ThemeToggle } from './components/ui'
import { Board } from './pages/Board'
import { Insights } from './pages/Insights'
import { LeadDetail } from './pages/LeadDetail'
import { Leads } from './pages/Leads'
import { NewLead } from './pages/NewLead'
import { useStore } from './store'

export function App() {
  const { dispatch } = useStore()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <Link to="/" className="brand" aria-label="Funil home">
          <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" />
            <path d="M8 10h16l-6 7v6l-4 2v-8z" />
          </svg>
          Funil
        </Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Pipeline</NavLink>
          <NavLink to="/leads">Leads</NavLink>
          <NavLink to="/insights">Insights</NavLink>
        </nav>
        <div className="tools">
          <ThemeToggle />
          <Link to="/new" className="btn primary"><Icon name="plus" size={16} /><span>New lead</span></Link>
        </div>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/new" element={<NewLead />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="*" element={<div className="card empty-state"><h1>Page not found</h1><Link className="btn" to="/">Back to pipeline</Link></div>} />
        </Routes>
      </main>
      <footer className="foot">
        Demo with fictitious data, saved only in this browser.{' '}
        <button type="button" className="text-btn" onClick={() => dispatch({ type: 'reset' })}>Reset demo data</button>
      </footer>
    </>
  )
}
