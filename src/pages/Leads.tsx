import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FilterBar, useFilters } from '../components/Filters'
import { Avatar, StageBadge } from '../components/ui'
import { filterLeads, money } from '../lib/leads'
import { useStore } from '../store'
import { STAGES, type Lead } from '../types'

type Key = 'company' | 'value' | 'stage' | 'createdAt'
const cmp: Record<Key, (a: Lead, b: Lead) => number> = {
  company: (a, b) => a.company.localeCompare(b.company),
  value: (a, b) => a.value - b.value,
  stage: (a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage),
  createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
}
const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export function Leads() {
  const { leads } = useStore()
  const [filters] = useFilters()
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'value', dir: -1 })
  const rows = [...filterLeads(leads, filters)].sort((a, b) => cmp[sort.key](a, b) * sort.dir)

  const th = (k: Key, children: string, className?: string) => (
    <th scope="col" className={className}
      aria-sort={sort.key === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="sort" onClick={() => setSort(s => ({ key: k, dir: s.key === k ? (-s.dir as 1 | -1) : 1 }))}>
        {children}<span aria-hidden="true">{sort.key === k ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}</span>
      </button>
    </th>
  )

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">All contacts</p>
          <h1>Leads</h1>
        </div>
      </header>
      <FilterBar count={rows.length} />
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              {th('company', 'Company')}
              {th('stage', 'Stage')}
              {th('value', 'Value', 'num')}
              <th scope="col" className="hide-sm">Owner</th>
              {th('createdAt', 'Created', 'hide-sm')}
            </tr>
          </thead>
          <tbody>
            {rows.map(l => (
              <tr key={l.id}>
                <td><Link to={`/leads/${l.id}`} className="row-link"><strong>{l.company}</strong><span>{l.name}</span></Link></td>
                <td><StageBadge stage={l.stage} /></td>
                <td className="num">{money(l.value)}</td>
                <td className="hide-sm"><span className="owner"><Avatar name={l.owner} />{l.owner}</span></td>
                <td className="hide-sm muted">{fmtDate(l.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="empty">No leads match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
