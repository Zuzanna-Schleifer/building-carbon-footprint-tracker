interface KpiCardProps {
  label: string
  value: string | number
  unit?: string
}

export default function KpiCard({ label, value, unit = '' }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
    </div>
  )
}
