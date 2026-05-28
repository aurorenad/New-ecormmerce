import type { FoApprovalTrend } from './foHelpers'

interface Props { data: FoApprovalTrend[]; height?: number }

export default function FoLineChart({ data, height = 100 }: Props) {
  const w = 320
  const pad = 16
  const max = Math.max(...data.map((d) => d.rate))
  const min = Math.min(...data.map((d) => d.rate)) - 5
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = height - ((d.rate - min) / (max - min)) * (height - 20) - 8
    return [x, y] as [number, number]
  })
  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const areaD = `${pathD} L${pts[pts.length - 1][0]},${height} L${pts[0][0]},${height} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height + 22}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="fo-line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#fo-line-grad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <g key={data[i].month}>
          <circle cx={x} cy={y} r="3" fill="#3b82f6" />
          <text x={x} y={height + 16} textAnchor="middle" fill="#9ca3af" fontSize="9">{data[i].month}</text>
        </g>
      ))}
    </svg>
  )
}
