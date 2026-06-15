import {
  BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine,
} from 'recharts'
import {
  SCOPE_WATERFALL, ANNUAL_TOTALS, SCOPE2_COMPARISON,
  SCOPE3_BREAKDOWN, INTENSITY_TOP20,
} from '../../data/results'

const C = {
  scope1: '#0F6E56',
  scope2loc: '#BA7517',
  scope2mkt: '#3B6D11',
  scope3: '#993C1D',
  target: '#534AB7',
  ink: '#2C2C2A',
  inkSoft: '#5F5E5A',
  line: '#D3D1C7',
  paper: '#F4F1EA',
}

const numFmt = (v: number) => v.toLocaleString('pl-PL', { maximumFractionDigits: 0 })

const tooltipStyle = {
  background: '#FFFFFF',
  border: `1px solid ${C.line}`,
  borderRadius: 4,
  fontSize: 13,
  fontFamily: 'IBM Plex Sans, sans-serif',
  padding: '8px 12px',
}

const axisStyle = { fontSize: 12, fill: C.inkSoft, fontFamily: 'IBM Plex Mono, monospace' }

// ── 1. Scope waterfall ──────────────────────────────────────
const waterfallColors: Record<string, string> = {
  scope1: C.scope1,
  scope2Location: C.scope2loc,
  scope2Market: C.scope2mkt,
  scope3: C.scope3,
}

export function ScopeWaterfall() {
  const total = SCOPE_WATERFALL.reduce((s, d) => s + d.value, 0)
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={SCOPE_WATERFALL} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.line} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: C.line }} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false}
            tickFormatter={(v) => numFmt(v)} width={64} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`${numFmt(v)} tCO₂eq`, 'Emisje']}
          />
          <ReferenceLine y={total} stroke={C.inkSoft} strokeDasharray="3 3"
            label={{ value: `Suma: ${numFmt(total)} tCO₂eq`, position: 'insideTopRight', fill: C.inkSoft, fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {SCOPE_WATERFALL.map((entry) => (
              <Cell key={entry.key} fill={waterfallColors[entry.key]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 2. YoY trend vs SBTi target ─────────────────────────────
export function YoyTrendChart() {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={ANNUAL_TOTALS} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.line} vertical={false} />
          <XAxis dataKey="year" tick={axisStyle} axisLine={{ stroke: C.line }} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false}
            tickFormatter={(v) => numFmt(v)} width={64}
            domain={[90000, 110000]} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number, name: string) => [`${numFmt(v)} tCO₂eq`, name]}
          />
          <Bar dataKey="scope1" stackId="a" fill={C.scope1} name="Scope 1" radius={[0, 0, 0, 0]} />
          <Bar dataKey="scope2Location" stackId="a" fill={C.scope2loc} name="Scope 2 (location)" />
          <Bar dataKey="scope3" stackId="a" fill={C.scope3} name="Scope 3" radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="sbtiTarget" stroke={C.target} strokeWidth={2}
            strokeDasharray="5 4" dot={{ r: 3, fill: C.target }} name="Cel SBTi 1.5°C" />
          <Line type="monotone" dataKey="total" stroke={C.ink} strokeWidth={2}
            dot={{ r: 3, fill: C.ink }} name="Łącznie" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="legend-row" style={{ marginTop: 8, marginBottom: 0 }}>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.scope1 }} />Scope 1</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.scope2loc }} />Scope 2 (location)</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.scope3 }} />Scope 3</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.ink }} />Łącznie</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.target }} />Cel SBTi (-4.2%/rok)</span>
      </div>
    </div>
  )
}

// ── 3. Scope 2 location vs market ───────────────────────────
export function Scope2Comparison() {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={SCOPE2_COMPARISON} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.line} vertical={false} />
          <XAxis dataKey="year" tick={axisStyle} axisLine={{ stroke: C.line }} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false}
            tickFormatter={(v) => numFmt(v)} width={64} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number, name: string) => [`${numFmt(v)} tCO₂eq`, name]}
          />
          <Bar dataKey="location" fill={C.scope2loc} name="Location-based" radius={[2, 2, 0, 0]} />
          <Bar dataKey="market" fill={C.scope2mkt} name="Market-based (PPA/GO)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="legend-row" style={{ marginTop: 8, marginBottom: 0 }}>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.scope2loc }} />Location-based (KOBiZE grid)</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: C.scope2mkt }} />Market-based (11 budynków z PPA/GO)</span>
      </div>
    </div>
  )
}

// ── 4. Scope 3 breakdown ─────────────────────────────────────
export function Scope3Breakdown() {
  const sorted = [...SCOPE3_BREAKDOWN].sort((a, b) => a.value - b.value)
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="2 4" stroke={C.line} horizontal={false} />
          <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false}
            tickFormatter={(v) => numFmt(v)} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: C.ink, fontFamily: 'IBM Plex Sans, sans-serif' }}
            axisLine={false} tickLine={false} width={170} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`${numFmt(v)} tCO₂eq`, 'Emisje 2023']}
          />
          <Bar dataKey="value" fill={C.scope3} radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 5. Intensity heatmap (top 20, rendered as horizontal bars) ──
export function IntensityHeatmap() {
  const sorted = [...INTENSITY_TOP20].sort((a, b) => b.y2023 - a.y2023)
  const max = Math.max(...sorted.map((d) => d.y2023))

  const colorFor = (val: number) => {
    const t = val / max
    if (t > 0.85) return '#E24B4A'
    if (t > 0.6) return '#EF9F27'
    if (t > 0.4) return '#FAC775'
    return '#97C459'
  }

  return (
    <div className="chart-box">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((d) => (
          <div key={d.buildingId} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 72px', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: C.inkSoft }}>{d.buildingId}</span>
            <div style={{ background: '#E9E6DC', borderRadius: 2, height: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                width: `${(d.y2023 / max) * 100}%`,
                height: '100%',
                background: colorFor(d.y2023),
                borderRadius: 2,
              }} />
            </div>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, textAlign: 'right' }}>
              {d.y2023.toFixed(3)} t/m²
            </span>
          </div>
        ))}
      </div>
      <div className="legend-row" style={{ marginTop: 16, marginBottom: 0 }}>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#97C459' }} />Niska intensywność</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#FAC775' }} />Średnia</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#EF9F27' }} />Wysoka</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#E24B4A' }} />Krytyczna</span>
      </div>
    </div>
  )
}
