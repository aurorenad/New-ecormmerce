import type { SalesRow } from '../../../shared/types/dashboard.types'
import ModalBase from '../../../shared/components/ModalBase'

interface Props { row: SalesRow; onClose: () => void }

export default function SaleDetailModal({ row, onClose }: Props) {
  const profit        = Math.round(row.revenue * (row.margin / 100))
  const revenuePerOrd = Math.round(row.revenue / row.orders)
  const isPos         = row.growth >= 0

  return (
    <ModalBase title={`Sales Report — ${row.region}`} onClose={onClose} footer={
      <button type="button" className="um-btn-secondary" onClick={onClose}>Close</button>
    }>
      <div className="um-profile-hero">
        <div className="sale-modal-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <p className="um-profile-name">{row.region}</p>
          <div className="um-profile-badges">
            <span className="role-pill">{row.period}</span>
            <span className={`growth-pill ${isPos ? '' : 'growth-pill--neg'}`}>{isPos ? '+' : ''}{row.growth}%</span>
          </div>
        </div>
      </div>

      <div className="um-info-grid">
        <div className="um-info-item"><span className="um-info-label">Revenue</span><span className="um-info-value cell-bold">${row.revenue.toLocaleString()}</span></div>
        <div className="um-info-item"><span className="um-info-label">Orders</span><span className="um-info-value">{row.orders.toLocaleString()}</span></div>
        <div className="um-info-item"><span className="um-info-label">Profit</span><span className="um-info-value sale-modal-profit">${profit.toLocaleString()}</span></div>
        <div className="um-info-item"><span className="um-info-label">Margin</span><span className="um-info-value">{row.margin}%</span></div>
        <div className="um-info-item"><span className="um-info-label">Growth</span><span className={`um-info-value ${isPos ? 'sale-pos' : 'sale-neg'}`}>{isPos ? '+' : ''}{row.growth}%</span></div>
        <div className="um-info-item"><span className="um-info-label">Revenue / Order</span><span className="um-info-value">${revenuePerOrd.toLocaleString()}</span></div>
      </div>
    </ModalBase>
  )
}
