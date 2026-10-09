export type RiskClass = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME';
export type FacilityType = 'HOSPITAL' | 'SHELTER' | 'SUBSTATION' | 'RELIEF_DEPOT';
export type FacilityStatus = 'OPERATIONAL' | 'AT_RISK' | 'ISOLATED' | 'INUNDATED';
export type RoadStatus = 'PASSABLE' | 'AT_RISK' | 'IMPASSABLE';
export type ProviderStatus = 'CONNECTED' | 'DEGRADED' | 'NO_CREDENTIALS' | 'UNAVAILABLE' | 'USING_CACHE' | 'DEMO';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  lat: float;
  lon: float;
  capacity: number;
  current_occupancy: number;
  status: FacilityStatus;
  flood_risk: number;
  zone_id: string;
}

export type float = number;

export interface RoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  length_km: number;
  status: RoadStatus;
  flood_probability: number;
  baseline_time_min: number;
  risk_adjusted_time_min: number;
  is_critical_artery: boolean;
}

export interface ChennaiZone {
  id: string;
  name: string;
  ward_number: number;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
  centroid: [number, number];
  elevation_m: number;
  distance_to_waterway_m: number;
  population: number;
  population_density_per_sqkm: number;
  building_count: number;
  drainage_index: number;
  flood_risk_score: number;
  risk_class: RiskClass;
  confidence: number;
  confidence_interval: [number, number];
  ward_label?: string;
  time_to_impact_hours?: number;
  time_to_impact_range_hours?: [number, number];
  inundation_depth_cm?: number;
  water_rise_rate_cm_hr?: number;
  critical_streets?: string[];
  nearest_shelter_name?: string;
  nearest_shelter_capacity?: number;
  vulnerability_score: number;
  impact_score: number;
  feature_contributions: Record<string, number>;
  supporting_evidence: string[];
  contradictions: string[];
  facilities: Facility[];
}

export interface AlertItem {
  id: string;
  event: string;
  headline: string;
  severity: string;
  urgency: string;
  certainty: string;
  area_desc: string;
  instruction: string;
  effective: string;
  expires: string;
  source_agency: string;
}

export interface RiverObservation {
  station_id: string;
  station_name: string;
  river_name: string;
  current_level_m: number | null;
  danger_level_m: number;
  warning_level_m: number;
  discharge_cusecs: number | null;
  trend: string;
  observation_status: string;
  timestamp: string;
}

export interface SatelliteEvidence {
  sensor: string;
  acquisition_time: string;
  flood_signal: string;
  cloud_limitation: string;
  confidence: number;
  coverage_area_sqkm: number;
  summary: string;
}

export interface CascadeNode {
  id: string;
  name: string;
  type: string;
  risk_score: number;
  status: string;
  description: string;
}

export interface CascadeEdge {
  source: string;
  target: string;
  dependency_type: string;
  impact_weight: number;
  description: string;
}

export interface CascadeGraph {
  nodes: CascadeNode[];
  edges: CascadeEdge[];
  propagation_summary: string;
}

export interface RecommendedAction {
  id: string;
  rank: number;
  title: string;
  action_type: string;
  target_zone_id: string;
  target_zone_name: string;
  expected_people_protected: number;
  response_time_improvement_min: number;
  operational_cost_inr: number;
  confidence: number;
  ras_score: number;
  reason: string;
  detailed_why: string[];
  resource_type: string;
  units_allocated: number;
}

export interface CounterfactualComparison {
  metric: string;
  baseline_value: string;
  pravah_value: string;
  aegis_value?: string;
  improvement: string;
  unit: string;
}

export interface SimulationResult {
  scenario_name: string;
  rainfall_change_pct: number;
  total_affected_population: number;
  additional_people_affected: number;
  roads_impassable_count: number;
  hospitals_at_risk_count: number;
  shelters_available_capacity: number;
  avg_response_time_min: number;
  baseline_avg_response_time_min: number;
  recommendations: RecommendedAction[];
  cascade: CascadeGraph;
  comparisons: CounterfactualComparison[];
  zones: ChennaiZone[];
  roads: RoadSegment[];
}

export interface DashboardSummary {
  hazard_type: string;
  city: string;
  timestamp: string;
  overall_risk_level: RiskClass;
  overall_confidence_pct: number;
  total_population_exposed: number;
  critical_facilities_threatened: number;
  roads_at_risk_count: number;
  active_alerts_count: number;
  sources_summary: Record<string, string>;
  is_demo_mode: boolean;
  scenario_title: string;
  forecast_agreement_score?: number;
  forecast_agreement_tier?: string;
  system_mode?: string;
}

export interface ProvenanceItem {
  layer: string;
  primary_source: string;
  secondary_source?: string;
  update_frequency: string;
  last_fetched: string;
  status: string;
  methodology: string;
  confidence_weight: number;
}

export interface SystemHealth {
  name: string;
  status: ProviderStatus;
  latency_ms: number | null;
  last_sync: string;
  details: string;
  is_live: boolean;
  fallback_mode: string;
}

