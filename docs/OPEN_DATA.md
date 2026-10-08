# PRAVAH Open Data & Open Source Architecture

PRAVAH is engineered on an **Open-Data First** architecture. The core decision-intelligence pipeline does not rely on proprietary paid commercial APIs, quota limits, or closed black-box models. All external feeds are isolated behind modular provider adapters that gracefully downgrade across four transparent operational states: `LIVE`, `CACHED`, `DEGRADED`, and `OFFLINE DEMO`.

---

## 1. Primary Open Data Stack

| Layer | Primary Open Provider | Protocol / Access | Self-Hostable? | Role in PRAVAH |
|---|---|---|---|---|
| **Weather & Rainfall** | **Open-Meteo** | REST (`/v1/forecast`) | Yes (Docker / Local) | Primary numerical weather prediction, hourly precipitation, wind, temperature |
| **River Discharge / Floods** | **GloFAS (Copernicus CEMS)** | Open-Meteo Flood API | Yes | Basin discharge forecasts, hydrological risk signals, return periods |
| **Ensemble Weather** | **ECMWF Open Data** | Open Data IFS 0.25° | Yes | Independent forecast corroboration, model spread, Forecast Agreement Score |
| **Satellite Radar (SAR)** | **Sentinel-1 (Copernicus)** | AWS Open Data / Local GRD | Yes (Local Otsu) | Cloud-penetrating C-band dual-pol (VV/VH) flood inundation evidence |
| **Basin Stage Telemetry** | **NWDP / CWC Telemetry** | National Water Data Portal | Yes (Cached DB) | River levels, reservoir storage (Chembarambakkam, Poondi, Saidapet) |
| **Roads & Critical Assets** | **OpenStreetMap (OSM)** | Overpass API / PostGIS | Yes (osm2pgsql) | Road vectors, hospitals, relief shelters, population centroids |
| **Terrain & Elevation** | **Copernicus DEM GLO-90** | Open-Meteo Elevation / DEM | Yes (Rasterio/GDAL) | Topographic low-lying coastal basin runoff impedance |
| **Risk-Aware Routing** | **OSRM (Open Source Routing)** | OSRM Driving Engine | Yes (Local OSRM) | Fastest route vs. PRAVAH risk-and-uncertainty penalized resilient route |

---

## 2. Multi-Source Fusion & Forecast Agreement Score

Disaster decision systems cannot depend on a single model. PRAVAH ingests independent numerical weather predictions from **Open-Meteo**, **ECMWF IFS 0.25°**, and (when configured) **IMD Regional Meteorological Center Chennai**.

### Formulation:
$$\text{Forecast Agreement Score} = \max\left(50\%, \min\left(98\%, (1.0 - \text{CV}) \times 100\right)\right)$$
$$\text{CV} = \frac{\sigma}{\mu}$$

Where:
- $\mu$ is the mean 24-hour rainfall accumulation across independent models.
- $\sigma$ is the model standard deviation (spread in mm).
- $\text{CV}$ is the coefficient of variation.

### Interpretation Tiers:
- **$\ge 85\%$ (VERY HIGH)**: Models converge tightly (e.g., Open-Meteo $145\text{ mm}$, ECMWF $158\text{ mm}$, spread $\pm 6.5\text{ mm}$).
- **$75\% - 85\%$ (HIGH)**: General agreement with minor spatial timing shifts.
- **$60\% - 75\%$ (MODERATE)**: Divergent rain band positioning.
- **$< 60\%$ (LOW / HIGH DISPERSION)**: Significant model disagreement; triggers an increased uncertainty penalty in the decision engine.

---

## 3. Four Transparent System States

PRAVAH never fabricates live telemetry. Every observation clearly reflects its true provenance:
1. **LIVE**: Direct real-time telemetry from remote API or sensor station.
2. **CACHED**: Stored recent telemetry within TTL (e.g., last 15–30 minutes).
3. **DEGRADED**: Provider connection failed; operating on spatial interpolation or baseline priors.
4. **OFFLINE DEMO**: Deterministic, fully calibrated historical scenario (Chennai 2015 / Michaung 2023) for competitive evaluation and offline disaster drills.
