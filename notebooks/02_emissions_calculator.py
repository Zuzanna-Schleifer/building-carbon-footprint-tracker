# ============================================================
# Projekt Data 3 — Carbon Footprint Tracker
# Notebook 02: Kalkulator emisji (GHG Protocol Scope 1+2+3)
# Author: Zuzanna Schleifer · github.com/Zuzanna-Schleifer
# ============================================================

import pandas as pd
import numpy as np

activity = pd.read_parquet('../data/raw/activity_data.parquet')
buildings = pd.read_parquet('../data/raw/buildings.parquet')
ef_df = pd.read_csv('../data/raw/emission_factors.csv')

ef = ef_df.set_index('source_type')['factor'].to_dict()
ef_meta = ef_df.set_index('source_type').to_dict('index')


class EmissionsCalculator:
    def __init__(self, activity_df, buildings_df, emission_factors, ef_meta):
        self.activity = activity_df.copy()
        self.buildings = buildings_df.copy()
        self.ef = emission_factors
        self.ef_meta = ef_meta
        self.results = None
        self.audit_trail = None
        
    def calculate(self):
        df = self.activity.drop(columns=['has_ppa'], errors='ignore').merge(
            self.buildings[['building_id', 'sqm', 'tenants', 'primary_use', 'has_ppa']],
            on='building_id'
        )
        df['emission_factor'] = df['source_type'].map(self.ef)
        df['kgco2eq'] = df['quantity'] * df['emission_factor']

        # Scope 2 market-based dla budynków z PPA
        mask_s2  = df['source_type'] == 'electricity_location'
        mask_ppa = df['has_ppa'] == True

        df.loc[mask_s2 & mask_ppa, 'emission_factor'] = self.ef['electricity_market']
        df.loc[mask_s2 & mask_ppa, 'kgco2eq'] = (
            df.loc[mask_s2 & mask_ppa, 'quantity'] * self.ef['electricity_market']
        )

        df['scope_label'] = df['scope'].astype(str)
        df.loc[mask_s2, 'scope_label'] = '2_location'
        df.loc[mask_s2 & mask_ppa, 'scope_label'] = '2_market'

        df['ef_source'] = df['source_type'].map(
            lambda x: self.ef_meta.get(x, {}).get('source', 'unknown'))
        df['ef_unit'] = df['source_type'].map(
            lambda x: self.ef_meta.get(x, {}).get('unit', 'unknown'))

        self.results = df
        self._build_audit_trail()
        return self

    def _build_audit_trail(self):
        self.audit_trail = self.results[[
            'building_id', 'month', 'scope', 'scope_label',
            'source_type', 'quantity', 'unit',
            'emission_factor', 'ef_unit', 'ef_source', 'kgco2eq'
        ]].copy()
        self.audit_trail['calculated_at'] = pd.Timestamp.now().date()

    def aggregate(self, level='portfolio'):
        if level == 'portfolio':
            return (self.results
                .groupby(['month', 'scope_label'])['kgco2eq'].sum()
                .reset_index().assign(tco2eq=lambda x: x['kgco2eq'] / 1000))
        elif level == 'building':
            return (self.results
                .groupby(['building_id', 'month', 'scope_label'])['kgco2eq'].sum()
                .reset_index().assign(tco2eq=lambda x: x['kgco2eq'] / 1000))


# ── Uruchomienie ──────────────────────────────────────────────
calc = EmissionsCalculator(activity, buildings, ef, ef_meta).calculate()
portfolio = calc.aggregate(level='portfolio')
by_building = calc.aggregate(level='building')

# ── Roczne KPI ───────────────────────────────────────────────
annual = (calc.results
    .assign(year=calc.results['month'].dt.year)
    .groupby(['year', 'scope_label'])['kgco2eq'].sum()
    .reset_index().assign(tco2eq=lambda x: x['kgco2eq'] / 1000)
)

annual_total = (calc.results
    .assign(year=calc.results['month'].dt.year)
    .groupby(['building_id', 'year'])['kgco2eq'].sum()
    .reset_index()
    .merge(buildings[['building_id', 'sqm', 'tenants']], on='building_id')
    .assign(
        tco2eq=lambda x: x['kgco2eq'] / 1000,
        intensity_sqm=lambda x: x['kgco2eq'] / x['sqm'] / 1000,
        intensity_tenant=lambda x: x['kgco2eq'] / x['tenants'] / 1000
    )
)

print("\n=== ROCZNE EMISJE PORTFOLIO (tCO2eq) ===")
annual_pivot = annual.pivot(index='year', columns='scope_label', values='tco2eq')
annual_pivot['total'] = annual_pivot.sum(axis=1)
annual_pivot['yoy_change_pct'] = annual_pivot['total'].pct_change() * 100
print(annual_pivot.round(1))

# SBTi 1.5°C — cel redukcji -4.2% rocznie
BASE_YEAR = 2021
base_emissions = annual_pivot.loc[BASE_YEAR, 'total']
annual_pivot['sbti_target'] = [
    base_emissions * (1 - 0.042) ** (y - BASE_YEAR)
    for y in annual_pivot.index
]
print("\n=== CELE SBTi vs RZECZYWISTOŚĆ ===")
print(annual_pivot[['total', 'sbti_target']].round(1))

# ── Zapis ─────────────────────────────────────────────────────
calc.results.to_parquet('../data/processed/emissions_calculated.parquet', index=False)
calc.audit_trail.to_parquet('../data/processed/audit_trail.parquet', index=False)
annual_pivot.reset_index().to_csv('../outputs/annual_kpi.csv', index=False)
by_building.to_parquet('../data/processed/emissions_by_building.parquet', index=False)
print("\nZapisano wszystkie pliki.")
