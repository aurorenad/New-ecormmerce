// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ADMIN_ACTIVITY_LOG,
  ADMIN_PLATFORM_STATS,
  ADMIN_PROFILE,
  DEVICES_SEED,
  FINANCING_SEED,
  LOGS_SEED,
  OVERVIEW_ORDERS_TREND,
  OVERVIEW_REVENUE_TREND,
  OVERVIEW_STATS,
  PRICING_SEED,
  SALES_SEED,
  USERS_SEED,
} from '../data/mockData'

function MiniKpi({ label, value, hint }) {
  return (
    <article className="mini-kpi">
      <p className="mini-kpi-label">{label}</p>
      <p className="mini-kpi-value">{value}</p>
      {hint && <p className="mini-kpi-hint">{hint}</p>}
    </article>
  )
}

function Toolbar({ search, onSearch, placeholder, children }) {
  return (
    <div className="section-toolbar">
      <div className="search-field search-field--compact">
        <svg className="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input type="search" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
      </div>
      {children}
    </div>
  )
}

const UM_ROLES = ['Customer', 'Admin', 'Technician', 'Finance Officer', 'Support Agent']
const UM_PAGE_SIZE = 5
const TODAY = new Date('2026-05-22')

// ─── User View Modal ──────────────────────────────────────────────────────────

