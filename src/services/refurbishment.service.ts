import { api } from '../lib/api'

export type RefurbishmentStatus =
  | 'RECEIVED'
  | 'DIAGNOSING'
  | 'REPAIRING'
  | 'QUALITY_CHECK'
  | 'CERTIFIED'
  | 'READY'

export interface ApiTradeInSummary {
  id: string
  defects?: string | null
  technicianComment?: string | null
  technicianRepairEstimate?: number | null
  estimatedValue?: number
  condition: string
  batteryHealth?: number | null
  finalOfferAmount?: number | null
  aiReasoning?: string | null
}

export interface ApiRefurbishmentDevice {
  id: string
  brand: string
  model: string
  condition: string
  postRepairCondition?: string | null
  status: string
  batteryHealth: number
  repairNotes?: string | null
  basePrice: number
  price: number
  imageUrls: string
  tradeInRequest?: ApiTradeInSummary | null
}

export interface ApiRefurbishment {
  id: string
  deviceId: string
  technicianId?: string | null
  status: RefurbishmentStatus
  diagnostics?: string | null
  repairNotes?: string | null
  partsUsed: string
  qcPassed: boolean
  certifiedAt?: string | null
  createdAt: string
  updatedAt: string
  device: ApiRefurbishmentDevice
  technician?: { id: string; firstName?: string; lastName?: string; email?: string }
}

export async function fetchRefurbishments() {
  const { data } = await api.get<{ refurbishments: ApiRefurbishment[] }>('/refurbishments')
  return data.refurbishments
}

export async function fetchRefurbishment(id: string) {
  const { data } = await api.get<{ refurbishment: ApiRefurbishment }>(`/refurbishments/${id}`)
  return data.refurbishment
}

export async function updateRefurbishment(
  id: string,
  payload: {
    status?: RefurbishmentStatus
    diagnostics?: string
    repairNotes?: string
    partsUsed?: string[]
    qcPassed?: boolean
  },
) {
  const { data } = await api.put<{ message: string; refurbishment: ApiRefurbishment }>(
    `/refurbishments/${id}`,
    payload,
  )
  return data.refurbishment
}
