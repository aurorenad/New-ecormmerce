import { api } from '../lib/api'

export interface ResellPricingSuggestion {
  suggestedListPrice: number
  suggestedPromotionPercent: number | null
  marginPercent: number
  conditionComparison: string
  reasoning: string
}

export async function suggestResellPricing(payload: {
  brand: string
  model: string
  originalCondition: string
  postRepairCondition?: string
  batteryHealth?: number
  acquisitionCost: number
  repairCost?: number
  originalAiEstimate?: number
  preOfferInspection?: string
  repairNotes?: string
  defects?: string
}) {
  const { data } = await api.post<{ suggestion: ResellPricingSuggestion }>('/ai/resell-pricing', payload)
  return data.suggestion
}