function UserViewModal({ user, onClose }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const activity = [
    { icon: '🔐', text: 'Logged in successfully', time: user.lastActive },
    { icon: '👤', text: 'Profile information viewed', time: '2 days ago' },
    { icon: '🔑', text: 'Password last changed', time: '30 days ago' },
    { icon: '✅', text: 'Account created', time: user.joinDate },
  ]
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">User Profile</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="um-modal-body">
          {/* Avatar + name row */}
          <div className="um-profile-hero">
            <div className="um-avatar">{initials}</div>
            <div>
              <p className="um-profile-name">{user.name}</p>
              <div className="um-profile-badges">
                <span className="role-pill">{user.role}</span>
                <span className={`um-status um-status--${user.status.toLowerCase()}`}>{user.status}</span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="um-info-grid">
            <div className="um-info-item">
              <span className="um-info-label">User ID</span>
              <span className="um-info-value cell-mono">{user.id}</span>
            </div>
            <div className="um-info-item">
              <span className="um-info-label">Email</span>
              <a href={`mailto:${user.email}`} className="um-info-link">{user.email}</a>
            </div>
            <div className="um-info-item">
              <span className="um-info-label">Phone</span>
              <span className="um-info-value">{user.phone}</span>
            </div>
            <div className="um-info-item">
              <span className="um-info-label">Member Since</span>
              <span className="um-info-value">{user.joinDate}</span>
            </div>
            <div className="um-info-item">
              <span className="um-info-label">Last Active</span>
              <span className="um-info-value">{user.lastActive} · {user.lastActiveDate}</span>
            </div>
          </div>

          {/* Activity log */}
          <div className="um-activity-section">
            <p className="um-activity-title">Recent Activity</p>
            <ul className="um-activity-list">
              {activity.map((a, i) => (
                <li key={i} className="um-activity-item">
                  <span className="um-activity-icon">{a.icon}</span>
                  <span className="um-activity-text">{a.text}</span>
                  <span className="um-activity-time">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── User Edit Modal ──────────────────────────────────────────────────────────

function UserEditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return
    onSave({ ...user, ...form })
    onClose()
  }

  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Edit User</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="um-modal-body">
          <p className="um-form-note">Editing: <strong>{user.id}</strong></p>

          <div className="um-form-grid">
            <label className="um-form-field">
              <span className="um-form-label">Full Name</span>
              <input className="um-form-input" type="text" value={form.name} onChange={set('name')} placeholder="Full name" />
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Email Address</span>
              <input className="um-form-input" type="email" value={form.email} onChange={set('email')} placeholder="Email" />
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Phone Number</span>
              <input className="um-form-input" type="text" value={form.phone} onChange={set('phone')} placeholder="Phone" />
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Role</span>
              <select className="um-form-input" value={form.role} onChange={set('role')}>
                {UM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Status</span>
              <select className="um-form-input" value={form.status} onChange={set('status')}>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </label>
          </div>
        </div>

        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="um-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export function UsersSection() {
  const [search, setSearch]           = useState('')
  const [roleFilter, setRoleFilter]   = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage]               = useState(1)
  const [users, setUsers]             = useState(USERS_SEED)
  const [viewUser, setViewUser]       = useState(null)
  const [editUser, setEditUser]       = useState(null)

  const handleSave = (updated) =>
    setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u))

  // counts for 4 KPI cards
  const counts = useMemo(() => {
    const sevenDaysAgo = new Date(TODAY)
    sevenDaysAgo.setDate(TODAY.getDate() - 7)
    return {
      total:       users.length,
      active:      users.filter((u) => u.status === 'Active').length,
      deactivated: users.filter((u) => u.status === 'Deactivated').length,
      newUsers:    users.filter((u) => new Date(u.joinDate) >= sevenDaysAgo).length,
    }
  }, [users])

  // filter + search
  const filtered = useMemo(() => {
    let list = users
    if (roleFilter !== 'All')   list = list.filter((u) => u.role === roleFilter)
    if (statusFilter !== 'All') list = list.filter((u) => u.status === statusFilter)
    const q = search.trim().toLowerCase()
    if (q) list = list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q),
    )
    return list
  }, [search, roleFilter, statusFilter, users])

  // reset to page 1 when filters change
  const totalPages  = Math.max(1, Math.ceil(filtered.length / UM_PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const paginated   = filtered.slice((safePage - 1) * UM_PAGE_SIZE, safePage * UM_PAGE_SIZE)

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)))

  const toggleStatus = (id) =>
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u))

  const kpis = [
    {
      label: 'Total Users', value: counts.total, change: '+42 this month',
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
      bg: 'rgba(2,92,80,0.09)', fg: '#025c50',
    },
    {
      label: 'Active Users', value: counts.active, change: `${((counts.active / counts.total) * 100).toFixed(0)}% rate`,
      icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
      bg: 'rgba(34,197,94,0.1)', fg: '#15803d',
    },
    {
      label: 'Deactivated', value: counts.deactivated, change: 'Requires review',
      icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
      bg: 'rgba(239,68,68,0.1)', fg: '#b91c1c',
    },
    {
      label: 'New Users (7d)', value: counts.newUsers, change: 'Last 7 days',
      icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></>,
      bg: 'rgba(59,130,246,0.1)', fg: '#1d4ed8',
    },
  ]

  return (
    <div className="section-stack">

      {/* 4 KPI Cards */}
      <section className="um-kpi-grid" aria-label="User metrics">
        {kpis.map((k) => (
          <article className="um-kpi-card" key={k.label}>
            <div className="um-kpi-top">
              <span className="um-kpi-icon" style={{ background: k.bg, color: k.fg }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{k.icon}</svg>
              </span>
            </div>
            <p className="um-kpi-value">{k.value}</p>
            <p className="um-kpi-label">{k.label}</p>
            <p className="um-kpi-hint">{k.change}</p>
          </article>
        ))}
      </section>

      {/* Table card */}
      <article className="panel-card">

        {/* Toolbar: search + filters */}
        <div className="um-toolbar">
          <div className="search-field search-field--compact">
            <svg className="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
            </svg>
            <input type="search" placeholder="Search by name, email, or ID…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>

          <div className="um-filters">
            <label className="um-filter-group">
              <span className="um-filter-label">Role</span>
              <select className="um-select" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}>
                <option value="All">All roles</option>
                {UM_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>

            <label className="um-filter-group">
              <span className="um-filter-label">Status</span>
              <select className="um-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="table-scroll">
          <table className="admin-table um-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id}>
                  <td className="cell-mono">{user.id}</td>
                  <td className="um-cell-name">{user.name}</td>
                  <td><a href={`mailto:${user.email}`} className="um-email-link">{user.email}</a></td>
                  <td><span className="role-pill">{user.role}</span></td>
                  <td>
                    <span className={`um-status um-status--${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td>
                    <span className="um-last-active-rel">{user.lastActive}</span>
                    <span className="um-last-active-date">{user.lastActiveDate}</span>
                  </td>
                  <td>
                    <div className="um-actions">
                      <button type="button" className="um-action-btn um-action-view" title="View" onClick={() => setViewUser(user)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span>View</span>
                      </button>
                      <button type="button" className="um-action-btn um-action-edit" title="Edit" onClick={() => setEditUser(user)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className={`um-action-btn ${user.status === 'Active' ? 'um-action-deactivate' : 'um-action-activate'}`}
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === 'Active'
                          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>Deactivate</span></>
                          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Activate</span></>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan="7" className="um-empty">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="um-pagination">
          <span className="um-pagination-info">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * UM_PAGE_SIZE + 1}–{Math.min(safePage * UM_PAGE_SIZE, filtered.length)} of {filtered.length} users
          </span>
          <div className="um-pagination-controls">
            <button type="button" className="um-page-btn" onClick={() => goTo(safePage - 1)} disabled={safePage === 1}>
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n} type="button"
                className={`um-page-btn ${n === safePage ? 'um-page-btn--active' : ''}`}
                onClick={() => goTo(n)}
              >{n}</button>
            ))}
            <button type="button" className="um-page-btn" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}>
              Next ›
            </button>
          </div>
        </div>

      </article>

      {viewUser && <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />}
      {editUser && <UserEditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
    </div>
  )
}

// ─── Inventory helpers ────────────────────────────────────────────────────────
const INV_PAGE_SIZE  = 5
const INV_CATEGORIES = ['Smartphone', 'Laptop', 'Tablet', 'Wearable']
const INV_WAREHOUSES = ['Kigali Central', 'Nyarugenge Hub', 'Remera Depot']
const INV_CONDITIONS = ['Certified', 'Refurbished A', 'Refurbished B', 'New', 'Used (Good)', 'Used (Fair)']

const getStockStatus = (n) => n === 0 ? 'Out of Stock' : n > 10 ? 'In Stock' : n >= 5 ? 'Low Stock' : 'Critical'
const getStockClass  = (n) => n === 0 ? 'stock-out'    : n > 10 ? 'stock-ok'  : n >= 5 ? 'stock-low'  : 'stock-critical'

// ─── Device View Modal ────────────────────────────────────────────────────────
function DeviceViewModal({ device, onClose }) {
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Device Details</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="um-modal-body">
          <div className="inv-view-hero">
            <div className="inv-view-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <div>
              <p className="inv-view-model">{device.model}</p>
              <p className="inv-view-sku">{device.sku}</p>
            </div>
          </div>
          <div className="um-info-grid">
            <div className="um-info-item"><span className="um-info-label">Category</span><span className="um-info-value">{device.category}</span></div>
            <div className="um-info-item"><span className="um-info-label">Condition</span><span className="um-info-value">{device.condition}</span></div>
            <div className="um-info-item"><span className="um-info-label">Warehouse</span><span className="um-info-value">{device.warehouse}</span></div>
            <div className="um-info-item"><span className="um-info-label">List Price</span><span className="um-info-value">${device.listPrice.toLocaleString()}</span></div>
            <div className="um-info-item"><span className="um-info-label">Stock</span><span className="um-info-value">{device.stock} units</span></div>
            <div className="um-info-item">
              <span className="um-info-label">Status</span>
              <span className={`stock-pill ${getStockClass(device.stock)}`}>{getStockStatus(device.stock)}</span>
            </div>
          </div>
        </div>
        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── Device Edit Modal ────────────────────────────────────────────────────────
function DeviceEditModal({ device, onClose, onSave }) {
  const [form, setForm] = useState({ model: device.model, category: device.category, condition: device.condition, warehouse: device.warehouse })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const handleSave = () => { if (!form.model.trim()) return; onSave({ ...device, ...form }); onClose() }
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Edit Device</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="um-modal-body">
          <p className="um-form-note">SKU: <strong>{device.sku}</strong></p>
          <div className="um-form-grid">
            <label className="um-form-field" style={{ gridColumn: '1 / -1' }}>
              <span className="um-form-label">Model Name</span>
              <input className="um-form-input" type="text" value={form.model} onChange={set('model')} />
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Category</span>
              <select className="um-form-input" value={form.category} onChange={set('category')}>
                {INV_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="um-form-field">
              <span className="um-form-label">Condition</span>
              <select className="um-form-input" value={form.condition} onChange={set('condition')}>
                {INV_CONDITIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="um-form-field" style={{ gridColumn: '1 / -1' }}>
              <span className="um-form-label">Warehouse</span>
              <select className="um-form-input" value={form.warehouse} onChange={set('warehouse')}>
                {INV_WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="um-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ─── Adjust Stock Modal ───────────────────────────────────────────────────────
function AdjustStockModal({ device, onClose, onSave }) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('Restock')
  const delta    = parseInt(amount, 10) || 0
  const newStock = Math.max(0, device.stock + delta)
  const handleSave = () => { if (delta === 0) return; onSave({ ...device, stock: newStock }); onClose() }
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal inv-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Adjust Stock</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="um-modal-body">
          <p className="um-form-note"><strong>{device.model}</strong> · {device.sku}</p>
          <div className="inv-adj-current">
            <span className="inv-adj-label">Current Stock</span>
            <span className="inv-adj-big">{device.stock} units</span>
          </div>
          <div className="inv-adj-row">
            <button type="button" className="inv-adj-btn" onClick={() => setAmount((a) => String((parseInt(a, 10) || 0) - 1))}>−</button>
            <input type="number" className="inv-adj-input" value={amount} placeholder="0" onChange={(e) => setAmount(e.target.value)} />
            <button type="button" className="inv-adj-btn" onClick={() => setAmount((a) => String((parseInt(a, 10) || 0) + 1))}>+</button>
          </div>
          {delta !== 0 && (
            <div className={`inv-adj-preview inv-adj-preview--${delta > 0 ? 'add' : 'remove'}`}>
              {delta > 0 ? `+${delta}` : delta} units → New total: <strong>{newStock}</strong>
              <span className={`stock-pill ${getStockClass(newStock)}`}>{getStockStatus(newStock)}</span>
            </div>
          )}
          <label className="um-form-field" style={{ marginTop: '8px' }}>
            <span className="um-form-label">Reason</span>
            <select className="um-form-input" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Restock</option>
              <option>Damaged / Write-off</option>
              <option>Transfer In</option>
              <option>Transfer Out</option>
              <option>Correction</option>
            </select>
          </label>
        </div>
        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="um-btn-primary" onClick={handleSave} disabled={delta === 0}>Apply</button>
        </div>
      </div>
    </div>
  )
}

// ─── Inventory Section ────────────────────────────────────────────────────────
export function InventorySection() {
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [whFilter, setWhFilter]   = useState('All')
  const [stFilter, setStFilter]   = useState('All')
  const [sortKey, setSortKey]     = useState('model')
  const [sortDir, setSortDir]     = useState('asc')
  const [page, setPage]           = useState(1)
  const [devices, setDevices]     = useState(DEVICES_SEED)
  const [viewDev, setViewDev]     = useState(null)
  const [editDev, setEditDev]     = useState(null)
  const [adjDev, setAdjDev]       = useState(null)

  const handleSave = (updated) =>
    setDevices((prev) => prev.map((d) => d.sku === updated.sku ? updated : d))

  const counts = useMemo(() => ({
    total:   devices.reduce((s, d) => s + d.stock, 0),
    inStock: devices.filter((d) => d.stock > 10).length,
    atRisk:  devices.filter((d) => d.stock <= 10).length,
  }), [devices])

  const maxStock = useMemo(() => Math.max(...devices.map((d) => d.stock)), [devices])

  const filtered = useMemo(() => {
    let list = devices.map((d) => ({ ...d, status: getStockStatus(d.stock) }))
    if (catFilter !== 'All') list = list.filter((d) => d.category === catFilter)
    if (whFilter  !== 'All') list = list.filter((d) => d.warehouse === whFilter)
    if (stFilter  !== 'All') list = list.filter((d) => d.status    === stFilter)
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((d) =>
      d.sku.toLowerCase().includes(q) || d.model.toLowerCase().includes(q) || d.warehouse.toLowerCase().includes(q),
    )
    return [...list].sort((a, b) => {
      const va = sortKey === 'stock' ? a.stock : (a[sortKey] ?? '').toLowerCase()
      const vb = sortKey === 'stock' ? b.stock : (b[sortKey] ?? '').toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [search, catFilter, whFilter, stFilter, sortKey, sortDir, devices])

  const totalPages = Math.max(1, Math.ceil(filtered.length / INV_PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * INV_PAGE_SIZE, safePage * INV_PAGE_SIZE)
  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)))

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const SortIcon = ({ k }) => (
    <span className={`inv-sort-icon ${sortKey === k ? 'inv-sort-icon--active' : ''}`}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  const kpis = [
    { label: 'Total Units',   value: counts.total,   hint: `${devices.length} SKUs tracked`,  bg: 'rgba(2,92,80,0.09)',    fg: '#025c50', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
    { label: 'In Stock',      value: counts.inStock, hint: 'Above 10 units',                  bg: 'rgba(34,197,94,0.1)',   fg: '#15803d', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
    { label: 'At Risk',       value: counts.atRisk,  hint: '≤ 10 units — reorder',            bg: 'rgba(239,68,68,0.1)',   fg: '#b91c1c', icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    { label: 'Avg Turnover',  value: '18 days',      hint: 'Last 30 days',                    bg: 'rgba(59,130,246,0.1)', fg: '#1d4ed8', icon: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></> },
  ]

  return (
    <div className="section-stack">

      <section className="um-kpi-grid" aria-label="Inventory metrics">
        {kpis.map((k) => (
          <article className="um-kpi-card" key={k.label}>
            <div className="um-kpi-top">
              <span className="um-kpi-icon" style={{ background: k.bg, color: k.fg }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{k.icon}</svg>
              </span>
            </div>
            <p className="um-kpi-value">{k.value}</p>
            <p className="um-kpi-label">{k.label}</p>
            <p className="um-kpi-hint">{k.hint}</p>
          </article>
        ))}
      </section>

      <article className="panel-card">

        <div className="um-toolbar">
          <div className="search-field search-field--compact">
            <svg className="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
            </svg>
            <input type="search" placeholder="Search SKU, model, or warehouse…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className="um-filters">
            <label className="um-filter-group">
              <span className="um-filter-label">Category</span>
              <select className="um-select" value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1) }}>
                <option value="All">All categories</option>
                {INV_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="um-filter-group">
              <span className="um-filter-label">Warehouse</span>
              <select className="um-select" value={whFilter} onChange={(e) => { setWhFilter(e.target.value); setPage(1) }}>
                <option value="All">All warehouses</option>
                {INV_WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
              </select>
            </label>
            <label className="um-filter-group">
              <span className="um-filter-label">Status</span>
              <select className="um-select" value={stFilter} onChange={(e) => { setStFilter(e.target.value); setPage(1) }}>
                <option value="All">All statuses</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Critical</option>
                <option>Out of Stock</option>
              </select>
            </label>
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table um-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>
                  <button type="button" className="inv-sort-btn" onClick={() => handleSort('model')}>
                    Model <SortIcon k="model" />
                  </button>
                </th>
                <th>Category</th>
                <th>
                  <button type="button" className="inv-sort-btn" onClick={() => handleSort('stock')}>
                    Stock <SortIcon k="stock" />
                  </button>
                </th>
                <th>Warehouse</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((device) => {
                const pct = Math.round((device.stock / maxStock) * 100)
                const fillColor = device.stock === 0 ? '#d1d5db' : device.stock > 10 ? '#22c55e' : device.stock >= 5 ? '#f59e0b' : '#ef4444'
                return (
                  <tr key={device.sku}>
                    <td><span className="inv-sku">{device.sku}</span></td>
                    <td className="inv-model">{device.model}</td>
                    <td>{device.category}</td>
                    <td>
                      <div className="inv-stock-cell">
                        <span className="inv-stock-units">{device.stock} units</span>
                        <div className="inv-stock-track">
                          <div className="inv-stock-fill" style={{ width: `${pct}%`, background: fillColor }} />
                        </div>
                      </div>
                    </td>
                    <td>{device.warehouse}</td>
                    <td>{device.condition}</td>
                    <td>
                      <div className="um-actions">
                        <button type="button" className="um-action-btn um-action-view" onClick={() => setViewDev(device)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          <span>View</span>
                        </button>
                        <button type="button" className="um-action-btn um-action-edit" onClick={() => setEditDev(device)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          <span>Edit</span>
                        </button>
                        <button type="button" className="um-action-btn um-action-adjust" onClick={() => setAdjDev(device)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Adjust</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {paginated.length === 0 && (
                <tr><td colSpan="7" className="um-empty">No devices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="um-pagination">
          <span className="um-pagination-info">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * INV_PAGE_SIZE + 1}–{Math.min(safePage * INV_PAGE_SIZE, filtered.length)} of {filtered.length} devices
          </span>
          <div className="um-pagination-controls">
            <button type="button" className="um-page-btn" onClick={() => goTo(safePage - 1)} disabled={safePage === 1}>‹ Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={`um-page-btn ${n === safePage ? 'um-page-btn--active' : ''}`} onClick={() => goTo(n)}>{n}</button>
            ))}
            <button type="button" className="um-page-btn" onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}>Next ›</button>
          </div>
        </div>

      </article>

      {viewDev && <DeviceViewModal device={viewDev} onClose={() => setViewDev(null)} />}
      {editDev && <DeviceEditModal device={editDev} onClose={() => setEditDev(null)} onSave={handleSave} />}
      {adjDev  && <AdjustStockModal device={adjDev} onClose={() => setAdjDev(null)} onSave={handleSave} />}
    </div>
  )
}

// ── Pricing helpers (pure, defined outside component) ────────────────────────
const pricingMargin = (row) => {
  const cost = row.cost ?? 0
  return row.listPrice > 0 ? Math.round(((row.listPrice - cost) / row.listPrice) * 100) : 0
}
const pricingMarginClass = (m) =>
  m > 25 ? 'margin-pill--high' : m >= 10 ? 'margin-pill--mid' : 'margin-pill--low'
const pricingEffectiveMargin = (row) => {
  if (!row.promo || row.promo === 'None') return null
  const match = row.promo.match(/(-?\d+)%/)
  if (!match) return null
  const disc = Math.abs(Number(match[1])) / 100
  const discPrice = row.listPrice * (1 - disc)
  const cost = row.cost ?? 0
  return discPrice > 0 ? Math.round(((discPrice - cost) / discPrice) * 100) : 0
}

export function PricingSection() {
  const [search, setSearch]           = useState('')
  const [pricing, setPricing]         = useState(PRICING_SEED)
  const [savingSkus, setSavingSkus]   = useState(new Set())
  const [savedSkus, setSavedSkus]     = useState(new Set())
  const [tierFilter, setTierFilter]   = useState('All')
  const [marginFilter, setMarginFilter] = useState('All')
  const [promoFilter, setPromoFilter] = useState('All')

  const tiers = useMemo(() => [...new Set(pricing.map((p) => p.tier))], [pricing])

  // ── Smart KPI data ────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const margins = pricing.map(pricingMargin)
    const avg = margins.length ? (margins.reduce((a, b) => a + b, 0) / margins.length).toFixed(1) : '0.0'
    const totalProfit = pricing.reduce((s, r) => s + (r.listPrice - (r.cost ?? 0)), 0)
    const lowCount = margins.filter((m) => m < 10).length
    const promoCount = pricing.filter((r) => r.promo && r.promo !== 'None').length
    return { avg, totalProfit, lowCount, promoCount }
  }, [pricing])

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = pricing
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((p) => p.sku.toLowerCase().includes(q) || p.model.toLowerCase().includes(q))
    if (tierFilter !== 'All') list = list.filter((p) => p.tier === tierFilter)
    if (promoFilter === 'Active') list = list.filter((p) => p.promo !== 'None')
    if (promoFilter === 'None')   list = list.filter((p) => p.promo === 'None')
    if (marginFilter !== 'All') {
      list = list.filter((p) => {
        const m = pricingMargin(p)
        if (marginFilter === 'High') return m > 25
        if (marginFilter === 'Mid')  return m >= 10 && m <= 25
        if (marginFilter === 'Low')  return m < 10
        return true
      })
    }
    return list
  }, [search, pricing, tierFilter, marginFilter, promoFilter])

  // ── Actions ───────────────────────────────────────────────────────────────
  const updatePrice = (sku, field, value) => {
    const num = Number(value)
    if (Number.isNaN(num) || num < 0) return
    setPricing((prev) => prev.map((row) => (row.sku === sku ? { ...row, [field]: num } : row)))
  }

  const saveRow = (sku) => {
    setSavingSkus((prev) => new Set([...prev, sku]))
    setTimeout(() => {
      setSavingSkus((prev) => { const s = new Set(prev); s.delete(sku); return s })
      setSavedSkus((prev) => new Set([...prev, sku]))
    }, 600)
  }

  return (
    <div className="section-stack">

      {/* ── Smart KPI Cards ─────────────────────────────────────────────── */}
      <section className="mini-kpi-grid">
        <MiniKpi label="Avg Margin"           value={`${kpis.avg}%`}                        hint="Across all SKUs" />
        <MiniKpi label="Total Profit / Unit"  value={`$${kpis.totalProfit.toLocaleString()}`} hint="Sum across catalog" />
        <MiniKpi label="Low Margin Devices"   value={kpis.lowCount}                          hint="< 10% — review needed" />
        <MiniKpi label="Active Promotions"    value={kpis.promoCount}                        hint="Discount live" />
      </section>

      <article className="panel-card">

        {/* ── Toolbar ───────────────────────────────────────────────────── */}
        <div className="pricing-toolbar">
          <div className="search-field search-field--compact">
            <svg className="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
            </svg>
            <input type="search" placeholder="Search SKU or device model..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="pricing-filters">
            <label className="um-filter-group">
              <span className="um-filter-label">Tier</span>
              <select className="um-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                <option value="All">All tiers</option>
                {tiers.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="um-filter-group">
              <span className="um-filter-label">Margin</span>
              <select className="um-select" value={marginFilter} onChange={(e) => setMarginFilter(e.target.value)}>
                <option value="All">All margins</option>
                <option value="High">High (&gt;25%)</option>
                <option value="Mid">Mid (10–25%)</option>
                <option value="Low">Low (&lt;10%)</option>
              </select>
            </label>
            <label className="um-filter-group">
              <span className="um-filter-label">Promo</span>
              <select className="um-select" value={promoFilter} onChange={(e) => setPromoFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Active">Active promo</option>
                <option value="None">No promo</option>
              </select>
            </label>
          </div>

        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Model</th>
                <th>Tier</th>
                <th>Cost ($)</th>
                <th>List Price ($)</th>
                <th>Profit ($)</th>
                <th>Margin</th>
                <th>Finance From ($/mo)</th>
                <th>Promotion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const margin    = pricingMargin(row)
                const effMargin = pricingEffectiveMargin(row)
                const profit    = row.listPrice - (row.cost ?? 0)
                const isSaving  = savingSkus.has(row.sku)
                const isSaved   = savedSkus.has(row.sku)
                return (
                  <tr key={row.sku}>
                    <td className="cell-mono">{row.sku}</td>
                    <td className="cell-bold">{row.model}</td>
                    <td><span className="tier-pill">{row.tier}</span></td>
                    <td>
                      <input type="number" className="price-input" value={row.cost ?? 0}
                        onChange={(e) => updatePrice(row.sku, 'cost', e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="price-input" value={row.listPrice}
                        onChange={(e) => updatePrice(row.sku, 'listPrice', e.target.value)} />
                    </td>
                    <td className="pricing-profit">${profit.toLocaleString()}</td>
                    <td>
                      <div className="margin-cell">
                        <span className={`margin-pill ${pricingMarginClass(margin)}`}>+{margin}%</span>
                        {effMargin !== null && (
                          <span className="margin-after-promo">→ {effMargin}% after promo</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <input type="number" className="price-input" value={row.financeFrom}
                        onChange={(e) => updatePrice(row.sku, 'financeFrom', e.target.value)} />
                    </td>
                    <td className="cell-muted">{row.promo}</td>
                    <td>
                      <button type="button"
                        className={`btn-table ${isSaved ? 'btn-table--saved' : 'btn-table--primary'}`}
                        onClick={() => saveRow(row.sku)}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Updating…' : isSaved ? 'Saved ✅' : 'Save'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="11" className="um-empty">No devices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </article>
    </div>
  )
}

// ── Financing helpers ─────────────────────────────────────────────────────────
const FIN_TODAY = new Date('2026-05-24')

const calcMonthly = (principal, apr, term) => {
  const r = apr / 12 / 100
  if (r === 0) return principal / term
  const pow = Math.pow(1 + r, term)
  return (principal * r * pow) / (pow - 1)
}

const finRisk = (apr, status) => {
  if (status === 'Delinquent') return 'High'
  if (apr > 15) return 'High'
  if (apr >= 14) return 'Medium'
  return 'Low'
}

const finRiskOrder = { Low: 0, Medium: 1, High: 2 }

const finDue = (nextDue) => {
  if (!nextDue) return { label: '—', cls: 'fin-due-none', days: Infinity }
  const due  = new Date(nextDue)
  const diff = Math.round((due - FIN_TODAY) / 86400000)
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, cls: 'fin-due-overdue', days: diff }
  if (diff <= 7) return { label: `Due in ${diff}d`,            cls: 'fin-due-soon',    days: diff }
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    cls: 'fin-due-upcoming', days: diff,
  }
}

const finStatusPill = (s) =>
  ({ Active: 'fin-active', Approved: 'fin-approved', 'Under Review': 'fin-under-review', Delinquent: 'fin-delinquent', Settled: 'fin-settled' }[s] ?? '')

// ── Loan Detail Modal ─────────────────────────────────────────────────────────
function LoanViewModal({ loan, onClose }) {
  const monthly = calcMonthly(loan.principal, loan.apr, loan.term)
  const risk    = finRisk(loan.apr, loan.status)
  const due     = finDue(loan.nextDue)
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Loan Details</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="um-modal-body">
          <div className="um-profile-hero">
            <div className="fin-modal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <p className="um-profile-name">{loan.customer}</p>
              <div className="um-profile-badges">
                <span className={`fin-pill ${finStatusPill(loan.status)}`}>{loan.status}</span>
                <span className={`risk-pill risk-${risk.toLowerCase()}`}>{risk} Risk</span>
              </div>
            </div>
          </div>
          <div className="um-info-grid">
            <div className="um-info-item"><span className="um-info-label">Reference</span><span className="um-info-value cell-mono">{loan.ref}</span></div>
            <div className="um-info-item"><span className="um-info-label">Device</span><span className="um-info-value">{loan.device}</span></div>
            <div className="um-info-item"><span className="um-info-label">Principal</span><span className="um-info-value">${loan.principal.toLocaleString()}</span></div>
            <div className="um-info-item"><span className="um-info-label">Term</span><span className="um-info-value">{loan.term} months</span></div>
            <div className="um-info-item"><span className="um-info-label">APR</span><span className="um-info-value">{loan.apr}%</span></div>
            <div className="um-info-item"><span className="um-info-label">Monthly Payment</span><span className="um-info-value fin-modal-monthly">${monthly.toFixed(2)}/mo</span></div>
            <div className="um-info-item"><span className="um-info-label">Total Repayable</span><span className="um-info-value">${(monthly * loan.term).toFixed(2)}</span></div>
            <div className="um-info-item"><span className="um-info-label">Next Due</span><span className={`um-info-value ${due.cls}`}>{due.label}</span></div>
          </div>
        </div>
        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Financing Section ─────────────────────────────────────────────────────────
export function FinancingSection() {
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [termFilter, setTermFilter]     = useState('all')
  const [loans, setLoans]               = useState(FINANCING_SEED)
  const [viewLoan, setViewLoan]         = useState(null)
  const [sortKey, setSortKey]           = useState(null)
  const [sortDir, setSortDir]           = useState('asc')

  const updateStatus = (ref, newStatus) =>
    setLoans((prev) => prev.map((l) => l.ref === ref ? { ...l, status: newStatus } : l))

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const kpis = useMemo(() => {
    const active      = loans.filter((l) => l.status === 'Active' || l.status === 'Approved')
    const delinquent  = loans.filter((l) => l.status === 'Delinquent')
    const outstanding = active.reduce((s, l) => s + l.principal, 0)
    const exposure    = delinquent.reduce((s, l) => s + l.principal, 0)
    const overdue     = delinquent.filter((l) => l.nextDue).reduce((s, l) => s + l.principal, 0)
    return { activeCount: active.length, outstanding, delinquentCount: delinquent.length, exposure, overdue }
  }, [loans])

  const filtered = useMemo(() => {
    let list = [...loans]
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((f) =>
      f.ref.toLowerCase().includes(q) ||
      f.customer.toLowerCase().includes(q) ||
      f.device.toLowerCase().includes(q),
    )
    if (statusFilter !== 'all') list = list.filter((f) => f.status.toLowerCase().replace(' ', '-') === statusFilter)
    if (termFilter   !== 'all') list = list.filter((f) => String(f.term) === termFilter)
    if (sortKey) {
      list = [...list].sort((a, b) => {
        let va, vb
        if (sortKey === 'principal') { va = a.principal; vb = b.principal }
        else if (sortKey === 'risk') {
          va = finRiskOrder[finRisk(a.apr, a.status)]
          vb = finRiskOrder[finRisk(b.apr, b.status)]
        } else if (sortKey === 'nextDue') {
          va = a.nextDue ? new Date(a.nextDue).getTime() : Infinity
          vb = b.nextDue ? new Date(b.nextDue).getTime() : Infinity
        }
        return sortDir === 'asc' ? va - vb : vb - va
      })
    }
    return list
  }, [search, statusFilter, termFilter, sortKey, sortDir, loans])

  const exportLoans = () => {
    const headers = ['Ref', 'Customer', 'Device', 'Amount', 'Term', 'APR', 'Monthly', 'Risk', 'Status', 'Next Due']
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    const rows = filtered.map((l) => {
      const m   = calcMonthly(l.principal, l.apr, l.term)
      const due = finDue(l.nextDue)
      return [l.ref, l.customer, l.device, `$${l.principal}`, `${l.term} mo`, `${l.apr}%`, `$${m.toFixed(2)}/mo`, finRisk(l.apr, l.status), l.status, due.label]
    })
    const csv  = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `loans-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const SortBtn = ({ k, children }) => (
    <button type="button" className="fin-sort-btn" onClick={() => handleSort(k)}>
      {children}
      <span className={`fin-sort-icon ${sortKey === k ? 'fin-sort-icon--active' : ''}`}>
        {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  )

  return (
    <div className="section-stack">

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <section className="mini-kpi-grid">
        <MiniKpi label="Active Loans"      value={kpis.activeCount}                        hint={`$${kpis.outstanding.toLocaleString()} outstanding`} />
        <MiniKpi label="Delinquent"        value={kpis.delinquentCount}                    hint={`${kpis.delinquentCount} accounts at risk`} />
        <MiniKpi label="Total Outstanding" value={`$${kpis.outstanding.toLocaleString()}`} hint="Active + Approved" />
        <MiniKpi label="Overdue Amount"    value={`$${kpis.overdue.toLocaleString()}`}     hint="Requires immediate action" />
      </section>

      <article className="panel-card">

        {/* ── Top action bar ───────────────────────────────────────────── */}
        <div className="fin-top-bar">
          <div className="fin-top-left">
            <div className="search-field search-field--compact">
              <svg className="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
              </svg>
              <input type="search" placeholder="Search ref, customer, or device..." value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="um-filters">
              <label className="um-filter-group">
                <span className="um-filter-label">Status</span>
                <select className="um-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="approved">Approved</option>
                  <option value="under-review">Under Review</option>
                  <option value="delinquent">Delinquent</option>
                  <option value="settled">Settled</option>
                </select>
              </label>
              <label className="um-filter-group">
                <span className="um-filter-label">Term</span>
                <select className="um-select" value={termFilter} onChange={(e) => setTermFilter(e.target.value)}>
                  <option value="all">All terms</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </label>
              {(statusFilter !== 'all' || termFilter !== 'all' || search) && (
                <button type="button" className="fin-reset-btn"
                  onClick={() => { setStatusFilter('all'); setTermFilter('all'); setSearch('') }}>
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="fin-top-actions">
            <button type="button" className="fin-top-btn fin-top-btn--secondary" onClick={exportLoans}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* ── Quick summary bar ─────────────────────────────────────────── */}
        <div className="fin-summary-bar">
          <span>Showing <strong>{filtered.length}</strong> of <strong>{loans.length}</strong> loans</span>
          <span>Total Value: <strong>${filtered.reduce((s, l) => s + l.principal, 0).toLocaleString()}</strong></span>
          <span>Delinquent: <strong className="fin-summary-red">{filtered.filter((l) => l.status === 'Delinquent').length}</strong></span>
        </div>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <div className="table-scroll">
          <table className="admin-table fin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Device</th>
                <th><SortBtn k="principal">Amount</SortBtn></th>
                <th>Term</th>
                <th>APR</th>
                <th>Monthly</th>
                <th><SortBtn k="risk">Risk</SortBtn></th>
                <th>Status</th>
                <th><SortBtn k="nextDue">Next Due</SortBtn></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="11">
                    <div className="fin-empty">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <p className="fin-empty-title">No loans found</p>
                      <p className="fin-empty-hint">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((row) => {
                const monthly  = calcMonthly(row.principal, row.apr, row.term)
                const risk     = finRisk(row.apr, row.status)
                const due      = finDue(row.nextDue)
                const rowClass = [
                  'fin-row',
                  row.status === 'Delinquent'                     ? 'fin-row--delinquent' : '',
                  risk === 'High' && row.status !== 'Delinquent'  ? 'fin-row--high'       : '',
                ].filter(Boolean).join(' ')
                return (
                  <tr key={row.ref} className={rowClass} onClick={() => setViewLoan(row)}>
                    <td className="cell-mono">{row.ref}</td>
                    <td className="cell-bold">{row.customer}</td>
                    <td className="fin-cell-device">{row.device}</td>
                    <td className="fin-cell-amount">${row.principal.toLocaleString()}</td>
                    <td className="fin-cell-light">{row.term} mo</td>
                    <td className="fin-cell-light">{row.apr}%</td>
                    <td className="fin-monthly">${monthly.toFixed(0)}/mo</td>
                    <td><span className={`risk-pill risk-${risk.toLowerCase()}`}>{risk}</span></td>
                    <td><span className={`fin-pill ${finStatusPill(row.status)}`}>{row.status}</span></td>
                    <td><span className={due.cls}>{due.label}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="fin-actions">
                        <button type="button" className="fin-action-btn fin-action-view" onClick={() => setViewLoan(row)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </article>

      {viewLoan && <LoanViewModal loan={viewLoan} onClose={() => setViewLoan(null)} />}
    </div>
  )
}

// ── Sales SVG Charts ──────────────────────────────────────────────────────────
function SvgLineChart({ data, color = '#025c50', valuePrefix = '$' }) {
  const [hovIdx, setHovIdx] = useState(null)
  const W = 500, H = 180, PL = 56, PR = 20, PT = 20, PB = 32
  const plotW = W - PL - PR
  const plotH = H - PT - PB
  const vals  = data.map((d) => d.value)
  const min   = Math.min(...vals)
  const max   = Math.max(...vals)
  const range = max - min || 1
  const xOf   = (i) => PL + (i / Math.max(data.length - 1, 1)) * plotW
  const yOf   = (v) => PT + plotH - ((v - min) / range) * plotH
  const line  = data.map((d, i) => `${xOf(i)},${yOf(d.value)}`).join(' ')
  const area  = [`${xOf(0)},${PT + plotH}`, ...data.map((d, i) => `${xOf(i)},${yOf(d.value)}`), `${xOf(data.length - 1)},${PT + plotH}`].join(' ')
  const fmt   = (v) => v >= 1000 ? `${valuePrefix}${(v / 1000).toFixed(0)}k` : `${valuePrefix}${v.toFixed(0)}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {[0, 0.5, 1].map((t) => {
        const y = PT + t * plotH
        return (
          <g key={t}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{fmt(max - t * range)}</text>
          </g>
        )
      })}
      <polygon points={area} fill={color} opacity="0.08" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const cx = xOf(i), cy = yOf(d.value)
        const isHov = hovIdx === i
        const tipW = 72, tipH = 22
        const tipX = Math.min(Math.max(cx - tipW / 2, PL), W - PR - tipW)
        return (
          <g key={i} style={{ cursor: 'default' }}>
            <rect x={cx - 12} y={PT - 4} width="24" height={plotH + 8} fill="transparent"
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
            <circle cx={cx} cy={cy} r={isHov ? 5.5 : 3.5} fill={color} />
            {isHov && (
              <>
                <line x1={cx} y1={PT} x2={cx} y2={PT + plotH} stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
                <rect x={tipX} y={cy - tipH - 8} width={tipW} height={tipH} rx="4" fill="#1e293b" />
                <text x={tipX + tipW / 2} y={cy - tipH + 7} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">{fmt(d.value)}</text>
              </>
            )}
            <text x={cx} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function SvgBarChart({ data, color = '#1d4ed8' }) {
  const [hovIdx, setHovIdx] = useState(null)
  const W = 500, H = 160, PL = 36, PR = 16, PT = 16, PB = 28
  const plotW = W - PL - PR
  const plotH = H - PT - PB
  const max   = Math.max(...data.map((d) => d.value)) || 1
  const slotW = plotW / data.length
  const barW  = slotW * 0.55
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {[0, 0.5, 1].map((t) => {
        const y = PT + t * plotH
        return (
          <g key={t}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PL - 4} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(max * (1 - t))}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const barH  = (d.value / max) * plotH
        const x     = PL + i * slotW + (slotW - barW) / 2
        const cx    = x + barW / 2
        const isHov = hovIdx === i
        const tipW  = 48
        return (
          <g key={i}>
            <rect x={x} y={PT + plotH - barH} width={barW} height={barH} rx="3"
              fill={color} opacity={isHov ? 1 : 0.75} style={{ cursor: 'default' }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
            {isHov && (
              <>
                <rect x={cx - tipW / 2} y={PT + plotH - barH - 26} width={tipW} height={20} rx="4" fill="#1e293b" />
                <text x={cx} y={PT + plotH - barH - 11} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{d.value}</text>
              </>
            )}
            <text x={cx} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Sale Detail Modal ─────────────────────────────────────────────────────────
function SaleDetailModal({ row, onClose }) {
  const profit        = Math.round(row.revenue * (row.margin / 100))
  const revenuePerOrd = Math.round(row.revenue / row.orders)
  const isPos         = row.growth >= 0
  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <h2 className="um-modal-title">Sales Report — {row.region}</h2>
          <button type="button" className="um-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="um-modal-body">
          <div className="um-profile-hero">
            <div className="sale-modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <p className="um-profile-name">{row.region}</p>
              <div className="um-profile-badges">
                <span className="role-pill">{row.period}</span>
                <span className={`growth-pill ${isPos ? '' : 'growth-pill--neg'}`}>{isPos ? '+' : ''}{row.growth}%</span>
              </div>
            </div>
          </div>
          <div className="um-info-grid">
            <div className="um-info-item"><span className="um-info-label">Revenue</span><span className="um-info-value cell-bold">${row.revenue.toLocaleString()}</span></div>
            <div className="um-info-item"><span className="um-info-label">Orders</span><span className="um-info-value">{row.orders.toLocaleString()}</span></div>
            <div className="um-info-item"><span className="um-info-label">Profit</span><span className="um-info-value sale-modal-profit">${profit.toLocaleString()}</span></div>
            <div className="um-info-item"><span className="um-info-label">Margin</span><span className="um-info-value">{row.margin}%</span></div>
            <div className="um-info-item"><span className="um-info-label">Growth</span><span className={`um-info-value ${isPos ? 'sale-pos' : 'sale-neg'}`}>{isPos ? '+' : ''}{row.growth}%</span></div>
            <div className="um-info-item"><span className="um-info-label">Revenue / Order</span><span className="um-info-value">${revenuePerOrd.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="um-modal-footer">
          <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ── Sales Section ─────────────────────────────────────────────────────────────
export function SalesSection() {
  const [period, setPeriod]         = useState('all')
  const [region, setRegion]         = useState('all')
  const [viewRow, setViewRow]       = useState(null)
  const [sortKey, setSortKey]       = useState(null)
  const [sortDir, setSortDir]       = useState('desc')
  const [chartMode, setChartMode]   = useState('revenue')
  const [showExport, setShowExport] = useState(false)
  const exportRef                   = useRef(null)

  const allRegions = useMemo(() => [...new Set(SALES_SEED.map((s) => s.region))], [])

  const filtered = useMemo(() => {
    let list = SALES_SEED
    if (period === 'may') list = list.filter((s) => s.period.includes('May'))
    else if (period === 'apr') list = list.filter((s) => s.period.includes('Apr'))
    if (region !== 'all') list = list.filter((s) => s.region === region)
    return list
  }, [period, region])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const va = sortKey === 'revenue' ? a.revenue : sortKey === 'profit' ? a.revenue * a.margin / 100 : sortKey === 'growth' ? a.growth : a.orders
      const vb = sortKey === 'revenue' ? b.revenue : sortKey === 'profit' ? b.revenue * b.margin / 100 : sortKey === 'growth' ? b.growth : b.orders
      return sortDir === 'desc' ? vb - va : va - vb
    })
  }, [filtered, sortKey, sortDir])

  const kpis = useMemo(() => {
    const may       = SALES_SEED.filter((s) => s.period.includes('May'))
    const apr       = SALES_SEED.filter((s) => s.period.includes('Apr'))
    const mayRev    = may.reduce((s, r) => s + r.revenue, 0)
    const aprRev    = apr.reduce((s, r) => s + r.revenue, 0)
    const mayOrd    = may.reduce((s, r) => s + r.orders, 0)
    const aprOrd    = apr.reduce((s, r) => s + r.orders, 0)
    const mayProfit = may.reduce((s, r) => s + r.revenue * (r.margin / 100), 0)
    const revGrowth = aprRev > 0 ? ((mayRev - aprRev) / aprRev * 100).toFixed(1) : null
    const ordGrowth = aprOrd > 0 ? ((mayOrd - aprOrd) / aprOrd * 100).toFixed(1) : null
    const revTarget = 620000, ordTarget = 500
    const revPct    = Math.min(Math.round((mayRev / revTarget) * 100), 100)
    const ordPct    = Math.min(Math.round((mayOrd / ordTarget) * 100), 100)
    return { revenue: mayRev, orders: mayOrd, profit: Math.round(mayProfit), avgOrder: mayOrd > 0 ? Math.round(mayRev / mayOrd) : 0, revGrowth, ordGrowth, revTarget, ordTarget, revPct, ordPct }
  }, [])

  const regionShares = useMemo(() => {
    const total = filtered.reduce((s, r) => s + r.revenue, 0)
    const map   = {}
    filtered.forEach((r) => { map[r.region] = (map[r.region] ?? 0) + r.revenue })
    return Object.entries(map)
      .map(([reg, rev]) => ({ region: reg, rev, pct: total > 0 ? ((rev / total) * 100).toFixed(1) : '0' }))
      .sort((a, b) => b.rev - a.rev)
  }, [filtered])

  const avgMarginAll = useMemo(() => {
    const totalRev    = SALES_SEED.reduce((s, r) => s + r.revenue, 0)
    const totalProfit = SALES_SEED.reduce((s, r) => s + r.revenue * (r.margin / 100), 0)
    return totalRev > 0 ? totalProfit / totalRev : 0.26
  }, [])

  const profitTrend = useMemo(() =>
    OVERVIEW_REVENUE_TREND.map((d) => ({ label: d.month, value: Math.round(d.revenue * avgMarginAll) }))
  , [avgMarginAll])

  const extremes = useMemo(() => {
    if (sorted.length === 0) return {}
    const revs    = sorted.map((r) => r.revenue)
    const profits = sorted.map((r) => r.revenue * r.margin / 100)
    const growths = sorted.map((r) => r.growth)
    return {
      maxRevIdx:  revs.indexOf(Math.max(...revs)),
      maxProfIdx: profits.indexOf(Math.max(...profits)),
      maxGrowIdx: growths.indexOf(Math.max(...growths)),
      minGrowIdx: growths.indexOf(Math.min(...growths)),
    }
  }, [sorted])

  const insights = useMemo(() => {
    const list = []
    if (regionShares.length > 0) list.push(`${regionShares[0].region} drives ${regionShares[0].pct}% of total revenue.`)
    if (kpis.revGrowth !== null) {
      const g = Number(kpis.revGrowth)
      list.push(`Revenue ${g >= 0 ? 'grew' : 'fell'} ${Math.abs(g)}% compared to last month.`)
    }
    const may = SALES_SEED.filter((s) => s.period.includes('May'))
    if (may.length > 0) {
      const fastest = may.reduce((best, r) => r.growth > best.growth ? r : best)
      if (fastest.growth > 0) list.push(`${fastest.region} is the fastest-growing region at +${fastest.growth}%.`)
      const neg = may.filter((r) => r.growth < 0)
      if (neg.length > 0) list.push(`${neg.map((r) => r.region).join(', ')} showing negative growth — attention needed.`)
    }
    if (kpis.revPct >= 85) list.push(`Revenue is at ${kpis.revPct}% of the $${(kpis.revTarget / 1000).toFixed(0)}K monthly target.`)
    return list
  }, [regionShares, kpis])

  const doSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortTh = ({ k, children }) => (
    <th onClick={() => doSort(k)} className="sale-sort-th">
      {children}<span className="fin-sort-icon">{sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'}</span>
    </th>
  )

  const exportSales = (format = 'csv') => {
    setShowExport(false)
    if (format === 'pdf') { alert('PDF export requires a print library. Use CSV for now.'); return }
    const headers = ['Period', 'Region', 'Orders', 'Revenue', 'Profit', 'Margin', 'Growth', 'Rev/Order']
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
    const rows = filtered.map((r) => {
      const profit = Math.round(r.revenue * (r.margin / 100))
      return [r.period, r.region, r.orders, `$${r.revenue}`, `$${profit}`, `${r.margin}%`, `${r.growth >= 0 ? '+' : ''}${r.growth}%`, `$${Math.round(r.revenue / r.orders)}`]
    })
    const csv  = [headers, ...rows].map((row) => row.map(esc).join(',')).join('\n')
    const ext  = format === 'excel' ? 'xls' : 'csv'
    const mime = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;'
    const blob = new Blob([csv], { type: mime })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `sales-${new Date().toISOString().slice(0, 10)}.${ext}`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const mainChartData = chartMode === 'revenue'
    ? OVERVIEW_REVENUE_TREND.map((d) => ({ label: d.month, value: d.revenue }))
    : profitTrend

  return (
    <div className="section-stack">

      {/* ── KPI Cards with progress bars ─────────────────────────────────── */}
      <section className="mini-kpi-grid">
        <article className="mini-kpi">
          <p className="mini-kpi-label">Revenue (MTD)</p>
          <p className="mini-kpi-value">${kpis.revenue.toLocaleString()}</p>
          {kpis.revGrowth && <p className={`mini-kpi-hint ${Number(kpis.revGrowth) >= 0 ? 'sale-pos' : 'sale-neg'}`}>{Number(kpis.revGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(kpis.revGrowth))}% vs last month</p>}
          <div className="sale-kpi-bar-track"><div className="sale-kpi-bar-fill" style={{ width: `${kpis.revPct}%` }} /></div>
          <p className="sale-kpi-target">{kpis.revPct}% of ${(kpis.revTarget / 1000).toFixed(0)}K target</p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Orders (MTD)</p>
          <p className="mini-kpi-value">{kpis.orders.toLocaleString()}</p>
          {kpis.ordGrowth && <p className={`mini-kpi-hint ${Number(kpis.ordGrowth) >= 0 ? 'sale-pos' : 'sale-neg'}`}>{Number(kpis.ordGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(kpis.ordGrowth))}% vs last month</p>}
          <div className="sale-kpi-bar-track"><div className="sale-kpi-bar-fill sale-kpi-bar-fill--blue" style={{ width: `${kpis.ordPct}%` }} /></div>
          <p className="sale-kpi-target">{kpis.ordPct}% of {kpis.ordTarget} target</p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Profit (MTD)</p>
          <p className="mini-kpi-value">${kpis.profit.toLocaleString()}</p>
          <p className="mini-kpi-hint">Gross margin applied</p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Avg Order Value</p>
          <p className="mini-kpi-value">${kpis.avgOrder.toLocaleString()}</p>
          <p className="mini-kpi-hint">Across all regions</p>
        </article>
      </section>

      {/* ── Charts (2:1 main + sidebar, profit chart full-width below) ────── */}
      <div className="sales-charts-grid sales-charts-grid--wide">
        <article className="panel-card sales-chart-card">
          <div className="sales-chart-header">
            <p className="sales-chart-title">{chartMode === 'revenue' ? 'Revenue' : 'Profit'} Trend (7 months)</p>
            <div className="sales-chart-toggle">
              <button type="button" className={`sale-toggle-btn ${chartMode === 'revenue' ? 'sale-toggle-btn--active' : ''}`} onClick={() => setChartMode('revenue')}>Revenue</button>
              <button type="button" className={`sale-toggle-btn ${chartMode === 'profit' ? 'sale-toggle-btn--active' : ''}`} onClick={() => setChartMode('profit')}>Profit</button>
            </div>
          </div>
          <SvgLineChart data={mainChartData} color={chartMode === 'revenue' ? '#025c50' : '#15803d'} valuePrefix="$" />
        </article>
        <article className="panel-card sales-chart-card">
          <p className="sales-chart-title">Orders per Month</p>
          <SvgBarChart data={OVERVIEW_ORDERS_TREND.map((d) => ({ label: d.month, value: d.orders }))} color="#1d4ed8" />
        </article>
      </div>

      <article className="panel-card">

        {/* ── Controls ─────────────────────────────────────────────────── */}
        <div className="sales-toolbar">
          <div className="um-filters" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <label className="um-filter-group">
              <span className="um-filter-label">Period</span>
              <select className="um-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="all">All periods</option>
                <option value="may">May 2026</option>
                <option value="apr">April 2026</option>
              </select>
            </label>
            <label className="um-filter-group">
              <span className="um-filter-label">Region</span>
              <select className="um-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="all">All regions</option>
                {allRegions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            {(period !== 'all' || region !== 'all') && (
              <button type="button" className="fin-reset-btn" onClick={() => { setPeriod('all'); setRegion('all') }}>Reset</button>
            )}
          </div>
          <div className="sales-actions" ref={exportRef} style={{ position: 'relative' }}>
            <button type="button" className="fin-top-btn fin-top-btn--secondary" onClick={() => setShowExport((v) => !v)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export ▾
            </button>
            {showExport && (
              <div className="sale-export-dropdown">
                <button type="button" onClick={() => exportSales('csv')}>CSV (.csv)</button>
                <button type="button" onClick={() => exportSales('excel')}>Excel (.xls)</button>
                <button type="button" onClick={() => exportSales('pdf')}>PDF (print)</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Insights ─────────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <div className="sales-insights">
            <p className="sales-insights-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Insights
            </p>
            <ul className="sales-insights-list">
              {insights.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* ── Region breakdown with ranking ─────────────────────────────── */}
        {regionShares.length > 0 && (
          <div className="sales-regions">
            <p className="sales-regions-title">Revenue by Region</p>
            <div className="sales-region-bars">
              {regionShares.map((r, idx) => (
                <div key={r.region} className="sales-region-row">
                  <span className="sales-region-rank">{idx === 0 ? '🏆' : `#${idx + 1}`}</span>
                  <span className="sales-region-name">{r.region}</span>
                  <div className="sales-region-track">
                    <div className="sales-region-fill" style={{ width: `${r.pct}%`, opacity: idx === 0 ? 1 : idx === 1 ? 0.7 : 0.5 }} />
                  </div>
                  <span className="sales-region-pct">{r.pct}%</span>
                  <span className="sales-region-rev">${r.rev.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Table with sorting + extreme highlights ───────────────────── */}
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Region</th>
                <SortTh k="orders">Orders</SortTh>
                <SortTh k="revenue">Revenue</SortTh>
                <SortTh k="profit">Profit</SortTh>
                <th>Margin</th>
                <SortTh k="growth">Growth</SortTh>
                <th>Rev / Order</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => {
                const profit   = Math.round(row.revenue * (row.margin / 100))
                const rpo      = Math.round(row.revenue / row.orders)
                const isPos    = row.growth >= 0
                const lowMarg  = row.margin < 25
                const isMaxRev = extremes.maxRevIdx === idx
                const isMaxPrf = extremes.maxProfIdx === idx
                const isMaxGrw = extremes.maxGrowIdx === idx
                const isMinGrw = extremes.minGrowIdx === idx
                return (
                  <tr key={`${row.period}-${row.region}`}
                    className={`sale-row ${!isPos ? 'sale-row--neg' : ''}`}
                    onClick={() => setViewRow(row)}
                  >
                    <td className="fin-cell-light">{row.period}</td>
                    <td className="cell-bold">{row.region}</td>
                    <td>{row.orders.toLocaleString()}</td>
                    <td className={`sale-cell-revenue${isMaxRev ? ' sale-cell--best' : ''}`}>${row.revenue.toLocaleString()}</td>
                    <td className={`sale-cell-profit${isMaxPrf ? ' sale-cell--best' : ''}`}>${profit.toLocaleString()}</td>
                    <td className={lowMarg ? 'sale-cell-margin-warn' : 'fin-cell-light'}>{row.margin}%</td>
                    <td className={isMinGrw ? 'sale-cell--worst' : ''}>
                      <span className={`growth-pill ${isPos ? '' : 'growth-pill--neg'}`}>{isPos ? '+' : ''}{row.growth}%</span>
                      {isMaxGrw && <span className="sale-star"> ★</span>}
                    </td>
                    <td className="fin-cell-light">${rpo.toLocaleString()}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="fin-action-btn fin-action-view" onClick={() => setViewRow(row)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
              {sorted.length === 0 && (
                <tr><td colSpan="9" className="um-empty">No sales data for this period / region.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </article>

      {viewRow && <SaleDetailModal row={viewRow} onClose={() => setViewRow(null)} />}
    </div>
  )
}

// ── Logs helpers ──────────────────────────────────────────────────────────────
const LOG_NOW      = new Date('2026-05-20T11:42:18')
const LOG_MODULES  = ['Auth', 'Inventory', 'Payments', 'Pricing', 'Sales', 'Users']
const LOG_TODAY    = new Date('2026-05-20T00:00:00')
const LOG_YEST     = new Date('2026-05-19T00:00:00')

const MODULE_TIPS = {
  Auth:      'Authentication & access control',
  Inventory: 'Stock levels & warehouse sync',
  Payments:  'Payments, webhooks & reconciliation',
  Pricing:   'Price management & promotions',
  Sales:     'Orders, revenue & reporting',
  Users:     'User accounts & roles',
}

const LEVEL_ICON = { INFO: 'ℹ', WARN: '▲', ERROR: '✕' }

function logRelTime(timeStr) {
  const then  = new Date(timeStr.replace(' ', 'T'))
  const mins  = Math.floor((LOG_NOW - then) / 60000)
  const hrs   = Math.floor(mins / 60)
  const days  = Math.floor(hrs / 24)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

const LIVE_POOL = [
  { level: 'INFO',  module: 'Auth',      message: 'Session token refreshed for USR-1001.' },
  { level: 'WARN',  module: 'Inventory', message: 'Low stock alert for SKU DV-IP15P-128 (4 units).' },
  { level: 'INFO',  module: 'Sales',     message: 'New order placed from Kigali.' },
  { level: 'WARN',  module: 'Payments',  message: 'Payout request queued for vendor VND-551.' },
]

export function LogsSection() {
  const [search, setSearch]       = useState('')
  const [level, setLevel]         = useState('all')
  const [mod, setMod]             = useState('all')
  const [timeWin, setTimeWin]     = useState('all')
  const [expanded, setExpanded]   = useState(new Set())
  const [resolved, setResolved]   = useState(() => new Set(LOGS_SEED.filter((l) => l.resolved).map((l) => l.id)))
  const [live, setLive]           = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [logs, setLogs]           = useState(LOGS_SEED)
  const exportRef                 = useRef(null)
  const livePoolIdx               = useRef(0)

  useEffect(() => {
    if (!live) return
    const timer = setInterval(() => {
      const f   = LIVE_POOL[livePoolIdx.current % LIVE_POOL.length]
      const now = new Date(LOG_NOW.getTime() + (livePoolIdx.current + 1) * 30000)
      const ts  = now.toISOString().replace('T', ' ').slice(0, 19)
      setLogs((prev) => [{ id: `LOG-LIVE-${Date.now()}`, time: ts, level: f.level, module: f.module, message: f.message }, ...prev])
      livePoolIdx.current++
    }, 8000)
    return () => clearInterval(timer)
  }, [live])

  useEffect(() => {
    if (!showExport) return
    const h = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setShowExport(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showExport])

  const toggleExpand  = (id) => setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const markResolved  = (id) => setResolved((p) => { const n = new Set(p); n.add(id); return n })
  const copyLog       = (log) => navigator.clipboard?.writeText(`[${log.time}] [${log.level}] [${log.module}] ${log.message}`).catch(() => {})

  const filtered = useMemo(() => {
    let list = logs
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((l) => l.id.toLowerCase().includes(q) || l.module.toLowerCase().includes(q) || l.message.toLowerCase().includes(q))
    if (level !== 'all') list = list.filter((l) => l.level.toLowerCase() === level)
    if (mod   !== 'all') list = list.filter((l) => l.module === mod)
    if (timeWin !== 'all') {
      const cutoff = new Date(LOG_NOW)
      if (timeWin === '1h')  cutoff.setHours(cutoff.getHours() - 1)
      if (timeWin === '24h') cutoff.setDate(cutoff.getDate() - 1)
      if (timeWin === '7d')  cutoff.setDate(cutoff.getDate() - 7)
      list = list.filter((l) => new Date(l.time.replace(' ', 'T')) >= cutoff)
    }
    return list
  }, [logs, search, level, mod, timeWin])

  const stats = useMemo(() => {
    const isToday = (l) => { const t = new Date(l.time.replace(' ', 'T')); return t >= LOG_TODAY }
    const isYest  = (l) => { const t = new Date(l.time.replace(' ', 'T')); return t >= LOG_YEST && t < LOG_TODAY }

    const infoCnt        = logs.filter((l) => l.level === 'INFO').length
    const warnCnt        = logs.filter((l) => l.level === 'WARN').length
    const errorCnt       = logs.filter((l) => l.level === 'ERROR').length
    const unresolved     = logs.filter((l) => l.level === 'ERROR' && !resolved.has(l.id)).length
    const warnInPayments = logs.filter((l) => l.level === 'WARN' && l.module === 'Payments').length
    const total          = logs.length || 1

    const todayErr  = logs.filter((l) => l.level === 'ERROR' && isToday(l)).length
    const yestErr   = logs.filter((l) => l.level === 'ERROR' && isYest(l)).length
    const todayWarn = logs.filter((l) => l.level === 'WARN'  && isToday(l)).length
    const yestWarn  = logs.filter((l) => l.level === 'WARN'  && isYest(l)).length
    const errTrend  = todayErr - yestErr
    const warnTrend = todayWarn - yestWarn

    return { infoCnt, warnCnt, errorCnt, unresolved, warnInPayments, total, errTrend, warnTrend, yestErr, yestWarn }
  }, [logs, resolved])

  const alerts = useMemo(() => {
    const list = []
    const byMod = {}
    logs.filter((l) => l.level === 'WARN').forEach((l) => { byMod[l.module] = (byMod[l.module] ?? 0) + 1 })
    const topWarn = Object.entries(byMod).sort((a, b) => b[1] - a[1])[0]
    if (topWarn) list.push({
      type: 'warn', icon: '⚠️',
      text: `${topWarn[0]} module generating most warnings (${topWarn[1]} logs).`,
      filter: { level: 'warn', mod: topWarn[0] }, hint: 'Click to filter',
    })
    const payErr = logs.filter((l) => l.level === 'ERROR' && l.module === 'Payments').length
    if (payErr > 0) list.push({
      type: 'error', icon: '❗',
      text: `${payErr} payment error${payErr > 1 ? 's' : ''} — manual review recommended.`,
      filter: { level: 'error', mod: 'Payments' }, hint: 'Click to filter',
    })
    if (stats.errTrend > 0) list.push({
      type: 'error', icon: '📈',
      text: `Errors up +${stats.errTrend} vs yesterday (${stats.yestErr} → ${stats.yestErr + stats.errTrend}).`,
      filter: { level: 'error' }, hint: 'Click to filter errors',
    })
    if (stats.warnTrend < 0) list.push({
      type: 'ok', icon: '✅',
      text: `Warnings down ${stats.warnTrend} vs yesterday — improving.`,
    })
    if (stats.unresolved === 0) list.push({ type: 'ok', icon: '✅', text: 'No unresolved critical errors.' })
    else list.push({
      type: 'error', icon: '❗',
      text: `${stats.unresolved} unresolved error${stats.unresolved > 1 ? 's' : ''} require attention.`,
      filter: { level: 'error' }, hint: 'Click to filter',
    })
    return list
  }, [logs, stats.unresolved, stats.errTrend, stats.warnTrend, stats.yestErr])

  const exportLogs = (fmt) => {
    setShowExport(false)
    if (fmt === 'json') {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href = url; a.download = `logs-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    } else {
      const esc  = (v) => `"${String(v).replace(/"/g, '""')}"`
      const rows = filtered.map((l) => [l.id, l.time, l.level, l.module, l.message])
      const csv  = [['ID', 'Time', 'Level', 'Module', 'Message'], ...rows].map((r) => r.map(esc).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a'); a.href = url; a.download = `logs-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    }
  }

  const hasFilters = search || level !== 'all' || mod !== 'all' || timeWin !== 'all'

  return (
    <div className="section-stack">

      {/* ── KPI Cards — Actionable ────────────────────────────────────────── */}
      <section className="mini-kpi-grid">
        <article className="mini-kpi">
          <p className="mini-kpi-label">Events (24h)</p>
          <p className="mini-kpi-value">{logs.length.toLocaleString()}</p>
          <p className="mini-kpi-hint">All modules</p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Warnings</p>
          <p className="mini-kpi-value" style={{ color: '#b45309' }}>{stats.warnCnt}</p>
          <p className="mini-kpi-hint" style={{ color: '#b45309' }}>{stats.warnInPayments} in Payments</p>
          <p className={`mini-kpi-hint ${stats.warnTrend > 0 ? 'sale-neg' : 'sale-pos'}`}>
            {stats.warnTrend > 0 ? `↑ +${stats.warnTrend}` : stats.warnTrend < 0 ? `↓ ${stats.warnTrend}` : '→ 0'} vs yesterday
          </p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Errors</p>
          <p className="mini-kpi-value" style={{ color: '#dc2626' }}>{stats.errorCnt} critical</p>
          <p className="mini-kpi-hint" style={{ color: '#dc2626' }}>{stats.unresolved} unresolved</p>
          <p className={`mini-kpi-hint ${stats.errTrend > 0 ? 'sale-neg' : 'sale-pos'}`}>
            {stats.errTrend > 0 ? `↑ +${stats.errTrend}` : stats.errTrend < 0 ? `↓ ${stats.errTrend}` : '→ 0'} vs yesterday
          </p>
        </article>
        <article className="mini-kpi">
          <p className="mini-kpi-label">Audit Retention</p>
          <p className="mini-kpi-value">90 days</p>
          <p className="mini-kpi-hint">Policy enforced</p>
        </article>
      </section>

      {/* ── Severity breakdown + Alerts ───────────────────────────────────── */}
      <div className="log-panels-row">
        <article className="panel-card log-sev-card">
          <p className="log-sev-title">Severity Breakdown</p>
          <div className="log-sev-bars">
            {[
              { label: 'INFO',  cls: 'info',  count: stats.infoCnt  },
              { label: 'WARN',  cls: 'warn',  count: stats.warnCnt  },
              { label: 'ERROR', cls: 'error', count: stats.errorCnt },
            ].map(({ label, cls, count }) => (
              <div key={label} className="log-sev-row">
                <span className={`log-pill log-${cls} log-sev-label`}>{label}</span>
                <div className="log-sev-track">
                  <div className={`log-sev-fill log-sev-fill--${cls}`} style={{ width: `${(count / stats.total) * 100}%` }} />
                </div>
                <span className="log-sev-count">{count}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel-card log-alerts-card">
          <p className="log-sev-title">Alerts</p>
          <ul className="log-alerts-list">
            {alerts.map((a, i) => (
              <li key={i}
                className={`log-alert log-alert--${a.type} ${a.filter ? 'log-alert--clickable' : ''}`}
                role={a.filter ? 'button' : undefined}
                title={a.hint}
                onClick={() => { if (a.filter) { if (a.filter.level) setLevel(a.filter.level); if (a.filter.mod) setMod(a.filter.mod) } }}>
                <span className="log-alert-icon">{a.icon}</span>
                <span className="log-alert-text">{a.text}</span>
                {a.filter && <span className="log-alert-arrow">→</span>}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="panel-card">

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="log-toolbar">
          <div className="log-toolbar-left">
            <div className="search-field search-field--compact">
              <svg className="icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
              </svg>
              <input type="search" placeholder="Search ID, module, message..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="um-filters" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <label className="um-filter-group">
                <span className="um-filter-label">Level</span>
                <select className="um-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="all">All levels</option>
                  <option value="info">INFO</option>
                  <option value="warn">WARN</option>
                  <option value="error">ERROR</option>
                </select>
              </label>
              <label className="um-filter-group">
                <span className="um-filter-label">Module</span>
                <select className="um-select" value={mod} onChange={(e) => setMod(e.target.value)}>
                  <option value="all">All modules</option>
                  {LOG_MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label className="um-filter-group">
                <span className="um-filter-label">Time</span>
                <select className="um-select" value={timeWin} onChange={(e) => setTimeWin(e.target.value)}>
                  <option value="all">All time</option>
                  <option value="1h">Last 1h</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7 days</option>
                </select>
              </label>
              {hasFilters && (
                <button type="button" className="fin-reset-btn" onClick={() => { setSearch(''); setLevel('all'); setMod('all'); setTimeWin('all') }}>Reset</button>
              )}
            </div>
          </div>
          <div className="log-toolbar-right">
            <button type="button" className={`log-live-btn ${live ? 'log-live-btn--on' : ''}`} onClick={() => setLive((v) => !v)}>
              <span className={`log-live-dot ${live ? 'log-live-dot--pulse' : 'log-live-dot--off'}`} />
              {live ? '🟢 Live updating' : '⏸ Paused'}
            </button>
            <div ref={exportRef} style={{ position: 'relative' }}>
              <button type="button" className="fin-top-btn fin-top-btn--secondary" onClick={() => setShowExport((v) => !v)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export ▾
              </button>
              {showExport && (
                <div className="sale-export-dropdown">
                  <button type="button" onClick={() => exportLogs('csv')}>CSV (.csv)</button>
                  <button type="button" onClick={() => exportLogs('json')}>JSON (.json)</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Summary bar ─────────────────────────────────────────────────── */}
        <div className="log-summary-bar">
          Showing <strong>{filtered.length}</strong> of <strong>{logs.length}</strong> logs
          {hasFilters && <span className="log-summary-filtered"> · filtered</span>}
        </div>

        {/* ── Table with expandable rows + actions ────────────────────────── */}
        <div className="table-scroll">
          <table className="admin-table admin-table--logs">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Log ID</th>
                <th style={{ width: '80px'  }}>Time</th>
                <th style={{ width: '72px'  }}>Level</th>
                <th style={{ width: '96px'  }}>Module</th>
                <th>Message</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const isExp = expanded.has(log.id)
                const isRes = resolved.has(log.id)
                const isErr = log.level === 'ERROR'
                const hasDetail = !!(log.stack || log.payload)
                return (
                  <>
                    <tr key={log.id}
                      className={`log-row log-row--${log.level.toLowerCase()} ${isRes ? 'log-row--resolved' : ''}`}
                      onClick={() => hasDetail && toggleExpand(log.id)}
                      style={{ cursor: hasDetail ? 'pointer' : 'default' }}>
                      <td className="cell-mono">
                        {log.id}
                        {log.count > 1 && <span className="log-repeat-badge">×{log.count}</span>}
                      </td>
                      <td className="cell-muted log-time-cell" title={log.time}>{logRelTime(log.time)}</td>
                      <td>
                        <span className={`log-pill log-${log.level.toLowerCase()}`}>
                          <span className="log-level-icon" aria-hidden>{LEVEL_ICON[log.level]}</span>
                          {log.level}
                        </span>
                      </td>
                      <td><span className="module-pill" title={MODULE_TIPS[log.module]}>{log.module}</span></td>
                      <td className="log-msg-cell">
                        {hasDetail && <span className="log-expand-caret">{isExp ? '▾' : '▸'}</span>}
                        {log.message}
                        {isRes && <span className="log-resolved-tag">Resolved</span>}
                      </td>
                      <td className="log-actions-cell" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="log-act log-act--copy" title="Copy to clipboard" onClick={() => copyLog(log)}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy
                        </button>
                        {isErr && !isRes && (
                          <button type="button" className="log-act log-act--resolve" onClick={() => markResolved(log.id)}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExp && (
                      <tr key={`${log.id}-exp`} className="log-expand-row">
                        <td colSpan="6">
                          <div className="log-expand-body">
                            {log.stack && (
                              <div className="log-expand-section">
                                <p className="log-expand-label">Stack Trace</p>
                                <pre className="log-stack-trace">{log.stack}</pre>
                              </div>
                            )}
                            {log.payload && (
                              <div className="log-expand-section">
                                <p className="log-expand-label">Payload</p>
                                <pre className="log-stack-trace">{JSON.stringify(log.payload, null, 2)}</pre>
                              </div>
                            )}
                            <div className="log-expand-meta">
                              <span>Full ID: <strong>{log.id}</strong></span>
                              <span>Timestamp: <strong>{log.time}</strong></span>
                              <span>Module: <strong>{log.module}</strong></span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="um-empty">No logs match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </article>
    </div>
  )
}

// ─── Admin Profile Section ────────────────────────────────────────────────────

export function ProfileSection() {
  const fileRef = useRef(null)
  const [profilePic, setProfilePic] = useState(null)
  const [editName, setEditName] = useState(false)
  const [name, setName] = useState(ADMIN_PROFILE.name)
  const [editEmail, setEditEmail] = useState(false)
  const [email, setEmail] = useState(ADMIN_PROFILE.email)
  const [editPhone, setEditPhone] = useState(false)
  const [phone, setPhone] = useState(ADMIN_PROFILE.phone)
  const [saved, setSaved] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setProfilePic(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const activityColors = {
    pricing: '#025c50', users: '#f0ab3c', finance: '#3b82f6',
    inventory: '#8b5cf6', reports: '#06b6d4', system: '#6b7280',
  }

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
      content: editPhone
        ? <input className="prf-inline-input" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setEditPhone(false)} autoFocus />
        : <span className="prf-info-val">{phone} <button type="button" className="prf-edit-btn" onClick={() => setEditPhone(true)}>Edit</button></span>,
    },
    {
      icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
      label: 'Location',
      content: <span className="prf-info-val">{ADMIN_PROFILE.location}</span>,
    },
    {
      icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
      label: 'Department',
      content: <span className="prf-info-val">{ADMIN_PROFILE.department}</span>,
    },
    {
      icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
      label: 'Member Since',
      content: <span className="prf-info-val">{ADMIN_PROFILE.since}</span>,
    },
  ]

  return (
    <div className="prf-page">

      {/* ── Left column ── */}
      <div className="prf-left">
        <div className="prf-card panel-card">
          <div className="prf-cover">
            <div className="prf-cover-accent" />
            <div className="prf-cover-accent2" />
          </div>
          <div className="prf-card-body">

            <div className="prf-avatar-ring" onClick={() => fileRef.current?.click()}>
              {profilePic
                ? <img src={profilePic} alt="Profile" className="prf-avatar-img" />
                : <div className="prf-avatar-initials">{ADMIN_PROFILE.initials}</div>
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
            <span className="prf-role-tag">{ADMIN_PROFILE.role}</span>
            <p className="prf-id">{ADMIN_PROFILE.id}</p>

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
          {ADMIN_PLATFORM_STATS.map((s) => (
            <div key={s.label} className="prf-stat-card">
              <p className="prf-stat-num">{s.value}</p>
              <p className="prf-stat-label">{s.label}</p>
              <p className="prf-stat-hint">{s.hint}</p>
            </div>
          ))}
        </div>

        <article className="prf-section-card">
          <h3 className="prf-section-title">Platform Snapshot</h3>
          <div className="ap-snapshot-grid">
            {[
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>, val: '6', label: 'Platform Users', cls: 'ap-snap-teal' },
              { icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />, val: '61', label: 'Devices in Stock', cls: 'ap-snap-amber' },
              { icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, val: '$124,592', label: 'Monthly Revenue', cls: 'ap-snap-green' },
              { icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, val: '4.92 / 5', label: 'Trust Score', cls: 'ap-snap-purple' },
              { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>, val: '5', label: 'Active Loans', cls: 'ap-snap-teal' },
              { icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />, val: '842', label: 'New Orders', cls: 'ap-snap-amber' },
            ].map((item) => (
              <div key={item.label} className="ap-snapshot-item">
                <span className={`ap-snapshot-icon ${item.cls}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{item.icon}</svg>
                </span>
                <div>
                  <p className="ap-snap-val">{item.val}</p>
                  <p className="ap-snap-label">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="prf-section-card">
          <h3 className="prf-section-title">Recent Activity</h3>
          <ul className="prf-timeline">
            {ADMIN_ACTIVITY_LOG.map((a) => (
              <li key={a.id} className="prf-timeline-item">
                <span className="prf-timeline-dot" style={{ background: activityColors[a.type] ?? '#6b7280' }} />
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
