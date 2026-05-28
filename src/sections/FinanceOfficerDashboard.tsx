// @ts-nocheck
import { useMemo, useRef, useState } from 'react'
import DashboardActions from '../components/DashboardActions'
import {
  FO_OFFICER_PROFILE,
  FO_OVERVIEW_KPIS,
  FO_LOAN_STATUS_PIE,
  FO_MONTHLY_LOANS,
  FO_APPROVAL_TREND,
  FO_REQUESTS_SEED,
  FO_ACTIVE_LOANS_SEED,
  FO_DELINQUENT_SEED,
  FO_CUSTOMERS_SEED,
  FO_DEVICES_SEED,
  FO_REPORTS_REGIONAL,
  FO_SETTINGS_SEED,
  FO_ACTIVITY_LOG,
} from '../data/mockData'

// ─── SVG Charts ───────────────────────────────────────────────────────────────

function DonutChart({ data, size = 160, centerLabel, centerSub }) {
  const r = size * 0.36
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)
  const segments = []
  let acc = 0
  for (const d of data.filter((d) => d.value > 0)) {
    const len = (d.value / total) * circ
    segments.push({ color: d.color, dashArray: `${len} ${circ - len}`, dashOffset: circ - acc })
    acc += len
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size * 0.115} />
      <g transform={`rotate(-90, ${cx}, ${cy})`}>
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
            strokeWidth={size * 0.115} strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset} />
        ))}
      </g>
      {centerLabel && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#111827" fontSize={size * 0.13} fontWeight="700">{centerLabel}</text>
          {centerSub && <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="#6b7280" fontSize={size * 0.075}>{centerSub}</text>}
        </>
      )}
    </svg>
  )
}

