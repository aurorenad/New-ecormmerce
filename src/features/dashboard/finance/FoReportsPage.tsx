import { FO_REPORTS_REGIONAL, FO_MONTHLY_LOANS, FO_APPROVAL_TREND } from '../../../data/mockData'
import FoBarChart from './FoBarChart'
import FoLineChart from './FoLineChart'

const fmt = (n: number) => '$' + n.toLocaleString('en-US')

export default function FoReportsPage() {
  const totalDisbursed    = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.disbursed.replace(/[$,]/g, '')), 0)
  const totalCollected    = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.collected.replace(/[$,]/g, '')), 0)
  const totalOutstanding  = FO_REPORTS_REGIONAL.reduce((s, r) => s + parseFloat(r.outstanding.replace(/[$,]/g, '')), 0)

  const handleExport = () => {
    const headers = ['Region', 'Disbursed', 'Collected', 'Outstanding', 'Default Rate', 'Loan Count']
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`
    const lines = [headers.map(esc).join(','), ...FO_REPORTS_REGIONAL.map((r) =>
      [r.region, r.disbursed, r.collected, r.outstanding, r.defaultRate, r.loanCount].map(esc).join(',')
    )]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `revivotech-finance-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div className="fo-page-wrap">
      <div className="fo-reports-summary">
        {[
          { label: 'Total Revenue',    val: fmt(totalDisbursed),   cls: '' },
          { label: 'Total Collected',  val: fmt(totalCollected),   cls: 'fo-green' },
          { label: 'Outstanding',      val: fmt(totalOutstanding), cls: 'fo-amber' },
          { label: 'Avg Default Rate', val: '2.5%',                cls: 'fo-red' },
        ].map((s) => (
          <div key={s.label} className="fo-rep-stat">
            <p className={`fo-rep-val ${s.cls}`}>{s.val}</p>
            <p className="fo-rep-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="fo-charts-row fo-charts-row-2">
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Monthly Loan Trends</h3>
          <FoBarChart data={FO_MONTHLY_LOANS} height={120} />
        </div>
        <div className="fo-chart-card">
          <h3 className="fo-chart-title">Approval Rate Performance</h3>
          <FoLineChart data={FO_APPROVAL_TREND} />
          <p className="fo-chart-hint">Current: <strong>87%</strong></p>
        </div>
      </div>

      <div className="fo-panel-card">
        <div className="fo-panel-header-row">
          <h3 className="fo-panel-title">Regional Performance</h3>
          <button className="fo-btn-export" onClick={handleExport}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M8 11l4 4 4-4M4 21h16" /></svg>
            Export CSV
          </button>
        </div>
        <div className="fo-table-scroll">
          <table className="fo-table">
            <thead><tr><th>Region</th><th>Disbursed</th><th>Collected</th><th>Outstanding</th><th>Default Rate</th><th>Loans</th></tr></thead>
            <tbody>
              {FO_REPORTS_REGIONAL.map((r) => (
                <tr key={r.region}>
                  <td><strong>{r.region}</strong></td>
                  <td>{r.disbursed}</td>
                  <td className="fo-green">{r.collected}</td>
                  <td className="fo-amber">{r.outstanding}</td>
                  <td className={parseFloat(r.defaultRate) > 3 ? 'fo-red' : ''}>{r.defaultRate}</td>
                  <td>{r.loanCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
