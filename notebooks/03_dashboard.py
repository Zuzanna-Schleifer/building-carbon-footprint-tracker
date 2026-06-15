# ============================================================
# Projekt Data 3 — Carbon Footprint Tracker
# Notebook 03: Dashboard i wizualizacje
# Author: Zuzanna Schleifer · github.com/Zuzanna-Schleifer
# ============================================================

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import os

emissions  = pd.read_parquet('../data/processed/emissions_calculated.parquet')
by_building = pd.read_parquet('../data/processed/emissions_by_building.parquet')
buildings  = pd.read_parquet('../data/raw/buildings.parquet')
annual_kpi = pd.read_csv('../outputs/annual_kpi.csv')
os.makedirs('../outputs/charts', exist_ok=True)

# ── 1. Waterfall chart — Scope 1+2+3 ─────────────────────────
last_year = emissions[emissions['month'].dt.year == 2023]
scope_totals = (last_year.groupby('scope_label')['kgco2eq'].sum().div(1000).reset_index())

order  = ['1', '2_location', '2_market', '3']
labels = {'1': 'Scope 1', '2_location': 'Scope 2\nlocation',
          '2_market': 'Scope 2\nmarket', '3': 'Scope 3'}
colors = {'1': '#E24B4A', '2_location': '#EF9F27', '2_market': '#97C459', '3': '#1D9E75'}

scope_totals = scope_totals[scope_totals['scope_label'].isin(order)]
scope_totals['label'] = scope_totals['scope_label'].map(labels)
scope_totals['color'] = scope_totals['scope_label'].map(colors)
scope_totals = scope_totals.set_index('scope_label').loc[
    [s for s in order if s in scope_totals.index]].reset_index()

total = scope_totals['kgco2eq'].sum()

fig1 = go.Figure(go.Bar(
    x=scope_totals['label'], y=scope_totals['kgco2eq'],
    marker_color=scope_totals['color'],
    text=scope_totals['kgco2eq'].round(0).astype(int).astype(str) + ' tCO₂eq',
    textposition='outside'
))
fig1.add_hline(y=total, line_dash='dot', line_color='gray',
               annotation_text=f'Łącznie: {total:.0f} tCO₂eq', annotation_position='right')
fig1.update_layout(title='Emisje CO₂eq — portfolio 2023 (GHG Protocol)',
                   yaxis_title='tCO₂eq', showlegend=False)
fig1.show()
fig1.write_html('../outputs/charts/scope_waterfall.html')

# ── 2. Trend YoY z celem SBTi ────────────────────────────────
annual_kpi['year'] = annual_kpi['year'].astype(int)

fig2 = go.Figure()
for scope, color in [('1','#E24B4A'), ('2_location','#EF9F27'), ('3','#1D9E75')]:
    if scope in annual_kpi.columns:
        fig2.add_trace(go.Bar(x=annual_kpi['year'], y=annual_kpi[scope].round(1),
                              name=labels.get(scope, scope), marker_color=color))
fig2.add_trace(go.Scatter(x=annual_kpi['year'], y=annual_kpi['sbti_target'].round(1),
                          name='Cel SBTi 1.5°C (-4.2%/rok)',
                          line=dict(color='#534AB7', width=2, dash='dash'),
                          mode='lines+markers'))
fig2.add_trace(go.Scatter(x=annual_kpi['year'], y=annual_kpi['total'].round(1),
                          name='Łączne emisje', line=dict(color='#2C2C2A', width=2),
                          mode='lines+markers'))
fig2.update_layout(title='Trend emisji vs cel SBTi 1.5°C — portfolio 2021–2023',
                   barmode='stack', yaxis_title='tCO₂eq',
                   xaxis=dict(tickvals=[2021, 2022, 2023]),
                   legend=dict(orientation='h', y=-0.2))
fig2.show()
fig2.write_html('../outputs/charts/yoy_trend.html')

# ── 3. Heatmapa intensywności ─────────────────────────────────
intensity = (emissions
    .assign(year=emissions['month'].dt.year)
    .groupby(['building_id', 'year'])['kgco2eq'].sum().reset_index()
    .merge(buildings[['building_id', 'sqm', 'primary_use']], on='building_id')
    .assign(intensity=lambda x: x['kgco2eq'] / x['sqm'] / 1000)
)
top20 = intensity.groupby('building_id')['intensity'].mean().nlargest(20).index
heatmap_data = (intensity[intensity['building_id'].isin(top20)]
    .pivot(index='building_id', columns='year', values='intensity').round(3))

fig3 = px.imshow(heatmap_data, color_continuous_scale='RdYlGn_r',
                 labels=dict(color='tCO₂eq/m²'),
                 title='Intensywność emisji — top 20 budynków (tCO₂eq/m²)')
fig3.show()
fig3.write_html('../outputs/charts/intensity_heatmap.html')

# ── 4. Location-based vs market-based Scope 2 ────────────────
s2 = (emissions[emissions['scope'] == 2]
    .assign(year=emissions['month'].dt.year)
    .groupby(['year', 'scope_label'])['kgco2eq'].sum().div(1000).reset_index()
)
s2_pivot = s2.pivot(index='year', columns='scope_label', values='kgco2eq').reset_index()

fig4 = go.Figure()
fig4.add_trace(go.Bar(x=s2_pivot['year'], y=s2_pivot.get('2_location', pd.Series()).round(1),
                      name='Location-based', marker_color='#EF9F27'))
fig4.add_trace(go.Bar(x=s2_pivot['year'], y=s2_pivot.get('2_market', pd.Series()).round(1),
                      name='Market-based (PPA/GO)', marker_color='#97C459'))
fig4.update_layout(title='Scope 2 — location-based vs market-based',
                   barmode='group', yaxis_title='tCO₂eq',
                   xaxis=dict(tickvals=[2021, 2022, 2023]),
                   legend=dict(orientation='h', y=-0.2))
fig4.show()
fig4.write_html('../outputs/charts/scope2_comparison.html')

# ── 5. Scope 3 breakdown ──────────────────────────────────────
s3 = (emissions[emissions['scope'] == 3]
    .assign(year=emissions['month'].dt.year)
    .groupby(['year', 'source_type'])['kgco2eq'].sum().div(1000).reset_index()
)
source_labels = {
    'car_commute': 'Dojazdy — auto (kat. 7)',
    'public_transport': 'Dojazdy — transport publ. (kat. 7)',
    'waste_landfill': 'Odpady — wysypisko (kat. 5)',
    'waste_recycled': 'Odpady — recykling (kat. 5)',
    'water_supply': 'Woda (kat. 5)',
}
s3['label'] = s3['source_type'].map(source_labels)

fig5 = px.bar(s3[s3['year'] == 2023].sort_values('kgco2eq', ascending=True),
              x='kgco2eq', y='label', orientation='h',
              title='Scope 3 breakdown — portfolio 2023',
              labels={'kgco2eq': 'tCO₂eq', 'label': ''},
              color='kgco2eq', color_continuous_scale='Greens')
fig5.update_layout(coloraxis_showscale=False)
fig5.show()
fig5.write_html('../outputs/charts/scope3_breakdown.html')

print("Wszystkie wykresy zapisane do outputs/charts/")
