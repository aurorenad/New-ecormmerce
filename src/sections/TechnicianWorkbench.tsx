// @ts-nocheck
import { useMemo, useRef, useState } from 'react'
import {
  REPAIR_TICKETS_SEED,
  TECH_PARTS_SEED,
  TECHNICIAN_PROFILE,
  TECH_PERF_STATS,
  TECH_ACTIVITY_SEED,
} from '../data/mockData'
import DashboardActions from '../components/DashboardActions'

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Awaiting Parts', 'Completed']

const TW_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'devices',  label: 'Assigned Devices' },
  { id: 'profile',  label: 'Profile' },
]

// ── Icons ──────────────────────────────────────────────────
function IconHome() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
}
function IconList() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="5" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="17" width="18" height="2" rx="1"/></svg>
}
function IconDetail() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
}
function IconUser() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconCheck() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><polyline points="20 6 9 17 4 12"/></svg>
}
function IconCamera() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
}
function IconBox() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}
function IconArrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}
function IconBack() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
}
function IconEdit() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}

function NavIcon({ id }) {
  if (id === 'overview') return <IconHome />
  if (id === 'devices')  return <IconList />
  if (id === 'details')  return <IconDetail />
  return <IconUser />
}

// ── Helpers ────────────────────────────────────────────────
const TW_NOW = new Date('2026-05-25T11:00:00')

function cloneTickets() {
  return REPAIR_TICKETS_SEED.map((t) => ({
    ...t,
    parts: t.parts.map((p) => ({ ...p })),
    faultNotes: [],
  }))
}

function statusPillClass(s) {
  return `tech-status tech-status--${s.toLowerCase().replace(/\s+/g, '-')}`
}

function progressClass(pct) {
  if (pct >= 70) return 'tov-prog--high'
  if (pct >= 30) return 'tov-prog--mid'
  return 'tov-prog--low'
}

function priorityClass(p) {
  if (p === 'Urgent') return 'tov-priority tov-priority--urgent'
  if (p === 'Low')    return 'tov-priority tov-priority--low'
  return 'tov-priority tov-priority--standard'
}

function deviceIcon(device) {
  const lc = device.toLowerCase()
  if (lc.includes('macbook') || lc.includes('laptop')) return '💻'
  if (lc.includes('ipad')   || lc.includes('tab'))    return '📟'
  return '📱'
}

function twRelTime(isoStr) {
  if (!isoStr) return '—'
  const then = new Date(isoStr)
  const mins = Math.floor((TW_NOW - then) / 60000)
  const hrs  = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

function dueInfo(dueIso) {
  if (!dueIso) return null
  const due     = new Date(dueIso)
  const diffMs  = due - TW_NOW
  const diffMin = Math.floor(Math.abs(diffMs) / 60000)
  const diffHrs = Math.floor(diffMin / 60)
  if (diffMs < 0) {
    const label = diffHrs > 0 ? `Overdue ${diffHrs}h` : `Overdue ${diffMin}m`
    return { label, cls: 'due-overdue' }
  }
  if (diffMin < 60)  return { label: `Due in ${diffMin}m`, cls: 'due-soon' }
  if (diffHrs < 24)  return { label: `Due in ${diffHrs}h`, cls: 'due-today' }
  return { label: `Due tomorrow`, cls: 'due-ok' }
}

function severityBadge(s) {
  if (s === 'Critical') return <span className="tw-sev tw-sev--critical">🔴 Critical</span>
  if (s === 'Medium')   return <span className="tw-sev tw-sev--medium">🟡 Medium</span>
  return <span className="tw-sev tw-sev--minor">🟢 Minor</span>
}

function actionButton(t, onUpdateStatus, onViewDevice) {
  return (
    <div className="tw-row-actions">
      {t.status === 'Pending' && (
        <button type="button" className="tw-act-btn tw-act-btn--start"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'In Progress') }}>
          🔧 Start
        </button>
      )}
      {t.status === 'In Progress' && (
        <button type="button" className="tw-act-btn tw-act-btn--resume"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'In Progress') }}>
          ⏩ Resume
        </button>
      )}
      {(t.status === 'In Progress' || t.status === 'Awaiting Parts') && (
        <button type="button" className="tw-act-btn tw-act-btn--complete"
          onClick={(e) => { e.stopPropagation(); onUpdateStatus(t.id, 'Completed') }}>
          ✅
        </button>
      )}
      <button type="button" className="tw-act-btn tw-act-btn--view"
        onClick={(e) => { e.stopPropagation(); onViewDevice(t.id) }}>
        View
      </button>
    </div>
  )
}

