# PRAVAH: Machine Learning & Algorithmic Engines

## 1. Multi-Factor Tabular Flood Risk Model

The risk model predicts urban flood hazard using calibrated hydrological and geospatial indicators:
- **Accumulated Precipitation (24h mm) & Peak Rain Rate (mm/h):** Weighted at 28%.
- **Digital Elevation Model (Copernicus DEM 90m):** Weighted at 22%. Inverted MSL scaling for coastal deltaic terrain.
- **Waterway Proximity:** Weighted at 18%. Exponential decay distance to Adyar, Cooum, and Buckingham Canal.
- **Drainage Impedance Index:** Weighted at 14%. Surface imperviousness and culvert obstruction index.
- **River Discharge Ratio ($Q / Q_{danger}$):** Weighted at 12%. Upstream surplus discharge rate.
- **Sentinel-1 SAR Empirical Evidence:** Weighted at 6%. Specular radar backscatter drop detection.

### Feature Attribution (SHAP-Aligned)
Every prediction produces granular feature contributions:
```json
{
  "rainfall_accumulation": 24.5,
  "terrain_low_elevation": 18.2,
  "waterway_proximity": 15.6,
  "drainage_impedance": 12.1,
  "river_surge_discharge": 11.4,
  "satellite_sar_evidence": 5.7
}
```

---

## 2. Uncertainty Quantification Engine

Rather than outputting static point probabilities, PRAVAH executes Monte Carlo ensemble perturbation ($N=100$ draws):
- **Prediction Interval:** Computes 90% conformal-style bounds $[L, U]$.
- **Confidence Calibration:** Calibrates score based on sensor agreement (SAR verification + CWC physical stage presence vs. spatial interpolation gaps).
- **Explainable Evidence vs. Contradictions:** Explicitly informs the emergency director why confidence is High or Moderate and identifies observational gaps (e.g., absence of physical gauges within 2km).

---

## 3. Combinatorial Action Optimization Engine (Google OR-Tools)

Candidate interventions are modeled as a Mixed-Integer Linear Program (MILP):
- **Decision Variables:** Deployment quantities of rescue boats, ambulances, and NDRF battalions to each zone.
- **Constraints:** Total available operational stock.
- **Objective:** Maximize protected citizens weighted by zone vulnerability and minimize operational response latency.
- **Ranking:** Scored via the novel **Resilience Action Score (RAS)**:
  $$\text{RAS} = \frac{\text{Protected} \times (\text{Vulnerability}/50) \times (\Delta T_{\text{saved}}/10) \times (\text{Confidence}/100)}{(\text{Cost}/10000) + \lambda}$$
