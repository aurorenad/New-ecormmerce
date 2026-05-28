export const FIN_TODAY = new Date('2026-05-24')

export const finRiskOrder: Record<string, number> = { Low: 0, Medium: 1, High: 2 }

export function calcMonthly(principal: number, apr: number, term: number): number {
  const r = apr / 12 / 100
  if (r === 0) return principal / term
  const pow = Math.pow(1 + r, term)
  return (principal * r * pow) / (pow - 1)
}

export function finRisk(apr: number, status: string): string {
  if (status === 'Delinquent') return 'High'
  if (apr > 15) return 'High'
  if (apr >= 14) return 'Medium'
  return 'Low'
}

export function finDue(nextDue: string | null): { label: string; cls: string; days: number } {
  if (!nextDue) return { label: '—', cls: 'fin-due-none', days: Infinity }
  const due  = new Date(nextDue)
  const diff = Math.round((due.getTime() - FIN_TODAY.getTime()) / 86400000)
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, cls: 'fin-due-overdue', days: diff }
  if (diff <= 7) return { label: `Due in ${diff}d`,            cls: 'fin-due-soon',    days: diff }
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    cls: 'fin-due-upcoming',
    days: diff,
  }
}

export function finStatusPill(s: string): string {
  const map: Record<string, string> = {
    Active: 'fin-active',
    Approved: 'fin-approved',
    'Under Review': 'fin-under-review',
    Delinquent: 'fin-delinquent',
    Settled: 'fin-settled',
  }
  return map[s] ?? ''
}
