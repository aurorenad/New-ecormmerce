import { useState } from 'react'

interface ChartPoint { label: string; value: number }

interface Props {
  data: ChartPoint[]
  color?: string
}

export default function SvgBarChart({ data, color = '#1d4ed8' }: Props) {
  const [hovIdx, setHovIdx] = useState<number | null>(null)
  const W = 500, H = 160, PL = 36, PR = 16, PT = 16, PB = 28
  const plotW = W - PL - PR
  const plotH = H - PT - PB
  const max   = Math.max(...data.map((d) => d.value)) || 1
  const slotW = plotW / data.length
  const barW  = slotW * 0.55

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {[0, 0.5, 1].map((t) => {
        const y = PT + t * plotH
        return (
          <g key={t}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PL - 4} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(max * (1 - t))}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const barH  = (d.value / max) * plotH
        const x     = PL + i * slotW + (slotW - barW) / 2
        const cx    = x + barW / 2
        const isHov = hovIdx === i
        const tipW  = 48
        return (
          <g key={i}>
            <rect x={x} y={PT + plotH - barH} width={barW} height={barH} rx="3"
              fill={color} opacity={isHov ? 1 : 0.75} style={{ cursor: 'default' }}
              onMouseEnter={() => setHovIdx(i)} onMouseLeave={() => setHovIdx(null)} />
            {isHov && (
              <>
                <rect x={cx - tipW / 2} y={PT + plotH - barH - 26} width={tipW} height={20} rx="4" fill="#1e293b" />
                <text x={cx} y={PT + plotH - barH - 11} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{d.value}</text>
              </>
            )}
            <text x={cx} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}
