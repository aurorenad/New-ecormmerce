interface RingChartProps {
  value: number
  size?: number
  color?: string
  label?: string
}

export default function RingChart({ value, size = 160, color = '#10b981', label = 'score' }: RingChartProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 22
  const circ = 2 * Math.PI * r
  const dashLen = (value / 100) * circ

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18"
              transform={`rotate(-90, ${cx}, ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="18"
              strokeDasharray={`${dashLen} ${circ - dashLen}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(-90, ${cx}, ${cy})`} />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="28" fontWeight="800"
            fill="#0f172a" fontFamily="inherit" dominantBaseline="middle">
        {value}%
      </text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize="11"
            fill="#94a3b8" fontFamily="inherit">
        {label}
      </text>
    </svg>
  )
}
