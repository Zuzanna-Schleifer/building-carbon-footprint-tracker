// ============================================================
// Projekt Data 3 — Carbon Footprint Tracker
// Computed results from notebooks 01-04
// ============================================================

export const PORTFOLIO_META = {
  buildings: 50,
  totalSqm: 779564,
  totalTenants: 13562,
  ppaBuildings: 11,
  cities: 5,
  period: '2021–2023',
}

// ── KPI summary (2023) ──────────────────────────────────────
export const KPI_SUMMARY = {
  scope1: 7674.45,
  scope2Location: 83642.76,
  scope2Market: 1633.65,
  scope3: 12422.18,
  total: 105373.04,
  intensityKgPerSqm: 135.17,
  yoyChangePct: 0.20,
  taxonomyCompliantPct: 2.0,
  sbtiTargetReduction: -4.2,
}

// ── Annual scope totals (tCO2eq) ────────────────────────────
export const ANNUAL_TOTALS = [
  { year: 2021, scope1: 7613.05, scope2Location: 83310.56, scope2Market: 1627.92, scope3: 12316.13, total: 104867.66, sbtiTarget: 104867.66 },
  { year: 2022, scope1: 7612.39, scope2Location: 83568.07, scope2Market: 1625.23, scope3: 12357.67, total: 105163.36, sbtiTarget: 100463.21 },
  { year: 2023, scope1: 7674.45, scope2Location: 83642.76, scope2Market: 1633.65, scope3: 12422.18, total: 105373.04, sbtiTarget: 96243.76 },
]

// ── Scope waterfall (2023, tCO2eq) ──────────────────────────
export const SCOPE_WATERFALL = [
  { name: 'Scope 1', value: 7674.45, key: 'scope1' },
  { name: 'Scope 2\n(location)', value: 83642.76, key: 'scope2Location' },
  { name: 'Scope 2\n(market)', value: 1633.65, key: 'scope2Market' },
  { name: 'Scope 3', value: 12422.18, key: 'scope3' },
]

// ── Scope 2: location-based vs market-based (tCO2eq) ────────
export const SCOPE2_COMPARISON = [
  { year: 2021, location: 83310.56, market: 1627.92 },
  { year: 2022, location: 83568.07, market: 1625.23 },
  { year: 2023, location: 83642.76, market: 1633.65 },
]

// ── Scope 3 breakdown (2023, tCO2eq) ────────────────────────
export const SCOPE3_BREAKDOWN = [
  { name: 'Dojazdy — samochód', key: 'car_commute', value: 10553.29, category: 'Kat. 7 — dojazdy do pracy' },
  { name: 'Dojazdy — transport publiczny', key: 'public_transport', value: 795.44, category: 'Kat. 7 — dojazdy do pracy' },
  { name: 'Odpady — wysypisko', key: 'waste_landfill', value: 979.87, category: 'Kat. 5 — odpady' },
  { name: 'Odpady — recykling', key: 'waste_recycled', value: 23.65, category: 'Kat. 5 — odpady' },
  { name: 'Woda', key: 'water_supply', value: 69.92, category: 'Kat. 5 — odpady i woda' },
]

