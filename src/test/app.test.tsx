import { createEvent, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { StoreProvider } from '../store'

const renderAt = (path = '/') => render(
  <StoreProvider><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></StoreProvider>,
)
const column = (name: string) => screen.getByRole('region', { name })

describe('pipeline board', () => {
  it('renders the six stages with their leads', () => {
    renderAt()
    for (const s of ['New', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost']) expect(column(s)).toBeInTheDocument()
    expect(within(column('New')).getByText('Lumen Studio')).toBeInTheDocument()
  })

  it('moves a lead with the keyboard-accessible buttons and announces it', async () => {
    renderAt()
    await userEvent.click(screen.getByRole('button', { name: 'Move Lumen Studio to Contacted' }))
    expect(within(column('Contacted')).getByText('Lumen Studio')).toBeInTheDocument()
    expect(within(column('New')).queryByText('Lumen Studio')).not.toBeInTheDocument()
    expect(screen.getByText('Lumen Studio moved to Contacted.')).toBeInTheDocument()
  })

  it('moves a lead with drag and drop', () => {
    renderAt()
    const data = new Map<string, string>()
    const dataTransfer = { setData: (k: string, v: string) => data.set(k, v), getData: (k: string) => data.get(k) ?? '', dropEffect: '', effectAllowed: '' }
    const card = within(column('New')).getByText('Lumen Studio').closest('li')!
    fireEvent.dragStart(card, { dataTransfer })
    const drop = createEvent.drop(column('Won'))
    Object.defineProperty(drop, 'dataTransfer', { value: dataTransfer })
    fireEvent(column('Won'), drop)
    expect(within(column('Won')).getByText('Lumen Studio')).toBeInTheDocument()
  })

  it('filters by owner and clears filters', async () => {
    renderAt()
    await userEvent.selectOptions(screen.getByLabelText('Owner'), 'Bruno Costa')
    expect(screen.queryByText('Lumen Studio')).not.toBeInTheDocument()
    expect(screen.getByText('Pátio Coffee Co.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Lumen Studio')).toBeInTheDocument()
  })
})

describe('lead flow', () => {
  it('shows errors, then adds a valid lead to the New column', async () => {
    renderAt('/new')
    await userEvent.click(screen.getByRole('button', { name: 'Add lead' }))
    expect(screen.getByText('Enter the contact name.')).toBeInTheDocument()
    expect(screen.getByLabelText('Contact name')).toHaveFocus()

    await userEvent.type(screen.getByLabelText('Contact name'), 'Nina Torres')
    await userEvent.type(screen.getByLabelText('Company'), 'Ateliê Nove')
    await userEvent.type(screen.getByLabelText('Deal value (USD)'), '4800')
    await userEvent.selectOptions(screen.getByLabelText('Owner'), 'Carla Mendes')
    await userEvent.selectOptions(screen.getByLabelText('Source'), 'Referral')
    await userEvent.click(screen.getByRole('button', { name: 'Add lead' }))
    expect(within(column('New')).getByText('Ateliê Nove')).toBeInTheDocument()
  })

  it('adds a note on the lead page and keeps it after a remount', async () => {
    const { unmount } = renderAt('/leads/L002')
    expect(screen.getByRole('heading', { level: 1, name: 'Rafael Nunes' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Save note' }))
    expect(screen.getByText('Write something before saving.')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Add a note'), 'Asked for a pilot')
    await userEvent.click(screen.getByRole('button', { name: 'Save note' }))
    expect(screen.getByText('Asked for a pilot')).toBeInTheDocument()
    unmount()
    renderAt('/leads/L002')
    expect(screen.getByText('Asked for a pilot')).toBeInTheDocument()
  })

  it('sorts the leads table by value', async () => {
    renderAt('/leads')
    const firstCompany = () => within(screen.getAllByRole('row')[1]).getByRole('link').querySelector('strong')!.textContent
    expect(firstCompany()).toBe('Atlas Logistics')
    await userEvent.click(screen.getByRole('button', { name: /Value/ }))
    expect(firstCompany()).toBe('Maré Surf Shop')
  })

  it('shows a not-found state for unknown leads', () => {
    renderAt('/leads/nope')
    expect(screen.getByRole('heading', { name: 'Lead not found' })).toBeInTheDocument()
  })
})
