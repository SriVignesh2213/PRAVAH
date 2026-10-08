from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from app.models.domain import (
    ProviderStatus, RiskClass, ChennaiZone, Facility, RoadSegment,
    AlertItem, RiverObservation, SatelliteEvidence, RecommendedAction,
    SystemProviderHealth, SimulationResult, CascadeGraph
)

class DashboardSummaryResponse(BaseModel):
    hazard_type: str = "URBAN_FLOOD"
    city: str = "Chennai, Tamil Nadu"
    timestamp: str
    overall_risk_level: RiskClass
    overall_confidence_pct: float
    total_population_exposed: int
    critical_facilities_threatened: int
    roads_at_risk_count: int
    active_alerts_count: int
    sources_summary: Dict[str, str]
    is_demo_mode: bool
    scenario_title: str
    forecast_agreement_score: Optional[float] = 84.6
    forecast_agreement_tier: Optional[str] = "VERY_HIGH"
    system_mode: Optional[str] = "LIVE"

class ProvenanceItem(BaseModel):
    layer: str
    primary_source: str
    secondary_source: Optional[str] = None
    update_frequency: str
    last_fetched: str
    status: str
    methodology: str
    confidence_weight: float

class ProvenanceResponse(BaseModel):
    provenance: List[ProvenanceItem]
    system_assurance: str
    last_audit: str
