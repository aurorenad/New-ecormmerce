import { REPAIR_TICKETS_SEED } from '../../../data/mockData'
import type { ApiRefurbishment, RefurbishmentStatus } from '../../../services/refurbishment.service'

export const TW_NOW = new Date()
export const STATUS_OPTIONS = ['Pending', 'In Progress', 'Awaiting Parts', 'Completed'] as const
export type TStatus = (typeof STATUS_OPTIONS)[number]

export const PRIORITY_OPTIONS = ['Urgent', 'Standard', 'Low'] as const
export type TPriority = (typeof PRIORITY_OPTIONS)[number]

export const TW_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'devices',  label: 'Assigned Devices' },
  { id: 'sell-requests', label: 'Sell Requests' },
  { id: 'profile',  label: 'Profile' },
] as const

export interface RepairPart  { id: string; label: string; done: boolean }
export interface FaultNote   { at: string; text: string }
export interface RepairTicket {
  id: string; device: string; fault: string
  priority: 'Urgent' | 'Standard' | 'Low'
  status: TStatus
  imei: string; modelCode: string; severity: 'Critical' | 'Medium' | 'Minor'
  assignedAt: string; dueAt: string | null; faultDetail: string
  parts: RepairPart[]; faultNotes: FaultNote[]; progress: number
  refurbishmentId?: string
  deviceId?: string
}

const REFURB_STATUS_PROGRESS: Record<RefurbishmentStatus, number> = {
  RECEIVED: 5,
  DIAGNOSING: 25,
  REPAIRING: 55,
  QUALITY_CHECK: 75,
  CERTIFIED: 90,
  READY: 100,
}

export function refurbishmentToTicket(r: ApiRefurbishment): RepairTicket {
  const tradeIn = r.device.tradeInRequest
  const repairEst = tradeIn?.technicianRepairEstimate ?? 0
  const priority: RepairTicket['priority'] =
    repairEst >= 150 ? 'Urgent' : repairEst >= 60 ? 'Standard' : 'Low'
  const severity: RepairTicket['severity'] =
    repairEst >= 150 ? 'Critical' : repairEst >= 60 ? 'Medium' : 'Minor'

  let status: TStatus = 'Pending'
  if (r.status === 'READY' || r.status === 'CERTIFIED') status = 'Completed'
  else if (r.status === 'REPAIRING') status = 'In Progress'
  else if (r.status === 'DIAGNOSING' || r.status === 'QUALITY_CHECK') status = 'In Progress'

  const fault = tradeIn?.defects || r.diagnostics || 'Awaiting diagnostic review'
  const faultDetail = [r.diagnostics, r.repairNotes, tradeIn?.technicianComment].filter(Boolean).join('\n\n') || fault

  const notes: FaultNote[] = []
  if (r.repairNotes && r.repairNotes !== r.diagnostics) {
    notes.push({ at: new Date(r.updatedAt).toISOString().slice(0, 16).replace('T', ' '), text: r.repairNotes })
  }

  let parts: RepairPart[] = []
  try {
    const parsed = JSON.parse(r.partsUsed)
    if (Array.isArray(parsed) && parsed.length > 0) {
      parts = parsed.map((label: string, i: number) => ({
        id: `part-${i}`,
        label: String(label),
        done: r.status === 'QUALITY_CHECK' || r.status === 'CERTIFIED' || r.status === 'READY',
      }))
    }
  } catch {
    parts = []
  }
  if (parts.length === 0) {
    parts = [
      { id: 'diag', label: 'Run full diagnostics', done: r.status !== 'RECEIVED' },
      { id: 'repair', label: 'Complete repair work', done: ['QUALITY_CHECK', 'CERTIFIED', 'READY'].includes(r.status) },
      { id: 'qc', label: 'Quality check & certify', done: r.status === 'CERTIFIED' || r.status === 'READY' },
    ]
  }

  const assigned = new Date(r.createdAt)
  const due = new Date(assigned)
  due.setDate(due.getDate() + (priority === 'Urgent' ? 1 : priority === 'Standard' ? 3 : 5))

  return {
    id: r.id.slice(0, 8).toUpperCase(),
    refurbishmentId: r.id,
    deviceId: r.deviceId,
    device: `${r.device.brand} ${r.device.model}`,
    fault: fault.slice(0, 80),
    priority,
    status,
    imei: r.deviceId.slice(0, 12),
    modelCode: r.device.model,
    severity,
    assignedAt: r.createdAt,
    dueAt: status === 'Completed' ? null : due.toISOString(),
    faultDetail,
    parts,
    faultNotes: notes,
    progress: REFURB_STATUS_PROGRESS[r.status] ?? 0,
  }
}

export function ticketStatusToRefurbishment(status: TStatus): RefurbishmentStatus {
  if (status === 'Completed') return 'READY'
  if (status === 'In Progress') return 'REPAIRING'
  if (status === 'Awaiting Parts') return 'REPAIRING'
  return 'RECEIVED'
}

export function cloneTickets(): RepairTicket[] {
  return (REPAIR_TICKETS_SEED as unknown as RepairTicket[]).map((t) => ({
    ...t,
    dueAt: t.dueAt ?? null,
    parts: t.parts.map((p) => ({ ...p })),
    faultNotes: [],
  }))
}

export function statusPillClass(s: string): string {
  return `tech-status tech-status--${s.toLowerCase().replace(/\s+/g, '-')}`
}

export function progressClass(pct: number): string {
  if (pct >= 70) return 'tov-prog--high'
  if (pct >= 30) return 'tov-prog--mid'
  return 'tov-prog--low'
}

export function priorityClass(p: string): string {
  if (p === 'Urgent') return 'tov-priority tov-priority--urgent'
  if (p === 'Low')    return 'tov-priority tov-priority--low'
  return 'tov-priority tov-priority--standard'
}

export function deviceIcon(device: string): string {
  const lc = device.toLowerCase()
  if (lc.includes('macbook') || lc.includes('laptop')) return '💻'
  if (lc.includes('ipad')   || lc.includes('tab'))    return '📟'
  return '📱'
}

export function twRelTime(isoStr: string | null): string {
  if (!isoStr) return '—'
  const then = new Date(isoStr)
  const mins = Math.floor((TW_NOW.getTime() - then.getTime()) / 60000)
  const hrs  = Math.floor(mins / 60)
  const days = Math.floor(hrs / 24)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs  < 24) return `${hrs}h ago`
  return `${days}d ago`
}

export function dueInfo(dueIso: string | null): { label: string; cls: string } | null {
  if (!dueIso) return null
  const due    = new Date(dueIso)
  const diffMs  = due.getTime() - TW_NOW.getTime()
  const diffMin = Math.floor(Math.abs(diffMs) / 60000)
  const diffHrs = Math.floor(diffMin / 60)
  if (diffMs < 0) {
    const label = diffHrs > 0 ? `Overdue ${diffHrs}h` : `Overdue ${diffMin}m`
    return { label, cls: 'due-overdue' }
  }
  if (diffMin < 60) return { label: `Due in ${diffMin}m`, cls: 'due-soon' }
  if (diffHrs < 24) return { label: `Due in ${diffHrs}h`, cls: 'due-today' }
  return { label: 'Due tomorrow', cls: 'due-ok' }
}
