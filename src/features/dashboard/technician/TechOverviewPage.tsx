import { useMemo, useState } from 'react'
import { TECHNICIAN_PROFILE } from '../../../data/mockData'
import DonutChart from '../shared/components/DonutChart'
import { IconArrow } from './TechIcons'
import { deviceIcon, dueInfo } from './techHelpers'
import type { RepairTicket } from './techHelpers'

interface Props {
  tickets: RepairTicket[]
  onGoToDevices: () => void
  onViewDevice: (id: string) => void
}

export default function TechOverviewPage({ tickets, onGoToDevices, onViewDevice }: Props) {
  const [showNotifPanel, setShowNotifPanel] = useState(false)

  const stats = useMemo(() => ({
    total:   tickets.length,
    active:  tickets.filter((t) => t.status === 'In Progress').length,
    done:    tickets.filter((t) => t.status === 'Completed').length,
    urgent:  tickets.filter((t) => t.priority === 'Urgent').length,
    pending: tickets.filter((t) => t.status === 'Pending').length,
  }), [tickets])

  const urgentTickets = useMemo(() =>
    tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed')
  , [tickets])

  const statusData = useMemo(() => [
    { label: 'Pending',        value: tickets.filter(t => t.status === 'Pending').length,        color: '#f59e0b' },
    { label: 'In Progress',    value: tickets.filter(t => t.status === 'In Progress').length,    color: '#3b82f6' },
    { label: 'Awaiting Parts', value: tickets.filter(t => t.status === 'Awaiting Parts').length, color: '#8b5cf6' },
    { label: 'Completed',      value: tickets.filter(t => t.status === 'Completed').length,      color: '#10b981' },
  ], [tickets])

  return (
    <div className="tw-page-wrap">
      <div className="tw-page-header tw-page-header--actions">
        <div>
          <h1 className="tw-page-title">Technician Dashboard</h1>
          <p className="tw-page-sub">Welcome back, {TECHNICIAN_PROFILE.name}. Here&apos;s your repair overview.</p>
        </div>
        <div className="tw-header-btns">
          <div className="tw-notif-wrap">
            <button type="button"
              className={`tw-urgent-alert-btn ${urgentTickets.length > 0 ? 'tw-urgent-alert-btn--active' : ''}`}
              onClick={() => setShowNotifPanel((v) => !v)}>
              {urgentTickets.length > 0 && <span className="tw-urgent-alert-pulse" />}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="tw-urgent-alert-label">
                {urgentTickets.length > 0 ? `${urgentTickets.length} Urgent` : 'No Alerts'}
              </span>
            </button>
            {showNotifPanel && (
              <div className="tw-notif-panel">
                <div className="tw-notif-panel-header">
                  <span>Urgent Tasks</span>
                  <button type="button" className="tw-notif-close" onClick={() => setShowNotifPanel(false)}>✕</button>
                </div>
                {urgentTickets.length === 0
                  ? <p className="tw-notif-empty">No urgent tasks right now.</p>
                  : urgentTickets.map((t) => {
                    const due = dueInfo(t.dueAt)
                    return (
                      <div key={t.id} className="tw-notif-item">
                        <span className="tw-dev-icon">{deviceIcon(t.device)}</span>
                        <div className="tw-notif-item-body">
                          <p className="tw-notif-device">{t.device}</p>
                          <p className="tw-notif-fault">{t.fault}</p>
                          {due && <span className={`tw-due tw-due--${due.cls}`}>{due.label}</span>}
                        </div>
                        <button type="button" className="tw-notif-view"
                          onClick={() => { setShowNotifPanel(false); onViewDevice(t.id) }}>
                          View →
                        </button>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tw-kpi-grid">
        <article className="tw-kpi-card tw-kpi--teal">
          <p className="tw-kpi-label">📋 Total Assigned</p>
          <p className="tw-kpi-value">{stats.total}</p>
          <p className="tw-kpi-hint">Today: +2 new</p>
        </article>
        <article className="tw-kpi-card tw-kpi--blue">
          <p className="tw-kpi-label">🔧 In Progress</p>
          <p className="tw-kpi-value">{stats.active}</p>
          <p className="tw-kpi-hint">Avg time: 45 min</p>
        </article>
        <article className="tw-kpi-card tw-kpi--green">
          <p className="tw-kpi-label">✅ Completed</p>
          <p className="tw-kpi-value">{stats.done}</p>
          <p className="tw-kpi-hint">Goal: 6 / day</p>
        </article>
        <article className="tw-kpi-card tw-kpi--red">
          <p className="tw-kpi-label">🔴 Urgent</p>
          <p className="tw-kpi-value">{stats.urgent}</p>
          <p className={`tw-kpi-hint${stats.urgent > 0 ? ' tw-kpi-hint--danger' : ''}`}>
            {stats.urgent > 0 ? '⚠ Needs immediate action' : 'All clear'}
          </p>
        </article>
      </div>

      <section className="tw-card">
        <h2 className="tw-card-title">Quick Summary</h2>
        <div className="tw-ov-donut-wrap">
          <DonutChart data={statusData} size={170} centerLabel={String(stats.total)} centerSub="tickets" />
          <div className="tw-ov-legend">
            {statusData.map((item) => (
              <div key={item.label} className="tw-ov-legend-item">
                <span className="tw-ov-legend-dot" style={{ background: item.color }} />
                <span className="tw-ov-legend-label">{item.label}</span>
                <span className="tw-ov-legend-count">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="tw-ghost-btn" onClick={onGoToDevices}>
          View all devices <IconArrow />
        </button>
      </section>
    </div>
  )
}
