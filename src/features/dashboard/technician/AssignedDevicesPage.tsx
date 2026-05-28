import { useMemo, useState } from 'react'
import { REPAIR_TICKETS_SEED } from '../../../data/mockData'
import { deviceIcon, dueInfo, priorityClass, progressClass, statusPillClass, twRelTime, TW_NOW } from './techHelpers'
import type { RepairTicket } from './techHelpers'
import { SeverityBadge } from './TechIcons'

interface Props {
  tickets: RepairTicket[]
  onViewDevice: (id: string) => void
  onUpdateStatus: (id: string, status: string) => void
}

function ActionButtons({ t, onUpdateStatus, onViewDevice }: { t: RepairTicket; onUpdateStatus: Props['onUpdateStatus']; onViewDevice: Props['onViewDevice'] }) {
  return (
    <div className="tw-row-actions">
      {t.status === 'Pending' && (
        <button type="button" className="tw-act-btn tw-act-btn--start"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'In Progress') }}>🔧 Start</button>
      )}
      {t.status === 'In Progress' && (
        <button type="button" className="tw-act-btn tw-act-btn--resume"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'In Progress') }}>⏩ Resume</button>
      )}
      {(t.status === 'In Progress' || t.status === 'Awaiting Parts') && (
        <button type="button" className="tw-act-btn tw-act-btn--complete"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'Completed') }}>✅</button>
      )}
      <button type="button" className="tw-act-btn tw-act-btn--view"
        onClick={(e) => { e.stopPropagation(); onViewDevice(t.id) }}>View</button>
    </div>
  )
}

