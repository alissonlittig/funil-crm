import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { seedLeads } from './lib/seed'
import type { Lead, LeadInput, Stage } from './types'

const KEY = 'funil:v1'

export type Action =
  | { type: 'move'; id: string; stage: Stage }
  | { type: 'add'; lead: LeadInput; id: string; today: string }
  | { type: 'note'; id: string; text: string; at: string }
  | { type: 'nextStep'; id: string; text: string }
  | { type: 'reset' }

export function reducer(state: Lead[], a: Action): Lead[] {
  switch (a.type) {
    case 'move': {
      const lead = state.find(l => l.id === a.id)
      if (!lead || lead.stage === a.stage) return state
      // moved card goes to the top of its new column
      return [{ ...lead, stage: a.stage }, ...state.filter(l => l.id !== a.id)]
    }
    case 'add':
      return [{ ...a.lead, id: a.id, stage: 'new', createdAt: a.today, notes: [] }, ...state]
    case 'note':
      return state.map(l => l.id === a.id
        ? { ...l, notes: [{ id: `N${l.id}-${l.notes.length + 1}`, at: a.at, text: a.text }, ...l.notes] }
        : l)
    case 'nextStep':
      return state.map(l => (l.id === a.id ? { ...l, nextStep: a.text } : l))
    case 'reset':
      return seedLeads()
  }
}

function load(): Lead[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (Array.isArray(parsed)) return parsed
  } catch { /* corrupted or blocked storage: fall back to demo data */ }
  return seedLeads()
}

const Ctx = createContext<{ leads: Lead[]; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(leads)) } catch { /* storage blocked: state stays in memory */ }
  }, [leads])
  return <Ctx.Provider value={{ leads, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside <StoreProvider>')
  return v
}
