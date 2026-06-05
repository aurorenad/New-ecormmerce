import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchDevicesAwaitingPricing, setDevicePricing, type ApiDeviceAwaitingPricing } from '../../../services/device.service'
import { suggestResellPricing, type ResellPricingSuggestion } from '../../../services/ai.service'
import { getErrorMessage } from '../../../lib/api'

const CONDITION_OPTIONS = ['NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR'] as const

function deviceLabel(d: ApiDeviceAwaitingPricing) {
  return `${d.brand} ${d.model}`
}

function fmtMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function effectivePrice(list: number, promo: number, disc: number) {
  let price = list
  if (disc > 0) price *= 1 - disc / 100
  if (promo > 0) price *= 1 - promo / 100
  return Math.round(price * 100) / 100
}

function calcProfit(salePrice: number, boughtPrice: number, repairCost: number) {
  return Math.round((salePrice - boughtPrice - repairCost) * 100) / 100
}

function profitClass(profit: number) {
  if (profit > 0) return 'fo-profit--pos'
  if (profit < 0) return 'fo-profit--neg'
  return 'fo-profit--zero'
}

interface PricingDraft {
  listPrice: string
  postRepairCondition: string
  promotionLabel: string
  promotionPercent: string
  discountPercent: string
}

function defaultDraft(d: ApiDeviceAwaitingPricing): PricingDraft {
  return {
    listPrice: String(d.price || Math.round(d.basePrice * 1.35)),
    postRepairCondition: d.postRepairCondition || d.condition,
    promotionLabel: d.promotionLabel || '',
    promotionPercent: d.promotionPercent != null ? String(d.promotionPercent) : '',
    discountPercent: d.discountPercent != null ? String(d.discountPercent) : '',
  }
}

function rowMetrics(d: ApiDeviceAwaitingPricing, draft: PricingDraft | undefined) {
  const bought = d.tradeInRequest?.finalOfferAmount ?? d.basePrice
  const repairCost = d.tradeInRequest?.technicianRepairEstimate ?? 0
  const list = parseFloat(draft?.listPrice ?? '') || 0
  const promo = parseFloat(draft?.promotionPercent ?? '') || 0
  const disc = parseFloat(draft?.discountPercent ?? '') || 0
  const sale = effectivePrice(list, promo, disc)
  const profit = calcProfit(sale, bought, repairCost)
  const margin = sale > 0 ? Math.round((profit / sale) * 100) : 0
  return { bought, repairCost, list, sale, profit, margin, promo, disc }
}

