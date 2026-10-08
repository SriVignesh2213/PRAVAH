# PRAVAH: REST API Reference (v1)

Base URL: `http://localhost:8000/api/v1`

---

### 1. `GET /api/v1/dashboard/summary`
Returns high-level situational awareness metrics for Chennai command center.
* **Response (200 OK):**
```json
{
  "hazard_type": "URBAN_FLOOD",
  "city": "Greater Chennai Corporation (GCC)",
  "timestamp": "2026-10-08T18:30:00Z",
  "overall_risk_level": "SEVERE",
  "overall_confidence_pct": 83.4,
  "total_population_exposed": 545737,
  "critical_facilities_threatened": 2,
  "roads_at_risk_count": 3,
  "active_alerts_count": 2,
  "sources_summary": {
    "IMD": "Active (High-Resolution NWP)",
    "SACHET": "Active (CAP Feed)",
    "India-WRIS": "Active (CWC Telemetry)",
    "Copernicus": "Active (Sentinel-1 SAR)",
    "OpenStreetMap": "Active (Overpass Extracted)"
  },
  "is_demo_mode": true,
  "scenario_title": "Chennai Extreme Precipitation & Basin Inundation"
}
```

---

### 2. `POST /api/v1/simulation/run`
Executes real-time counterfactual simulation recalculating flood risk, prediction intervals, cascading failures, and resource allocations under perturbed conditions.
* **Request Body:**
```json
{
  "rainfall_multiplier": 1.25,
  "river_discharge_multiplier": 1.1,
  "closed_roads": ["road-01", "road-03"],
  "failed_facilities": [],
  "available_boats": 15,
  "available_ambulances": 25,
  "available_ndrf_teams": 10,
  "emergency_priority": "BALANCED",
  "use_demo_scenario": true
}
```
* **Response (200 OK):**
Returns `SimulationResult` containing recalculated zones, impassable roads, cascading failure graph, ranked actions, and Before/After plan metrics.

---

### 3. `GET /api/v1/alerts`
Returns parsed NDMA SACHET Common Alerting Protocol emergency bulletins.
* **Response:** Array of `AlertItem` (ID, event, headline, severity, urgency, certainty, area, instructions, source agency).

---

### 4. `GET /api/v1/river-levels`
Returns Central Water Commission (CWC) / India-WRIS hydrometric station telemetry across Adyar and Cooum basins.
* Stations without current readings explicitly return `"NO_RECENT_OBSERVATION"`.

---

### 5. `GET /api/v1/routes`
Returns current road network conditions, identifying severed arterial segments and computing the PRAVAH Risk-Adjusted Resilient Evacuation path.

---

### 6. `GET /api/v1/system-health`
Returns connectivity, latency, and status for all integrated telemetry providers:
- `IMD`
- `SACHET`
- `India-WRIS`
- `Copernicus`
- `MOSDAC`
- `NASA FIRMS`
- `OpenStreetMap`
- `OSRM`
- `Copernicus DEM`

---

### 7. `GET /api/v1/provenance`
Returns full audit trail for each data layer with authority, update frequency, freshness, and scientific methodology.

---

### 8. `GET /api/v1/validation`
Returns empirical validation performance metrics comparing baseline uncoordinated response against PRAVAH decision intelligence.
