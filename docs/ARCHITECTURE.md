# PRAVAH: System Architecture & Technical Specifications

## 1. High-Level Architecture Overview

PRAVAH is organized as a high-performance decision-support monorepo split into an intelligent analytical FastAPI backend and a GIS Command-Center React/TypeScript frontend:

```
                  ┌────────────────────────────────────────┐
                  │    REMOTE OBSERVATION & TELEMETRY      │
                  │   IMD · SACHET · CWC · Copernicus · OSM │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │    INTEGRATION ADAPTER LAYER (BASE)    │
                  │   Non-blocking HTTP · TTL/ETag Cache   │
                  │   Graceful Fallback & Health Tracking  │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │      CORE DECISION-INTELLIGENCE        │
                  │                                        │
                  │  1. Flood Risk Engine (SHAP-aligned)   │
                  │  2. Uncertainty Engine (Monte Carlo)   │
                  │  3. Vulnerability & Exposure Engines   │
                  │  4. Cascading Failure Engine (NetworkX)│
                  │  5. Resource Optimizer (Google OR-Tools)│
                  │  6. Counterfactual What-If Simulator   │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │       FASTAPI REST API LAYER (v1)      │
                  │   Schemas · Provenance · Health Check  │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │      COMMAND-CENTER OPERATOR UI        │
                  │   MapLibre GL JS · Cartographic Styles  │
                  │   Telemetry Strip · Action Optimizer   │
                  │   What-If Dock · Provenance Matrix     │
                  └────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
PRAVAH/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # REST Endpoints (Dashboard, Simulation, Hazards, etc.)
│   │   ├── cache/           # TTL and ETag memory store
│   │   ├── cascade/         # NetworkX disaster propagation graph engine
│   │   ├── core/            # Config, Pydantic settings, Structured logging
│   │   ├── exposure/        # Exposed population, building, facility envelope
│   │   ├── forecasting/     # Explainable tabular flood risk model
│   │   ├── geospatial/      # Chennai GCC administrative & hydrological polygons
│   │   ├── integrations/    # Provider adapters (IMD, SACHET, WRIS, Copernicus, etc.)
│   │   ├── models/          # Pydantic domain models
│   │   ├── optimization/    # Google OR-Tools Mixed-Integer Linear Programming solver
│   │   ├── schemas/         # API request/response contracts
│   │   ├── simulation/      # Counterfactual What-If simulator engine
│   │   └── uncertainty/     # Monte Carlo perturbation & Conformal interval engine
│   ├── tests/               # Pytest suite with 100% engine coverage
│   └── main.py              # Application entrypoint with CORS & logging
├── frontend/
│   ├── src/
│   │   ├── components/      # Command center UI components
│   │   │   ├── Header.tsx           # Telemetry metrics strip & mode switcher
│   │   │   ├── MapLibreView.tsx     # GIS map canvas with GeoJSON vector layers
│   │   │   ├── LayerControls.tsx    # Multi-hazard layer toggles
│   │   │   ├── TimelineController.tsx # T-6h to T+2h scenario stepper
│   │   │   ├── AlertsFeed.tsx       # NDMA SACHET live alert cards
│   │   │   ├── ZoneInspector.tsx    # Explainable zone popup & SHAP feature breakdown
│   │   │   ├── ActionOptimizer.tsx  # Ranked actions, RAS score & plan comparison
│   │   │   ├── CascadingView.tsx    # Directed dependency propagation graph
│   │   │   ├── HydrometricPanel.tsx # CWC river telemetry & Sentinel-1 SAR evidence
│   │   │   ├── CounterfactualDock.tsx # Bottom What-If perturbation controls
│   │   │   ├── ProvenanceModal.tsx  # Full data provenance audit drawer
│   │   │   ├── SystemHealthModal.tsx # Provider connectivity & latency matrix
│   │   │   └── ValidationModal.tsx  # Empirical model evaluation vs baseline
│   │   ├── services/        # Fetch API clients
│   │   ├── types/           # TypeScript domain definitions
│   │   ├── App.tsx          # Workspace orchestrator
│   │   └── index.css        # Technical GIS typography and restrained styles
├── docs/                    # Technical documentation
│   ├── ARCHITECTURE.md
│   ├── API_SETUP.md
│   ├── NOVELTY.md
│   ├── API.md
│   ├── DATA_SOURCES.md
│   └── ML.md
├── .env.example             # Complete environment variables template
└── README.md                # Comprehensive documentation
```

---

## 3. Resilience Action Score (RAS) Formulation

The optimization engine uses Mixed-Integer Linear Programming (MILP) solved via Google OR-Tools to maximize population protection and minimize response times subject to finite resource inventory constraints:

$$\max \sum_{i \in \mathcal{Z}} \left( 350 \cdot b_i + 180 \cdot a_i + 900 \cdot n_i \right) \cdot W_i$$

Subject to:
$$\sum_{i} b_i \le B_{total}, \quad \sum_{i} a_i \le A_{total}, \quad \sum_{i} n_i \le N_{total}$$

Each recommended intervention is subsequently assigned a Resilience Action Score (RAS):

$$\text{RAS} = \frac{\text{PopProtected} \times (\text{Vulnerability} / 50) \times (\Delta T_{\text{saved}} / 10) \times (\text{Confidence} / 100)}{(\text{Cost} / 10000) + \lambda}$$

The system explains **why** an action ranks highest through explicit causal points rather than opaque black-box outputs.
