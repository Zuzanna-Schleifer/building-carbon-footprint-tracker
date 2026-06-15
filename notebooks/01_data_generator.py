# ============================================================
# Projekt Data 3 — Carbon Footprint Tracker
# Notebook 01: Generator danych syntetycznych + emission factors
# Author: Zuzanna Schleifer · github.com/Zuzanna-Schleifer
# ============================================================

import pandas as pd
import numpy as np

# ── Emission factors ─────────────────────────────────────────
EMISSION_FACTORS = {
    # Scope 1
    'natural_gas':        {'factor': 2.040,  'unit': 'kgCO2eq/m³',  'source': 'KOBiZE 2023'},
    'fuel_oil':           {'factor': 2.520,  'unit': 'kgCO2eq/l',   'source': 'KOBiZE 2023'},
    'diesel_generator':   {'factor': 2.640,  'unit': 'kgCO2eq/l',   'source': 'KOBiZE 2023'},
    'refrigerant_r410a':  {'factor': 2088.0, 'unit': 'kgCO2eq/kg',  'source': 'IPCC AR6 2021'},
    'refrigerant_r32':    {'factor': 675.0,  'unit': 'kgCO2eq/kg',  'source': 'IPCC AR6 2021'},
    # Scope 2
    'electricity_location':{'factor': 0.770, 'unit': 'kgCO2eq/kWh', 'source': 'KOBiZE 2023'},
    'electricity_market':  {'factor': 0.050, 'unit': 'kgCO2eq/kWh', 'source': 'GO/PPA residual mix PL 2023'},
    'district_heat':       {'factor': 0.330, 'unit': 'kgCO2eq/kWh', 'source': 'KOBiZE 2023'},
    'district_cooling':    {'factor': 0.180, 'unit': 'kgCO2eq/kWh', 'source': 'KOBiZE 2023'},
    # Scope 3
    'waste_landfill':     {'factor': 0.580,  'unit': 'kgCO2eq/kg',  'source': 'DEFRA 2023'},
    'waste_recycled':     {'factor': 0.021,  'unit': 'kgCO2eq/kg',  'source': 'DEFRA 2023'},
    'water_supply':       {'factor': 0.149,  'unit': 'kgCO2eq/m³',  'source': 'DEFRA 2023'},
    'car_commute':        {'factor': 0.171,  'unit': 'kgCO2eq/km',  'source': 'DEFRA 2023'},
    'public_transport':   {'factor': 0.029,  'unit': 'kgCO2eq/km',  'source': 'DEFRA 2023'},
}

ef_df = pd.DataFrame(EMISSION_FACTORS).T.reset_index()
ef_df.columns = ['source_type', 'factor', 'unit', 'source']
print(ef_df)

# ── Metadane budynków ─────────────────────────────────────────
np.random.seed(42)
N_BUILDINGS = 50

BUILDING_TYPES = ['Office', 'Retail', 'Logistics', 'Hotel', 'Mixed-use']
CITIES = ['Warsaw', 'Krakow', 'Wroclaw', 'Poznan', 'Gdansk']

buildings = pd.DataFrame({
    'building_id':    [f'B{str(i).zfill(3)}' for i in range(1, N_BUILDINGS+1)],
    'name':           [f'Property {i}' for i in range(1, N_BUILDINGS+1)],
    'primary_use':    np.random.choice(BUILDING_TYPES, N_BUILDINGS, p=[0.4, 0.25, 0.15, 0.1, 0.1]),
    'city':           np.random.choice(CITIES, N_BUILDINGS),
    'sqm':            np.random.randint(500, 25000, N_BUILDINGS),
    'tenants':        np.random.randint(10, 500, N_BUILDINGS),
    'construction_year': np.random.randint(1990, 2022, N_BUILDINGS),
    'has_ppa':        np.random.choice([True, False], N_BUILDINGS, p=[0.3, 0.7]),
})

buildings.to_csv('../data/raw/buildings.csv', index=False)
print(buildings.head())

# ── Generator Scope 1 ────────────────────────────────────────
months = pd.date_range('2021-01', '2023-12', freq='MS')
records = []