export default function AssignedDevicesPage({ tickets, onViewDevice, onUpdateStatus }: Props) {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatus]     = useState('all')
  const [typeFilter, setType]         = useState('all')
  const [quickFilter, setQuickFilter] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set(REPAIR_TICKETS_SEED.map((t) => {
      if (t.device.toLowerCase().includes('macbook') || t.device.toLowerCase().includes('laptop')) return 'Laptop'
      if (t.device.toLowerCase().includes('ipad') || t.device.toLowerCase().includes('tab')) return 'Tablet'
      return 'Smartphone'
    }))
    return ['all', ...set]
  }, [])

  const filtered = useMemo(() => {
    let list = [...tickets]
    if (quickFilter === 'urgent')      list = list.filter((t) => t.priority === 'Urgent')
    else if (quickFilter === 'active') list = list.filter((t) => t.status === 'In Progress')
    else if (quickFilter === 'parts')  list = list.filter((t) => t.status === 'Awaiting Parts')
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((t) => t.device.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.fault.toLowerCase().includes(q))
    if (statusFilter !== 'all') list = list.filter((t) => t.status.toLowerCase().replace(/\s+/g, '-') === statusFilter)
    if (typeFilter !== 'all') list = list.filter((t) => {
      const lc = t.device.toLowerCase()
      if (typeFilter === 'Laptop') return lc.includes('macbook') || lc.includes('laptop')
      if (typeFilter === 'Tablet') return lc.includes('ipad') || lc.includes('tab')
      return !lc.includes('macbook') && !lc.includes('ipad')
    })
    list.sort((a, b) => ({ Urgent: 0, Standard: 1, Low: 2 } as Record<string, number>)[a.priority] - ({ Urgent: 0, Standard: 1, Low: 2 } as Record<string, number>)[b.priority])
    return list
  }, [tickets, search, statusFilter, typeFilter, quickFilter])

  const summary = useMemo(() => ({
    total: tickets.length,
    urgent: tickets.filter((t) => t.priority === 'Urgent').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    overdue: tickets.filter((t) => t.dueAt != null && new Date(t.dueAt) < TW_NOW).length,
  }), [tickets])

  const rowClass = (t: RepairTicket) => {
    if (t.priority === 'Urgent')        return 'tw-ad-row tw-ad-row--urgent'
    if (t.status  === 'In Progress')    return 'tw-ad-row tw-ad-row--active'
    if (t.status  === 'Awaiting Parts') return 'tw-ad-row tw-ad-row--parts'
    return 'tw-ad-row'
  }

  const progressLabel = (t: RepairTicket) => {
    if (t.status === 'Completed')      return 'Complete'
    if (t.status === 'Awaiting Parts') return `${t.progress}% — Waiting`
    if (t.status === 'In Progress')    return `${t.progress}% — Active`
    return `${t.progress}% — Not started`
  }

  return (
    <div className="tw-page-wrap">
      <div className="tw-page-header">
        <h1 className="tw-page-title">Assigned Devices</h1>
        <p className="tw-page-sub">Urgent tasks sorted to top. Click any row to open device details.</p>
      </div>
      <div className="tw-ad-summary">
        <span>Total: <strong>{summary.total}</strong></span>
        <span className={summary.urgent > 0 ? 'tw-sum--urgent' : ''}>Urgent: <strong>{summary.urgent}</strong></span>
        <span>In Progress: <strong>{summary.inProgress}</strong></span>
        {summary.overdue > 0 && <span className="tw-sum--overdue">🔴 Overdue: <strong>{summary.overdue}</strong></span>}
        <span className="tw-sum-showing">Showing {filtered.length} of {summary.total}</span>
      </div>
      <div className="tw-quick-filters">
        {[{ key: 'urgent', label: '🔴 Urgent Only' }, { key: 'active', label: '🔧 In Progress' }, { key: 'parts', label: '⏳ Awaiting Parts' }].map((f) => (
          <button key={f.key} type="button" className={`tw-qf-btn ${quickFilter === f.key ? 'tw-qf-btn--active' : ''}`}
            onClick={() => setQuickFilter(quickFilter === f.key ? null : f.key)}>{f.label}</button>
        ))}
        {quickFilter && <button type="button" className="fin-reset-btn" onClick={() => setQuickFilter(null)}>Clear</button>}
      </div>
      <div className="tw-filters-row">
        <div className="tw-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
          <input type="search" placeholder="Search device, ticket ID, or fault…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="select-wrap">
          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="awaiting-parts">Awaiting Parts</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="select-wrap">
          <select value={typeFilter} onChange={(e) => setType(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All device types' : c}</option>)}
          </select>
        </div>
      </div>
      <div className="tw-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="admin-table tw-ad-table">
            <thead><tr><th>Ticket ID</th><th>Device</th><th>Fault / Severity</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Due</th><th>Progress</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="table-empty">No devices match your search or filters.</td></tr>
              ) : filtered.map((t) => {
                const due = dueInfo(t.dueAt)
                return (
                  <tr key={t.id} className={rowClass(t)} onClick={() => onViewDevice(t.id)} style={{ cursor: 'pointer' }}>
                    <td className="cell-mono">{t.id}</td>
                    <td><span className="tw-device-cell"><span className="tw-dev-icon-sm">{deviceIcon(t.device)}</span><span className="cell-bold">{t.device}</span></span></td>
                    <td><p className="cell-muted tw-fault-line">{t.fault}</p>{t.severity && <SeverityBadge s={t.severity} />}</td>
                    <td><span className={priorityClass(t.priority)}>{t.priority}</span></td>
                    <td><span className={statusPillClass(t.status)}>{t.status}</span></td>
                    <td className="cell-muted tw-time-cell">{twRelTime(t.assignedAt)}</td>
                    <td>{due ? <span className={`tw-due tw-due--${due.cls}`}>{due.label}</span> : <span className="cell-muted">—</span>}</td>
                    <td>
                      <div className="tw-table-prog">
                        <div className={`progress tov-prog-bar ${progressClass(t.progress)}`} style={{ flex: 1 }}><div style={{ width: `${t.progress}%` }} /></div>
                        <span className="tw-prog-label">{progressLabel(t)}</span>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}><ActionButtons t={t} onUpdateStatus={onUpdateStatus} onViewDevice={onViewDevice} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
