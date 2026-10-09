# AEGIS EARTH - ALERTNEST
### Hyperlocal Flood Early-Warning & Evacuation Copilot (Problem Statement HW01)
**Theme:** Climate, Environment & Disaster Tech  
**Primary Demonstration:** Chennai / Tamil Nadu Urban Flood Emergency Response (Michaung & Live)

---

## 1. Executive Summary

Existing disaster systems excel at broadcasting alerts, forecasting rainfall, or viewing satellite images. **PRAVAH goes beyond prediction and alerts to deliver decision intelligence.**

PRAVAH answers the eight critical questions demanded by incident commanders:
1. **What is likely to happen?** (Multi-factor calibrated flood hazard estimation)
2. **Where will it happen?** (Chennai administrative and hydrological basin envelopes)
3. **Who and what will be affected?** (Population exposure, building footprints, critical facilities)
4. **What infrastructure or routes may fail?** (Impassable arterial corridors, severed access routes)
5. **How might one failure trigger another?** (Cascading failure graph: Flood → Road severance → Hospital isolation → Substation trip)
6. **What should responders do now?** (Google OR-Tools MILP resource allocation & ranked interventions)
7. **What happens if they choose another action?** (Real-time Counterfactual What-If Simulator)
8. **How confident is the system in its recommendation?** (Monte Carlo perturbation, calibrated prediction intervals, evidence & contradiction audit)

---

## 2. Key Technical Innovations

1. **Uncertainty-Aware Counterfactual Disaster Action Optimization**  
   Operators can interactively perturb environmental conditions (Rainfall $+10\%, +25\%, +50\%$, river surges, arterial road closures, facility outages) and trigger instantaneous recalculation of cascading consequences and resource re-allocations.
2. **Forecast Agreement Score**  
   Compares independent numerical weather prediction models (**Open-Meteo**, **ECMWF IFS 0.25°**, and **IMD Regional Met**) to calculate inter-model dispersion (e.g., $84.6\%$ agreement with $\pm 6.5\text{ mm}$ spread) and scales prediction confidence accordingly.
3. **Risk-Aware Resilient Routing (Fastest vs. Safest)**  
   Emergency vehicles are routed by minimizing:
   $$\text{Cost} = \text{travel\_time} + (w_{\text{flood}} \cdot \text{flood\_risk}) + (w_{\text{fail}} \cdot \text{road\_failure\_prob}) + \text{uncertainty\_penalty}$$
   Guarantees that ambulances bypass 1.1m submerged traps on Velachery Main Road in favor of elevated, navigable corridors.
4. **Resilience Action Score (RAS)**  
   A mathematically grounded scoring index that balances protected vulnerable populations, response time gains, and prediction confidence against deployment costs and operational risks:
   $$\text{RAS} = \frac{\text{PopProtected} \times (\text{Vulnerability} / 50) \times (\Delta T_{\text{saved}} / 10) \times (\text{Confidence} / 100)}{(\text{Cost} / 10000) + 1.5}$$
5. **Cascading Failure Propagation Graph**  
   Models disaster consequences across a directed NetworkX graph, revealing hidden dependencies where an inundated arterial road delays emergency medical arrival by $+28$ minutes and an electrical substation shutdown severs power to municipal relief shelters.
6. **Open-Data First Architecture**  
   Free from proprietary commercial APIs, paid quotas, or mandatory credentials. Operates across four transparent states: `LIVE`, `CACHED`, `DEGRADED`, and `OFFLINE DEMO`.

---

## 3. Architecture & Tech Stack

```
PRAVAH/
├── backend/                # Python 3.13 / FastAPI decision intelligence service
│   ├── app/
│   │   ├── api/v1/         # Endpoints (Summary, Simulation, Hazards, Routes, Provenance)
│   │   ├── cascade/        # NetworkX cascading failure graph engine
│   │   ├── forecasting/    # Multi-factor flood risk model with SHAP feature attribution
│   │   ├── uncertainty/    # Monte Carlo prediction intervals and evidence decomposition
│   │   ├── optimization/   # Google OR-Tools Mixed-Integer Programming solver
│   │   ├── simulation/     # Counterfactual What-If simulation engine
│   │   ├── services/
│   │   │   └── data_fusion/# Multi-source fusion & Forecast Agreement Engine
│   │   └── integrations/   # Modular adapters
│   │       ├── open_meteo/ # Open-Meteo keyless weather engine
│   │       ├── glofas/     # GloFAS flood discharge API
│   │       ├── ecmwf/      # ECMWF IFS 0.25° Open Data
│   │       ├── sentinel1/  # Sentinel-1 SAR local Otsu processing pipeline
│   │       ├── nwdp/       # NWDP / CWC basin stage telemetry
│   │       ├── osrm/       # Risk-aware OSRM routing engine
│   │       ├── osm/        # OpenStreetMap road & facility graphs
│   │       ├── imd/        # Optional authoritative IMD services
│   │       ├── sachet/     # Optional NDMA SACHET CAP alerts
│   │       └── elevation/  # Copernicus DEM GLO-90
│   └── tests/              # 10 comprehensive tests (100% pass rate)
├── frontend/               # React 19 / TypeScript / Vite / MapLibre GL JS
│   └── src/
│       ├── components/     # Command-center GIS interface (dark, restrained, technical)
│       └── services/       # Type-safe API client
└── docs/                   # Complete documentation suite
```

---

## 4. Documentation Suite

- [docs/ARCHITECTURE.md](file:///d:/Disaster/docs/ARCHITECTURE.md) — System design and end-to-end data pipeline
- [docs/OPEN_DATA.md](file:///d:/Disaster/docs/OPEN_DATA.md) — Open data stack, self-hostability, and Forecast Agreement Score
- [docs/API_SETUP.md](file:///d:/Disaster/docs/API_SETUP.md) — Credentials configuration, fallbacks, and provider limits
- [docs/DATA_SOURCES.md](file:///d:/Disaster/docs/DATA_SOURCES.md) — Real scientific and operational data feeds
- [docs/ML.md](file:///d:/Disaster/docs/ML.md) — Tabular flood risk model and SHAP feature attribution
- [docs/UNCERTAINTY.md](file:///d:/Disaster/docs/UNCERTAINTY.md) — Monte Carlo perturbation, intervals, and sensor audits
- [docs/OPTIMIZATION.md](file:///d:/Disaster/docs/OPTIMIZATION.md) — Google OR-Tools MILP formulation & Resilience Action Score
- [docs/NOVELTY.md](file:///d:/Disaster/docs/NOVELTY.md) — Innovation summary and differentiation from alert dashboards
- [docs/DEMO.md](file:///d:/Disaster/docs/DEMO.md) — Step-by-step judge walkthrough script

---

## 5. Quickstart: Running the Application

### Step 1: Environment Configuration
```bash
# Verify environment configuration
cp .env.example .env
```

### Step 2: Start the FastAPI Backend
```bash
cd backend
$env:PYTHONPATH="."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API Health:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Interactive OpenAPI / Swagger:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Step 3: Start the Command-Center Frontend
In a separate terminal:
```bash
cd frontend
npm run dev
```
- **Web UI:** [http://localhost:5173](http://localhost:5173)

---

## 6. Running the Automated Test Suite

```bash
cd backend
pytest -v
```
**Results:** `10 passed in ~28s (100% pass rate)`
