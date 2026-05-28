import {
  FO_OVERVIEW_KPIS, FO_LOAN_STATUS_PIE, FO_MONTHLY_LOANS,
  FO_APPROVAL_TREND, FO_REQUESTS_SEED,
} from '../../../data/mockData'
import DonutChart from '../shared/components/DonutChart'
import { FoKpiCard, StatusBadge } from './FoBadges'
import FoBarChart from './FoBarChart'
import FoLineChart from './FoLineChart'

export default function FoOverviewPage() {
  return (
    <div className="fo-page-wrap">
      <div className="fo-kpi-grid">
        {FO_OVERVIEW_KPIS.map((s) => <FoKpiCard key={s.label} stat={s} />)}
      </div>

      <div className="fo-charts-row">
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Loan Status Distribution</h3>
          <div className="fo-donut-wrap">
            <DonutChart data={FO_LOAN_STATUS_PIE} size={170} centerLabel="1,284" centerSub="Total Loans" />
            <ul className="fo-donut-legend">
              {FO_LOAN_STATUS_PIE.map((d) => (
                <li key={d.label} className="fo-legend-item">
                  <span className="fo-legend-dot" style={{ background: d.color }} />
                  <span className="fo-legend-label">{d.label}</span>
                  <span className="fo-legend-val">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Monthly Loans Issued</h3>
          <FoBarChart data={FO_MONTHLY_LOANS} />
        </div>
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Approval Rate Trend</h3>
          <FoLineChart data={FO_APPROVAL_TREND} />
          <p className="fo-chart-hint">Current month: <strong>87%</strong></p>
        </div>
      </div>

      <div className="fo-panel-card fo-recent-requests">
        <h3 className="fo-panel-title">Recent Requests</h3>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead>
              <tr><th>Ref</th><th>Customer</th><th>Device</th><th>Status</th></tr>
            </thead>
            <tbody>
              {FO_REQUESTS_SEED.slice(0, 5).map((r) => (
                <tr key={r.ref}>
                  <td className="fo-ref-cell">{r.ref}</td>
                  <td>{r.customer}</td>
                  <td>{r.device}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
