import { useState } from 'react'
import { initials } from '../lib/leads'
import { STAGE_LABEL, type Stage } from '../types'

const paths = {
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  left: 'm15 18-6-6 6-6',
  right: 'm9 18 6-6-6-6',
  plus: 'M12 5v14M5 12h14',
  search: 'm21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z',
  back: 'M19 12H5m7 7-7-7 7-7',
}

export function Icon({ name, size = 18 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  )
}

export function Avatar({ name }: { name: string }) {
  const hue = [...name].reduce((h, c) => h + c.charCodeAt(0), 0) % 360
  return <span className="avatar" style={{ '--h': hue } as React.CSSProperties} title={name}>{initials(name)}</span>
}

export function StageBadge({ stage }: { stage: Stage }) {
  return <span className={`stage-badge s-${stage}`}><i aria-hidden="true" />{STAGE_LABEL[stage]}</span>
}

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('funil:theme', next) } catch { /* private mode: theme just won't persist */ }
    setDark(!dark)
  }
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-pressed={dark} aria-label="Dark mode">
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  )
}
