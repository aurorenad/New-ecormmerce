import type { Loan } from '../../../shared/types/dashboard.types'
import ModalBase from '../../../shared/components/ModalBase'
import { calcMonthly, finRisk, finDue, finStatusPill } from './financingHelpers'

interface Props { loan: Loan; onClose: () => void }

export default function LoanViewModal({ loan, onClose }: Props) {
  const monthly = calcMonthly(loan.principal, loan.apr, loan.term)
  const risk    = finRisk(loan.apr, loan.status)
  const due     = finDue(loan.nextDue)

  return (
    <ModalBase title="Loan Details" onClose={onClose} footer={
      <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
    }>
      <div className="um-profile-hero">
        <div className="fin-modal-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <p className="um-profile-name">{loan.customer}</p>
          <div className="um-profile-badges">
            <span className={`fin-pill ${finStatusPill(loan.status)}`}>{loan.status}</span>
            <span className={`risk-pill risk-${risk.toLowerCase()}`}>{risk} Risk</span>
          </div>
        </div>
      </div>

      <div className="um-info-grid">
        <div className="um-info-item"><span className="um-info-label">Reference</span><span className="um-info-value cell-mono">{loan.ref}</span></div>
        <div className="um-info-item"><span className="um-info-label">Device</span><span className="um-info-value">{loan.device}</span></div>
        <div className="um-info-item"><span className="um-info-label">Principal</span><span className="um-info-value">${loan.principal.toLocaleString()}</span></div>
        <div className="um-info-item"><span className="um-info-label">Term</span><span className="um-info-value">{loan.term} months</span></div>
        <div className="um-info-item"><span className="um-info-label">APR</span><span className="um-info-value">{loan.apr}%</span></div>
        <div className="um-info-item"><span className="um-info-label">Monthly Payment</span><span className="um-info-value fin-modal-monthly">${monthly.toFixed(2)}/mo</span></div>
        <div className="um-info-item"><span className="um-info-label">Total Repayable</span><span className="um-info-value">${(monthly * loan.term).toFixed(2)}</span></div>
        <div className="um-info-item"><span className="um-info-label">Next Due</span><span className={`um-info-value ${due.cls}`}>{due.label}</span></div>
      </div>
    </ModalBase>
  )
}
