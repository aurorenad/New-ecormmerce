// @ts-nocheck
import { OVERVIEW_PIE_DATA, OVERVIEW_REVENUE_TREND, OVERVIEW_STATS, OVERVIEW_ORDERS_TREND } from '../data/mockData'

// ─── SVG: Donut Chart ─────────────────────────────────────────────────────────

function DonutChart({ data, size = 160, centerLabel, centerSub }) {
  const r = size * 0.36
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)
  const segments = []
  let acc = 0
  for (const d of data.filter((d) => d.value > 0)) {
    const len = (d.value / total) * circ
    segments.push({ color: d.color, dashArray: `${len} ${circ - len}`, dashOffset: circ - acc })
    acc += len
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={size * 0.115} />
      <g transform={`rotate(-90, ${cx}, ${cy})`}>
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
            strokeWidth={size * 0.115} strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset} />
        ))}
      </g>
      {centerLabel && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#111827"
            fontSize={size * 0.13} fontWeight="700"
            fontFamily="system-ui, sans-serif">{centerLabel}</text>
          {centerSub && (
            <text x={cx} y={cy + size * 0.1} textAnchor="middle" fill="#6b7280"
              fontSize={size * 0.075}
              fontFamily="system-ui, sans-serif">{centerSub}</text>
          )}
        </>
      )}
    </svg>
  )
}

// ─── SVG: Revenue Bar Chart ───────────────────────────────────────────────────

function RevenueBarChart({ data }) {
  const W = 400
  const H = 170
  const padL = 10
  const padR = 10
  const padT = 28
  const padB = 26
  const chartW = W - padL - padR
  const chartH = H - padT - padB
  const max = Math.max(...data.map((d) => d.revenue))
  const step = chartW / data.length
  const barW = Math.floor(step * 0.55)
  const fmtK = (v) => '$' + Math.round(v / 1000) + 'K'

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ov-bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const bh = Math.max(6, (d.revenue / max) * chartH)
        const x = padL + i * step + (step - barW) / 2
        const y = padT + chartH - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="5" fill="url(#ov-bar-grad)" />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle"
              fill="#374151" fontSize="10" fontWeight="600"
              fontFamily="system-ui, sans-serif">{fmtK(d.revenue)}</text>
            <text x={x + barW / 2} y={H - 6} textAnchor="middle"
              fill="#94a3b8" fontSize="10"
              fontFamily="system-ui, sans-serif">{d.month}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── SVG: Orders Line Chart ───────────────────────────────────────────────────

function OrdersLineChart({ data }) {
  const W = 360
  const H = 130
  const padL = 14
  const padR = 14
  const padT = 18
  const padB = 28
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const max = Math.max(...data.map((d) => d.orders))
  const min = Math.min(...data.map((d) => d.orders)) - 8

  const pts = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * chartW
    const y = padT + chartH - ((d.orders - min) / (max - min)) * chartH
    return [x, y]
  })

  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length - 1][0].toFixed(1)},${padT + chartH} L${padL},${padT + chartH} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ov-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#ov-area-grad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
          <text x={x} y={H - 6} textAnchor="middle"
            fill="#9ca3af" fontSize="10"
            fontFamily="system-ui, sans-serif">{data[i].month}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── Stat Icon ────────────────────────────────────────────────────────────────

function StatIcon({ type }) {
  const icons = {
    people:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    package: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    tool:    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    finance: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
    dollar:  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    loans:   <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /><circle cx="12" cy="12" r="10" strokeOpacity="0.15" /></>,
  }
  const colors = {
    people:  { bg: 'rgba(2,92,80,0.1)',     fg: '#025c50' },
    package: { bg: 'rgba(240,171,60,0.12)', fg: '#b45309' },
    tool:    { bg: 'rgba(59,130,246,0.1)',  fg: '#1d4ed8' },
    finance: { bg: 'rgba(139,92,246,0.1)',  fg: '#6d28d9' },
    dollar:  { bg: 'rgba(34,197,94,0.1)',   fg: '#15803d' },
    loans:   { bg: 'rgba(6,182,212,0.1)',   fg: '#0e7490' },
  }
  const c = colors[type] ?? colors.dollar
  return (
    <span className="ov-kpi-icon" style={{ background: c.bg, color: c.fg }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {icons[type] ?? icons.dollar}
      </svg>
    </span>
  )
}

// ─── Overview Section ─────────────────────────────────────────────────────────

export default function OverviewSection() {
  const total = OVERVIEW_PIE_DATA.reduce((s, d) => s + d.value, 0)
  const currentOrders = OVERVIEW_ORDERS_TREND[OVERVIEW_ORDERS_TREND.length - 1].orders

  return (
    <div className="overview-stack">

      {/* KPI Cards — 6 in a row */}
      <section className="ov-kpi-grid" aria-label="Key metrics">
        {OVERVIEW_STATS.map((stat) => (
          <article className="ov-kpi-card" key={stat.label}>
            <div className="ov-kpi-top">
              <StatIcon type={stat.icon} />
              <span className={`ov-kpi-trend ${stat.trend}`}>
                {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
              </span>
            </div>
            <p className="ov-kpi-label">{stat.label}</p>
            <p className="ov-kpi-value">{stat.value}</p>
          </article>
        ))}
      </section>

      {/* Charts row — 3 panels */}
      <div className="ov-charts-row">

        {/* Left: Distribution Donut */}
        <div className="ov-chart-card">
          <h3 className="ov-chart-title">Distribution Overview</h3>
          <div className="ov-donut-wrap">
            <DonutChart
              data={OVERVIEW_PIE_DATA}
              size={160}
              centerLabel={total.toLocaleString()}
              centerSub="Total"
            />
            <ul className="ov-donut-legend">
              {OVERVIEW_PIE_DATA.map((d) => (
                <li key={d.label} className="ov-legend-item">
                  <span className="ov-legend-dot" style={{ background: d.color }} />
                  <span className="ov-legend-label">{d.label}</span>
                  <span className="ov-legend-val">{d.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle: Revenue Bar Chart */}
        <div className="ov-chart-card">
          <h3 className="ov-chart-title">Monthly Revenue</h3>
          <RevenueBarChart data={OVERVIEW_REVENUE_TREND} />
          <p className="ov-chart-hint">
            Current month: <strong>$124,592</strong>
          </p>
        </div>

        {/* Right: Orders Line Chart */}
        <div className="ov-chart-card">
          <h3 className="ov-chart-title">Orders Trend</h3>
          <OrdersLineChart data={OVERVIEW_ORDERS_TREND} />
          <p className="ov-chart-hint">
            Current month: <strong>{currentOrders} orders</strong>
          </p>
        </div>

      </div>
    </div>
  )
}