export default function FoReadyForPricingPage() {
  const [devices, setDevices] = useState<ApiDeviceAwaitingPricing[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, PricingDraft>>({})
  const [aiByDevice, setAiByDevice] = useState<Record<string, ResellPricingSuggestion>>({})
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    fetchDevicesAwaitingPricing()
      .then((rows) => {
        setDevices(rows)
        setLoadError(null)
        setDrafts((prev) => {
          const next = { ...prev }
          for (const d of rows) {
            if (!next[d.id]) next[d.id] = defaultDraft(d)
          }
          return next
        })
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return devices
    return devices.filter((d) => deviceLabel(d).toLowerCase().includes(q) || d.id.toLowerCase().includes(q))
  }, [devices, search])

  const awaitingCount = useMemo(
    () => devices.filter((d) => d.pricingStatus !== 'PUBLISHED').length,
    [devices],
  )

  const totals = useMemo(() => {
    let bought = 0
    let projected = 0
    let profit = 0
    for (const d of filtered) {
      const m = rowMetrics(d, drafts[d.id])
      bought += m.bought
      projected += m.sale
      profit += m.profit
    }
    return { bought, projected, profit, count: filtered.length }
  }, [filtered, drafts])

  function isPublished(d: ApiDeviceAwaitingPricing) {
    return d.pricingStatus === 'PUBLISHED' || d.status === 'AVAILABLE'
  }

  function toggleDetails(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const selected = useMemo(
    () => (selectedId ? devices.find((d) => d.id === selectedId) : null),
    [devices, selectedId],
  )

  const draft = selected ? drafts[selected.id] : null
  const ai = selected ? aiByDevice[selected.id] : null
  const refurb = selected?.refurbishments[0]
  const tradeIn = selected?.tradeInRequest
  const selectedMetrics = selected && draft ? rowMetrics(selected, draft) : null

  async function handleAiSuggest(device: ApiDeviceAwaitingPricing) {
    setAiLoading(device.id)
    const ti = device.tradeInRequest
    const ref = device.refurbishments[0]
    try {
      const suggestion = await suggestResellPricing({
        brand: device.brand,
        model: device.model,
        originalCondition: ti?.condition || device.condition,
        postRepairCondition: drafts[device.id]?.postRepairCondition || device.condition,
        batteryHealth: device.batteryHealth,
        acquisitionCost: device.basePrice,
        repairCost: ti?.technicianRepairEstimate ?? undefined,
        originalAiEstimate: ti?.estimatedValue,
        preOfferInspection: ti?.technicianComment ?? undefined,
        repairNotes: ref?.repairNotes || device.repairNotes || undefined,
        defects: ti?.defects ?? undefined,
      })
      setAiByDevice((prev) => ({ ...prev, [device.id]: suggestion }))
      setDrafts((prev) => ({
        ...prev,
        [device.id]: {
          ...prev[device.id],
          listPrice: String(suggestion.suggestedListPrice),
          promotionPercent:
            suggestion.suggestedPromotionPercent != null
              ? String(suggestion.suggestedPromotionPercent)
              : prev[device.id]?.promotionPercent || '',
        },
      }))
    } catch (err) {
      setLoadError(getErrorMessage(err))
    } finally {
      setAiLoading(null)
    }
  }

  async function handleSave(device: ApiDeviceAwaitingPricing) {
    const d = drafts[device.id]
    if (!d) return
    const listPrice = parseFloat(d.listPrice)
    if (!Number.isFinite(listPrice) || listPrice <= 0) {
      setLoadError('Enter a valid list price.')
      return
    }
    setSaving(device.id)
    setSaveMsg(null)
    try {
      await setDevicePricing(device.id, {
        price: listPrice,
        basePrice: device.basePrice,
        postRepairCondition: d.postRepairCondition,
        promotionLabel: d.promotionLabel.trim() || undefined,
        promotionPercent: d.promotionPercent ? parseFloat(d.promotionPercent) : null,
        discountPercent: d.discountPercent ? parseFloat(d.discountPercent) : null,
        publishToMarketplace: true,
      })
      setSaveMsg(`${deviceLabel(device)} priced and listed on marketplace.`)
      setSelectedId(null)
      load()
    } catch (err) {
      setLoadError(getErrorMessage(err))
    } finally {
      setSaving(null)
    }
  }

  function updateDraft(deviceId: string, patch: Partial<PricingDraft>) {
    setDrafts((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], ...patch } }))
  }

  return (
    <div className="fo-page-wrap fo-pricing-page">
      {loadError && (
        <p className="fo-pricing-alert fo-pricing-alert--error">{loadError}</p>
      )}
      {saveMsg && (
        <p className="fo-pricing-alert fo-pricing-alert--success">{saveMsg}</p>
      )}

      <div className="fo-pricing-kpis">
        <div className="fo-pricing-kpi">
          <span className="fo-pricing-kpi-label">Devices</span>
          <strong className="fo-pricing-kpi-value">{totals.count}</strong>
          <span className="fo-pricing-kpi-hint">{awaitingCount} awaiting pricing</span>
        </div>
        <div className="fo-pricing-kpi">
          <span className="fo-pricing-kpi-label">Bought from customers</span>
          <strong className="fo-pricing-kpi-value">{fmtMoney(totals.bought)}</strong>
          <span className="fo-pricing-kpi-hint">Total acquisition cost</span>
        </div>
        <div className="fo-pricing-kpi">
          <span className="fo-pricing-kpi-label">Projected sales</span>
          <strong className="fo-pricing-kpi-value">{fmtMoney(totals.projected)}</strong>
          <span className="fo-pricing-kpi-hint">After promos &amp; discounts</span>
        </div>
        <div className={`fo-pricing-kpi fo-pricing-kpi--profit ${totals.profit >= 0 ? 'fo-pricing-kpi--profit-pos' : 'fo-pricing-kpi--profit-neg'}`}>
          <span className="fo-pricing-kpi-label">Projected profit</span>
          <strong className="fo-pricing-kpi-value">{fmtMoney(totals.profit)}</strong>
          <span className="fo-pricing-kpi-hint">Sale price minus costs</span>
        </div>
      </div>

      <div className="fo-filter-bar fo-pricing-toolbar">
        <div className="fo-search-box fo-pricing-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
          <input
            type="search"
            placeholder="Search device…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="fo-pricing-toolbar-meta">
          {devices.length} repaired device{devices.length === 1 ? '' : 's'}
        </span>
        <button type="button" className="fo-btn-export" onClick={load}>Refresh</button>
      </div>

      <div className="fo-panel-card fo-pricing-table-panel">
        <div className="fo-panel-header-row">
          <h3 className="fo-panel-title">Repaired devices</h3>
        </div>
        <div className="fo-table-scroll">
          <table className="fo-table fo-pricing-table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Status</th>
                    <th>Condition</th>
                    <th>Bought from customer</th>
                    <th>Repair cost</th>
                    <th>List price</th>
                    <th>Promo / discount</th>
                    <th>Sale price</th>
                    <th>Profit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="fo-table-empty">
                        {devices.length === 0
                          ? 'No repaired devices yet. When technicians complete repairs, they will appear here.'
                          : 'No devices match your search.'}
                      </td>
                    </tr>
                  ) : filtered.map((d) => {
                    const draftRow = drafts[d.id] ?? defaultDraft(d)
                    const m = rowMetrics(d, draftRow)
                    const published = isPublished(d)
                    const tech = d.refurbishments[0]?.technician
                    const techName = tech ? `${tech.firstName ?? ''} ${tech.lastName ?? ''}`.trim() : '—'
                    return (
                      <tr
                        key={d.id}
                        className={selectedId === d.id ? 'fo-pricing-row--active' : ''}
                      >
                        <td>
                          <strong className="fo-pricing-device-name">{deviceLabel(d)}</strong>
                          <span className="fo-pricing-device-sub">Repaired by {techName}</span>
                        </td>
                        <td>
                          <span className={`fo-pricing-status-pill ${published ? 'fo-pricing-status-pill--pub' : 'fo-pricing-status-pill--wait'}`}>
                            {published ? 'Listed' : 'Awaiting'}
                          </span>
                        </td>
                        <td>
                          <span className="fo-pricing-cond">{d.condition}</span>
                          {draftRow.postRepairCondition !== d.condition && (
                            <span className="fo-pricing-cond-arrow"> → {draftRow.postRepairCondition}</span>
                          )}
                        </td>
                        <td className="fo-pricing-money">{fmtMoney(m.bought)}</td>
                        <td className="fo-pricing-money fo-pricing-muted">{fmtMoney(m.repairCost)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {published ? (
                            <span className="fo-pricing-money">{fmtMoney(m.list)}</span>
                          ) : (
                            <input
                              type="number"
                              className="fo-price-input fo-pricing-inline-input"
                              min="0"
                              step="1"
                              value={draftRow.listPrice}
                              onChange={(e) => updateDraft(d.id, { listPrice: e.target.value })}
                            />
                          )}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {published ? (
                            <span className="fo-pricing-muted">
                              {m.promo > 0 || m.disc > 0 ? `${m.promo}% / ${m.disc}%` : '—'}
                            </span>
                          ) : (
                            <div className="fo-pricing-promo-cell">
                              <input
                                type="number"
                                className="fo-price-input fo-pricing-inline-input fo-pricing-inline-input--sm"
                                min="0"
                                max="90"
                                placeholder="Promo %"
                                value={draftRow.promotionPercent}
                                onChange={(e) => updateDraft(d.id, { promotionPercent: e.target.value })}
                              />
                              <input
                                type="number"
                                className="fo-price-input fo-pricing-inline-input fo-pricing-inline-input--sm"
                                min="0"
                                max="90"
                                placeholder="Disc %"
                                value={draftRow.discountPercent}
                                onChange={(e) => updateDraft(d.id, { discountPercent: e.target.value })}
                              />
                            </div>
                          )}
                        </td>
                        <td className="fo-pricing-money">{fmtMoney(m.sale)}</td>
                        <td>
                          <span className={`fo-profit-pill ${profitClass(m.profit)}`}>
                            {m.profit >= 0 ? '+' : ''}{fmtMoney(m.profit)}
                          </span>
                          <span className="fo-pricing-margin-sub">{m.margin}% margin</span>
                        </td>
                        <td>
                          <div className="fo-pricing-row-actions">
                            <button
                              type="button"
                              className={`fo-btn-view ${selectedId === d.id ? 'fo-btn-view--active' : ''}`}
                              onClick={() => toggleDetails(d.id)}
                            >
                              {selectedId === d.id ? 'Hide' : 'Details'}
                            </button>
                            {!published && (
                              <>
                                <button
                                  type="button"
                                  className="fo-btn-view"
                                  disabled={aiLoading === d.id}
                                  onClick={() => handleAiSuggest(d)}
                                >
                                  {aiLoading === d.id ? '…' : 'AI'}
                                </button>
                                <button
                                  type="button"
                                  className="fo-btn-view fo-btn-view--primary"
                                  disabled={saving === d.id}
                                  onClick={() => handleSave(d)}
                                >
                                  {saving === d.id ? '…' : 'Publish'}
                                </button>
                              </>
                            )}
                            {published && <span className="fo-pricing-muted">On marketplace</span>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
          </table>
        </div>
      </div>

      {selected && draft && selectedMetrics && (
            <div className="fo-pricing-detail">
              <header className="fo-pricing-detail-head">
                <div>
                  <h2>{deviceLabel(selected)}</h2>
                  <p>
                    Bought for {fmtMoney(selectedMetrics.bought)} · Repair est. {fmtMoney(selectedMetrics.repairCost)} ·
                    Projected profit <strong className={profitClass(selectedMetrics.profit)}>{fmtMoney(selectedMetrics.profit)}</strong>
                  </p>
                </div>
                <div className="fo-pricing-detail-actions">
                  {!isPublished(selected) && (
                    <button
                      type="button"
                      className="btn-table btn-table--primary"
                      disabled={aiLoading === selected.id}
                      onClick={() => handleAiSuggest(selected)}
                    >
                      {aiLoading === selected.id ? 'Analyzing…' : '✨ AI suggest price'}
                    </button>
                  )}
                  <button type="button" className="btn-table" onClick={() => setSelectedId(null)}>Close</button>
                </div>
              </header>

              <section className="fo-pricing-insight">
                <h3>Inspection context</h3>
                <dl className="fo-pricing-dl">
                  <div><dt>Before repair</dt><dd>{tradeIn?.condition || selected.condition}</dd></div>
                  <div><dt>Pre-offer notes</dt><dd>{tradeIn?.technicianComment || '—'}</dd></div>
                  <div><dt>Repair notes</dt><dd>{refurb?.repairNotes || selected.repairNotes || '—'}</dd></div>
                  <div><dt>Defects reported</dt><dd>{tradeIn?.defects || '—'}</dd></div>
                  <div><dt>Bought from customer</dt><dd>{fmtMoney(selectedMetrics.bought)}</dd></div>
                  <div><dt>Repair estimate</dt><dd>{fmtMoney(selectedMetrics.repairCost)}</dd></div>
                </dl>
              </section>

              {ai && (
                <section className="fo-pricing-ai-box">
                  <h3>AI pricing suggestion</h3>
                  <p><strong>{fmtMoney(ai.suggestedListPrice)}</strong> suggested list · {ai.marginPercent}% margin</p>
                  <p className="fo-pricing-ai-reason">{ai.conditionComparison}</p>
                  <p className="fo-pricing-ai-reason">{ai.reasoning}</p>
                </section>
              )}

              <section className="fo-pricing-form">
                <div className="fo-pricing-field">
                  <label htmlFor="post-condition">Condition after repair</label>
                  <select
                    id="post-condition"
                    value={draft.postRepairCondition}
                    onChange={(e) => updateDraft(selected.id, { postRepairCondition: e.target.value })}
                  >
                    {CONDITION_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="fo-pricing-field">
                  <label htmlFor="promo-label">Promotion label</label>
                  <input
                    id="promo-label"
                    type="text"
                    placeholder="e.g. Summer Sale, Certified Deal"
                    value={draft.promotionLabel}
                    onChange={(e) => updateDraft(selected.id, { promotionLabel: e.target.value })}
                  />
                </div>

                <div className="fo-pricing-summary fo-pricing-summary--wide">
                  <span>List price: <strong>{fmtMoney(selectedMetrics.list)}</strong></span>
                  <span>Customer pays: <strong>{fmtMoney(selectedMetrics.sale)}</strong></span>
                  <span>Total cost: <strong>{fmtMoney(selectedMetrics.bought + selectedMetrics.repairCost)}</strong></span>
                  <span>Profit: <strong className={profitClass(selectedMetrics.profit)}>{fmtMoney(selectedMetrics.profit)}</strong></span>
                </div>

                {!isPublished(selected) && (
                  <button
                    type="button"
                    className="btn-table btn-table--primary"
                    disabled={saving === selected.id}
                    onClick={() => handleSave(selected)}
                  >
                    {saving === selected.id ? 'Saving…' : 'Save price & publish to marketplace'}
                  </button>
                )}
              </section>
            </div>
      )}
    </div>
  )
}
