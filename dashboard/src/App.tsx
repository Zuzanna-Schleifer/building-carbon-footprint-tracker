import KpiCard from './components/KpiCard'
import SectionHeader from './components/SectionHeader'
import {
  ScopeWaterfall, YoyTrendChart, Scope2Comparison,
  Scope3Breakdown, IntensityHeatmap,
} from './components/charts'
import { KPI_SUMMARY, PORTFOLIO_META, EMISSION_FACTORS } from './data/results'

const fmt = (v: number) => v.toLocaleString('pl-PL', { maximumFractionDigits: 0 })

export default function App() {
  return (
    <div className="app">

      {/* ── Header / ledger hero ──────────────────────────── */}
      <header className="ledger-header">
        <div className="ledger-eyebrow">CSRD · ESRS E1-6 · GHG Protocol Scope 1+2+3</div>
        <h1 className="ledger-title">Carbon footprint tracker</h1>
        <p className="ledger-sub">
          Skonsolidowany raport emisji dla portfolio {PORTFOLIO_META.buildings} budynków
          komercyjnych ({fmt(PORTFOLIO_META.totalSqm)} m² GLA, {PORTFOLIO_META.cities} miast),
          okres {PORTFOLIO_META.period}. Metodologia zgodna z GHG Protocol Corporate Standard
          oraz wymogami raportowania CSRD / ESRS E1.
        </p>

        <div className="ledger-totals">
          <div className="ledger-total-main">
            <div className="ledger-stat-label">Łączne emisje — 2023</div>
            <div>
              <span className="ledger-num">{fmt(KPI_SUMMARY.total)}</span>
              <span className="ledger-unit">tCO₂eq</span>
            </div>
          </div>
          <div>
            <div className="ledger-stat-label">Zmiana r/r</div>
            <div className={`ledger-stat-value ${KPI_SUMMARY.yoyChangePct >= 0 ? 'up' : 'down'}`}>
              {KPI_SUMMARY.yoyChangePct >= 0 ? '+' : ''}{KPI_SUMMARY.yoyChangePct.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="ledger-stat-label">Intensywność (kgCO₂eq/m²)</div>
            <div className="ledger-stat-value">{KPI_SUMMARY.intensityKgPerSqm.toFixed(1)}</div>
          </div>
        </div>
      </header>

      {/* ── KPI summary ────────────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Podsumowanie KPI"
          meta="ESRS E1-4 / E1-6 · rok 2023"
          description="Kluczowe wskaźniki raportowane w ramach CSRD. Scope 2 obliczono dwoma metodami zgodnie z wymogiem GHG Protocol — location-based (krajowy mix energetyczny) i market-based (z uwzględnieniem certyfikatów PPA/GO dla budynków z zieloną energią)."
        />
        <div className="kpi-grid">
          <KpiCard label="Scope 1" value={`${fmt(KPI_SUMMARY.scope1)} t`} note="Gaz ziemny + F-gazy" />
          <KpiCard label="Scope 2 (location)" value={`${fmt(KPI_SUMMARY.scope2Location)} t`} note="Krajowy mix energetyczny" />
          <KpiCard label="Scope 2 (market)" value={`${fmt(KPI_SUMMARY.scope2Market)} t`} note={`${PORTFOLIO_META.ppaBuildings} budynków z PPA/GO`} />
          <KpiCard label="Scope 3" value={`${fmt(KPI_SUMMARY.scope3)} t`} note="Dojazdy, odpady, woda" />
          <KpiCard label="Zgodność EU Taxonomy" value={`${KPI_SUMMARY.taxonomyCompliantPct.toFixed(0)}%`} note="Intensywność < 25 kgCO₂eq/m²" />
          <KpiCard label="Cel SBTi" value={`${KPI_SUMMARY.sbtiTargetReduction}%`} note="Redukcja rocznie, baza 2021" />
        </div>
      </section>

      {/* ── Scope waterfall ────────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Struktura emisji portfolio"
          meta="tCO₂eq · 2023"
          description="Rozbicie łącznych emisji na Scope 1, 2 (dwie metody) i 3. Scope 2 location-based dominuje strukturę — odzwierciedla to typowy profil portfolio biurowo-handlowego, w którym energia elektryczna jest głównym źródłem emisji."
        />
        <ScopeWaterfall />
      </section>

      {/* ── YoY trend vs SBTi ──────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Trend emisji vs cel SBTi 1.5°C"
          meta="tCO₂eq · 2021–2023"
          description="Łączne emisje portfolio pozostają praktycznie płaskie (+0,2% r/r), podczas gdy cel SBTi wymaga redukcji o 4,2% rocznie od bazy 2021. Rozjazd między linią rzeczywistych emisji a celem rośnie z każdym rokiem — w 2023 portfolio jest o ok. 9 100 tCO₂eq powyżej trajektorii dekarbonizacji."
        />
        <YoyTrendChart />
      </section>

      {/* ── Scope 2 comparison ─────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Scope 2 — location-based vs market-based"
          meta="tCO₂eq · 2021–2023"
          description={`Dla ${PORTFOLIO_META.ppaBuildings} z ${PORTFOLIO_META.buildings} budynków portfolio (22%) zakupiono certyfikaty pochodzenia (PPA/GO), co redukuje ich raportowane emisje Scope 2 o ok. 94% względem metody location-based. Różnica między oboma metodami kwantyfikuje finansową wartość zakupu zielonej energii.`}
        />
        <Scope2Comparison />
      </section>

      {/* ── Scope 3 breakdown ──────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Scope 3 — struktura emisji"
          meta="tCO₂eq · 2023"
          description="Dojazdy pracowników do pracy (kategoria 7 GHG Protocol) odpowiadają za 91% emisji Scope 3 — dominujący udział samochodów osobowych nad transportem publicznym jest typowy dla lokalizacji poza centrami miast i sygnalizuje potencjał redukcji poprzez programy mobility management."
        />
        <Scope3Breakdown />
      </section>

      {/* ── Intensity heatmap ──────────────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Intensywność emisji — top 20 budynków"
          meta="tCO₂eq/m² · 2023"
          description="Budynki uszeregowane według intensywności emisji na metr kwadratowy. Najbardziej intensywne pozycje (B006, B034, B031) to mniejsze obiekty biurowe i mieszane — typowo wyższa intensywność wynika z niższej efektywności energetycznej na jednostkę powierzchni w starszych, mniejszych budynkach."
        />
        <IntensityHeatmap />
      </section>

      {/* ── Emission factors reference ─────────────────────── */}
      <section className="section">
        <SectionHeader
          title="Współczynniki emisji — metodologia"
          meta="14 źródeł"
          description="Pełna tabela współczynników emisji użytych w kalkulacjach, z przypisaniem do scope i bazy danych źródłowej. Tabela audytowa — każda wartość w raporcie jest traceable do tego źródła."
        />
        <table className="ef-table">
          <thead>
            <tr>
              <th>Scope</th>
              <th>Źródło emisji</th>
              <th className="num">Współczynnik</th>
              <th>Jednostka</th>
              <th>Baza danych</th>
            </tr>
          </thead>
          <tbody>
            {EMISSION_FACTORS.map((ef) => (
              <tr key={ef.source}>
                <td><span className={`scope-tag s${ef.scope}`}>Scope {ef.scope}</span></td>
                <td>{ef.source}</td>
                <td className="num">{ef.factor}</td>
                <td className="num" style={{ textAlign: 'left' }}>{ef.unit}</td>
                <td>{ef.database}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-text">
          Zuzanna Schleifer · GHG Protocol · CSRD / ESRS E1 · Python · React + TypeScript
        </p>
        <a
          href="https://github.com/Zuzanna-Schleifer/carbon-footprint-tracker"
          className="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub →
        </a>
      </footer>

    </div>
  )
}
