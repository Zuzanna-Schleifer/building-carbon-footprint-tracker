# Carbon Footprint Tracker — Real Estate Portfolio CSRD Reporting

**[Live demo →](https://building-carbon-footprint-tracker.vercel.app/)**
Automated Scope 1+2+3 emissions calculation, GHG Protocol-compliant methodology, and CSRD-ready Excel report generation for a 50-building commercial real estate portfolio.

---

## Business context

From 2024, large companies (500+ employees) must report non-financial data under the CSRD directive (Corporate Sustainability Reporting Directive). For real estate asset managers, this means:

- **ESRS E1-6** — Scope 1, 2, and 3 greenhouse gas emissions per building and portfolio
- **ESRS E1-4** — energy intensity and emissions intensity (kgCO₂eq/m²)
- **EU Taxonomy Art. 10** — "green" activity criteria for buildings
- **GHG Protocol Corporate Standard** — methodology for Scope 1+2+3 calculation

This project demonstrates a full end-to-end pipeline: from raw activity data (gas meters, electricity, tenant commuting, waste) through emissions calculation to a structured Excel report ready for external auditors — replacing manual Excel-based data collection.

---

## Project structure

```
carbon-footprint-tracker/
├── data/
│   ├── raw/                         ← synthetic portfolio data + emission factors
│   │   ├── buildings.parquet        ← 50 buildings: type, GLA, city, PPA status
│   │   ├── activity_data.parquet    ← monthly activity data (Scope 1+2+3)
│   │   └── emission_factors.csv     ← KOBiZE / DEFRA / IPCC AR6 factors
│   └── processed/
│       ├── emissions_calculated.parquet  ← calculated kgCO₂eq per record
│       ├── emissions_by_building.parquet ← aggregated by building
│       └── audit_trail.parquet      ← full audit trail for each emission source
├── notebooks/
│   ├── 01_data_generator.ipynb      ← synthetic data + emission factors setup
│   ├── 02_emissions_calculator.ipynb ← GHG Protocol Scope 1+2+3 calculation
│   ├── 03_dashboard.ipynb           ← 5 portfolio visualizations
│   └── 04_csrd_export.ipynb         ← Excel report generation (4 sheets)
├── outputs/
│   ├── CSRD_Carbon_Report_2023.xlsx ← final deliverable
│   ├── annual_kpi.csv               ← KPI summary per year
│   └── charts/                      ← exported chart PNGs for reporting
└── README.md
```

---

## Dataset

**Synthetic portfolio — 50 commercial buildings, 3 years (2021–2023)**

No public dataset exists with full Scope 1+2+3 data for real estate. A realistic simulator was built based on industry benchmarks:

| Parameter | Value |
|---|---|
| Buildings | 50 (office, retail, logistics, hotel, mixed-use) |
| Cities | Warsaw, Kraków, Wrocław, Poznań, Gdańsk |
| Period | Jan 2021 – Dec 2023 (monthly) |
| GLA range | 500 – 25,000 m² |
| PPA / green energy | 30% of buildings |
| Total records | ~48,000 activity data rows |

---

## Methodology

### Scope 1 — direct emissions

| Source | Unit | Emission factor | Database |
|---|---|---|---|
| Natural gas | m³ | 2.040 kgCO₂eq/m³ | KOBiZE 2023 |
| Fuel oil | l | 2.520 kgCO₂eq/l | KOBiZE 2023 |
| Diesel generator | l | 2.640 kgCO₂eq/l | KOBiZE 2023 |
| Refrigerant R-410A | kg | 2,088 kgCO₂eq/kg | IPCC AR6 2021 |
| Refrigerant R-32 | kg | 675 kgCO₂eq/kg | IPCC AR6 2021 |

### Scope 2 — indirect emissions (energy)

Two methods calculated in parallel per GHG Protocol requirements:

- **Location-based**: national grid emission factor (0.770 kgCO₂eq/kWh, KOBiZE 2023)
- **Market-based**: residual mix for buildings with PPA/GO certificates (0.050 kgCO₂eq/kWh)

### Scope 3 — value chain emissions

| Category | Source | Unit | Emission factor | Database |
|---|---|---|---|---|
| Cat. 5 — waste | Landfill | kg | 0.580 kgCO₂eq/kg | DEFRA 2023 |
| Cat. 5 — waste | Recycling | kg | 0.021 kgCO₂eq/kg | DEFRA 2023 |
| Cat. 5 — water | Supply | m³ | 0.149 kgCO₂eq/m³ | DEFRA 2023 |
| Cat. 7 — commuting | Car | km | 0.171 kgCO₂eq/km | DEFRA 2023 |
| Cat. 7 — commuting | Public transport | km | 0.029 kgCO₂eq/km | DEFRA 2023 |

---

## Key outputs

### CSRD Excel report — 4 sheets

| Sheet | Content |
|---|---|
| 1. KPI Summary | ESRS E1-4 and E1-6 disclosure table, ready for annual report |
| 2. Detailed data | Emissions per building × year × source, with auto-filter |
| 3. Audit trail | Every number traceable to source: emission factor, database version, calculation date |
| 4. Emission factors | Full table of factors used with sources — methodological transparency |

### Visualizations

- Waterfall chart: Scope 1+2+3 breakdown (GHG Protocol color convention)
- YoY trend vs SBTi 1.5°C target (-4.2%/year)
- Emissions intensity heatmap: tCO₂eq/m² per building × year
- Location-based vs market-based Scope 2
- Scope 3 breakdown by category

---

## Tech stack

```
Python 3.11
pandas · numpy · plotly · seaborn · openpyxl
```

---

## How to run

```bash
git clone https://github.com/Zuzanna-Schleifer/carbon-footprint-tracker
cd carbon-footprint-tracker

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

pip install pandas numpy plotly seaborn openpyxl jupyter

jupyter notebook
```

Run notebooks in order: 01 → 02 → 03 → 04

---

## Relevance to real estate ESG roles

**CSRD compliance teams** — automates the path from building management system data to ESRS E1 disclosure tables, replacing manual data collection.

**Asset managers (JLL, Cushman & Wakefield, CBRE)** — emissions intensity heatmap and YoY trend provide data layer for portfolio decarbonization strategy and SBTi target-setting.

**ESG auditors** — audit trail sheet provides full methodological transparency: every reported figure has a traceable source, emission factor version, and calculation timestamp.

**Fund managers** — Scope 2 location vs market-based comparison quantifies the financial value of renewable energy procurement (PPA/GO).

---

## Author

**Zuzanna Schleifer**
[LinkedIn](https://www.linkedin.com/in/zuzanna-schleifer) · [GitHub](https://github.com/Zuzanna-Schleifer) · zu.schleifer@gmail.com

Open to roles in ESG data, real estate analytics, and CSRD reporting.
