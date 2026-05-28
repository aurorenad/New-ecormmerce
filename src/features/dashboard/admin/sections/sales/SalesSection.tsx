import { useMemo, useRef, useState } from 'react'
import { SALES_SEED, OVERVIEW_REVENUE_TREND, OVERVIEW_ORDERS_TREND } from '../../../../../data/mockData'
import type { SalesRow } from '../../../shared/types/dashboard.types'
import SvgLineChart from './SvgLineChart'
import SvgBarChart from './SvgBarChart'
import SaleDetailModal from './SaleDetailModal'
import '../../../shared/styles/dashboard-shared.css'
import './SalesSection.css'

export default function SalesSection() {
  const [period, setPeriod]         = useState('all')
  const [region, setRegion]         = useState('all')
  const [viewRow, setViewRow]       = useState<SalesRow | null>(null)
  const [sortKey, setSortKey]       = useState<string | null>(null)
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc')
  const [chartMode, setChartMode]   = useState<'revenue' | 'profit'>('revenue')
  const [showExport, setShowExport] = useState(false)
  const exportRef                   = useRef<HTMLDivElement>(null)

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
    const revPct = Math.min(Math.round((mayRev / revTarget) * 100), 100)
    const ordPct = Math.min(Math.round((mayOrd / ordTarget) * 100), 100)
    return { revenue: mayRev, orders: mayOrd, profit: Math.round(mayProfit), avgOrder: mayOrd > 0 ? Math.round(mayRev / mayOrd) : 0, revGrowth, ordGrowth, revTarget, ordTarget, revPct, ordPct }
  }, [])

  const regionShares = useMemo(() => {
    const total = filtered.reduce((s, r) => s + r.revenue, 0)
    const map: Record<string, number> = {}
    filtered.forEach((r) => { map[r.region] = (map[r.region] ?? 0) + r.revenue })
    return Object.entries(map).map(([reg, rev]) => ({ region: reg, rev, pct: total > 0 ? ((rev / total) * 100).toFixed(1) : '0' })).sort((a, b) => b.rev - a.rev)
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
    if (sorted.length === 0) return {} as Record<string, number>
    const revs    = sorted.map((r) => r.revenue)
    const profits = sorted.map((r) => r.revenue * r.margin / 100)
    const growths = sorted.map((r) => r.growth)
    return { maxRevIdx: revs.indexOf(Math.max(...revs)), maxProfIdx: profits.indexOf(Math.max(...profits)), maxGrowIdx: growths.indexOf(Math.max(...growths)), minGrowIdx: growths.indexOf(Math.min(...growths)) }
  }, [sorted])

  const insights = useMemo(() => {
    const list: string[] = []
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

  const doSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const exportSales = (format = 'csv') => {
    setShowExport(false)
    if (format === 'pdf') { alert('PDF export requires a print library. Use CSV for now.'); return }
    const headers = ['Period', 'Region', 'Orders', 'Revenue', 'Profit', 'Margin', 'Growth', 'Rev/Order']
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`
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

  const SortTh = ({ k, children }: { k: string; children: React.ReactNode }) => (
    <th onClick={() => doSort(k)} className="sale-sort-th">
      {children}<span className="fin-sort-icon">{sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'}</span>
    </th>
  )

  const mainChartData = chartMode === 'revenue'
    ? OVERVIEW_REVENUE_TREND.map((d) => ({ label: d.month, value: d.revenue }))
    : profitTrend

  return (
    <div className="section-stack">
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

        {regionShares.length > 0 && (
          <div className="sales-regions">
            <p className="sales-regions-title">Revenue by Region</p>
            <div className="sales-region-bars">
              {regionShares.map((r, idx) => (
                <div key={r.region} className="sales-region-row">
                  <span className="sales-region-rank">{idx === 0 ? '🏆' : `#${idx + 1}`}</span>
                  <span className="sales-region-name">{r.region}</span>
                  <div className="sales-region-track"><div className="sales-region-fill" style={{ width: `${r.pct}%`, opacity: idx === 0 ? 1 : idx === 1 ? 0.7 : 0.5 }} /></div>
                  <span className="sales-region-pct">{r.pct}%</span>
                  <span className="sales-region-rev">${r.rev.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Period</th><th>Region</th>
                <SortTh k="orders">Orders</SortTh>
                <SortTh k="revenue">Revenue</SortTh>
                <SortTh k="profit">Profit</SortTh>
                <th>Margin</th>
                <SortTh k="growth">Growth</SortTh>
                <th>Rev / Order</th><th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => {
                const profit   = Math.round(row.revenue * (row.margin / 100))
                const rpo      = Math.round(row.revenue / row.orders)
                const isPos    = row.growth >= 0
                const isMaxRev = extremes.maxRevIdx === idx
                const isMaxPrf = extremes.maxProfIdx === idx
                const isMaxGrw = extremes.maxGrowIdx === idx
                const isMinGrw = extremes.minGrowIdx === idx
                return (
                  <tr key={`${row.period}-${row.region}`} className={`sale-row ${!isPos ? 'sale-row--neg' : ''}`} onClick={() => setViewRow(row)}>
                    <td className="fin-cell-light">{row.period}</td>
                    <td className="cell-bold">{row.region}</td>
                    <td>{row.orders.toLocaleString()}</td>
                    <td className={`sale-cell-revenue${isMaxRev ? ' sale-cell--best' : ''}`}>${row.revenue.toLocaleString()}</td>
                    <td className={`sale-cell-profit${isMaxPrf ? ' sale-cell--best' : ''}`}>${profit.toLocaleString()}</td>
                    <td className={row.margin < 25 ? 'sale-cell-margin-warn' : 'fin-cell-light'}>{row.margin}%</td>
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
              {sorted.length === 0 && <tr><td colSpan={9} className="um-empty">No sales data for this period / region.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>

      {viewRow && <SaleDetailModal row={viewRow} onClose={() => setViewRow(null)} />}
    </div>
  )
}
