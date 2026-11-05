import { useSearchParams } from 'react-router-dom'
import type { Filters } from '../lib/leads'
import { OWNERS, SOURCES } from '../types'
import { Icon } from './ui'

/** Filters live in the URL so a filtered view can be bookmarked or shared. */
export function useFilters(): [Filters, (k: keyof Filters, v: string) => void, () => void] {
  const [params, setParams] = useSearchParams()
  const f = { q: params.get('q') ?? '', owner: params.get('owner') ?? '', source: params.get('source') ?? '' }
  const set = (k: keyof Filters, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    setParams(next, { replace: true })
  }
  return [f, set, () => setParams({}, { replace: true })]
}

export function FilterBar({ count }: { count: number }) {
  const [f, set, clear] = useFilters()
  const active = Boolean(f.q || f.owner || f.source)
  return (
    <div className="filters" role="search">
      <label className="search">
        <span className="sr-only">Search leads</span>
        <Icon name="search" />
        <input type="search" placeholder="Search name, company or next step" value={f.q}
          onChange={e => set('q', e.target.value)} />
      </label>
      <label className="select">
        <span className="sr-only">Owner</span>
        <select value={f.owner} onChange={e => set('owner', e.target.value)}>
          <option value="">All owners</option>
          {OWNERS.map(o => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className="select">
        <span className="sr-only">Source</span>
        <select value={f.source} onChange={e => set('source', e.target.value)}>
          <option value="">All sources</option>
          {SOURCES.map(o => <option key={o}>{o}</option>)}
        </select>
      </label>
      <p className="filter-count" aria-live="polite">
        {count} {count === 1 ? 'lead' : 'leads'}
        {active && <button type="button" className="text-btn" onClick={clear}>Clear filters</button>}
      </p>
    </div>
  )
}