export interface ModelValidation {
  evaluation_type: string;
  metrics: {
    flood_classifier_precision: number;
    flood_classifier_recall: number;
    f1_score: number;
    rainfall_nwp_mae_mm: number;
    confidence_calibration_brier_score: number;
  };
  operational_impact: {
    baseline_avg_response_time_min: number;
    pravah_avg_response_time_min: number;
    response_time_improvement_pct: number;
    population_protection_gain_pct: number;
    prevented_vehicle_stranding_incidents: number;
  };
}

export interface IMDCityForecastDay {
  day: number;
  date: string;
  max_temp_c?: number;
  min_temp_c?: number;
  forecast: string;
}

export interface IMDCityForecast {
  station_code: string;
  station_name: string;
  date_of_observation: string;
  latitude?: number;
  longitude?: number;
  today_max_temp?: number;
  today_max_departure?: number;
  today_min_temp?: number;
  today_min_departure?: number;
  past_24_hrs_rainfall_mm: number;
  relative_humidity_0830?: number;
  relative_humidity_1730?: number;
  sunrise_time?: string;
  sunset_time?: string;
  moonrise_time?: string;
  moonset_time?: string;
  seven_day_forecast: IMDCityForecastDay[];
}

export interface IMDCurrentWeather {
  station_id: string;
  station_name: string;
  date_of_observation: string;
  time_of_observation_utc: string;
  mslp_hpa: number;
  wind_direction_code: number;
  wind_direction_desc: string;
  wind_speed_kmph: number;
  temperature_c: number;
  weather_code: string;
  weather_desc: string;
  nebulosity_oktas: number;
  humidity_pct: number;
  last_24_hrs_rainfall_mm: number;
}

export interface IMDDistrictNowcast {
  station_name: string;
  date: string;
  warning_code: number;
  warning_desc: string;
  message: string;
  time_of_issue_ist: string;
  valid_upto_ist: string;
  color_code: number;
  color_hex: string;
  severity_level: string;
}

export interface IMDDistrictWarning {
  obj_id: string;
  district: string;
  date_of_issue: string;
  utc_time: string;
  day_1_codes: number[];
  day_1_text: string;
  day_1_color: string;
  day_2_codes: number[];
  day_2_text: string;
  day_2_color: string;
  day_3_codes: number[];
  day_3_text: string;
  day_3_color: string;
  day_4_codes: number[];
  day_4_text: string;
  day_4_color: string;
  day_5_codes: number[];
  day_5_text: string;
  day_5_color: string;
}

export interface IMDAWSStation {
  id: string;
  call_sign: string;
  station_name: string;
  district: string;
  state: string;
  date: string;
  time_utc: string;
  temp_c: number;
  dew_point_c?: number;
  humidity_pct: number;
  wind_direction_deg: number;
  wind_speed_kmph: number;
  mslp_hpa: number;
  latitude: number;
  longitude: number;
  weather_code: string;
  feels_like_c: number;
}

export interface IMDRiverBasinQPF {
  obj_id: string;
  date: string;
  fmo: string;
  basin: string;
  sub_basin: string;
  area_sqkm: number;
  day1_qpf_mm: string;
  day2_qpf_mm: string;
  day3_qpf_mm: string;
  day4_qpf_mm: string;
  day5_qpf_mm: string;
  average_areal_precipitation_mm: number;
}

export interface IMDCycloneSuite {
  track: {
    cyclone_name: string;
    observed: { date_time: string; lat: number; lon: number; msw_kmph: string; category: string }[];
    forecast: { date_time: string; lat: number; lon: number; msw_kmph: string; category: string }[];
  };
  cone_of_uncertainty: {
    cone_polygon: {
      type: string;
      coordinates: number[][][][];
    };
  };
}

export type AdvisorySeverity = 'CRITICAL' | 'WARNING' | 'WATCH' | 'ADVISORY' | 'NORMAL';
export type AdvisoryStatus = 'PENDING_OPERATOR_REVIEW' | 'OPERATOR_APPROVED' | 'BROADCAST_AUTHORIZED';

export interface MultilingualAdvisory {
  id: string;
  ward_id: string;
  ward_label: string;
  ward_name: string;
  severity: AdvisorySeverity;
  time_to_impact: string;
  time_to_impact_hours: number;
  inundation_expected_depth_cm: number;
  water_rise_rate_cm_hr: number;
  status: AdvisoryStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  operator_notes?: string | null;
  english_title: string;
  english_message: string;
  english_action: string;
  english_safe_route: string;
  tamil_title: string;
  tamil_message: string;
  tamil_action: string;
  tamil_safe_route: string;
  sms_condensed: string;
  target_shelter: string;
  critical_streets_avoid: string[];
  is_simulated: boolean;
  timestamp: string;
}

export interface CopilotQueryRequest {
  query: string;
  ward_id?: string;
  language?: string;
  use_demo_scenario?: boolean;
}

export interface CopilotQueryResponse {
  query: string;
  answer: string;
  answer_tamil?: string | null;
  intent: string;
  tools_invoked: string[];
  evidence_sources: string[];
  suggested_actions: string[];
  data_mode: string;
  timestamp: string;
}

export interface AdvisoryApprovalRequest {
  advisory_id: string;
  operator_name?: string;
  operator_notes?: string;
  edited_english_message?: string;
  edited_tamil_message?: string;
}


