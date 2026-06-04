import { api } from '../lib/api'
import type { ApiTradeIn, TradeInAiEvaluation } from '../lib/tradeIn'

export interface SubmitTradeInPayload {
  brand: string
  model: string
  condition: string
  category?: string
  batteryHealth?: string
  askingPrice?: string
  defects?: string
  storage?: string
  ram?: string
  color?: string
  location?: string
  images?: File[]
}

export async function submitTradeIn(payload: SubmitTradeInPayload) {
  const form = new FormData()
  form.append('brand', payload.brand)
  form.append('model', payload.model)
  form.append('condition', payload.condition)
  if (payload.category) form.append('category', payload.category)
  if (payload.batteryHealth) form.append('batteryHealth', payload.batteryHealth)
  if (payload.askingPrice) form.append('askingPrice', payload.askingPrice)
  if (payload.defects) form.append('defects', payload.defects)
  if (payload.storage) form.append('storage', payload.storage)
  if (payload.ram) form.append('ram', payload.ram)
  if (payload.color) form.append('color', payload.color)
  if (payload.location) form.append('location', payload.location)
  payload.images?.forEach((file) => form.append('images', file))

  const { data } = await api.post<{
    message: string
    tradeIn: ApiTradeIn
    aiEvaluation: TradeInAiEvaluation
    aiEnabled: boolean
  }>('/devices/trade-in', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchTradeIns() {
  const { data } = await api.get<{ tradeIns: ApiTradeIn[] }>('/devices/trade-in')
  return data.tradeIns
}

export async function fetchTradeIn(id: string) {
  const { data } = await api.get<{ tradeIn: ApiTradeIn }>(`/devices/trade-in/${id}`)
  return data.tradeIn
}

export async function technicianReviewTradeIn(
  id: string,
  payload: { technicianComment: string; repairEstimate: number },
) {
  const { data } = await api.put<{ message: string; tradeIn: ApiTradeIn }>(
    `/devices/trade-in/${id}/technician-review`,
    {
      technicianComment: payload.technicianComment,
      repairEstimate: payload.repairEstimate,
    },
  )
  return data.tradeIn
}

export async function financeReviewTradeIn(
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED'; finalOfferAmount?: number; officerNotes?: string },
) {
  const { data } = await api.put<{ message: string; tradeIn: ApiTradeIn }>(
    `/devices/trade-in/${id}`,
    {
      tradeInId: id,
      status: payload.status,
      finalOfferAmount: payload.finalOfferAmount,
      officerNotes: payload.officerNotes,
    },
  )
  return data.tradeIn
}

export async function customerDecisionTradeIn(id: string, decision: 'APPROVE' | 'REJECT') {
  const { data } = await api.put<{ message: string; tradeIn: ApiTradeIn }>(
    `/devices/trade-in/${id}/customer-decision`,
    { decision },
  )
  return data.tradeIn
}
