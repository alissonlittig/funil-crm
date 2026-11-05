import { STAGES, type Lead, type LeadInput, type Stage } from '../types'

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')

export interface Filters { q: string; owner: string; source: string }

export function filterLeads(leads: Lead[], f: Filters): Lead[] {
  const q = f.q.trim().toLowerCase()
  return leads.filter(l =>
    (!q || `${l.name} ${l.company} ${l.nextStep}`.toLowerCase().includes(q)) &&
    (!f.owner || l.owner === f.owner) &&
    (!f.source || l.source === f.source))
}

export function groupByStage(leads: Lead[]): Record<Stage, Lead[]> {
  const out = Object.fromEntries(STAGES.map(s => [s, [] as Lead[]])) as Record<Stage, Lead[]>
  for (const l of leads) out[l.stage].push(l)
  return out
}

export const sum = (leads: Lead[]) => leads.reduce((t, l) => t + l.value, 0)

export function summary(leads: Lead[]) {
  const g = groupByStage(leads)
  const open = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost')
  const closed = g.won.length + g.lost.length
  return {
    openValue: sum(open),
    openCount: open.length,
    wonValue: sum(g.won),
    winRate: closed ? g.won.length / closed : 0,
    avgDeal: g.won.length ? sum(g.won) / g.won.length : 0,
  }
}

/** Next/previous stage in pipeline order, or null at the edges. */
export function shiftStage(stage: Stage, dir: -1 | 1): Stage | null {
  return STAGES[STAGES.indexOf(stage) + dir] ?? null
}

export type LeadForm = Record<keyof LeadInput, string>

export function validateLead(input: LeadForm) {
  const errors: Partial<LeadForm> = {}
  if (!input.name.trim()) errors.name = 'Enter the contact name.'
  if (!input.company.trim()) errors.company = 'Enter the company.'
  const v = Number(input.value)
  if (!input.value.trim() || !Number.isFinite(v) || v <= 0) errors.value = 'Enter a deal value above zero.'
  else if (v > 10_000_000) errors.value = 'Deal value looks too high.'
  if (!input.owner) errors.owner = 'Choose an owner.'
  if (!input.source) errors.source = 'Choose a source.'
  return errors
}
