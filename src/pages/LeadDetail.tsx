import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Icon, StageBadge } from '../components/ui'
import { money } from '../lib/leads'
import { useStore } from '../store'
import { STAGES, STAGE_LABEL, type Stage } from '../types'

const fmt = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
    .toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...(iso.length > 10 && { hour: 'numeric', minute: '2-digit' }) })

export function LeadDetail() {
  const { id } = useParams()
  const { leads, dispatch } = useStore()
  const lead = leads.find(l => l.id === id)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')

  if (!lead) {
    return (
      <div className="card empty-state">
        <h1>Lead not found</h1>
        <p className="muted">It may have been removed after a demo reset.</p>
        <Link className="btn" to="/">Back to pipeline</Link>
      </div>
    )
  }

  const addNote = (e: FormEvent) => {
    e.preventDefault()
    if (!note.trim()) { setNoteError('Write something before saving.'); return }
    dispatch({ type: 'note', id: lead.id, text: note.trim(), at: new Date().toISOString() })
    setNote(''); setNoteError('')
  }

  return (
    <>
      <Link to="/" className="back"><Icon name="back" size={16} /> Pipeline</Link>
      <header className="page-head detail-head">
        <div>
          <p className="eyebrow">{lead.company}</p>
          <h1>{lead.name}</h1>
        </div>
        <StageBadge stage={lead.stage} />
      </header>

      <div className="detail-grid">
        <section className="card" aria-labelledby="deal">
          <h2 id="deal">Deal</h2>
          <dl className="facts">
            <div><dt>Value</dt><dd className="big">{money(lead.value)}</dd></div>
            <div><dt>Owner</dt><dd className="owner"><Avatar name={lead.owner} />{lead.owner}</dd></div>
            <div><dt>Source</dt><dd>{lead.source}</dd></div>
            <div><dt>Created</dt><dd>{fmt(lead.createdAt)}</dd></div>
          </dl>
          <label className="field">
            <span>Stage</span>
            <select value={lead.stage} onChange={e => dispatch({ type: 'move', id: lead.id, stage: e.target.value as Stage })}>
              {STAGES.map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Next step</span>
            <input value={lead.nextStep} onChange={e => dispatch({ type: 'nextStep', id: lead.id, text: e.target.value })} />
          </label>
        </section>

        <section className="card" aria-labelledby="activity">
          <h2 id="activity">Activity</h2>
          <form onSubmit={addNote} className="note-form" noValidate>
            <label className="field">
              <span>Add a note</span>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                aria-invalid={Boolean(noteError)} aria-describedby={noteError ? 'note-err' : undefined}
                placeholder="Call summary, objections, agreed next step…" />
            </label>
            {noteError && <p id="note-err" className="error">{noteError}</p>}
            <button className="btn primary" type="submit">Save note</button>
          </form>
          <ol className="timeline">
            {lead.notes.map(n => (
              <li key={n.id}><time dateTime={n.at}>{fmt(n.at)}</time><p>{n.text}</p></li>
            ))}
            {lead.notes.length === 0 && <li className="muted">No notes yet.</li>}
          </ol>
        </section>
      </div>
    </>
  )
}