for _, b in buildings.iterrows():
    sqm = b['sqm']
    use = b['primary_use']
    gas_intensity = {'Office': 8, 'Retail': 6, 'Logistics': 4,
                     'Hotel': 14, 'Mixed-use': 9}[use]

    for month in months:
        month_num = month.month
        heating_factor = max(0, np.cos((month_num - 1) / 12 * 2 * np.pi) * 0.8 + 0.2)
        noise = np.random.normal(1.0, 0.08)

        records.append({
            'building_id': b['building_id'],
            'month': month, 'scope': 1,
            'source_type': 'natural_gas',
            'quantity': round(sqm * gas_intensity / 12 * heating_factor * noise, 1),
            'unit': 'm³',
        })
        if month_num == 6:
            records.append({
                'building_id': b['building_id'],
                'month': month, 'scope': 1,
                'source_type': 'refrigerant_r410a',
                'quantity': round(sqm * 0.002 * np.random.uniform(0.8, 1.2), 2),
                'unit': 'kg',
            })

scope1_df = pd.DataFrame(records)
print(f"Scope 1: {len(scope1_df):,} wierszy")

# ── Generator Scope 2 ────────────────────────────────────────
records_s2 = []

for _, b in buildings.iterrows():
    sqm = b['sqm']
    use = b['primary_use']
    elec_intensity = {'Office': 180, 'Retail': 220, 'Logistics': 80,
                      'Hotel': 260, 'Mixed-use': 160}[use]

    for month in months:
        month_num = month.month
        season_factor = 1.0 + 0.15 * np.sin((month_num - 3) / 12 * 2 * np.pi)
        noise = np.random.normal(1.0, 0.05)

        records_s2.append({
            'building_id': b['building_id'],
            'month': month, 'scope': 2,
            'source_type': 'electricity_location',
            'quantity': round(sqm * elec_intensity / 12 * season_factor * noise, 1),
            'unit': 'kWh',
            'has_ppa': b['has_ppa'],
        })

scope2_df = pd.DataFrame(records_s2)
print(f"Scope 2: {len(scope2_df):,} wierszy")

# ── Generator Scope 3 ────────────────────────────────────────
records_s3 = []

for _, b in buildings.iterrows():
    tenants = b['tenants']
    sqm = b['sqm']

    for month in months:
        noise = np.random.normal(1.0, 0.1)

        records_s3.extend([
            {'building_id': b['building_id'], 'month': month, 'scope': 3,
             'category': 'cat7_commuting', 'source_type': 'car_commute',
             'quantity': round(tenants * 0.6 * 15 * 2 * 21 * noise, 0), 'unit': 'km'},
            {'building_id': b['building_id'], 'month': month, 'scope': 3,
             'category': 'cat7_commuting', 'source_type': 'public_transport',
             'quantity': round(tenants * 0.4 * 10 * 2 * 21 * noise, 0), 'unit': 'km'},
            {'building_id': b['building_id'], 'month': month, 'scope': 3,
             'category': 'cat5_waste', 'source_type': 'waste_landfill',
             'quantity': round(sqm * 0.3 * 0.6 * noise, 1), 'unit': 'kg'},
            {'building_id': b['building_id'], 'month': month, 'scope': 3,
             'category': 'cat5_waste', 'source_type': 'waste_recycled',
             'quantity': round(sqm * 0.3 * 0.4 * noise, 1), 'unit': 'kg'},
            {'building_id': b['building_id'], 'month': month, 'scope': 3,
             'category': 'water', 'source_type': 'water_supply',
             'quantity': round(sqm * 0.05 * noise, 2), 'unit': 'm³'},
        ])

scope3_df = pd.DataFrame(records_s3)
print(f"Scope 3: {len(scope3_df):,} wierszy")

# ── Zapis ─────────────────────────────────────────────────────
activity_data = pd.concat([scope1_df, scope2_df, scope3_df], ignore_index=True)
activity_data['month'] = pd.to_datetime(activity_data['month'])

activity_data.to_parquet('../data/raw/activity_data.parquet', index=False)
buildings.to_parquet('../data/raw/buildings.parquet', index=False)
ef_df.to_csv('../data/raw/emission_factors.csv', index=False)

print("=== DANE WYGENEROWANE ===")
print(f"Budynki:         {len(buildings)}")
print(f"Wierszy łącznie: {len(activity_data):,}")