// ── DonutChart ─────────────────────────────────────────────
function DonutChart({ data, size = 180, centerLabel, centerSub }) {
  const cx = size / 2, cy = size / 2
  const r = (size - 44) / 2
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)

  if (total === 0) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="22"
                transform={`rotate(-90, ${cx}, ${cy})`} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="inherit">
          No data
        </text>
      </svg>
    )
  }

  const segments = []
  let acc = 0
  for (const d of data.filter(d => d.value > 0)) {
    const len = (d.value / total) * circ
    segments.push({
      color: d.color,
      dashArray: `${len} ${circ - len}`,
      dashOffset: circ - acc,
    })
    acc += len
  }

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="22"
              transform={`rotate(-90, ${cx}, ${cy})`} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="22"
          strokeDasharray={seg.dashArray}
          strokeDashoffset={seg.dashOffset}
          transform={`rotate(-90, ${cx}, ${cy})`}
        />
      ))}
      {centerLabel !== undefined && (
        <>
          <text x={cx} y={cy - 3} textAnchor="middle" fontSize="22" fontWeight="800"
                fill="#0f172a" fontFamily="inherit" dominantBaseline="middle">
            {centerLabel}
          </text>
          {centerSub && (
            <text x={cx} y={cy + 17} textAnchor="middle" fontSize="11"
                  fill="#94a3b8" fontFamily="inherit">
              {centerSub}
            </text>
          )}
        </>
      )}
    </svg>
  )
}

