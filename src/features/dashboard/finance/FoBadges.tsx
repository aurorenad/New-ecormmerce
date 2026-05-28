import type { ReactNode } from 'react'
import type { FoKpiStat } from './foHelpers'

const STATUS_MAP: Record<string, string> = {
  Pending: 'fo-badge-pending', 'Under Review': 'fo-badge-review',
  Approved: 'fo-badge-approved', Rejected: 'fo-badge-rejected',
  Active: 'fo-badge-approved', Current: 'fo-badge-approved',
  Settled: 'fo-badge-settled', Delinquent: 'fo-badge-rejected',
  'Due Soon': 'fo-badge-pending', Overdue: 'fo-badge-rejected',
}

const RISK_MAP: Record<string, string> = {
  Low: 'fo-risk-low', Medium: 'fo-risk-medium', High: 'fo-risk-high', Critical: 'fo-risk-critical',
}

const KPI_ICONS: Record<string, ReactNode> = {
  stack:  <path d="M2 20h20M2 15h20M5 10h14a2 2 0 0 0 0-4H5a2 2 0 0 0 0 4zM5 6V4M19 6V4" />,
  pulse:  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  clock:  <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  alert:  <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>,
  dollar: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`fo-badge ${STATUS_MAP[status] ?? 'fo-badge-pending'}`}>{status}</span>
}

export function RiskBadge({ level }: { level: string }) {
  return <span className={`fo-risk-badge ${RISK_MAP[level] ?? 'fo-risk-medium'}`}>{level}</span>
}

export function FoKpiCard({ stat }: { stat: FoKpiStat }) {
  return (
    <article className="fo-kpi-card">
      <div className="fo-kpi-top">
        <span className="fo-kpi-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {KPI_ICONS[stat.icon]}
          </svg>
        </span>
        <span className={`fo-kpi-trend ${stat.trend}`}>
          {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
        </span>
      </div>
      <p className="fo-kpi-label">{stat.label}</p>
      <p className="fo-kpi-value">{stat.value}</p>
    </article>
  )
}
