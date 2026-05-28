import { useMemo, useState } from 'react'
import { PRICING_SEED } from '../../../../../data/mockData'
import type { PricingRow } from '../../../shared/types/dashboard.types'
import MiniKpiCard from '../../../shared/components/MiniKpiCard'
import '../../../shared/styles/dashboard-shared.css'
import './PricingSection.css'

function pricingMargin(row: PricingRow): number {
  const cost = row.cost ?? 0
  return row.listPrice > 0 ? Math.round(((row.listPrice - cost) / row.listPrice) * 100) : 0
}
function pricingMarginClass(m: number) {
  return m > 25 ? 'margin-pill--high' : m >= 10 ? 'margin-pill--mid' : 'margin-pill--low'
}
function pricingEffectiveMargin(row: PricingRow): number | null {
  if (!row.promo || row.promo === 'None') return null
  const match = row.promo.match(/(-?\d+)%/)
  if (!match) return null
  const disc = Math.abs(Number(match[1])) / 100
  const discPrice = row.listPrice * (1 - disc)
  const cost = row.cost ?? 0
  return discPrice > 0 ? Math.round(((discPrice - cost) / discPrice) * 100) : 0
}

export default function PricingSection() {
  const [search, setSearch]           = useState('')
  const [pricing, setPricing]         = useState<PricingRow[]>(PRICING_SEED)
  const [savingSkus, setSavingSkus]   = useState<Set<string>>(new Set())
  const [savedSkus, setSavedSkus]     = useState<Set<string>>(new Set())
  const [tierFilter, setTierFilter]   = useState('All')
  const [marginFilter, setMarginFilter] = useState('All')
  const [promoFilter, setPromoFilter] = useState('All')

  const tiers = useMemo(() => [...new Set(pricing.map((p) => p.tier))], [pricing])

  const kpis = useMemo(() => {
    const margins = pricing.map(pricingMargin)
    const avg = margins.length ? (margins.reduce((a, b) => a + b, 0) / margins.length).toFixed(1) : '0.0'
    const totalProfit = pricing.reduce((s, r) => s + (r.listPrice - (r.cost ?? 0)), 0)
    const lowCount = margins.filter((m) => m < 10).length
    const promoCount = pricing.filter((r) => r.promo && r.promo !== 'None').length
    return { avg, totalProfit, lowCount, promoCount }
  }, [pricing])

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

  const updatePrice = (sku: string, field: 'cost' | 'listPrice' | 'financeFrom', value: string) => {
    const num = Number(value)
    if (Number.isNaN(num) || num < 0) return
    setPricing((prev) => prev.map((row) => row.sku === sku ? { ...row, [field]: num } : row))
  }

  const saveRow = (sku: string) => {
    setSavingSkus((prev) => new Set([...prev, sku]))
    setTimeout(() => {
      setSavingSkus((prev) => { const s = new Set(prev); s.delete(sku); return s })
      setSavedSkus((prev) => new Set([...prev, sku]))
    }, 600)
  }

  return (
    <div className="section-stack">
      <section className="mini-kpi-grid">
        <MiniKpiCard label="Avg Margin"          value={`${kpis.avg}%`}                          hint="Across all SKUs" />
        <MiniKpiCard label="Total Profit / Unit" value={`$${kpis.totalProfit.toLocaleString()}`} hint="Sum across catalog" />
        <MiniKpiCard label="Low Margin Devices"  value={kpis.lowCount}                           hint="< 10% — review needed" />
        <MiniKpiCard label="Active Promotions"   value={kpis.promoCount}                         hint="Discount live" />
      </section>

      <article className="panel-card">
        <div className="pricing-toolbar">
          <div className="search-field search-field--compact">
            <svg className="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" />
            </svg>
            <input type="search" placeholder="Search SKU or device model..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="pricing-filters">
            <label className="um-filter-group"><span className="um-filter-label">Tier</span>
              <select className="um-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                <option value="All">All tiers</option>
                {tiers.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="um-filter-group"><span className="um-filter-label">Margin</span>
              <select className="um-select" value={marginFilter} onChange={(e) => setMarginFilter(e.target.value)}>
                <option value="All">All margins</option>
                <option value="High">High (&gt;25%)</option>
                <option value="Mid">Mid (10–25%)</option>
                <option value="Low">Low (&lt;10%)</option>
              </select>
            </label>
            <label className="um-filter-group"><span className="um-filter-label">Promo</span>
              <select className="um-select" value={promoFilter} onChange={(e) => setPromoFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Active">Active promo</option>
                <option value="None">No promo</option>
              </select>
            </label>
          </div>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th><th>Model</th><th>Tier</th><th>Cost ($)</th>
                <th>List Price ($)</th><th>Profit ($)</th><th>Margin</th>
                <th>Finance From ($/mo)</th><th>Promotion</th><th>Actions</th>
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
                    <td><input type="number" className="price-input" value={row.cost ?? 0} onChange={(e) => updatePrice(row.sku, 'cost', e.target.value)} /></td>
                    <td><input type="number" className="price-input" value={row.listPrice} onChange={(e) => updatePrice(row.sku, 'listPrice', e.target.value)} /></td>
                    <td className="pricing-profit">${profit.toLocaleString()}</td>
                    <td>
                      <div className="margin-cell">
                        <span className={`margin-pill ${pricingMarginClass(margin)}`}>+{margin}%</span>
                        {effMargin !== null && <span className="margin-after-promo">→ {effMargin}% after promo</span>}
                      </div>
                    </td>
                    <td><input type="number" className="price-input" value={row.financeFrom} onChange={(e) => updatePrice(row.sku, 'financeFrom', e.target.value)} /></td>
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
              {filtered.length === 0 && <tr><td colSpan={10} className="um-empty">No devices match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}
