import {
  DashboardSummary,
  SimulationResult,
  AlertItem,
  RiverObservation,
  SatelliteEvidence,
  ProvenanceItem,
  SystemHealth,
  ModelValidation,
  ChennaiZone,
  RoadSegment,
  Facility
} from '../types';

// Support Vercel production deployment with Render backend
// Reads VITE_API_BASE_URL (e.g. "https://pravah-lxz6.onrender.com")
// Safely strips trailing slash if provided to prevent double slashes
const RAW_BACKEND_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, '');
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api/v1` : '/api/v1';

export async function fetchDashboardSummary(useDemoScenario: boolean = false): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard/summary?use_demo_scenario=${useDemoScenario}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch dashboard summary`);
  return res.json();
}

export async function fetchSimulation(params: {
  rainfall_multiplier?: number;
  river_discharge_multiplier?: number;
  closed_roads?: string[];
  failed_facilities?: string[];
  available_boats?: number;
  available_ambulances?: number;
  available_ndrf_teams?: number;
  emergency_priority?: string;
  use_demo_scenario?: boolean;
}): Promise<SimulationResult> {
  const res = await fetch(`${API_BASE}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rainfall_multiplier: params.rainfall_multiplier ?? 1.0,
      river_discharge_multiplier: params.river_discharge_multiplier ?? 1.0,
      closed_roads: params.closed_roads ?? [],
      failed_facilities: params.failed_facilities ?? [],
      available_boats: params.available_boats ?? 12,
      available_ambulances: params.available_ambulances ?? 24,
      available_ndrf_teams: params.available_ndrf_teams ?? 8,
      emergency_priority: params.emergency_priority ?? 'BALANCED',
      use_demo_scenario: params.use_demo_scenario ?? false
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to run simulation`);
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch alerts`);
  return res.json();
}

export async function fetchRiverLevels(): Promise<RiverObservation[]> {
  const res = await fetch(`${API_BASE}/river-levels`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch river levels`);
  return res.json();
}

export async function fetchFloodHazards(): Promise<{ zones: ChennaiZone[]; satellite_evidence: SatelliteEvidence }> {
  const res = await fetch(`${API_BASE}/hazards/flood`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch flood hazards`);
  return res.json();
}

export async function fetchFacilities(): Promise<Facility[]> {
  const res = await fetch(`${API_BASE}/facilities`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch facilities`);
  return res.json();
}

export async function fetchRoutes(): Promise<{ road_network: RoadSegment[]; routing_comparison: any }> {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch routes`);
  return res.json();
}

export async function fetchTimelineStep(step: string): Promise<any> {
  const res = await fetch(`${API_BASE}/timeline/replay?step=${step}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch timeline step`);
  return res.json();
}

export async function fetchProvenance(): Promise<{ provenance: ProvenanceItem[]; system_assurance: string; last_audit: string }> {
  const res = await fetch(`${API_BASE}/provenance`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch provenance`);
  return res.json();
}

export async function fetchSystemHealth(): Promise<SystemHealth[]> {
  const res = await fetch(`${API_BASE}/system-health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch system health`);
  return res.json();
}

export async function fetchModelValidation(): Promise<ModelValidation> {
  const res = await fetch(`${API_BASE}/validation`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch model validation`);
  return res.json();
}

// IMD Official Services API
export async function fetchIMDForecast(): Promise<any> {
  const res = await fetch(`${API_BASE}/imd/forecast`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD forecast`);
  return res.json();
}

export async function fetchIMDCurrentWeather(): Promise<any> {
  const res = await fetch(`${API_BASE}/imd/current-weather`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD current weather`);
  return res.json();
}

export async function fetchIMDNowcast(): Promise<any> {
  const res = await fetch(`${API_BASE}/imd/nowcast`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD nowcast`);
  return res.json();
}

export async function fetchIMDWarnings(): Promise<any> {
  const res = await fetch(`${API_BASE}/imd/warnings`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD warnings`);
  return res.json();
}

export async function fetchIMDAWS(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/imd/aws`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD AWS stations`);
  return res.json();
}

export async function fetchIMDBasinQPF(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/imd/basin-qpf`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD Basin QPF`);
  return res.json();
}

export async function fetchIMDCyclone(): Promise<any> {
  const res = await fetch(`${API_BASE}/imd/cyclone`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch IMD Cyclone`);
  return res.json();
}

export async function fetchDataFusion(): Promise<any> {
  const res = await fetch(`${API_BASE}/data-fusion`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch data fusion`);
  return res.json();
}

export async function fetchRiskAwareRoute(): Promise<any> {
  const res = await fetch(`${API_BASE}/routes/risk-aware`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch risk aware route`);
  return res.json();
}

export async function fetchOpenMeteoDeepTelemetry(): Promise<any> {
  const res = await fetch(`${API_BASE}/open-meteo/deep-telemetry`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch Open-Meteo telemetry`);
  return res.json();
}



