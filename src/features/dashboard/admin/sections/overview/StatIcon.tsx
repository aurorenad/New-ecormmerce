import type { ReactElement } from 'react'

export type StatIconType = 'people' | 'package' | 'tool' | 'finance' | 'dollar' | 'loans'

interface StatIconProps {
  type: StatIconType
}

const ICON_PATHS: Record<StatIconType, ReactElement> = {
  people:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  package: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
  tool:    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  finance: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  dollar:  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  loans:   <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /><circle cx="12" cy="12" r="10" strokeOpacity="0.15" /></>,
}

const ICON_COLORS: Record<StatIconType, { bg: string; fg: string }> = {
  people:  { bg: 'rgba(2,92,80,0.1)',     fg: '#025c50' },
  package: { bg: 'rgba(240,171,60,0.12)', fg: '#b45309' },
  tool:    { bg: 'rgba(59,130,246,0.1)',  fg: '#1d4ed8' },
  finance: { bg: 'rgba(139,92,246,0.1)',  fg: '#6d28d9' },
  dollar:  { bg: 'rgba(34,197,94,0.1)',   fg: '#15803d' },
  loans:   { bg: 'rgba(6,182,212,0.1)',   fg: '#0e7490' },
}

export default function StatIcon({ type }: StatIconProps) {
  const c = ICON_COLORS[type] ?? ICON_COLORS.dollar
  return (
    <span className="ov-kpi-icon" style={{ background: c.bg, color: c.fg }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {ICON_PATHS[type] ?? ICON_PATHS.dollar}
      </svg>
    </span>
  )
}
