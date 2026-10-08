import numpy as np
from typing import Dict, Any, Tuple
from app.models.domain import RiskClass

class FloodRiskModel:
    """
    Explainable Tabular Flood Risk Engine for Urban Hydrology.
    Integrates physical catchment parameters, meteorological inputs,
    and satellite SAR radar observations.
    """
    def __init__(self):
        # Calibrated weights based on urban flood vulnerability literature for coastal deltaic cities
        self.weights = {
            "rainfall_forecast": 0.28,
            "elevation": 0.22,
            "waterway_proximity": 0.18,
            "drainage_index": 0.14,
            "river_discharge": 0.12,
            "satellite_sar": 0.06
        }

    def predict(
        self,
        rainfall_24h_mm: float,
        rainfall_intensity_mm_hr: float,
        elevation_m: float,
        distance_to_waterway_m: float,
        drainage_index: float,
        river_discharge_ratio: float, # current_discharge / danger_threshold (e.g. 1.1 = 10% over danger)
        sar_flood_signal: bool
    ) -> Tuple[float, RiskClass, Dict[str, float]]:
        """
        Computes calibrated flood risk score (0-100) and feature contributions (SHAP-aligned).
        """
        # Normalized feature components [0.0 to 100.0]
        # Rainfall term (scaled across high-monsoon threshold ~350mm/24h)
        f_rain = min(100.0, (rainfall_24h_mm / 350.0) * 80.0 + (rainfall_intensity_mm_hr / 50.0) * 20.0)
        
        # Elevation term: lower elevation = much higher flood exposure (Chennai MSL scale: 2m - 20m)
        f_elev = max(0.0, min(100.0, (18.0 - elevation_m) / 16.0 * 100.0))
        
        # Proximity term: closer to river/canal (<100m = 100%, >1000m = 10%)
        f_water = max(10.0, min(100.0, (1000.0 - distance_to_waterway_m) / 900.0 * 100.0))
        
        # Drainage impedance
        f_drain = drainage_index * 100.0
        
        # Upstream river surge/discharge
        f_river = min(100.0, river_discharge_ratio * 80.0)
        
        # Physical hydrological activation trigger
        # In real-life dry weather (zero precipitation & baseflow), low elevation remains latent until activated
        hazard_trigger = min(1.0, max(0.06, (f_rain / 25.0) + (f_river / 35.0) + (0.75 if sar_flood_signal else 0.0)))

        # SAR empirical observation
        f_sar = 95.0 if sar_flood_signal else (10.0 * hazard_trigger)

        # Feature contributions scaled by physical activation trigger
        contributions = {
            "rainfall_accumulation": round(f_rain * self.weights["rainfall_forecast"], 1),
            "terrain_low_elevation": round(f_elev * self.weights["elevation"] * hazard_trigger, 1),
            "waterway_proximity": round(f_water * self.weights["waterway_proximity"] * hazard_trigger, 1),
            "drainage_impedance": round(f_drain * self.weights["drainage_index"] * hazard_trigger, 1),
            "river_surge_discharge": round(f_river * self.weights["river_discharge"], 1),
            "satellite_sar_evidence": round(f_sar * self.weights["satellite_sar"], 1)
        }

        # Composite raw score
        raw_score = sum(contributions.values())
        score = float(np.clip(raw_score, 0.0, 99.5))
        score = round(score, 1)

        # Risk Classification
        if score >= 80.0:
            risk_class = RiskClass.EXTREME if score >= 90.0 else RiskClass.SEVERE
        elif score >= 60.0:
            risk_class = RiskClass.HIGH
        elif score >= 35.0:
            risk_class = RiskClass.MODERATE
        else:
            risk_class = RiskClass.LOW

        return score, risk_class, contributions

flood_risk_model = FloodRiskModel()
