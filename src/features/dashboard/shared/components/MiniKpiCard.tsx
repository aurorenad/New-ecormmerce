interface MiniKpiCardProps {
  label: string
  value: string | number
  hint?: string
}

export default function MiniKpiCard({ label, value, hint }: MiniKpiCardProps) {
  return (
    <article className="mini-kpi">
      <p className="mini-kpi-label">{label}</p>
      <p className="mini-kpi-value">{value}</p>
      {hint && <p className="mini-kpi-hint">{hint}</p>}
    </article>
  )
}
