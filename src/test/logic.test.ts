import { filterLeads, groupByStage, initials, shiftStage, summary, validateLead } from '../lib/leads'
import { seedLeads } from '../lib/seed'
import { reducer } from '../store'

const leads = seedLeads()

describe('lead helpers', () => {
  it('filters by text, owner and source together', () => {
    expect(filterLeads(leads, { q: 'atlas', owner: '', source: '' }).map(l => l.company)).toEqual(['Atlas Logistics'])
    const ana = filterLeads(leads, { q: '', owner: 'Ana Ribeiro', source: 'LinkedIn' })
    expect(ana.length).toBeGreaterThan(0)
    expect(ana.every(l => l.owner === 'Ana Ribeiro' && l.source === 'LinkedIn')).toBe(true)
  })

  it('groups every lead into exactly one stage', () => {
    const g = groupByStage(leads)
    expect(Object.values(g).flat()).toHaveLength(leads.length)
  })

  it('computes win rate only from closed deals', () => {
    const s = summary(leads)
    expect(s.winRate).toBeCloseTo(3 / 5)
    expect(s.wonValue).toBe(5400 + 7600 + 1500)
    expect(summary([]).winRate).toBe(0)
  })

  it('shifts stages and stops at the edges', () => {
    expect(shiftStage('new', 1)).toBe('contacted')
    expect(shiftStage('new', -1)).toBeNull()
    expect(shiftStage('lost', 1)).toBeNull()
  })

  it('validates the new lead form', () => {
    const e = validateLead({ name: ' ', company: 'X', value: '-3', owner: '', source: 'Website', nextStep: '' })
    expect(Object.keys(e).sort()).toEqual(['name', 'owner', 'value'])
    expect(validateLead({ name: 'A', company: 'B', value: '1200', owner: 'Ana Ribeiro', source: 'Event', nextStep: '' })).toEqual({})
  })

  it('makes initials', () => expect(initials('Ana  Ribeiro')).toBe('AR'))
})

describe('reducer', () => {
  it('moves a lead and puts it first', () => {
    const next = reducer(leads, { type: 'move', id: 'L016', stage: 'new' })
    expect(next[0]).toMatchObject({ id: 'L016', stage: 'new' })
    expect(next).toHaveLength(leads.length)
  })
  it('ignores a move to the same stage', () => {
    expect(reducer(leads, { type: 'move', id: 'L001', stage: 'new' })).toBe(leads)
  })
  it('adds notes newest first', () => {
    let s = reducer(leads, { type: 'note', id: 'L002', text: 'one', at: '2026-11-01T10:00:00Z' })
    s = reducer(s, { type: 'note', id: 'L002', text: 'two', at: '2026-11-02T10:00:00Z' })
    expect(s.find(l => l.id === 'L002')!.notes.map(n => n.text)).toEqual(['two', 'one'])
  })
})
