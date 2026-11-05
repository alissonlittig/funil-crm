import { useState, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { FilterBar, useFilters } from '../components/Filters'
import { Avatar, Icon } from '../components/ui'
import { filterLeads, groupByStage, money, shiftStage, sum, summary } from '../lib/leads'
import { useStore } from '../store'
import { STAGES, STAGE_LABEL, type Lead, type Stage } from '../types'

export function Board() {
  const { leads, dispatch } = useStore()
  const [filters] = useFilters()
  const [over, setOver] = useState<Stage | null>(null)
  const [announce, setAnnounce] = useState('')
  const visible = filterLeads(leads, filters)
  const cols = groupByStage(visible)
  const s = summary(leads)

  const move = (lead: Lead, stage: Stage) => {
    dispatch({ type: 'move', id: lead.id, stage })
    setAnnounce(`${lead.company} moved to ${STAGE_LABEL[stage]}.`)
  }
  const onDrop = (e: DragEvent, stage: Stage) => {
    e.preventDefault()
    setOver(null)
    const lead = leads.find(l => l.id === e.dataTransfer.getData('text/plain'))
    if (lead) move(lead, stage)
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Sales pipeline</p>
          <h1>Pipeline</h1>
        </div>
        <dl className="stats">
          <div><dt>Open pipeline</dt><dd>{money(s.openValue)}</dd></div>
          <div><dt>Won</dt><dd>{money(s.wonValue)}</dd></div>
          <div><dt>Win rate</dt><dd>{Math.round(s.winRate * 100)}%</dd></div>
        </dl>
      </header>

      <FilterBar count={visible.length} />
      <p className="sr-only" aria-live="assertive">{announce}</p>

      <div className="board" aria-label="Pipeline board">
        {STAGES.map(stage => (
          <section key={stage} aria-labelledby={`col-${stage}`}
            className={`column s-${stage}${over === stage ? ' over' : ''}`}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== stage) setOver(stage) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null) }}
            onDrop={e => onDrop(e, stage)}>
            <header className="col-head">
              <h2 id={`col-${stage}`}><i aria-hidden="true" />{STAGE_LABEL[stage]}</h2>
              <span className="count" aria-label={`${cols[stage].length} leads`}>{cols[stage].length}</span>
              <span className="col-sum">{money(sum(cols[stage]))}</span>
            </header>
            <ul className="cards">
              {cols[stage].map(lead => <Card key={lead.id} lead={lead} onMove={move} />)}
              {cols[stage].length === 0 && <li className="drop-hint">Drop a lead here</li>}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

function Card({ lead, onMove }: { lead: Lead; onMove: (l: Lead, s: Stage) => void }) {
  const [dragging, setDragging] = useState(false)
  const prev = shiftStage(lead.stage, -1)
  const next = shiftStage(lead.stage, 1)
  return (
    <li className={`card lead${dragging ? ' dragging' : ''}`} draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', lead.id); e.dataTransfer.effectAllowed = 'move'; setDragging(true) }}
      onDragEnd={() => setDragging(false)}>
      <Link to={`/leads/${lead.id}`} className="lead-link">
        <span className="lead-company">{lead.company}</span>
        <span className="lead-name">{lead.name}</span>
      </Link>
      <p className="lead-next">{lead.nextStep}</p>
      <div className="lead-foot">
        <strong className="lead-value">{money(lead.value)}</strong>
        <span className="chip">{lead.source}</span>
        <Avatar name={lead.owner} />
      </div>
      <div className="lead-move">
        <button type="button" className="icon-btn sm" disabled={!prev}
          aria-label={prev ? `Move ${lead.company} to ${STAGE_LABEL[prev]}` : `${lead.company} is in the first stage`}
          onClick={() => prev && onMove(lead, prev)}><Icon name="left" size={16} /></button>
        <button type="button" className="icon-btn sm" disabled={!next}
          aria-label={next ? `Move ${lead.company} to ${STAGE_LABEL[next]}` : `${lead.company} is in the last stage`}
          onClick={() => next && onMove(lead, next)}><Icon name="right" size={16} /></button>
      </div>
    </li>
  )
}
