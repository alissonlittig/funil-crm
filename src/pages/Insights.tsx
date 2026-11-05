import { Avatar } from '../components/ui'
import { groupByStage, money, sum, summary } from '../lib/leads'
import { useStore } from '../store'
import { OWNERS, SOURCES, STAGES, STAGE_LABEL } from '../types'

function Bars({ rows, format }: { rows: { label: React.ReactNode; key: string; value: number; cls?: string }[]; format: (n: number) => string }) {
  const max = Math.max(1, ...rows.map(r => r.value))
  return (
    <ul className="bars">
      {rows.map(r => (
        <li key={r.key}>
          <span className="bar-label">{r.label}</span>
          <span className="bar-track"><span className={`bar-fill ${r.cls ?? ''}`} style={{ width: `${(r.value / max) * 100}%` }} /></span>
          <span className="bar-value">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  )
}

export function Insights() {
  const { leads } = useStore()
  const g = groupByStage(leads)
  const s = summary(leads)
  const count = (n: number) => String(n)

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Performance</p>
          <h1>Insights</h1>
        </div>
      </header>

      <div className="kpis">
        <div className="card kpi"><span>Open deals</span><strong>{s.openCount}</strong></div>
        <div className="card kpi"><span>Open pipeline</span><strong>{money(s.openValue)}</strong></div>
        <div className="card kpi"><span>Win rate</span><strong>{Math.round(s.winRate * 100)}%</strong></div>
        <div className="card kpi"><span>Average won deal</span><strong>{money(s.avgDeal)}</strong></div>
      </div>

      <div className="insight-grid">
        <section className="card" aria-labelledby="funnel">
          <h2 id="funnel">Funnel by stage</h2>
          <Bars format={count} rows={STAGES.map(st => ({ key: st, label: STAGE_LABEL[st], value: g[st].length, cls: `s-${st}` }))} />
        </section>
        <section className="card" aria-labelledby="value">
          <h2 id="value">Value by stage</h2>
          <Bars format={money} rows={STAGES.map(st => ({ key: st, label: STAGE_LABEL[st], value: sum(g[st]), cls: `s-${st}` }))} />
        </section>
        <section className="card" aria-labelledby="owners">
          <h2 id="owners">Open pipeline by owner</h2>
          <Bars format={money} rows={OWNERS.map(o => ({
            key: o, label: <span className="owner"><Avatar name={o} />{o.split(' ')[0]}</span>,
            value: sum(leads.filter(l => l.owner === o && l.stage !== 'won' && l.stage !== 'lost')),
          }))} />
        </section>
        <section className="card" aria-labelledby="sources">
          <h2 id="sources">Leads by source</h2>
          <Bars format={count} rows={SOURCES.map(src => ({ key: src, label: src, value: leads.filter(l => l.source === src).length }))} />
        </section>
      </div>
    </>
  )
}