// ── RingChart (single percentage) ─────────────────────────
function RingChart({ value, size = 160, color = '#10b981', label = 'score' }) {
  const cx = size / 2, cy = size / 2
  const r = size / 2 - 22
  const circ = 2 * Math.PI * r
  const dashLen = (value / 100) * circ

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18"
              transform={`rotate(-90, ${cx}, ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="18"
              strokeDasharray={`${dashLen} ${circ - dashLen}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(-90, ${cx}, ${cy})`} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="28" fontWeight="800"
            fill="#0f172a" fontFamily="inherit" dominantBaseline="middle">
        {value}%
      </text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize="11"
            fill="#94a3b8" fontFamily="inherit">
        {label}
      </text>
    </svg>
  )
}

// ── 1. OVERVIEW PAGE ──────────────────────────────────────
function OverviewPage({ tickets, onGoToDevices, onViewDevice, onUpdateStatus }) {
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
    { label: 'Pending',        value: tickets.filter(t => t.status === 'Pending').length,        color: '#f59e0b', est: '~3h work remaining' },
    { label: 'In Progress',    value: tickets.filter(t => t.status === 'In Progress').length,    color: '#3b82f6', est: '~2h to complete'    },
    { label: 'Awaiting Parts', value: tickets.filter(t => t.status === 'Awaiting Parts').length, color: '#8b5cf6', est: 'Blocked on parts'   },
    { label: 'Completed',      value: tickets.filter(t => t.status === 'Completed').length,      color: '#10b981', est: 'Done'               },
  ], [tickets])

  return (
    <div className="tw-page-wrap">

      {/* ── Header with action buttons ─────────────────────────── */}
      <div className="tw-page-header tw-page-header--actions">
        <div>
          <h1 className="tw-page-title">Technician Dashboard</h1>
          <p className="tw-page-sub">Welcome back, {TECHNICIAN_PROFILE.name}. Here&apos;s your repair overview.</p>
        </div>
        <div className="tw-header-btns">
          <div className="tw-notif-wrap">
            <button
              type="button"
              className={`tw-urgent-alert-btn ${urgentTickets.length > 0 ? 'tw-urgent-alert-btn--active' : ''}`}
              onClick={() => setShowNotifPanel((v) => !v)}
              aria-label="Urgent notifications"
            >
              {urgentTickets.length > 0 && <span className="tw-urgent-alert-pulse" />}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
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
                {urgentTickets.length === 0 ? (
                  <p className="tw-notif-empty">No urgent tasks right now.</p>
                ) : urgentTickets.map((t) => {
                  const due = dueInfo(t.dueAt)
                  return (
                    <div key={t.id} className="tw-notif-item">
                      <span className="tw-dev-icon">{deviceIcon(t.device)}</span>
                      <div className="tw-notif-item-body">
                        <p className="tw-notif-device">{t.device}</p>
                        <p className="tw-notif-fault">{t.fault}</p>
                        {due && <span className={`tw-due tw-due--${due.cls}`}>{due.label}</span>}
                      </div>
                      <button type="button" className="tw-notif-view" onClick={() => { setShowNotifPanel(false); onViewDevice(t.id) }}>
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

      {/* ── KPI Cards with context ─────────────────────────────── */}
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
          <p className="tw-kpi-hint tw-kpi-hint--danger">{stats.urgent > 0 ? '⚠ Needs immediate action' : 'All clear'}</p>
        </article>
      </div>

      <section className="tw-card">
        <h2 className="tw-card-title">Quick Summary</h2>
        <div className="tw-ov-donut-wrap">
          <DonutChart data={statusData} size={170} centerLabel={stats.total} centerSub="tickets" />
          <div className="tw-ov-legend">
            {statusData.map((item) => (
              <div key={item.label} className="tw-ov-legend-item" title={item.est}>
                <span className="tw-ov-legend-dot" style={{ background: item.color }} />
                <span className="tw-ov-legend-label">{item.label}</span>
                <span className="tw-ov-legend-count">{item.value}</span>
                {item.value > 0 && <span className="tw-ov-legend-est">{item.est}</span>}
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

// ── 2. ASSIGNED DEVICES PAGE ──────────────────────────────
function AssignedDevicesPage({ tickets, onViewDevice, onUpdateStatus }) {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatus]     = useState('all')
  const [typeFilter, setType]         = useState('all')
  const [quickFilter, setQuickFilter] = useState(null)

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

    list.sort((a, b) => {
      const pri = { Urgent: 0, Standard: 1, Low: 2 }
      return pri[a.priority] - pri[b.priority]
    })
    return list
  }, [tickets, search, statusFilter, typeFilter, quickFilter])

  const summary = useMemo(() => ({
    total:      tickets.length,
    urgent:     tickets.filter((t) => t.priority === 'Urgent').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    overdue:    tickets.filter((t) => t.dueAt && new Date(t.dueAt) < TW_NOW).length,
  }), [tickets])

  const progressLabel = (t) => {
    if (t.status === 'Completed')      return 'Complete'
    if (t.status === 'Awaiting Parts') return `${t.progress}% — Waiting on parts`
    if (t.status === 'In Progress')    return `${t.progress}% — In progress`
    return `${t.progress}% — Not started`
  }

  const rowClass = (t) => {
    if (t.priority === 'Urgent')          return 'tw-ad-row tw-ad-row--urgent'
    if (t.status  === 'In Progress')      return 'tw-ad-row tw-ad-row--active'
    if (t.status  === 'Awaiting Parts')   return 'tw-ad-row tw-ad-row--parts'
    return 'tw-ad-row'
  }

  return (
    <div className="tw-page-wrap">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="tw-page-header">
        <h1 className="tw-page-title">Assigned Devices</h1>
        <p className="tw-page-sub">Urgent tasks sorted to top. Click any row to open device details.</p>
      </div>

      {/* ── Summary bar ─────────────────────────────────────── */}
      <div className="tw-ad-summary">
        <span>Total: <strong>{summary.total}</strong></span>
        <span className={summary.urgent > 0 ? 'tw-sum--urgent' : ''}>Urgent: <strong>{summary.urgent}</strong></span>
        <span>In Progress: <strong>{summary.inProgress}</strong></span>
        {summary.overdue > 0 && (
          <span className="tw-sum--overdue">🔴 Overdue: <strong>{summary.overdue}</strong></span>
        )}
        <span className="tw-sum-showing">Showing {filtered.length} of {summary.total}</span>
      </div>

      {/* ── Quick filters ────────────────────────────────────── */}
      <div className="tw-quick-filters">
        {[
          { key: 'urgent', label: '🔴 Urgent Only' },
          { key: 'active', label: '🔧 In Progress' },
          { key: 'parts',  label: '⏳ Awaiting Parts' },
        ].map((f) => (
          <button key={f.key} type="button"
            className={`tw-qf-btn ${quickFilter === f.key ? 'tw-qf-btn--active' : ''}`}
            onClick={() => setQuickFilter(quickFilter === f.key ? null : f.key)}>
            {f.label}
          </button>
        ))}
        {quickFilter && (
          <button type="button" className="fin-reset-btn" onClick={() => setQuickFilter(null)}>Clear</button>
        )}
      </div>

      {/* ── Search + selects ─────────────────────────────────── */}
      <div className="tw-filters-row">
        <div className="tw-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
          </svg>
          <input type="search" placeholder="Search device, ticket ID, or fault…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="select-wrap">
          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="awaiting-parts">Awaiting Parts</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="select-wrap">
          <select value={typeFilter} onChange={(e) => setType(e.target.value)} aria-label="Filter by device type">
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All device types' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="tw-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="admin-table tw-ad-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Device</th>
                <th>Fault / Severity</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Due / Time</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="table-empty">No devices match your search or filters.</td></tr>
              ) : (
                filtered.map((t) => {
                  const due = dueInfo(t.dueAt)
                  return (
                    <tr key={t.id} className={rowClass(t)} onClick={() => onViewDevice(t.id)}
                      style={{ cursor: 'pointer' }}>
                      <td className="cell-mono">{t.id}</td>
                      <td>
                        <span className="tw-device-cell">
                          <span className="tw-dev-icon-sm">{deviceIcon(t.device)}</span>
                          <span className="cell-bold">{t.device}</span>
                        </span>
                      </td>
                      <td>
                        <p className="cell-muted tw-fault-line">{t.fault}</p>
                        {t.severity && severityBadge(t.severity)}
                      </td>
                      <td><span className={priorityClass(t.priority)}>{t.priority}</span></td>
                      <td><span className={statusPillClass(t.status)}>{t.status}</span></td>
                      <td className="cell-muted tw-time-cell">{twRelTime(t.assignedAt)}</td>
                      <td>{due ? <span className={`tw-due tw-due--${due.cls}`}>{due.label}</span> : <span className="cell-muted">—</span>}</td>
                      <td>
                        <div className="tw-table-prog">
                          <div className={`progress tov-prog-bar ${progressClass(t.progress)}`} style={{ flex: 1 }}>
                            <div style={{ width: `${t.progress}%` }} />
                          </div>
                          <span className="tw-prog-label">{progressLabel(t)}</span>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {actionButton(t, onUpdateStatus, onViewDevice)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── 3. DEVICE DETAILS PAGE ────────────────────────────────
function DeviceDetailsPage({
  ticket,
  onBack,
  onTogglePart,
  onUpdateStatus,
  onSubmitNote,
  onUpdateFault,
  faultDraft,
  setFaultDraft,
  savedStatus,
}) {
  const [editingFault, setEditingFault] = useState(false)
  const [faultEditText, setFaultEditText] = useState(ticket?.faultDetail ?? '')
  const [photos, setPhotos] = useState([null, null])
  const photoRefs = [useRef(null), useRef(null)]

  const handlePhotoChange = (idx, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotos((prev) => { const next = [...prev]; next[idx] = ev.target.result; return next })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  if (!ticket) {
    return (
      <div className="tw-page-wrap">
        <div className="tw-empty-state">
          <IconDetail />
          <h2>No device selected</h2>
          <p>Go to Assigned Devices and click a ticket to view its details here.</p>
          <button type="button" className="btn-table btn-table--primary" onClick={onBack}>
            Go to Assigned Devices
          </button>
        </div>
      </div>
    )
  }

  const doneParts = ticket.parts.filter((p) => p.done).length
  const isComplete = ticket.status === 'Completed'

  const handleSaveFault = () => {
    const text = faultEditText.trim()
    if (text) onUpdateFault(ticket.id, text)
    setEditingFault(false)
  }

  const handleCancelFault = () => {
    setFaultEditText(ticket.faultDetail)
    setEditingFault(false)
  }

  return (
    <div className="tw-page-wrap">
      {/* Breadcrumb */}
      <div className="tw-breadcrumb">
        <button type="button" className="tw-link-btn tw-bc-btn" onClick={onBack}>
          <IconBack /> Assigned Devices
        </button>
        <span className="tw-bc-sep">›</span>
        <span className="tw-bc-current">{ticket.device}</span>
      </div>

      {/* Device header banner */}
      <div className="tw-det-banner">
        <div className="tw-det-banner-left">
          <span className="tw-det-ticket-id">{ticket.id}</span>
          <h1 className="tw-det-device">{ticket.device}</h1>
          <p className="tw-det-meta">IMEI: {ticket.imei} · Model: {ticket.modelCode}</p>
        </div>
        <div className="tw-det-banner-right">
          <span className={priorityClass(ticket.priority)}>{ticket.priority}</span>
          <span className={statusPillClass(ticket.status)}>{ticket.status}</span>
        </div>
      </div>

      {/* Two-column body */}
      <div className="tw-det-body">

        {/* LEFT: Fault Reporting */}
        <div className="tw-det-left">
          <section className="tw-card">
            <h2 className="tw-card-title">
              <span className="tw-section-icon tw-icon-fault">!</span>
              Fault Reporting
            </h2>

            <div className="tw-fault-header">
              <p className="tw-card-sub" style={{ marginBottom: 0 }}>Fault description</p>
              {!editingFault && (
                <button type="button" className="tw-fault-edit-btn" onClick={() => setEditingFault(true)}>
                  <IconEdit /> Edit
                </button>
              )}
            </div>

            {editingFault ? (
              <>
                <textarea
                  className="tech-textarea"
                  rows={5}
                  value={faultEditText}
                  onChange={(e) => setFaultEditText(e.target.value)}
                  placeholder="Describe the fault in detail…"
                />
                <div className="tw-fault-actions">
                  <button type="button" className="btn-table btn-table--primary" onClick={handleSaveFault}>
                    <IconCheck /> Save
                  </button>
                  <button type="button" className="btn-table" onClick={handleCancelFault}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="tech-fault-box">{ticket.faultDetail}</div>
            )}

            <p className="tw-card-sub" style={{ marginTop: '16px' }}>
              <IconCamera /> Diagnostic photos
            </p>
            <div className="tech-photo-row">
              {[['Front / Screen', 0], ['Rear / Internal', 1]].map(([label, idx]) => (
                <div key={idx} className="tech-photo-slot" onClick={() => photoRefs[idx].current?.click()} title="Click to upload photo">
                  {photos[idx] ? (
                    <img src={photos[idx]} alt={label} className="tech-photo-img" />
                  ) : (
                    <div className="tech-photo-empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                      </svg>
                      <p className="tech-photo-empty-label">{label}</p>
                      <p className="tech-photo-empty-hint">Click to upload</p>
                    </div>
                  )}
                  <input ref={photoRefs[idx]} type="file" accept="image/*" hidden onChange={(e) => handlePhotoChange(idx, e)} />
                </div>
              ))}
            </div>

            <p className="tw-card-sub" style={{ marginTop: '16px' }}>Add an inspection note</p>
            <textarea
              className="tech-textarea"
              rows={3}
              placeholder="Describe new symptoms, observations, or escalation details…"
              value={faultDraft}
              onChange={(e) => setFaultDraft(e.target.value)}
            />
            <button type="button" className="btn-table btn-table--primary" onClick={onSubmitNote}>
              Submit Note
            </button>

            {(ticket.faultNotes?.length ?? 0) > 0 && (
              <>
                <p className="tw-card-sub" style={{ marginTop: '14px' }}>Note history</p>
                <ul className="tech-notes-list">
                  {ticket.faultNotes.map((n, i) => (
                    <li key={`${n.at}-${i}`}>
                      <time>{n.at}</time>
                      {n.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        {/* RIGHT: Progress + Parts + Completion */}
        <div className="tw-det-right">

          {/* Repair Progress */}
          <section className="tw-card">
            <h2 className="tw-card-title">
              <span className="tw-section-icon tw-icon-progress">↗</span>
              Repair Progress
            </h2>
            <div className="tw-det-prog-row">
              <div className={`progress tov-prog-bar ${progressClass(ticket.progress)}`} style={{ flex: 1, height: '10px' }}>
                <div style={{ width: `${ticket.progress}%` }} />
              </div>
              <span className="tw-progress-label">{ticket.progress}% complete</span>
            </div>
            <ul className="tech-parts-list" style={{ marginTop: '4px' }}>
              {ticket.parts.map((p) => (
                <li key={p.id}>
                  <label className="tech-check">
                    <input
                      type="checkbox"
                      checked={p.done}
                      onChange={() => onTogglePart(ticket.id, p.id)}
                    />
                    <span>{p.label}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="tw-parts-done-note">
              <IconCheck /> {doneParts} of {ticket.parts.length} parts confirmed
            </p>
          </section>

          {/* Completion Status */}
          <section className="tw-card">
            <h2 className="tw-card-title">
              <span className="tw-section-icon tw-icon-status">✓</span>
              Completion Status
            </h2>
            <p className="tw-card-sub">Update the repair status for this device</p>
            <div className="tw-status-options">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`tw-status-opt ${ticket.status === s ? 'is-active' : ''}`}
                  onClick={() => onUpdateStatus(ticket.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
            {savedStatus && (
              <p className="tw-saved-msg"><IconCheck /> Status updated</p>
            )}
            <button
              type="button"
              className={`tw-complete-btn ${isComplete ? 'is-done' : ''}`}
              onClick={() => onUpdateStatus(ticket.id, 'Completed')}
              disabled={isComplete}
            >
              {isComplete ? <><IconCheck /> Marked as Complete</> : 'Mark as Complete'}
            </button>
          </section>

        </div>
      </div>
    </div>
  )
}

// ── 4. PROFILE PAGE ───────────────────────────────────────
function ProfilePage({ profilePic, onProfilePicChange }) {
  const fileRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onProfilePicChange(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const repairDistData = [
    { label: 'Completed',   value: 127, color: '#10b981' },
    { label: 'In Progress', value: 5,   color: '#3b82f6' },
    { label: 'Pending',     value: 3,   color: '#f59e0b' },
  ]

  const activityDotColor = (type) => {
    const map = { complete: '#10b981', note: '#3b82f6', parts: '#8b5cf6', status: '#f59e0b', assign: '#025c50' }
    return map[type] ?? '#94a3b8'
  }

  const infoRows = [
    { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, label: 'Email',        val: TECHNICIAN_PROFILE.email },
    { icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>, label: 'Phone',       val: TECHNICIAN_PROFILE.phone },
    { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,                                                                                                                                                                                                                                                                                                                                                                                                       label: 'Location',    val: TECHNICIAN_PROFILE.location },
    { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,                                                                                                                                                                                                                                                                                                                              label: 'Member Since', val: TECHNICIAN_PROFILE.since },
  ]

  return (
    <div className="prf-page">

      {/* ── Left column ── */}
      <div className="prf-left">
        <div className="prf-card tw-card">
          <div className="prf-cover">
            <div className="prf-cover-accent" />
            <div className="prf-cover-accent2" />
          </div>
          <div className="prf-card-body">

            <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
              {profilePic
                ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                : <div className="prf-avatar-initials">{TECHNICIAN_PROFILE.initials}</div>
              }
              <div className="prf-avatar-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Upload</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

            <button type="button" className="prf-upload-label" onClick={() => fileRef.current?.click()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload photo
            </button>

            <div className="prf-name-row">
              <h2 className="prf-name">{TECHNICIAN_PROFILE.name}</h2>
            </div>
            <span className="prf-role-tag">{TECHNICIAN_PROFILE.role}</span>
            <p className="prf-id">{TECHNICIAN_PROFILE.id}</p>

            <div className="prf-info-list">
              {infoRows.map((row) => (
                <div key={row.label} className="prf-info-item">
                  <span className="prf-info-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{row.icon}</svg>
                  </span>
                  <div className="prf-info-text">
                    <p className="prf-info-label">{row.label}</p>
                    <p className="prf-info-val">{row.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Efficiency Score</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#025c50' }}>82 / 100</span>
              </div>
              <div className="progress">
                <div style={{ width: '82%', background: 'linear-gradient(90deg, #025c50, #10b981)' }} />
              </div>
              <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '4px 0 0' }}>3-day average repair time · Active status</p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="prf-section-card">
          <h3 className="prf-section-title">Certifications</h3>
          <div className="prf-cert-list">
            {TECHNICIAN_PROFILE.certifications.map((cert) => (
              <div key={cert} className="prf-cert-item">
                <svg className="prf-cert-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right column ── */}
      <div className="prf-right">

        <div className="prf-stats-row">
          {TECH_PERF_STATS.map((s) => (
            <div key={s.label} className="prf-stat-card">
              <p className="prf-stat-num">{s.value}</p>
              <p className="prf-stat-label">{s.label}</p>
              <p className="prf-stat-hint">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="tw-prof-charts-row">
          <section className="tw-card">
            <h3 className="tw-card-title">Repair Distribution</h3>
            <div className="tw-ov-donut-wrap">
              <DonutChart data={repairDistData} size={160} centerLabel="135" centerSub="total" />
              <div className="tw-ov-legend">
                {repairDistData.map((d) => (
                  <div key={d.label} className="tw-ov-legend-item">
                    <span className="tw-ov-legend-dot" style={{ background: d.color }} />
                    <span className="tw-ov-legend-label">{d.label}</span>
                    <span className="tw-ov-legend-count">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="tw-card tw-prof-ring-card">
            <h3 className="tw-card-title">Satisfaction Rate</h3>
            <div className="tw-prof-ring-wrap">
              <RingChart value={98} size={156} color="#10b981" label="satisfaction" />
            </div>
            <p className="tw-prof-ring-sub">98% customer satisfaction</p>
            <p className="tw-prof-ring-note">Based on feedback across 127 completed repairs.</p>
            <div className="tw-prof-ring-stats">
              <div>
                <p className="tw-kpi-label" style={{ marginBottom: '2px' }}>Parts Accuracy</p>
                <p className="tw-prof-ring-stat-val">99.1%</p>
              </div>
              <div>
                <p className="tw-kpi-label" style={{ marginBottom: '2px' }}>Avg. Repair Time</p>
                <p className="tw-prof-ring-stat-val">2d</p>
              </div>
            </div>
          </section>
        </div>

        <article className="prf-section-card">
          <h3 className="prf-section-title">Recent Activity</h3>
          <ul className="prf-timeline">
            {TECH_ACTIVITY_SEED.map((a) => (
              <li key={a.id} className="prf-timeline-item">
                <span className="prf-timeline-dot" style={{ background: activityDotColor(a.type) }} />
                <div>
                  <p className="prf-timeline-action">{a.action}</p>
                  <p className="prf-timeline-time">{a.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

      </div>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────
export default function TechnicianWorkbench({ onBack, darkMode = false, onToggleDark, notifications = [], onMarkNotifRead }) {
  const [page, setPage]               = useState('overview')
  const [tickets, setTickets]         = useState(cloneTickets)
  const [selectedId, setSelectedId]   = useState(null)
  const [faultDraft, setFaultDraft]   = useState('')
  const [savedStatus, setSavedStatus] = useState(false)
  const [profilePic, setProfilePic]   = useState(null)

  const selected = useMemo(
    () => (selectedId ? tickets.find((t) => t.id === selectedId) : null),
    [tickets, selectedId],
  )
  const urgentCount = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Completed').length

  const handleViewDevice = (id) => {
    setSelectedId(id)
    setFaultDraft('')
    setSavedStatus(false)
    setPage('detail')
  }

  const handleUpdateStatus = (id, status) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        if (status === 'Completed') return { ...t, status, progress: 100 }
        const next = { ...t, status }
        if (t.status === 'Completed' && status !== 'Completed') {
          const done = t.parts.filter((p) => p.done).length
          next.progress = t.parts.length ? Math.round((done / t.parts.length) * 100) : t.progress
        }
        return next
      }),
    )
    setSavedStatus(true)
    setTimeout(() => setSavedStatus(false), 2500)
  }

  const handleTogglePart = (ticketId, partId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t
        const parts = t.parts.map((p) => (p.id === partId ? { ...p, done: !p.done } : p))
        const done = parts.filter((p) => p.done).length
        return { ...t, parts, progress: parts.length ? Math.round((done / parts.length) * 100) : t.progress }
      }),
    )
  }

  const handleSubmitNote = () => {
    const text = faultDraft.trim()
    if (!text || !selectedId) return
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              faultNotes: [
                ...(t.faultNotes || []),
                { at: new Date().toISOString().slice(0, 16).replace('T', ' '), text },
              ],
            }
          : t,
      ),
    )
    setFaultDraft('')
  }

  const handleUpdateFault = (ticketId, newText) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, faultDetail: newText } : t)),
    )
  }

  return (
    <div className="tw-layout">

      {/* ── Sidebar ── */}
      <aside className="tw-sidebar" aria-label="Technician navigation">
        <p className="tw-sidebar-caption">Navigation</p>

        <nav className="tw-sidebar-nav">
          {TW_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tw-nav-btn ${(page === item.id || (item.id === 'devices' && page === 'detail')) ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <NavIcon id={item.id} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="tw-sidebar-bottom">
          <button type="button" className="tw-nav-back" onClick={onBack}>
            <IconBack /> Admin Portal
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="tw-content">
        <header className="tw-portal-header">
          <div className="tw-portal-brand">
            <span className="tw-portal-logo" aria-hidden>VT</span>
            <div>
              <strong>reviveTech</strong>
              <p>Technician</p>
            </div>
          </div>
          <span className="tw-portal-tagline">TECHNICIAN DASHBOARD</span>
          <DashboardActions
            darkMode={darkMode}
            onToggleDark={onToggleDark}
            userName={TECHNICIAN_PROFILE.name}
            role={TECHNICIAN_PROFILE.role}
            notifications={notifications}
            onMarkRead={onMarkNotifRead}
          />
        </header>
        {page === 'overview' && (
          <OverviewPage
            tickets={tickets}
            onGoToDevices={() => setPage('devices')}
            onViewDevice={handleViewDevice}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        {page === 'devices' && (
          <AssignedDevicesPage
            tickets={tickets}
            onViewDevice={handleViewDevice}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        {page === 'detail' && (
          <DeviceDetailsPage
            ticket={selected}
            onBack={() => setPage('devices')}
            onTogglePart={handleTogglePart}
            onUpdateStatus={handleUpdateStatus}
            onSubmitNote={handleSubmitNote}
            onUpdateFault={(text) => setTickets((prev) => prev.map((t) => t.id === selectedId ? { ...t, faultDetail: text } : t))}
            faultDraft={faultDraft}
            setFaultDraft={setFaultDraft}
            savedStatus={savedStatus}
          />
        )}
        {page === 'profile' && (
          <ProfilePage
            profilePic={profilePic}
            onProfilePicChange={setProfilePic}
          />
        )}
      </main>

    </div>
  )
}

