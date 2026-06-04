import { api } from '../lib/api'
import type { ApiDevice } from '../lib/mappers'

export async function intakeDevice(payload: {
  brand: string
  model: string
  originalSerialNumber?: string
  condition: string
  batteryHealth?: number
  basePrice: number
  price: number
}) {
  const { data } = await api.post<{ device: ApiDevice }>('/devices/intake', payload)
  return data.device
}

export async function fetchDevices(params?: Record<string, string>) {
  const { data } = await api.get<{ devices: ApiDevice[] }>('/devices', { params })
  return data.devices
}

/** @deprecated Use submitTradeIn from tradeIn.service.ts (multipart + images) */
export { submitTradeIn } from './tradeIn.service'
