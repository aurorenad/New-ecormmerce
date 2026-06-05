export interface ApiTradeInUser {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface ApiTradeIn {
  id: string
  userId: string
  brand: string
  model: string
  category?: string | null
  condition: string
  batteryHealth?: number | null
  askingPrice?: number | null
  estimatedValue: number
  imageUrls: string
  defects?: string | null
  storage?: string | null
  ram?: string | null
  color?: string | null
  location?: string | null
  aiReasoning?: string | null
  technicianId?: string | null
  technicianComment?: string | null
  technicianRepairEstimate?: number | null
  technicianReviewedAt?: string | null
  officerNotes?: string | null
  finalOfferAmount?: number | null
  decisionAt?: string | null
  customerOfferDecision?: string | null
  customerDecisionAt?: string | null
  deviceId?: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
  user?: ApiTradeInUser
  technician?: ApiTradeInUser
}

export interface TradeInAiEvaluation {
  tradeInRecommendation: number
  resaleEstimate?: number
  reasoning: string
}

export function parseTradeInImages(imageUrls: string): string[] {
  try {
    const parsed = JSON.parse(imageUrls)
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === 'string') : []
  } catch {
    return []
  }
}

export function tradeInDeviceLabel(t: ApiTradeIn): string {
  return `${t.brand} ${t.model}`.trim()
}

export type WorkflowStep = {
  id: string
  label: string
  detail?: string
  done: boolean
  active: boolean
}

export function getTradeInWorkflowSteps(t: ApiTradeIn): WorkflowStep[] {
  const hasAi = t.estimatedValue > 0
  const hasTech = Boolean(t.technicianComment && t.technicianRepairEstimate != null)
  const hasFinance = t.status === 'APPROVED' || t.status === 'REJECTED' || t.status === 'COMPLETED'
  const hasCustomer = Boolean(t.customerOfferDecision)

  return [
    {
      id: 'submitted',
      label: 'Submitted',
      detail: new Date(t.createdAt).toLocaleDateString(),
      done: true,
      active: !hasAi,
    },
    {
      id: 'ai',
      label: 'AI price estimate',
      detail: hasAi ? `$${t.estimatedValue.toFixed(0)} suggested` : 'Pending',
      done: hasAi,
      active: hasAi && !hasTech,
    },
    {
      id: 'technician',
      label: 'Technician inspection',
      detail: hasTech
        ? `Repair est. $${t.technicianRepairEstimate!.toFixed(0)}`
        : 'Awaiting physical review',
      done: hasTech,
      active: hasTech && !hasFinance,
    },
    {
      id: 'finance',
      label: 'Finance decision',
      detail: hasFinance
        ? t.status === 'REJECTED'
          ? 'Offer declined'
          : t.finalOfferAmount
            ? `Final offer $${t.finalOfferAmount.toFixed(0)}`
            : 'Approved'
        : 'Awaiting finance officer',
      done: hasFinance,
      active: hasFinance && t.status === 'APPROVED' && !hasCustomer,
    },
    {
      id: 'customer',
      label: 'Your response',
      detail: hasCustomer
        ? t.customerOfferDecision === 'APPROVED'
          ? 'You accepted the offer'
          : 'You declined — pickup arranged'
        : t.status === 'APPROVED' && t.finalOfferAmount
          ? 'Action required'
          : '—',
      done: hasCustomer || t.status === 'COMPLETED' || (t.status === 'REJECTED' && hasFinance),
      active: t.status === 'APPROVED' && !!t.finalOfferAmount && !hasCustomer,
    },
    {
      id: 'repair',
      label: 'Technician repair',
      detail: t.status === 'COMPLETED' && t.deviceId
        ? 'Device assigned for refurbishment'
        : t.status === 'COMPLETED'
          ? 'Repair in progress'
          : '—',
      done: t.status === 'COMPLETED' && Boolean(t.deviceId),
      active: t.status === 'COMPLETED' && Boolean(t.deviceId),
    },
  ]
}

/** Finance dashboard workflow label */
export function tradeInFinanceStage(t: ApiTradeIn): {
  key: string
  label: string
  className: string
} {
  if (t.status === 'COMPLETED') {
    return { key: 'completed', label: 'Completed', className: 'bg-emerald-100 text-emerald-800' }
  }
  if (t.status === 'REJECTED') {
    return { key: 'rejected', label: 'Rejected', className: 'bg-red-100 text-red-800' }
  }
  if (t.status === 'APPROVED') {
    return {
      key: 'approved',
      label: t.customerOfferDecision ? 'Approved · customer responded' : 'Approved · awaiting customer',
      className: 'bg-emerald-100 text-emerald-800',
    }
  }
  if (t.technicianComment && t.technicianRepairEstimate != null) {
    return { key: 'ready', label: 'Ready for finance', className: 'bg-blue-100 text-blue-800' }
  }
  if (t.technicianComment) {
    return { key: 'ready', label: 'Ready for finance', className: 'bg-blue-100 text-blue-800' }
  }
  return { key: 'awaiting_tech', label: 'Awaiting technician', className: 'bg-amber-100 text-amber-800' }
}

export function tradeInCustomerName(t: ApiTradeIn): string {
  const u = t.user
  if (!u) return '—'
  return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email || '—'
}

export function tradeInShortId(t: ApiTradeIn): string {
  return t.id.slice(0, 8).toUpperCase()
}

export function tradeInStatusBadge(t: ApiTradeIn): { label: string; className: string } {
  if (t.status === 'COMPLETED') return { label: 'Completed', className: 'bg-emerald-100 text-emerald-700' }
  if (t.status === 'REJECTED') {
    return t.customerOfferDecision === 'REJECTED'
      ? { label: 'Offer declined by you', className: 'bg-gray-100 text-gray-600' }
      : { label: 'Not approved', className: 'bg-red-100 text-red-700' }
  }
  if (t.status === 'APPROVED') {
    if (!t.customerOfferDecision) return { label: 'Offer ready', className: 'bg-amber-100 text-amber-800' }
    return { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' }
  }
  if (t.technicianComment) return { label: 'Awaiting finance', className: 'bg-blue-100 text-blue-700' }
  return { label: 'Awaiting technician', className: 'bg-amber-100 text-amber-800' }
}
