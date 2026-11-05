import { cloneElement, useState, type FormEvent, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateLead, type LeadForm } from '../lib/leads'
import { useStore } from '../store'
import { OWNERS, SOURCES, type Owner, type Source } from '../types'

const empty: LeadForm = { name: '', company: '', value: '', owner: '', source: '', nextStep: '' }

export function NewLead() {
  const { leads, dispatch } = useStore()
  const nav = useNavigate()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Partial<LeadForm>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateLead(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    const id = `L${String(leads.reduce((m, l) => Math.max(m, Number(l.id.slice(1)) || 0), 0) + 1).padStart(3, '0')}`
    dispatch({
      type: 'add', id, today: new Date().toISOString().slice(0, 10),
      lead: { ...form, name: form.name.trim(), company: form.company.trim(), value: Number(form.value),
        owner: form.owner as Owner, source: form.source as Source, nextStep: form.nextStep.trim() || 'First contact' },
    })
    nav('/')
  }

  const field = (k: keyof LeadForm, label: string, input: ReactElement<Record<string, unknown>>) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      {cloneElement(input, {
        id: `f-${k}`, value: form[k],
        onChange: (e: { target: { value: string } }) => setForm(f => ({ ...f, [k]: e.target.value })),
        'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `e-${k}` : undefined,
      })}
      {errors[k] && <p id={`e-${k}`} className="error">{errors[k]}</p>}
    </div>
  )

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1>New lead</h1>
        </div>
      </header>
      <form className="card form" onSubmit={submit} noValidate>
        <div className="form-grid">
          {field('name', 'Contact name', <input autoComplete="off" />)}
          {field('company', 'Company', <input autoComplete="off" />)}
          {field('value', 'Deal value (USD)', <input inputMode="numeric" />)}
          {field('owner', 'Owner', <select><option value="">Choose…</option>{OWNERS.map(o => <option key={o}>{o}</option>)}</select>)}
          {field('source', 'Source', <select><option value="">Choose…</option>{SOURCES.map(o => <option key={o}>{o}</option>)}</select>)}
          {field('nextStep', 'Next step (optional)', <input />)}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => nav(-1)}>Cancel</button>
          <button type="submit" className="btn primary">Add lead</button>
        </div>
      </form>
    </>
  )
}
