import { api } from '../lib/api'
import type { ApiTradeInSummary } from './refurbishment.service'

export interface ApiDeviceAwaitingPricing {
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
  promotionLabel?: string | null
  promotionPercent?: number | null
  discountPercent?: number | null
  imageUrls: string
  tradeInRequest?: ApiTradeInSummary | null
  refurbishments: {
    id: string
    status: string
    repairNotes?: string | null
    diagnostics?: string | null
    technician?: { firstName?: string; lastName?: string; email?: string }
  }[]
  listings?: { id: string; status: string; price: number }[]
  pricingStatus?: 'AWAITING' | 'PUBLISHED'
}

export async function fetchDevicesAwaitingPricing() {
  const { data } = await api.get<{ devices: ApiDeviceAwaitingPricing[] }>('/devices/awaiting-pricing')
  return data.devices
}

export async function setDevicePricing(
  deviceId: string,
  payload: {
    price: number
    basePrice?: number
    postRepairCondition?: string
    promotionLabel?: string
    promotionPercent?: number | null
    discountPercent?: number | null
    publishToMarketplace?: boolean
  },
) {
  const { data } = await api.put<{ message: string; device: ApiDeviceAwaitingPricing }>(
    `/devices/${deviceId}/pricing`,
    payload,
  )
  return data.device
}