// ── Emission intensity — top 20 most intensive buildings (tCO2eq/m²) ──
export const INTENSITY_TOP20 = [
  { buildingId: 'B006', use: 'Office',    city: 'Poznan',  sqm: 1002,  y2021: 0.3358, y2022: 0.3486, y2023: 0.3419 },
  { buildingId: 'B034', use: 'Mixed-use', city: 'Gdansk',  sqm: 1559,  y2021: 0.2611, y2022: 0.2621, y2023: 0.2693 },
  { buildingId: 'B031', use: 'Retail',    city: 'Wroclaw', sqm: 2178,  y2021: 0.2463, y2022: 0.2396, y2023: 0.2428 },
  { buildingId: 'B008', use: 'Hotel',     city: 'Warsaw',  sqm: 13185, y2021: 0.2403, y2022: 0.2408, y2023: 0.2401 },
  { buildingId: 'B047', use: 'Office',    city: 'Wroclaw', sqm: 4127,  y2021: 0.2391, y2022: 0.2427, y2023: 0.2392 },
  { buildingId: 'B013', use: 'Hotel',     city: 'Krakow',  sqm: 22861, y2021: 0.2265, y2022: 0.2363, y2023: 0.2318 },
  { buildingId: 'B028', use: 'Retail',    city: 'Wroclaw', sqm: 8074,  y2021: 0.2302, y2022: 0.2206, y2023: 0.2246 },
  { buildingId: 'B036', use: 'Hotel',     city: 'Krakow',  sqm: 16698, y2021: 0.2227, y2022: 0.2216, y2023: 0.2172 },
  { buildingId: 'B029', use: 'Retail',    city: 'Warsaw',  sqm: 6874,  y2021: 0.2180, y2022: 0.2151, y2023: 0.2135 },
  { buildingId: 'B042', use: 'Retail',    city: 'Warsaw',  sqm: 10289, y2021: 0.2089, y2022: 0.2094, y2023: 0.2135 },
  { buildingId: 'B040', use: 'Retail',    city: 'Poznan',  sqm: 11317, y2021: 0.2040, y2022: 0.1993, y2023: 0.2018 },
  { buildingId: 'B019', use: 'Retail',    city: 'Warsaw',  sqm: 17747, y2021: 0.1953, y2022: 0.1998, y2023: 0.2014 },
  { buildingId: 'B049', use: 'Retail',    city: 'Wroclaw', sqm: 10673, y2021: 0.1940, y2022: 0.1978, y2023: 0.1993 },
  { buildingId: 'B007', use: 'Office',    city: 'Poznan',  sqm: 7410,  y2021: 0.1924, y2022: 0.1907, y2023: 0.1940 },
  { buildingId: 'B021', use: 'Retail',    city: 'Gdansk',  sqm: 24292, y2021: 0.1888, y2022: 0.1905, y2023: 0.1948 },
  { buildingId: 'B009', use: 'Retail',    city: 'Gdansk',  sqm: 23822, y2021: 0.1897, y2022: 0.1901, y2023: 0.1938 },
  { buildingId: 'B048', use: 'Retail',    city: 'Warsaw',  sqm: 16657, y2021: 0.1865, y2022: 0.1821, y2023: 0.1886 },
  { buildingId: 'B025', use: 'Retail',    city: 'Warsaw',  sqm: 22903, y2021: 0.1861, y2022: 0.1887, y2023: 0.1880 },
  { buildingId: 'B045', use: 'Office',    city: 'Poznan',  sqm: 3193,  y2021: 0.1831, y2022: 0.1799, y2023: 0.1785 },
  { buildingId: 'B037', use: 'Office',    city: 'Warsaw',  sqm: 10414, y2021: 0.1766, y2022: 0.1778, y2023: 0.1754 },
]

// ── Portfolio composition ───────────────────────────────────
export const CITY_DISTRIBUTION = [
  { city: 'Warsaw', count: 13 },
  { city: 'Poznan', count: 10 },
  { city: 'Krakow', count: 9 },
  { city: 'Gdansk', count: 9 },
  { city: 'Wroclaw', count: 9 },
]

export const USE_DISTRIBUTION = [
  { use: 'Office', count: 24 },
  { use: 'Retail', count: 13 },
  { use: 'Mixed-use', count: 5 },
  { use: 'Logistics', count: 5 },
  { use: 'Hotel', count: 3 },
]

// ── Emission factors reference table ────────────────────────
export const EMISSION_FACTORS = [
  { source: 'Gaz ziemny', factor: 2.040, unit: 'kgCO2eq/m³', database: 'KOBiZE 2023', scope: 1 },
  { source: 'Olej opałowy', factor: 2.520, unit: 'kgCO2eq/l', database: 'KOBiZE 2023', scope: 1 },
  { source: 'Generator diesel', factor: 2.640, unit: 'kgCO2eq/l', database: 'KOBiZE 2023', scope: 1 },
  { source: 'Czynnik R-410A', factor: 2088, unit: 'kgCO2eq/kg', database: 'IPCC AR6 2021', scope: 1 },
  { source: 'Czynnik R-32', factor: 675, unit: 'kgCO2eq/kg', database: 'IPCC AR6 2021', scope: 1 },
  { source: 'Energia elektryczna (location)', factor: 0.770, unit: 'kgCO2eq/kWh', database: 'KOBiZE 2023', scope: 2 },
  { source: 'Energia elektryczna (market, PPA/GO)', factor: 0.050, unit: 'kgCO2eq/kWh', database: 'Residual mix PL 2023', scope: 2 },
  { source: 'Ciepło systemowe', factor: 0.330, unit: 'kgCO2eq/kWh', database: 'KOBiZE 2023', scope: 2 },
  { source: 'Chłód systemowy', factor: 0.180, unit: 'kgCO2eq/kWh', database: 'KOBiZE 2023', scope: 2 },
  { source: 'Odpady — wysypisko', factor: 0.580, unit: 'kgCO2eq/kg', database: 'DEFRA 2023', scope: 3 },
  { source: 'Odpady — recykling', factor: 0.021, unit: 'kgCO2eq/kg', database: 'DEFRA 2023', scope: 3 },
  { source: 'Woda', factor: 0.149, unit: 'kgCO2eq/m³', database: 'DEFRA 2023', scope: 3 },
  { source: 'Dojazdy — samochód', factor: 0.171, unit: 'kgCO2eq/km', database: 'DEFRA 2023', scope: 3 },
  { source: 'Dojazdy — transport publiczny', factor: 0.029, unit: 'kgCO2eq/km', database: 'DEFRA 2023', scope: 3 },
]
