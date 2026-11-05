import type { Lead } from '../types'

// Fictitious companies and people; any resemblance is coincidental.
const rows: [string, string, number, Lead['stage'], Lead['owner'], Lead['source'], string, string][] = [
  ['Marina Duarte', 'Lumen Studio', 4200, 'new', 'Ana Ribeiro', 'Website', '2026-10-28', 'Send intro deck'],
  ['Rafael Nunes', 'Pátio Coffee Co.', 1800, 'new', 'Bruno Costa', 'Referral', '2026-10-30', 'First call on Monday'],
  ['Helena Prado', 'Northwind Clinics', 12500, 'new', 'Carla Mendes', 'Event', '2026-11-01', 'Qualify budget'],
  ['Tomás Vieira', 'Ferro & Filho', 3100, 'contacted', 'Diego Alves', 'Outbound', '2026-10-21', 'Follow up by phone'],
  ['Júlia Castro', 'Verde Market', 6800, 'contacted', 'Ana Ribeiro', 'LinkedIn', '2026-10-18', 'Book a demo'],
  ['Lucas Moreira', 'Atlas Logistics', 21000, 'contacted', 'Carla Mendes', 'Referral', '2026-10-15', 'Map decision makers'],
  ['Beatriz Lima', 'Casa Aurora', 2600, 'proposal', 'Bruno Costa', 'Website', '2026-10-09', 'Proposal sent, await reply'],
  ['Pedro Santos', 'Orbit Fitness', 9400, 'proposal', 'Diego Alves', 'Event', '2026-10-06', 'Review scope with ops'],
  ['Camila Rocha', 'Sal & Pimenta', 3900, 'proposal', 'Ana Ribeiro', 'LinkedIn', '2026-10-11', 'Adjust pricing tier'],
  ['André Farias', 'Quanta Labs', 18000, 'negotiation', 'Carla Mendes', 'Outbound', '2026-09-29', 'Legal review of contract'],
  ['Sofia Martins', 'Bloom Florals', 2200, 'negotiation', 'Bruno Costa', 'Referral', '2026-10-02', 'Agree on start date'],
  ['Gabriel Teixeira', 'Ponto Print', 5400, 'won', 'Diego Alves', 'Website', '2026-09-20', 'Kickoff scheduled'],
  ['Larissa Gomes', 'Trilha Travel', 7600, 'won', 'Ana Ribeiro', 'Event', '2026-09-12', 'Onboarding call'],
  ['Felipe Araújo', 'Maré Surf Shop', 1500, 'won', 'Bruno Costa', 'LinkedIn', '2026-09-25', 'Send invoice'],
  ['Isabela Cunha', 'Nimbus Cloud', 14000, 'lost', 'Carla Mendes', 'Outbound', '2026-09-08', 'Chose in-house team'],
  ['Mateus Barros', 'Gira Bikes', 2900, 'lost', 'Diego Alves', 'Website', '2026-09-16', 'Budget frozen until Q1'],
]

export function seedLeads(): Lead[] {
  return rows.map(([name, company, value, stage, owner, source, createdAt, nextStep], i) => ({
    id: `L${String(i + 1).padStart(3, '0')}`,
    name, company, value, stage, owner, source, createdAt, nextStep,
    notes: i % 3 === 0 ? [{ id: `N${i}`, at: `${createdAt}T14:00:00`, text: `Lead created from ${source.toLowerCase()}.` }] : [],
  }))
}
