import { useMemo, useState } from 'react'
import { FO_CUSTOMERS_SEED } from '../../../data/mockData'
import { StatusBadge, RiskBadge } from './FoBadges'
import FoCustomerDetail from './FoCustomerDetail'
import type { FoCustomer } from './foHelpers'

export default function FoCustomersPage() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected]       = useState<FoCustomer | null>(null)

  const filtered = useMemo(() => {
    let list = FO_CUSTOMERS_SEED
    const q = search.trim().toLowerCase()
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    if (statusFilter !== 'all') list = list.filter((c) => c.status.toLowerCase() === statusFilter)
    return list
  }, [search, statusFilter])

  const exportCustomers = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Borrowed', 'Risk', 'Status']
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`
    const rows = filtered.map((c) => [c.id, c.name, c.email, c.phone, c.totalBorrowed, c.riskLevel, c.status])
    const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  if (selected) {
    return <FoCustomerDetail customer={selected} onBack={() => setSelected(null)} />
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
            <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Total Borrowed</th><th>Risk</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="fo-table-empty">No customers match your filters.</td></tr>
                : filtered.map((c) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
