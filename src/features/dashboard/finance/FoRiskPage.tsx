import { useState } from 'react'
import { FO_DELINQUENT_SEED } from '../../../data/mockData'
import { RiskBadge } from './FoBadges'
import type { FoDelinquent } from './foHelpers'

export default function FoRiskPage() {
  const [list, setList]   = useState<FoDelinquent[]>(FO_DELINQUENT_SEED)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
  const markPaid     = (ref: string) => { setList((prev) => prev.filter((r) => r.ref !== ref)); showToast('Marked as paid and removed from delinquency list.') }
  const sendReminder = (ref: string) => showToast(`Payment reminder sent for ${ref}.`)
  const escalate     = (ref: string) => showToast(`${ref} escalated to collections team.`)

  return (
    <div className="fo-page-wrap">
      <div className="fo-risk-summary-row">
        {[
          { label: 'Critical',     cls: 'fo-risk-card-red',    val: list.filter((r) => r.riskLevel === 'Critical').length },
          { label: 'High Risk',    cls: 'fo-risk-card-orange', val: list.filter((r) => r.riskLevel === 'High').length },
          { label: 'Medium Risk',  cls: 'fo-risk-card-yellow', val: list.filter((r) => r.riskLevel === 'Medium').length },
          { label: '$ Overdue',    cls: 'fo-risk-card-blue',   val: '$' + list.reduce((s, r) => s + parseFloat(r.amountDue.replace('$', '')), 0).toFixed(2) },
        ].map((s) => (
          <div key={s.label} className={`fo-risk-stat-card ${s.cls}`}>
            <p className="fo-risk-stat-val">{s.val}</p>
            <p className="fo-risk-stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="fo-panel-card">
        <h3 className="fo-panel-title">Delinquent Accounts</h3>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead><tr><th>Ref</th><th>Customer</th><th>Device</th><th>Overdue</th><th>Amount Due</th><th>Total Owed</th><th>Risk</th><th>Actions</th></tr></thead>
            <tbody>
              {list.length === 0
                ? <tr><td colSpan={8} className="fo-table-empty">No delinquent accounts.</td></tr>
                : list.map((r) => (
                  <tr key={r.ref}>
                    <td className="fo-ref-cell">{r.ref}</td>
                    <td><div>{r.customer}</div><div className="fo-muted">{r.phone}</div></td>
                    <td>{r.device}</td>
                    <td className="fo-due-overdue">{r.overdueDays}d</td>
                    <td>{r.amountDue}</td>
                    <td>{r.totalOwed}</td>
                    <td><RiskBadge level={r.riskLevel} /></td>
                    <td>
                      <div className="fo-action-btns">
                        <button className="fo-btn-view" onClick={() => sendReminder(r.ref)}>Remind</button>
                        <button className="fo-btn-approve" onClick={() => markPaid(r.ref)}>Paid</button>
                        <button className="fo-btn-reject" onClick={() => escalate(r.ref)}>Escalate</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className="fo-toast">{toast}</div>}
    </div>
  )
}
