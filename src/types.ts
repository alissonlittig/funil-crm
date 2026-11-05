export const STAGES = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] as const
export type Stage = (typeof STAGES)[number]

export const STAGE_LABEL: Record<Stage, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
}

export const OWNERS = ['Ana Ribeiro', 'Bruno Costa', 'Carla Mendes', 'Diego Alves'] as const
export const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Event', 'Outbound'] as const
export type Owner = (typeof OWNERS)[number]
export type Source = (typeof SOURCES)[number]

export interface Note { id: string; at: string; text: string }

export interface Lead {
  id: string
  name: string
  company: string
  value: number
  stage: Stage
  owner: Owner
  source: Source
  createdAt: string
  nextStep: string
  notes: Note[]
}

export type LeadInput = Pick<Lead, 'name' | 'company' | 'value' | 'owner' | 'source' | 'nextStep'>
