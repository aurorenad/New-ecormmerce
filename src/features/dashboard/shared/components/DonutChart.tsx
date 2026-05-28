import type { DonutSegment } from '../types/dashboard.types'

interface DonutChartProps {
  data: DonutSegment[]
  size?: number
  centerLabel?: string
  centerSub?: string
}

export default function DonutChart({ data, size = 160, centerLabel, centerSub }: DonutChartProps) {
  const r = size * 0.36
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const total = data.reduce((s, d) => s + d.value, 0)
  const segments: { color: string; dashArray: string; dashOffset: number }[] = []
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
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={size * 0.115}
            strokeDasharray={s.dashArray}
            strokeDashoffset={s.dashOffset}
          />
        ))}
      </g>
      {centerLabel && (
        <>
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#111827"
            fontSize={size * 0.13}
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            {centerLabel}
          </text>
          {centerSub && (
            <text
              x={cx}
              y={cy + size * 0.1}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={size * 0.075}
              fontFamily="system-ui, sans-serif"
            >
              {centerSub}
            </text>
          )}
        </>
      )}
    </svg>
  )
}