function BarChart({ data, height = 130 }) {
  const max = Math.max(...data.map((d) => d.count))
  const w = 320
  const barW = Math.floor((w - 24) / data.length) - 4
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height + 28}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const bh = Math.max(3, (d.count / max) * height)
        const x = 12 + i * ((w - 24) / data.length)
        const y = height - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="3" fill="#3b82f6" opacity="0.85" />
            <text x={x + barW / 2} y={height + 14} textAnchor="middle" fill="#9ca3af" fontSize="9">{d.month}</text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#6b7280" fontSize="8">{d.count}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, height = 100 }) {
  const w = 320
  const pad = 16
  const max = Math.max(...data.map((d) => d.rate))
  const min = Math.min(...data.map((d) => d.rate)) - 5
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = height - ((d.rate - min) / (max - min)) * (height - 20) - 8
    return [x, y]
  })
  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length - 1][0]},${height} L${pts[0][0]},${height} Z`
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height + 22}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="fo-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#fo-line-grad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="#3b82f6" />
          <text x={x} y={height + 16} textAnchor="middle" fill="#9ca3af" fontSize="9">{data[i].month}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    Pending: 'fo-badge-pending',
    'Under Review': 'fo-badge-review',
    Approved: 'fo-badge-approved',
    Rejected: 'fo-badge-rejected',
    Active: 'fo-badge-approved',
    Current: 'fo-badge-approved',
    Settled: 'fo-badge-settled',
    Delinquent: 'fo-badge-rejected',
    'Due Soon': 'fo-badge-pending',
    Overdue: 'fo-badge-rejected',
  }
  return <span className={`fo-badge ${map[status] ?? 'fo-badge-pending'}`}>{status}</span>
}

function RiskBadge({ level }) {
  const map = { Low: 'fo-risk-low', Medium: 'fo-risk-medium', High: 'fo-risk-high', Critical: 'fo-risk-critical' }
  return <span className={`fo-risk-badge ${map[level] ?? 'fo-risk-medium'}`}>{level}</span>
}

function FoKpiCard({ stat }) {
  const icons = {
    stack: <path d="M2 20h20M2 15h20M5 10h14a2 2 0 0 0 0-4H5a2 2 0 0 0 0 4zM5 6V4M19 6V4" />,
    pulse: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>,
    dollar: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  }
  return (
    <article className="fo-kpi-card">
      <div className="fo-kpi-top">
        <span className="fo-kpi-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{icons[stat.icon]}</svg>
        </span>
        <span className={`fo-kpi-trend ${stat.trend}`}>{stat.trend === 'up' ? '↗' : '↘'} {stat.change}</span>
      </div>
      <p className="fo-kpi-label">{stat.label}</p>
      <p className="fo-kpi-value">{stat.value}</p>
    </article>
  )
}

// ─── Page: Overview ───────────────────────────────────────────────────────────

function FoOverviewPage() {
  return (
    <div className="fo-page-wrap">
      <div className="fo-kpi-grid">
        {FO_OVERVIEW_KPIS.map((s) => <FoKpiCard key={s.label} stat={s} />)}
      </div>

      <div className="fo-charts-row">
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Loan Status Distribution</h3>
          <div className="fo-donut-wrap">
            <DonutChart data={FO_LOAN_STATUS_PIE} size={170} centerLabel="1,284" centerSub="Total Loans" />
            <ul className="fo-donut-legend">
              {FO_LOAN_STATUS_PIE.map((d) => (
                <li key={d.label} className="fo-legend-item">
                  <span className="fo-legend-dot" style={{ background: d.color }} />
                  <span className="fo-legend-label">{d.label}</span>
                  <span className="fo-legend-val">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Monthly Loans Issued</h3>
          <BarChart data={FO_MONTHLY_LOANS} />
        </div>

        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Approval Rate Trend</h3>
          <LineChart data={FO_APPROVAL_TREND} />
          <p className="fo-chart-hint">Current month: <strong>87%</strong></p>
        </div>
      </div>

      <div className="fo-panel-card fo-recent-requests">
        <h3 className="fo-panel-title">Recent Requests</h3>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Ref</th><th>Customer</th><th>Device</th><th>Status</th></tr>
            </thead>
            <tbody>
              {FO_REQUESTS_SEED.slice(0, 5).map((r) => (
                <tr key={r.ref}>
                  <td className="fo-ref-cell">{r.ref}</td>
                  <td>{r.customer}</td>
                  <td>{r.device}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Page: Financing Requests ─────────────────────────────────────────────────

function FoRequestsPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [requests, setRequests] = useState(FO_REQUESTS_SEED)
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    let list = [...requests]
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((r) => r.ref.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.device.toLowerCase().includes(q))
    if (filterStatus) list = list.filter((r) => r.status === filterStatus)
    if (dateFrom) list = list.filter((r) => r.appliedAt >= dateFrom)
    if (dateTo) list = list.filter((r) => r.appliedAt <= dateTo)
    if (priceMin) list = list.filter((r) => parseFloat(r.price.replace(/[$,]/g, '')) >= parseFloat(priceMin))
    if (priceMax) list = list.filter((r) => parseFloat(r.price.replace(/[$,]/g, '')) <= parseFloat(priceMax))
    return list
  }, [requests, search, filterStatus, dateFrom, dateTo, priceMin, priceMax])

  const changeStatus = (ref, newStatus) => {
    setRequests((prev) => prev.map((r) => r.ref === ref ? { ...r, status: newStatus } : r))
    setModal(null)
  }

  const resetFilters = () => {
    setSearch(''); setFilterStatus(''); setDateFrom(''); setDateTo(''); setPriceMin(''); setPriceMax('')
  }

  return (
    <div className="fo-page-wrap">
      <div className="fo-filter-bar">
        <div className="fo-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
          <input type="search" placeholder="Search ref, customer, device…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="fo-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>Under Review</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <label className="fo-date-field">
          <span>From</span>
          <input type="date" className="fo-date-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label className="fo-date-field">
          <span>To</span>
          <input type="date" className="fo-date-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <label className="fo-price-field">
          <span>Min $</span>
          <input type="number" className="fo-price-input" placeholder="0" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
        </label>
        <label className="fo-price-field">
          <span>Max $</span>
          <input type="number" className="fo-price-input" placeholder="9999" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
        </label>
        <button className="fo-btn-reset" onClick={resetFilters}>Reset</button>
      </div>

      <div className="fo-panel-card">
        <div className="fo-panel-header-row">
          <p className="fo-results-hint">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Ref ID</th><th>Customer</th><th>Device</th><th>Price</th><th>Term</th><th>APR</th><th>Status</th><th>Applied</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="fo-table-empty">No requests match your filters.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.ref}>
                    <td className="fo-ref-cell">{r.ref}</td>
                    <td>{r.customer}</td>
                    <td>{r.device}</td>
                    <td>{r.price}</td>
                    <td>{r.term}</td>
                    <td>{r.apr}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="fo-muted">{r.appliedAt}</td>
                    <td>
                      <div className="fo-action-btns">
                        {(r.status === 'Pending' || r.status === 'Under Review') && (
                          <>
                            <button className="fo-btn-approve" onClick={() => changeStatus(r.ref, 'Approved')}>Approve</button>
                            <button className="fo-btn-reject" onClick={() => changeStatus(r.ref, 'Rejected')}>Reject</button>
                          </>
                        )}
                        <button className="fo-btn-view" onClick={() => setModal(r)}>View</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fo-modal-overlay" onClick={() => setModal(null)}>
          <div className="fo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fo-modal-header">
              <h3>Request Details — {modal.ref}</h3>
              <button className="fo-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="fo-modal-body">
              <div className="fo-detail-grid">
                {[['Customer', modal.customer], ['Device', modal.device], ['Price', modal.price], ['Term', modal.term], ['APR', modal.apr], ['Applied', modal.appliedAt]].map(([label, val]) => (
                  <div key={label} className="fo-detail-item">
                    <span className="fo-detail-label">{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
                <div className="fo-detail-item">
                  <span className="fo-detail-label">Status</span>
                  <StatusBadge status={modal.status} />
                </div>
              </div>
              {(modal.status === 'Pending' || modal.status === 'Under Review') && (
                <div className="fo-modal-actions">
                  <button className="fo-btn-approve" onClick={() => changeStatus(modal.ref, 'Approved')}>Approve</button>
                  <button className="fo-btn-reject" onClick={() => changeStatus(modal.ref, 'Rejected')}>Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page: Active Loans ───────────────────────────────────────────────────────

function FoLoansPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateLoan, setShowCreateLoan] = useState(false)

  const filtered = useMemo(() => {
    let list = FO_ACTIVE_LOANS_SEED
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((r) => r.ref.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q))
    if (statusFilter !== 'all') list = list.filter((r) => r.status.toLowerCase().replace(' ', '-') === statusFilter)
    return list
  }, [search, statusFilter])

  return (
    <div className="fo-page-wrap">
      <div className="fo-toolbar">
        <div className="fo-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
          <input type="search" placeholder="Search customer or ref…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="fo-toolbar-right">
          <label className="fo-filter-group">
            <span className="fo-filter-label">Status</span>
            <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="current">Current</option>
              <option value="due-soon">Due Soon</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
          <button className="fo-btn-create" onClick={() => setShowCreateLoan(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Loan
          </button>
        </div>
      </div>
      <div className="fo-legend-inline" style={{ marginBottom: '12px' }}>
        <span className="fo-dot fo-dot-overdue" /> Overdue
        <span className="fo-dot fo-dot-due-soon" /> Due Soon
        <span className="fo-dot fo-dot-current" /> Current
      </div>
      {showCreateLoan && (
        <div className="um-backdrop" onClick={() => setShowCreateLoan(false)}>
          <div className="um-modal" onClick={(e) => e.stopPropagation()}>
            <div className="um-modal-header">
              <h2 className="um-modal-title">Create New Loan</h2>
              <button type="button" className="um-modal-close" onClick={() => setShowCreateLoan(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="um-modal-body">
              <p className="fo-muted" style={{ marginBottom: '20px' }}>Fill in the details below to create a new financing loan for a customer.</p>
              {[['Customer Name', 'text', 'e.g. Jean Baptiste N.'], ['Device', 'text', 'e.g. iPhone 15 Pro'], ['Principal Amount ($)', 'number', 'e.g. 1099'], ['APR (%)', 'number', 'e.g. 14.5'], ['Term (months)', 'number', 'e.g. 12']].map(([label, type, placeholder]) => (
                <label key={label} className="fo-settings-field" style={{ marginBottom: '14px' }}>
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <input type={type} className="fo-form-input" placeholder={placeholder} />
                </label>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="fo-btn-approve" style={{ flex: 1 }} onClick={() => setShowCreateLoan(false)}>Create Loan</button>
                <button className="fo-btn-view" onClick={() => setShowCreateLoan(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fo-panel-card">
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Ref</th><th>Customer</th><th>Device</th><th>Monthly</th><th>Remaining</th><th>Next Due</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.ref} className={r.status === 'Overdue' ? 'fo-row-overdue' : r.status === 'Due Soon' ? 'fo-row-due-soon' : ''}>
                  <td className="fo-ref-cell">{r.ref}</td>
                  <td>{r.customer}</td>
                  <td>{r.device}</td>
                  <td>{r.monthly}</td>
                  <td>{r.remaining}</td>
                  <td className={r.status === 'Overdue' ? 'fo-due-overdue' : r.status === 'Due Soon' ? 'fo-due-soon' : ''}>{r.nextDue}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Page: Risk & Delinquency ─────────────────────────────────────────────────

function FoRiskPage() {
  const [list, setList] = useState(FO_DELINQUENT_SEED)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
  const markPaid = (ref) => { setList((prev) => prev.filter((r) => r.ref !== ref)); showToast('Marked as paid and removed from delinquency list.') }
  const sendReminder = (ref) => showToast(`Payment reminder sent for ${ref}.`)
  const escalate = (ref) => showToast(`${ref} escalated to collections team.`)

  return (
    <div className="fo-page-wrap">
      <div className="fo-risk-summary-row">
        {[
          { label: 'Critical', cls: 'fo-risk-card-red', val: list.filter((r) => r.riskLevel === 'Critical').length },
          { label: 'High Risk', cls: 'fo-risk-card-orange', val: list.filter((r) => r.riskLevel === 'High').length },
          { label: 'Medium Risk', cls: 'fo-risk-card-yellow', val: list.filter((r) => r.riskLevel === 'Medium').length },
          { label: '$ Overdue', cls: 'fo-risk-card-blue', val: '$' + list.reduce((s, r) => s + parseFloat(r.amountDue.replace('$', '')), 0).toFixed(2) },
        ].map((s) => (
          <div key={s.label} className={`fo-risk-stat-card ${s.cls}`}>
            <p className="fo-risk-stat-val">{s.val}</p>
            <p className="fo-risk-stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="fo-panel-card">
        <h3 className="fo-panel-title">Delinquent Accounts</h3>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Ref</th><th>Customer</th><th>Device</th><th>Overdue</th><th>Amount Due</th><th>Total Owed</th><th>Risk</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={8} className="fo-table-empty">No delinquent accounts.</td></tr>
              ) : (
                list.map((r) => (
                  <tr key={r.ref}>
                    <td className="fo-ref-cell">{r.ref}</td>
                    <td>
                      <div>{r.customer}</div>
                      <div className="fo-muted">{r.phone}</div>
                    </td>
                    <td>{r.device}</td>
                    <td className="fo-due-overdue">{r.overdueDays}d</td>
                    <td>{r.amountDue}</td>
                    <td>{r.totalOwed}</td>
                    <td><RiskBadge level={r.riskLevel} /></td>
                    <td>
                      <div className="fo-action-btns">
                        <button className="fo-btn-view" onClick={() => sendReminder(r.ref)}>Remind</button>
                        <button className="fo-btn-approve" onClick={() => markPaid(r.ref)}>Paid</button>
                        <button className="fo-btn-reject" onClick={() => escalate(r.ref)}>Escalate</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className="fo-toast">{toast}</div>}
    </div>
  )
}

// ─── Page: Customers ──────────────────────────────────────────────────────────

function FoCustomersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    let list = FO_CUSTOMERS_SEED
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    if (statusFilter !== 'all') list = list.filter((c) => c.status.toLowerCase() === statusFilter)
    return list
  }, [search, statusFilter])

  const exportCustomers = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Borrowed', 'Risk', 'Status']
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    const rows = filtered.map((c) => [c.id, c.name, c.email, c.phone, c.totalBorrowed, c.riskLevel, c.status])
    const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `customers-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  if (selected) {
    const loanHistory = FO_ACTIVE_LOANS_SEED.filter((l) => l.customer === selected.name)
    return (
      <div className="fo-page-wrap">
        <button className="fo-back-btn" onClick={() => setSelected(null)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Back to Customers
        </button>
        <div className="fo-cust-header">
          <div className="fo-cust-avatar">{selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
          <div>
            <h2 className="fo-cust-name">{selected.name}</h2>
            <p className="fo-muted">{selected.id} · {selected.email} · {selected.phone}</p>
          </div>
          <div className="fo-cust-badges">
            <StatusBadge status={selected.status} />
            <RiskBadge level={selected.riskLevel} />
          </div>
        </div>
        <div className="fo-cust-stats-row">
          <div className="fo-cust-stat"><span className="fo-cust-stat-val">{selected.loans}</span><span className="fo-cust-stat-label">Total Loans</span></div>
          <div className="fo-cust-stat"><span className="fo-cust-stat-val">{selected.totalBorrowed}</span><span className="fo-cust-stat-label">Total Borrowed</span></div>
          <div className="fo-cust-stat"><span className="fo-cust-stat-val"><RiskBadge level={selected.riskLevel} /></span><span className="fo-cust-stat-label">Risk Level</span></div>
        </div>
        <div className="fo-panel-card">
          <h3 className="fo-panel-title">Loan History</h3>
          {loanHistory.length === 0 ? (
            <p className="fo-muted" style={{ padding: '16px' }}>No active loans on record.</p>
          ) : (
            <div className="fo-table-scroll">
              <table className="fo-table">
                <thead><tr><th>Ref</th><th>Device</th><th>Monthly</th><th>Remaining</th><th>Next Due</th><th>Status</th></tr></thead>
                <tbody>
                  {loanHistory.map((l) => (
                    <tr key={l.ref}>
                      <td className="fo-ref-cell">{l.ref}</td>
                      <td>{l.device}</td>
                      <td>{l.monthly}</td>
                      <td>{l.remaining}</td>
                      <td>{l.nextDue}</td>
                      <td><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fo-page-wrap">
      <div className="fo-toolbar">
        <div className="fo-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
          <input type="search" placeholder="Search name, email, ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="fo-toolbar-right">
          <label className="fo-filter-group">
            <span className="fo-filter-label">Status</span>
            <select className="fo-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="delinquent">Delinquent</option>
            </select>
          </label>
          <button className="fo-btn-export" onClick={exportCustomers}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M8 11l4 4 4-4M4 21h16" /></svg>
            Export Report
          </button>
        </div>
      </div>
      <div className="fo-panel-card">
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Contact</th><th>Total Borrowed</th><th>Risk</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="fo-ref-cell">{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <a href={`mailto:${c.email}`} className="fo-email-link">{c.email}</a>
                    <div className="fo-muted">{c.phone}</div>
                  </td>
                  <td>{c.totalBorrowed}</td>
                  <td><RiskBadge level={c.riskLevel} /></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td><button className="fo-btn-view" onClick={() => setSelected(c)}>View</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="fo-table-empty">No customers match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Page: Reports ────────────────────────────────────────────────────────────

function FoReportsPage() {
  const totalDisbursed = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.disbursed.replace(/[$,]/g, '')), 0)
  const totalCollected = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.collected.replace(/[$,]/g, '')), 0)
  const totalOutstanding = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.outstanding.replace(/[$,]/g, '')), 0)
  const fmt = (n) => '$' + n.toLocaleString('en-US')

  const handleExport = () => {
    const headers = ['Region', 'Disbursed', 'Collected', 'Outstanding', 'Default Rate', 'Loan Count']
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    const lines = [headers.map(esc).join(','), ...FO_REPORTS_REGIONAL.map((r) =>
      [r.region, r.disbursed, r.collected, r.outstanding, r.defaultRate, r.loanCount].map(esc).join(',')
    )]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `revivotech-finance-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div className="fo-page-wrap">
      <div className="fo-reports-summary">
        {[
          { label: 'Total Revenue', val: fmt(totalDisbursed), cls: '' },
          { label: 'Total Collected', val: fmt(totalCollected), cls: 'fo-green' },
          { label: 'Outstanding', val: fmt(totalOutstanding), cls: 'fo-amber' },
          { label: 'Avg Default Rate', val: '2.5%', cls: 'fo-red' },
        ].map((s) => (
          <div key={s.label} className="fo-rep-stat">
            <p className={`fo-rep-val ${s.cls}`}>{s.val}</p>
            <p className="fo-rep-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="fo-charts-row fo-charts-row-2">
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Monthly Loan Trends</h3>
          <BarChart data={FO_MONTHLY_LOANS} height={120} />
        </div>
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Approval Rate Performance</h3>
          <LineChart data={FO_APPROVAL_TREND} />
          <p className="fo-chart-hint">Current: <strong>87%</strong></p>
        </div>
      </div>

      <div className="fo-panel-card">
        <div className="fo-panel-header-row">
          <h3 className="fo-panel-title">Regional Performance</h3>
          <button className="fo-btn-export" onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M8 11l4 4 4-4M4 21h16" /></svg>
            Export CSV
          </button>
        </div>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Region</th><th>Disbursed</th><th>Collected</th><th>Outstanding</th><th>Default Rate</th><th>Loans</th></tr>
            </thead>
            <tbody>
              {FO_REPORTS_REGIONAL.map((r) => (
                <tr key={r.region}>
                  <td><strong>{r.region}</strong></td>
                  <td>{r.disbursed}</td>
                  <td className="fo-green">{r.collected}</td>
                  <td className="fo-amber">{r.outstanding}</td>
                  <td className={parseFloat(r.defaultRate) > 3 ? 'fo-red' : ''}>{r.defaultRate}</td>
                  <td>{r.loanCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Page: Settings ───────────────────────────────────────────────────────────

function FoSettingsPage() {
  const [settings, setSettings] = useState(FO_SETTINGS_SEED)
  const [saved, setSaved] = useState(false)

  const update = (path, value) => {
    setSettings((prev) => {
      const next = { ...prev }
      if (path.includes('.')) {
        const [k, sub] = path.split('.')
        next[k] = { ...prev[k], [sub]: value }
      } else {
        next[path] = value
      }
      return next
    })
  }

  return (
    <div className="fo-page-wrap">
      <div className="fo-settings-grid">
        <div className="fo-settings-card">
          <h3 className="fo-settings-section-title">Interest Rates (%)</h3>
          {[['Standard Tier', 'interestRates.standard'], ['Premium Tier', 'interestRates.premium'], ['Business Tier', 'interestRates.business']].map(([label, path]) => (
            <label key={path} className="fo-settings-field">
              <span>{label}</span>
              <input type="number" step="0.1" className="fo-form-input"
                value={settings.interestRates[path.split('.')[1]]}
                onChange={(e) => update(path, parseFloat(e.target.value))} />
            </label>
          ))}
        </div>

        <div className="fo-settings-card">
          <h3 className="fo-settings-section-title">Loan Duration &amp; Fees</h3>
          <label className="fo-settings-field">
            <span>Late Payment Penalty (%)</span>
            <input type="number" step="0.1" className="fo-form-input" value={settings.lateFeePercent}
              onChange={(e) => update('lateFeePercent', parseFloat(e.target.value))} />
          </label>
          <label className="fo-settings-field">
            <span>Grace Period (days)</span>
            <input type="number" className="fo-form-input" value={settings.gracePeriodDays}
              onChange={(e) => update('gracePeriodDays', parseInt(e.target.value))} />
          </label>
          <label className="fo-settings-field">
            <span>Escalation Threshold (days)</span>
            <input type="number" className="fo-form-input" value={settings.escalationThresholdDays}
              onChange={(e) => update('escalationThresholdDays', parseInt(e.target.value))} />
          </label>
        </div>

        <div className="fo-settings-card">
          <h3 className="fo-settings-section-title">Notifications</h3>
          <label className="fo-settings-toggle-field">
            <span>Auto Payment Reminders</span>
            <button className={`fo-toggle ${settings.autoReminder ? 'fo-toggle-on' : ''}`}
              onClick={() => update('autoReminder', !settings.autoReminder)}>
              <span className="fo-toggle-knob" />
            </button>
          </label>
          <label className="fo-settings-field">
            <span>Reminder Days Before Due</span>
            <input type="number" className="fo-form-input" value={settings.reminderDaysBefore}
              onChange={(e) => update('reminderDaysBefore', parseInt(e.target.value))} />
          </label>
        </div>

        <div className="fo-settings-card">
          <h3 className="fo-settings-section-title">Localization</h3>
          <label className="fo-settings-field">
            <span>Language</span>
            <select className="fo-form-input fo-form-select"
              value={settings.language}
              onChange={(e) => update('language', e.target.value)}>
              <option value="en">English</option>
              <option value="fr">French (Français)</option>
              <option value="rw">Kinyarwanda</option>
              <option value="sw">Swahili</option>
            </select>
          </label>
          <label className="fo-settings-field" style={{ marginTop: '12px' }}>
            <span>Currency</span>
            <select className="fo-form-input fo-form-select"
              value={settings.currency}
              onChange={(e) => update('currency', e.target.value)}>
              <option value="USD">USD — US Dollar</option>
              <option value="RWF">RWF — Rwandan Franc</option>
              <option value="EUR">EUR — Euro</option>
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="UGX">UGX — Ugandan Shilling</option>
            </select>
          </label>
        </div>
      </div>

      <button className={`fo-btn-save-settings ${saved ? 'fo-btn-saved' : ''}`}
        onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  )
}

// ─── Page: Profile ────────────────────────────────────────────────────────────

function FoProfilePage({ profilePic, onProfilePicChange }) {
  const fileRef = useRef(null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(FO_OFFICER_PROFILE.name)
  const [editEmail, setEditEmail] = useState(false)
  const [email, setEmail] = useState(FO_OFFICER_PROFILE.email)
  const [saved, setSaved] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onProfilePicChange(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const colorMap = { approve: '#22c55e', reject: '#ef4444', reminder: '#f0ab3c', escalate: '#ef4444', settings: '#3b82f6', complete: '#22c55e' }

  const infoRows = [
    {
      icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
      label: 'Email',
      content: editEmail
        ? <input className="prf-inline-input" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEditEmail(false)} autoFocus />
        : <span className="prf-info-val">{email} <button type="button" className="prf-edit-btn" onClick={() => setEditEmail(true)}>Edit</button></span>,
    },
    {
      icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
      label: 'Phone',
      content: <span className="prf-info-val">{FO_OFFICER_PROFILE.phone}</span>,
    },
    {
      icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
      label: 'Location',
      content: <span className="prf-info-val">{FO_OFFICER_PROFILE.location}</span>,
    },
    {
      icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
      label: 'Member Since',
      content: <span className="prf-info-val">{FO_OFFICER_PROFILE.since}</span>,
    },
  ]

  return (
    <div className="fo-page-wrap">
      <div className="prf-page">

        {/* ── Left column ── */}
        <div className="prf-left">
          <div className="prf-card fo-panel-card">
            <div className="prf-cover">
              <div className="prf-cover-accent" />
              <div className="prf-cover-accent2" />
            </div>
            <div className="prf-card-body">

              <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
                {profilePic
                  ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                  : <div className="prf-avatar-initials">{FO_OFFICER_PROFILE.initials}</div>
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
                {editName
                  ? <input className="prf-name-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setEditName(false)} autoFocus />
                  : <><h2 className="prf-name">{name}</h2><button type="button" className="prf-edit-btn" onClick={() => setEditName(true)}>Edit</button></>
                }
              </div>
              <span className="prf-role-tag">{FO_OFFICER_PROFILE.role}</span>
              <p className="prf-id">{FO_OFFICER_PROFILE.id}</p>

              <div className="prf-info-list">
                {infoRows.map((row) => (
                  <div key={row.label} className="prf-info-item">
                    <span className="prf-info-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{row.icon}</svg>
                    </span>
                    <div className="prf-info-text">
                      <p className="prf-info-label">{row.label}</p>
                      {row.content}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`prf-save-btn${saved ? ' prf-save-btn--saved' : ''}`}
                onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              >
                {saved ? '✓ Changes Saved' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="prf-right">
          <div className="prf-stats-row">
            {[
              { label: 'Loans Processed',     val: '1,284', hint: 'All time' },
              { label: 'Approval Rate',        val: '87%',   hint: 'Last 90 days' },
              { label: 'Avg Review Time',      val: '1.4d',  hint: 'Per application' },
              { label: 'Delinquency Handled',  val: '212',   hint: 'Resolved cases' },
            ].map((s) => (
              <div key={s.label} className="prf-stat-card">
                <p className="prf-stat-num">{s.val}</p>
                <p className="prf-stat-label">{s.label}</p>
                <p className="prf-stat-hint">{s.hint}</p>
              </div>
            ))}
          </div>

          <article className="prf-section-card">
            <h3 className="prf-section-title">Recent Activity</h3>
            <ul className="prf-timeline">
              {FO_ACTIVITY_LOG.map((a) => (
                <li key={a.id} className="prf-timeline-item">
                  <span className="prf-timeline-dot" style={{ background: colorMap[a.type] ?? '#64748b' }} />
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
    </div>
  )
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const FINANCING_SUB = [
  { id: 'requests', label: 'Financing Requests' },
  { id: 'loans', label: 'Active Loans' },
  { id: 'risk', label: 'Risk & Delinquency' },
]

function FoSidebar({ page, setPage }) {
  const [financingOpen, setFinancingOpen] = useState(
    ['requests', 'loans', 'risk'].includes(page)
  )

  const isFinancingSub = ['requests', 'loans', 'risk'].includes(page)

  const navItem = (id, label, icon) => (
    <button key={id} type="button"
      className={`fo-nav-btn ${page === id ? 'fo-nav-active' : ''}`}
      onClick={() => setPage(id)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{icon}</svg>
      {label}
    </button>
  )

  return (
    <>
      {navItem('overview', 'Overview',
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      )}

      {/* Financing dropdown */}
      <div className="fo-nav-group">
        <button type="button"
          className={`fo-nav-btn fo-nav-parent ${isFinancingSub ? 'fo-nav-parent-active' : ''}`}
          onClick={() => setFinancingOpen((v) => !v)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Financing
          <svg className={`fo-chevron ${financingOpen ? 'fo-chevron-open' : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {financingOpen && (
          <div className="fo-nav-sub">
            {FINANCING_SUB.map((sub) => (
              <button key={sub.id} type="button"
                className={`fo-nav-sub-btn ${page === sub.id ? 'fo-nav-sub-active' : ''}`}
                onClick={() => setPage(sub.id)}>
                <span className="fo-sub-dot" />
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {navItem('customers', 'Customers',
        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
      )}
      {navItem('reports', 'Analytics',
        <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>
      )}
      {navItem('settings', 'Settings',
        <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>
      )}
      {navItem('profile', 'Profile',
        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
      )}
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PAGE_META = {
  overview:  { title: 'Overview',              subtitle: 'Monitor loan portfolio health, approvals, and revenue performance.' },
  requests:  { title: 'Financing Requests',    subtitle: 'Review and action incoming financing applications from customers.' },
  loans:     { title: 'Active Loans',          subtitle: 'Track all active loan accounts, due dates, and payment statuses.' },
  risk:      { title: 'Risk & Delinquency',    subtitle: 'Identify delinquent accounts and take action to recover outstanding amounts.' },
  customers: { title: 'Customers',             subtitle: 'Browse customer profiles, loan history, and risk assessments.' },
  reports:   { title: 'Analytics',             subtitle: 'Analyze regional revenue, collection performance, and export data.' },
  settings:  { title: 'Settings',              subtitle: 'Configure interest rates, loan terms, fees, and notification rules.' },
  profile:   { title: 'My Profile',            subtitle: 'Manage your account details, photo, and review your activity log.' },
}

const FO_STATIC_ALERTS = [
  { type: 'error', icon: '🔴', msg: '5 loans overdue by more than 7 days — escalation recommended.' },
  { type: 'warn',  icon: '🟡', msg: '63 new financing requests awaiting review.' },
  { type: 'info',  icon: '🟢', msg: 'Approval rate hit 87% this month — all-time high.' },
]

export default function FinanceOfficerDashboard({ onBack, darkMode = false, onToggleDark, notifications = [], onMarkNotifRead }) {
  const [page, setPage] = useState('overview')
  const [profilePic, setProfilePic] = useState(null)

  const overdueLoans = FO_ACTIVE_LOANS_SEED.filter((l) => l.status === 'Overdue' || l.status === 'Due Soon')

  // Merge Finance-specific alerts with shared notifications
  const foNotifications = [
    ...FO_STATIC_ALERTS.map((a, i) => ({
      id: `FO-STATIC-${i}`,
      type: a.type,
      title: a.type === 'error' ? 'Escalation needed' : a.type === 'warn' ? 'Requests awaiting' : 'Approval milestone',
      desc: a.msg,
      time: 'Today',
      read: a.type === 'info',
    })),
    ...overdueLoans.map((l) => ({
      id: l.ref,
      type: l.status === 'Overdue' ? 'error' : 'warn',
      title: `${l.status}: ${l.customer}`,
      desc: `${l.device} — Next due: ${l.nextDue}`,
      time: 'Loan alert',
      read: false,
    })),
    ...notifications,
  ]

  const renderPage = () => {
    switch (page) {
      case 'overview':  return <FoOverviewPage />
      case 'requests':  return <FoRequestsPage />
      case 'loans':     return <FoLoansPage />
      case 'risk':      return <FoRiskPage />
      case 'customers': return <FoCustomersPage />
      case 'reports':   return <FoReportsPage />
      case 'settings':  return <FoSettingsPage />
      case 'profile':   return <FoProfilePage profilePic={profilePic} onProfilePicChange={setProfilePic} />
      default:          return <FoOverviewPage />
    }
  }

  const copy = PAGE_META[page] ?? PAGE_META.overview

  return (
    <div className="fo-layout">
      <aside className="fo-sidebar">
        <div className="fo-brand">
          <span className="fo-brand-mark">FO</span>
          <div>
            <strong>reviveTech</strong>
            <p>Finance Portal</p>
          </div>
        </div>
        <p className="fo-sidebar-caption">Loan management &amp; risk monitoring</p>
        <nav className="fo-nav">
          <FoSidebar page={page} setPage={setPage} />
        </nav>
        <div className="fo-sidebar-bottom">
          <button type="button" className="fo-back-sidebar-btn" onClick={onBack}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Admin
          </button>
        </div>
      </aside>

      <main className="fo-main">
        <header className="fo-portal-header">
          <span className="fo-portal-tagline">FINANCE PORTAL</span>
          <DashboardActions
            darkMode={darkMode}
            onToggleDark={onToggleDark}
            userName={FO_OFFICER_PROFILE.name}
            role={FO_OFFICER_PROFILE.role}
            notifications={foNotifications}
            onMarkRead={onMarkNotifRead}
          />
        </header>

        <header className="fo-topbar">
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </header>

        <div className="fo-section-content">{renderPage()}</div>
      </main>
    </div>
  )
}
