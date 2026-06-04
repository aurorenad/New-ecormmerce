import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchTradeIns, financeReviewTradeIn } from '../../../services/tradeIn.service'
import type { ApiTradeIn } from '../../../lib/tradeIn'
import {
  tradeInDeviceLabel,
  tradeInCustomerName,
  tradeInFinanceStage,
  tradeInShortId,
} from '../../../lib/tradeIn'
import { getErrorMessage } from '../../../lib/api'

type StageFilter =
  | ''
  | 'awaiting_tech'
  | 'ready'
  | 'approved'
  | 'rejected'
  | 'completed'

const STAGE_OPTIONS: { value: StageFilter; label: string }[] = [
  { value: '', label: 'All stages' },
  { value: 'ready', label: 'Ready for finance' },
  { value: 'awaiting_tech', label: 'Awaiting technician' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
]

function canFinanceDecide(t: ApiTradeIn): boolean {
  return (
    t.status === 'PENDING' &&
    Boolean(t.technicianComment?.trim()) &&
    t.technicianRepairEstimate != null
  )
}

function matchesStage(t: ApiTradeIn, stage: StageFilter): boolean {
  if (!stage) return true
  return tradeInFinanceStage(t).key === stage
}

function inDateRange(iso: string, from: string, to: string): boolean {
  const day = iso.slice(0, 10)
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}

function downloadSellReport(rows: ApiTradeIn[], filename: string) {
  const headers = [
    'Ref',
    'Submitted',
    'Customer',
    'Email',
    'Device',
    'Condition',
    'AI Estimate',
    'Repair Estimate',
    'Final Offer',
    'Stage',
    'Finance Decision Date',
    'Officer Notes',
    'Customer Decision',
  ]
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? '' : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }
  const lines = [
    headers.join(','),
    ...rows.map((t) => {
      const stage = tradeInFinanceStage(t)
      return [
        tradeInShortId(t),
        t.createdAt.slice(0, 10),
        tradeInCustomerName(t),
        t.user?.email ?? '',
        tradeInDeviceLabel(t),
        t.condition,
        t.estimatedValue.toFixed(2),
        t.technicianRepairEstimate?.toFixed(2) ?? '',
        t.finalOfferAmount?.toFixed(2) ?? '',
        stage.label,
        t.decisionAt?.slice(0, 10) ?? '',
        t.officerNotes ?? '',
        t.customerOfferDecision ?? '',
      ]
        .map(escape)
        .join(',')
    }),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function FoSellRequestsPage() {
  const [all, setAll] = useState<ApiTradeIn[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ApiTradeIn | null>(null)
  const [finalOffer, setFinalOffer] = useState('')
  const [officerNotes, setOfficerNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<StageFilter>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [dateField, setDateField] = useState<'submitted' | 'decision'>('submitted')
  const [view, setView] = useState<'table' | 'review'>('table')

  const load = useCallback(() => {
    setLoading(true)
    fetchTradeIns()
      .then((rows) => {
        setAll(rows)
        setLoadError(null)
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    let list = [...all]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          tradeInDeviceLabel(t).toLowerCase().includes(q) ||
          tradeInCustomerName(t).toLowerCase().includes(q) ||
          (t.user?.email ?? '').toLowerCase().includes(q) ||
          tradeInShortId(t).toLowerCase().includes(q),
      )
    }
    if (stageFilter) list = list.filter((t) => matchesStage(t, stageFilter))
    list = list.filter((t) => {
      const iso = dateField === 'decision' ? t.decisionAt ?? '' : t.createdAt
      if (!iso && (dateFrom || dateTo)) return false
      if (!iso) return true
      return inDateRange(iso, dateFrom, dateTo)
    })
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [all, search, stageFilter, dateFrom, dateTo, dateField])

  const stats = useMemo(() => {
    const ready = all.filter((t) => tradeInFinanceStage(t).key === 'ready').length
    const approved = all.filter((t) => ['approved', 'completed'].includes(tradeInFinanceStage(t).key)).length
    const rejected = all.filter((t) => tradeInFinanceStage(t).key === 'rejected').length
    const offerTotal = all
      .filter((t) => t.finalOfferAmount != null)
      .reduce((s, t) => s + (t.finalOfferAmount ?? 0), 0)
    return { total: all.length, ready, approved, rejected, offerTotal }
  }, [all])

  const pendingQueue = useMemo(
    () => all.filter(canFinanceDecide),
    [all],
  )

  async function decide(status: 'APPROVED' | 'REJECTED') {
    if (!selected || !canFinanceDecide(selected)) return
    setSubmitting(true)
    setActionError(null)
    try {
      if (status === 'APPROVED') {
        const amount = parseFloat(finalOffer)
        if (!Number.isFinite(amount) || amount <= 0) {
          setActionError('Enter a positive final offer amount.')
          setSubmitting(false)
          return
        }
        await financeReviewTradeIn(selected.id, {
          status,
          finalOfferAmount: amount,
          officerNotes: officerNotes.trim() || undefined,
        })
      } else {
        await financeReviewTradeIn(selected.id, {
          status,
          officerNotes: officerNotes.trim() || undefined,
        })
      }
      setSelected(null)
      setFinalOffer('')
      setOfficerNotes('')
      setView('table')
      load()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  function openForReview(t: ApiTradeIn) {
    setSelected(t)
    setFinalOffer(
      String(
        Math.max(0, Math.round(t.estimatedValue - (t.technicianRepairEstimate ?? 0))),
      ),
    )
    setOfficerNotes('')
    setActionError(null)
    setView('review')
  }

  function resetFilters() {
    setSearch('')
    setStageFilter('')
    setDateFrom('')
    setDateTo('')
    setDateField('submitted')
  }

  function exportReport() {
    const stamp = new Date().toISOString().slice(0, 10)
    const suffix = stageFilter || 'all'
    downloadSellReport(filtered, `sell-requests-report-${suffix}-${stamp}.csv`)
  }

  const suggestedOffer = selected
    ? Math.max(0, selected.estimatedValue - (selected.technicianRepairEstimate ?? 0))
    : 0

  return (
    <div className="fo-page-wrap fo-sell-page">
      {loadError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {loadError}
        </p>
      )}

      {/* Summary */}
      <div className="fo-sell-kpis">
        <div className="fo-sell-kpi">
          <span className="fo-sell-kpi-label">Total requests</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="fo-sell-kpi fo-sell-kpi--warn">
          <span className="fo-sell-kpi-label">Ready for decision</span>
          <strong>{stats.ready}</strong>
        </div>
        <div className="fo-sell-kpi fo-sell-kpi--ok">
          <span className="fo-sell-kpi-label">Approved / completed</span>
          <strong>{stats.approved}</strong>
        </div>
        <div className="fo-sell-kpi fo-sell-kpi--bad">
          <span className="fo-sell-kpi-label">Rejected</span>
          <strong>{stats.rejected}</strong>
        </div>
        <div className="fo-sell-kpi">
          <span className="fo-sell-kpi-label">Final offers (all time)</span>
          <strong>${stats.offerTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
        </div>
      </div>

      {/* Filters + report */}
      <div className="fo-filter-bar fo-sell-filters">
        <div className="fo-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
          <input
            type="search"
            placeholder="Search customer, device, ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="fo-select"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as StageFilter)}
        >
          {STAGE_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="fo-select"
          value={dateField}
          onChange={(e) => setDateField(e.target.value as 'submitted' | 'decision')}
          title="Which date to filter on"
        >
          <option value="submitted">Date: submitted</option>
          <option value="decision">Date: finance decision</option>
        </select>
        <label className="fo-date-field">
          <span>From</span>
          <input
            type="date"
            className="fo-date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label className="fo-date-field">
          <span>To</span>
          <input
            type="date"
            className="fo-date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <button type="button" className="fo-btn-reset" onClick={resetFilters}>
          Reset
        </button>
        <button
          type="button"
          className="fo-btn-export"
          onClick={exportReport}
          disabled={filtered.length === 0}
        >
          Export report (CSV)
        </button>
        {pendingQueue.length > 0 && view === 'table' && (
          <button
            type="button"
            className="fo-btn-primary"
            onClick={() => openForReview(pendingQueue[0])}
          >
            Review next ({pendingQueue.length})
          </button>
        )}
      </div>

      <p className="fo-results-hint">
        {loading ? 'Loading…' : `${filtered.length} of ${all.length} sell request${all.length !== 1 ? 's' : ''}`}
        {stageFilter || dateFrom || dateTo ? ' (filtered)' : ''}
      </p>

      {view === 'review' && selected ? (
        <div className="fo-sell-review-layout">
          <button
            type="button"
            className="fo-btn-view mb-2"
            onClick={() => {
              setView('table')
              setSelected(null)
              setActionError(null)
            }}
          >
            ← Back to all requests
          </button>
          <div className="fo-panel-card p-5 space-y-4">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{tradeInDeviceLabel(selected)}</h3>
                <p className="text-sm text-gray-600">
                  {tradeInCustomerName(selected)} · {selected.user?.email}
                </p>
                <p className="text-xs text-gray-400 mt-1">Ref {tradeInShortId(selected)}</p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full h-fit ${tradeInFinanceStage(selected).className}`}
              >
                {tradeInFinanceStage(selected).label}
              </span>
            </div>

            {canFinanceDecide(selected) ? (
              <>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-semibold">AI estimate</p>
                    <p className="text-lg font-black">${selected.estimatedValue.toFixed(0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-semibold">Repair estimate</p>
                    <p className="text-lg font-black">
                      ${selected.technicianRepairEstimate!.toFixed(0)}
                    </p>
                  </div>
                  <div className="bg-[#127058]/5 rounded-xl p-3">
                    <p className="text-xs text-[#127058] font-semibold">Suggested offer</p>
                    <p className="text-lg font-black text-[#127058]">${suggestedOffer.toFixed(0)}</p>
                  </div>
                </div>
                <div className="text-sm bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="font-bold text-blue-900 text-xs uppercase mb-1">Technician</p>
                  <p className="text-gray-800">{selected.technicianComment}</p>
                </div>
                <label className="block text-sm">
                  <span className="font-semibold text-gray-700">Final offer ($) — if approving</span>
                  <input
                    type="number"
                    min={1}
                    step={0.01}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={finalOffer}
                    onChange={(e) => setFinalOffer(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-gray-700">Notes to customer (optional)</span>
                  <textarea
                    rows={2}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2"
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                  />
                </label>
                {actionError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {actionError}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => decide('APPROVED')}
                    className="fo-btn-approve px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-60"
                  >
                    Approve offer
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => decide('REJECTED')}
                    className="fo-btn-reject px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </>
            ) : (
              <FoSellDetailReadonly tradeIn={selected} />
            )}
          </div>
        </div>
      ) : (
        <div className="fo-panel-card">
          <div className="fo-table-scroll">
            <table className="fo-table fo-sell-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Submitted</th>
                  <th>Customer</th>
                  <th>Device</th>
                  <th>AI est.</th>
                  <th>Repair est.</th>
                  <th>Final offer</th>
                  <th>Stage</th>
                  <th>Decision</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="fo-empty-cell">
                      Loading sell requests…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="fo-empty-cell">
                      No sell requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => {
                    const stage = tradeInFinanceStage(t)
                    return (
                      <tr key={t.id}>
                        <td className="font-mono text-xs">{tradeInShortId(t)}</td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className="block font-semibold text-gray-900">
                            {tradeInCustomerName(t)}
                          </span>
                          <span className="text-xs text-gray-500">{t.user?.email}</span>
                        </td>
                        <td>{tradeInDeviceLabel(t)}</td>
                        <td>${t.estimatedValue.toFixed(0)}</td>
                        <td>
                          {t.technicianRepairEstimate != null
                            ? `$${t.technicianRepairEstimate.toFixed(0)}`
                            : '—'}
                        </td>
                        <td>
                          {t.finalOfferAmount != null
                            ? `$${t.finalOfferAmount.toFixed(0)}`
                            : '—'}
                        </td>
                        <td>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.className}`}
                          >
                            {stage.label}
                          </span>
                        </td>
                        <td className="text-xs text-gray-500">
                          {t.decisionAt
                            ? new Date(t.decisionAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="fo-btn-view"
                            onClick={() => openForReview(t)}
                          >
                            {canFinanceDecide(t) ? 'Decide' : 'View'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function FoSellDetailReadonly({ tradeIn }: { tradeIn: ApiTradeIn }) {
  return (
    <div className="space-y-3 text-sm">
      <dl className="grid sm:grid-cols-2 gap-3">
        <div>
          <dt className="text-xs text-gray-500 font-semibold">AI estimate</dt>
          <dd className="font-bold">${tradeIn.estimatedValue.toFixed(0)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 font-semibold">Repair estimate</dt>
          <dd className="font-bold">
            {tradeIn.technicianRepairEstimate != null
              ? `$${tradeIn.technicianRepairEstimate.toFixed(0)}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 font-semibold">Final offer</dt>
          <dd className="font-bold">
            {tradeIn.finalOfferAmount != null
              ? `$${tradeIn.finalOfferAmount.toFixed(0)}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 font-semibold">Customer decision</dt>
          <dd>{tradeIn.customerOfferDecision ?? '—'}</dd>
        </div>
      </dl>
      {tradeIn.technicianComment && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="font-bold text-blue-900 text-xs uppercase mb-1">Technician</p>
          <p>{tradeIn.technicianComment}</p>
        </div>
      )}
      {tradeIn.officerNotes && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="font-bold text-gray-700 text-xs uppercase mb-1">Finance notes</p>
          <p>{tradeIn.officerNotes}</p>
        </div>
      )}
      {tradeIn.aiReasoning && (
        <div className="bg-[#127058]/5 border border-[#127058]/15 rounded-xl p-3">
          <p className="font-bold text-[#127058] text-xs uppercase mb-1">AI reasoning</p>
          <p className="text-gray-700">{tradeIn.aiReasoning}</p>
        </div>
      )}
      <p className="text-xs text-gray-500">
        This request is not awaiting a new finance decision. Use filters or export a report for
        records.
      </p>
    </div>
  )
}
