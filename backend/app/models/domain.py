from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ProviderStatus(str, Enum):
    CONNECTED = "CONNECTED"
    DEGRADED = "DEGRADED"
    NO_CREDENTIALS = "NO_CREDENTIALS"
    UNAVAILABLE = "UNAVAILABLE"
    USING_CACHE = "USING_CACHE"
    DEMO = "DEMO"

class RiskClass(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"
    EXTREME = "EXTREME"

class FacilityType(str, Enum):
    HOSPITAL = "HOSPITAL"
    SHELTER = "SHELTER"
    SUBSTATION = "SUBSTATION"
    RELIEF_DEPOT = "RELIEF_DEPOT"

class FacilityStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    AT_RISK = "AT_RISK"
    ISOLATED = "ISOLATED"
    INUNDATED = "INUNDATED"

class RoadStatus(str, Enum):
    PASSABLE = "PASSABLE"
    AT_RISK = "AT_RISK"
    IMPASSABLE = "IMPASSABLE"

class Facility(BaseModel):
    id: str
    name: str
    type: FacilityType
    lat: float
    lon: float
    capacity: int = 100
    current_occupancy: int = 0
    status: FacilityStatus = FacilityStatus.OPERATIONAL
    flood_risk: float = 0.0
    zone_id: str

class RoadSegment(BaseModel):
    id: str
    name: str
    coordinates: List[List[float]] # [[lon, lat], ...]
    length_km: float
    status: RoadStatus = RoadStatus.PASSABLE
    flood_probability: float = 0.0
    baseline_time_min: float = 10.0
    risk_adjusted_time_min: float = 10.0
    is_critical_artery: bool = False

class ChennaiZone(BaseModel):
    id: str
    name: str
    ward_number: int
    ward_label: str = ""
    geometry: Dict[str, Any] # GeoJSON Polygon
    centroid: List[float] # [lon, lat]
    elevation_m: float
    distance_to_waterway_m: float
    population: int
    population_density_per_sqkm: float
    building_count: int
    drainage_index: float # 0 to 1 (1 = poor drainage)
    
    # ML Engine dynamic outputs
    flood_risk_score: float = 0.0 # 0 - 100
    risk_class: RiskClass = RiskClass.LOW
    confidence: float = 80.0 # 0 - 100
    confidence_interval: List[float] = [0.0, 0.0]
    
    # HW01 Time-to-Impact & Hydrologic Depth
    time_to_impact_hours: float = 0.0
    time_to_impact_range_hours: List[float] = [0.0, 0.0]
    inundation_depth_cm: float = 0.0
    water_rise_rate_cm_hr: float = 0.0
    critical_streets: List[str] = []
    nearest_shelter_name: str = ""
    nearest_shelter_capacity: int = 0
    
    vulnerability_score: float = 0.0 # 0 - 100
    impact_score: float = 0.0 # 0 - 100
    
    # Explainability
    feature_contributions: Dict[str, float] = {}
    supporting_evidence: List[str] = []
    contradictions: List[str] = []
    
    facilities: List[Facility] = []

class AlertItem(BaseModel):
    id: str
    event: str
    headline: str
    severity: str
    urgency: str
    certainty: str
    area_desc: str
    instruction: str
    effective: str
    expires: str
    source_agency: str

class RiverObservation(BaseModel):
    station_id: str
    station_name: str
    river_name: str
    current_level_m: Optional[float] = None
    danger_level_m: float
    warning_level_m: float
    discharge_cusecs: Optional[float] = None
    trend: str = "STEADY" # RISING, FALLING, STEADY
    observation_status: str = "LIVE" # LIVE, NO_RECENT_OBSERVATION
    timestamp: str

class SatelliteEvidence(BaseModel):
    sensor: str
    acquisition_time: str
    flood_signal: str # DETECTED, NOT_DETECTED, INCONCLUSIVE
    cloud_limitation: str
    confidence: float
    coverage_area_sqkm: float
    summary: str

class CascadeNode(BaseModel):
    id: str
    name: str
    type: str # HAZARD, ROAD, FACILITY, POPULATION
    risk_score: float
    status: str
    description: str

class CascadeEdge(BaseModel):
    source: str
    target: str
    dependency_type: str # INUNDATES, SEVERS_ACCESS_TO, CUTS_POWER_TO, DELAYS_EVACUATION
    impact_weight: float
    description: str

class CascadeGraph(BaseModel):
    nodes: List[CascadeNode]
    edges: List[CascadeEdge]
    propagation_summary: str

class RecommendedAction(BaseModel):
    id: str
    rank: int
    title: str
    action_type: str
    target_zone_id: str
    target_zone_name: str
    expected_people_protected: int
    response_time_improvement_min: float
    operational_cost_inr: float
    confidence: float
    ras_score: float # Resilience Action Score
    reason: str
    detailed_why: List[str]
    resource_type: str
    units_allocated: int

class SystemProviderHealth(BaseModel):
    name: str
    status: ProviderStatus
    latency_ms: Optional[float] = None
    last_sync: str
    details: str
    is_live: bool
    fallback_mode: str

class CounterfactualRequest(BaseModel):
    rainfall_multiplier: float = 1.0 # 1.0 = baseline, 1.25 = +25%
    river_discharge_multiplier: float = 1.0
    closed_roads: List[str] = []
    failed_facilities: List[str] = []
    available_boats: int = 12
    available_ambulances: int = 24
    available_ndrf_teams: int = 8
    emergency_priority: str = "BALANCED" # VULNERABLE_FIRST, RAPID_RESPONSE, BALANCED
    use_demo_scenario: bool = False # Real-time live Open-Meteo & GloFAS telemetry mode by default

class CounterfactualComparison(BaseModel):
    metric: str
    baseline_value: str
    pravah_value: str = ""
    aegis_value: str = ""
    improvement: str
    unit: str

class SimulationResult(BaseModel):
    scenario_name: str
    rainfall_change_pct: float
    total_affected_population: int
    additional_people_affected: int
    roads_impassable_count: int
    hospitals_at_risk_count: int
    shelters_available_capacity: int
    avg_response_time_min: float
    baseline_avg_response_time_min: float
    recommendations: List[RecommendedAction]
    cascade: CascadeGraph
    comparisons: List[CounterfactualComparison]
    zones: List[ChennaiZone]
    roads: List[RoadSegment]

# =========================================================================
# HW01 MULTILINGUAL ADVISORIES & AGENTIC COPILOT SCHEMAS
# =========================================================================

class AdvisorySeverity(str, Enum):
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    WATCH = "WATCH"
    ADVISORY = "ADVISORY"
    NORMAL = "NORMAL"

class AdvisoryStatus(str, Enum):
    PENDING_OPERATOR_REVIEW = "PENDING_OPERATOR_REVIEW"
    OPERATOR_APPROVED = "OPERATOR_APPROVED"
    BROADCAST_AUTHORIZED = "BROADCAST_AUTHORIZED"

class MultilingualAdvisory(BaseModel):
    id: str
    ward_id: str
    ward_label: str
    ward_name: str
    severity: AdvisorySeverity
    time_to_impact: str
    time_to_impact_hours: float
    inundation_expected_depth_cm: float
    water_rise_rate_cm_hr: float
    status: AdvisoryStatus = AdvisoryStatus.PENDING_OPERATOR_REVIEW
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    operator_notes: Optional[str] = None
    english_title: str
    english_message: str
    english_action: str
    english_safe_route: str
    tamil_title: str
    tamil_message: str
    tamil_action: str
    tamil_safe_route: str
    sms_condensed: str
    target_shelter: str
    critical_streets_avoid: List[str]
    is_simulated: bool = False
    timestamp: str

class CopilotQueryRequest(BaseModel):
    query: str
    ward_id: Optional[str] = None
    language: str = "en"
    use_demo_scenario: bool = False

class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    answer_tamil: Optional[str] = None
    intent: str
    tools_invoked: List[str]
    evidence_sources: List[str]
    suggested_actions: List[str]
    data_mode: str
    timestamp: str

class AdvisoryApprovalRequest(BaseModel):
    advisory_id: str
    operator_name: str = "Duty Officer - GCC Disaster Cell"
    operator_notes: Optional[str] = None
    edited_english_message: Optional[str] = None
    edited_tamil_message: Optional[str] = None
