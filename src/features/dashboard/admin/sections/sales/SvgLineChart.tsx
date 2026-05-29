import { useState } from 'react'

interface ChartPoint { label: string; value: number }

interface Props {
  data: ChartPoint[]
  color?: string
  valuePrefix?: string
}

export default function SvgLineChart({ data, color = '#025c50', valuePrefix = '$' }: Props) {
  const [hovIdx, setHovIdx] = useState<number | null>(null)
  const W = 500, H = 180, PL = 56, PR = 20, PT = 20, PB = 32
  const plotW = W - PL - PR
  const plotH = H - PT - PB
  const vals  = data.map((d) => d.value)
  const min   = Math.min(...vals)
  const max   = Math.max(...vals)
  const range = max - min || 1
  const xOf   = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * plotW
  const yOf   = (v: number) => PT + plotH - ((v - min) / range) * plotH
  const line  = data.map((d, i) => `${xOf(i)},${yOf(d.value)}`).join(' ')
  const area  = [`${xOf(0)},${PT + plotH}`, ...data.map((d, i) => `${xOf(i)},${yOf(d.value)}`), `${xOf(data.length - 1)},${PT + plotH}`].join(' ')
  const fmt   = (v: number) => v >= 1000 ? `${valuePrefix}${(v / 1000).toFixed(0)}k` : `${valuePrefix}${v.toFixed(0)}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {[0, 0.5, 1].map((t) => {
        const y = PT + t * plotH
        return (
          <g key={t}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{fmt(max - t * range)}</text>
          </g>
        )
      })}
      <polygon points={area} fill={color} opacity="0.08" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const cx = xOf(i), cy = yOf(d.value)
        const isHov = hovIdx === i
        const tipW = 72, tipH = 22
        const tipX = Math.min(Math.max(cx - tipW / 2, PL), W - PR - tipW)
        return (
          <g key={i} style={{ cursor: 'default' }}>
            <rect x={cx - 12} y={PT - 4} width="24" height={plotH + 8} fill="transparent"
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
            <circle cx={cx} cy={cy} r={isHov ? 5.5 : 3.5} fill={color} />
            {isHov && (
              <>
                <line x1={cx} y1={PT} x2={cx} y2={PT + plotH} stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
                <rect x={tipX} y={cy - tipH - 8} width={tipW} height={tipH} rx="4" fill="#1e293b" />
                <text x={tipX + tipW / 2} y={cy - tipH + 7} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">{fmt(d.value)}</text>
              </>
            )}
            <text x={cx} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}
