import { useCallback, useEffect, useState } from 'react'
import { fetchTradeIns, technicianReviewTradeIn } from '../../../services/tradeIn.service'
import type { ApiTradeIn } from '../../../lib/tradeIn'
import { tradeInDeviceLabel } from '../../../lib/tradeIn'
import { getErrorMessage } from '../../../lib/api'

export default function TechSellRequestsPage() {
  const [list, setList] = useState<ApiTradeIn[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ApiTradeIn | null>(null)
  const [comment, setComment] = useState('')
  const [repairEstimate, setRepairEstimate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const load = useCallback(() => {
    fetchTradeIns()
      .then((rows) => {
        const pending = rows.filter(
          (t) => t.status === 'PENDING' && !t.technicianComment,
        )
        setList(pending)
        setLoadError(null)
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const estimate = parseFloat(repairEstimate)
    if (!comment.trim() || !Number.isFinite(estimate) || estimate < 0) {
      setSubmitError('Enter inspection notes and a valid repair estimate (0 or more).')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      await technicianReviewTradeIn(selected.id, {
        technicianComment: comment.trim(),
        repairEstimate: estimate,
      })
      setSelected(null)
      setComment('')
      setRepairEstimate('')
      load()
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="tw-page-wrap">
      <header className="tw-page-header">
        <h1 className="tw-page-title">Sell requests</h1>
        <p className="tw-page-sub">Inspect submitted devices, note condition, and estimate repair cost before finance decides.</p>
      </header>

      {loadError && <p className="tw-sell-error">{loadError}</p>}

      <div className="tw-sell-grid">
        <div className="tw-sell-list">
          <p className="tw-sell-count">{list.length} awaiting inspection</p>
          {list.length === 0 ? (
            <p className="tw-sell-empty">No pending sell requests.</p>
          ) : (
            list.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tw-sell-card ${selected?.id === t.id ? 'tw-sell-card--active' : ''}`}
                onClick={() => {
                  setSelected(t)
                  setComment('')
                  setRepairEstimate('')
                  setSubmitError(null)
                }}
              >
                <strong>{tradeInDeviceLabel(t)}</strong>
                <span>{t.user?.firstName} {t.user?.lastName}</span>
                <span className="tw-sell-meta">AI est. ${t.estimatedValue.toFixed(0)}</span>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <form className="tw-sell-detail" onSubmit={handleSubmit}>
            <h2>{tradeInDeviceLabel(selected)}</h2>
            <p className="tw-sell-customer">{selected.user?.email}</p>
            <dl className="tw-sell-facts">
              <div><dt>Condition</dt><dd>{selected.condition}</dd></div>
              <div><dt>AI estimate</dt><dd>${selected.estimatedValue.toFixed(0)}</dd></div>
              {selected.askingPrice != null && (
                <div><dt>Customer asking</dt><dd>${selected.askingPrice.toFixed(0)}</dd></div>
              )}
              {selected.defects && <div><dt>Defects</dt><dd>{selected.defects}</dd></div>}
            </dl>
            {selected.aiReasoning && (
              <p className="tw-sell-ai">{selected.aiReasoning}</p>
            )}
            <label className="tw-field">
              <span>Inspection notes *</span>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Physical condition, parts needed, accuracy of customer description…"
                required
              />
            </label>
            <label className="tw-field">
              <span>Repair estimate ($) *</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={repairEstimate}
                onChange={(e) => setRepairEstimate(e.target.value)}
                placeholder="0 if no repair needed"
                required
              />
            </label>
            {submitError && <p className="tw-sell-error">{submitError}</p>}
            <button type="submit" className="tw-btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Submit review to finance'}
            </button>
          </form>
        ) : (
          <div className="tw-sell-detail tw-sell-detail--empty">
            Select a request to inspect
          </div>
        )}
      </div>
    </div>
  )
}
