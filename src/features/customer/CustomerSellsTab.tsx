import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Banknote, ChevronRight, Plus, Sparkles } from 'lucide-react'
import TradeInWorkflowSteps from '../../components/trade-in/TradeInWorkflowSteps'
import type { ApiTradeIn } from '../../lib/tradeIn'
import { parseTradeInImages, tradeInDeviceLabel, tradeInStatusBadge } from '../../lib/tradeIn'
import { customerDecisionTradeIn, fetchTradeIns } from '../../services/tradeIn.service'
import { getErrorMessage } from '../../lib/api'

export default function CustomerSellsTab() {
  const [list, setList] = useState<ApiTradeIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [acting, setActing] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchTradeIns()
      .then((rows) => {
        setList(rows)
        setSelectedId((prev) => (prev && rows.some((r) => r.id === prev) ? prev : rows[0]?.id ?? null))
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const selected = list.find((t) => t.id === selectedId) ?? null

  async function handleDecision(decision: 'APPROVE' | 'REJECT') {
    if (!selected) return
    setActing(true)
    setActionError(null)
    try {
      const updated = await customerDecisionTradeIn(selected.id, decision)
      setList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setActing(false)
    }
  }

  const canRespond =
    selected?.status === 'APPROVED' &&
    selected.finalOfferAmount &&
    !selected.customerOfferDecision

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">My sells</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Devices you submitted to sell — AI estimate, technician review, and finance decisions.
          </p>
        </div>
        <Link
          to="/Sell-Your-Device"
          className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#127058] hover:bg-[#0e5845] text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} /> Sell a device
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {loading && (
        <p className="text-sm text-gray-500 text-center py-8">Loading your sell requests…</p>
      )}

      {!loading && list.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
          <Banknote className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No sell requests yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Submit a device to get an AI-assisted offer.</p>
          <Link to="/Sell-Your-Device" className="text-sm font-bold text-[#127058] hover:underline">
            Sell your first device →
          </Link>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-2">
            {list.map((t) => {
              const badge = tradeInStatusBadge(t)
              const imgs = parseTradeInImages(t.imageUrls)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedId === t.id
                      ? 'border-[#127058] bg-[#127058]/5 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex gap-3">
                    {imgs[0] ? (
                      <img src={imgs[0]} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        No img
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{tradeInDeviceLabel(t)}</p>
                      <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                      <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                  </div>
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{tradeInDeviceLabel(selected)}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selected.condition.toLowerCase()} · {selected.category || 'Device'}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tradeInStatusBadge(selected).className}`}>
                  {tradeInStatusBadge(selected).label}
                </span>
              </div>

              {selected.aiReasoning && (
                <div className="bg-[#127058]/5 border border-[#127058]/15 rounded-xl p-4 flex gap-3">
                  <Sparkles className="w-5 h-5 text-[#127058] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#127058] uppercase tracking-wide">AI suggested price</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">${selected.estimatedValue.toFixed(0)}</p>
                    <p className="text-sm text-gray-600 mt-1">{selected.aiReasoning}</p>
                  </div>
                </div>
              )}

              {selected.technicianComment && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                  <p className="font-bold text-blue-900 text-xs uppercase tracking-wide mb-1">Technician review</p>
                  <p className="text-gray-800">{selected.technicianComment}</p>
                  {selected.technicianRepairEstimate != null && (
                    <p className="text-blue-800 font-semibold mt-2">
                      Estimated repair cost: ${selected.technicianRepairEstimate.toFixed(0)}
                    </p>
                  )}
                </div>
              )}

              {(selected.finalOfferAmount || selected.officerNotes) && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm">
                  <p className="font-bold text-amber-900 text-xs uppercase tracking-wide mb-1">Finance decision</p>
                  {selected.finalOfferAmount != null && (
                    <p className="text-xl font-black text-gray-900">Final offer: ${selected.finalOfferAmount.toFixed(0)}</p>
                  )}
                  {selected.officerNotes && <p className="text-gray-700 mt-1">{selected.officerNotes}</p>}
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Progress</p>
                <TradeInWorkflowSteps tradeIn={selected} />
              </div>

              {canRespond && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-800">
                    Accept the final offer of <strong>${selected.finalOfferAmount!.toFixed(0)}</strong>?
                  </p>
                  {actionError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{actionError}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => handleDecision('APPROVE')}
                      className="px-4 py-2 bg-[#127058] hover:bg-[#0e5845] text-white text-sm font-bold rounded-xl disabled:opacity-60"
                    >
                      Accept offer
                    </button>
                    <button
                      type="button"
                      disabled={acting}
                      onClick={() => handleDecision('REJECT')}
                      className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-60"
                    >
                      Decline &amp; arrange pickup
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
