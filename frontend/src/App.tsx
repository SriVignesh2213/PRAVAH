import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MapLibreView } from './components/MapLibreView';
import { LayerControls } from './components/LayerControls';
import { TimelineController } from './components/TimelineController';
import { AlertsFeed } from './components/AlertsFeed';
import { ZoneInspector } from './components/ZoneInspector';
import { ActionOptimizer } from './components/ActionOptimizer';
import { CascadingView } from './components/CascadingView';
import { HydrometricPanel } from './components/HydrometricPanel';
import { CounterfactualDock } from './components/CounterfactualDock';
import { ProvenanceModal } from './components/ProvenanceModal';
import { SystemHealthModal } from './components/SystemHealthModal';
import { ValidationModal } from './components/ValidationModal';
import { IMDWeatherModal } from './components/IMDWeatherModal';
import { RiskAwareRoutingModal } from './components/RiskAwareRoutingModal';
import { OpenMeteoModal } from './components/OpenMeteoModal';
import { CopilotModal } from './components/CopilotModal';
import { AdvisoryStudioModal } from './components/AdvisoryStudioModal';
import {
  fetchDashboardSummary,
  fetchSimulation,
  fetchAlerts,
  fetchRiverLevels,
  fetchFloodHazards,
  fetchFacilities,
  fetchRoutes,
  fetchRiskAwareRoute,
  fetchOpenMeteoDeepTelemetry,
  fetchTimelineStep,
  fetchProvenance,
  fetchSystemHealth,
  fetchModelValidation,
  fetchIMDForecast,
  fetchIMDCurrentWeather,
  fetchIMDNowcast,
  fetchIMDWarnings,
  fetchIMDAWS,
  fetchIMDBasinQPF,
  fetchIMDCyclone
} from './services/api';
import {
  DashboardSummary,
  SimulationResult,
  AlertItem,
  RiverObservation,
  SatelliteEvidence,
  ChennaiZone,
  RoadSegment,
  Facility,
  ProvenanceItem,
  SystemHealth,
  ModelValidation,
  IMDCityForecast,
  IMDCurrentWeather,
  IMDDistrictNowcast,
  IMDDistrictWarning,
  IMDAWSStation,
  IMDRiverBasinQPF,
  IMDCycloneSuite
} from './types';
import { Target, GitBranch, Waves } from 'lucide-react';

export const App: React.FC = () => {
  // Application Modes & Modals (Default to Live Telemetry)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);
  const [isHealthOpen, setIsHealthOpen] = useState<boolean>(false);
  const [isValidationOpen, setIsValidationOpen] = useState<boolean>(false);
  const [isIMDOpen, setIsIMDOpen] = useState<boolean>(false);
  const [isRoutingOpen, setIsRoutingOpen] = useState<boolean>(false);
  const [routingComparison, setRoutingComparison] = useState<any>(null);
  const [isOpenMeteoOpen, setIsOpenMeteoOpen] = useState<boolean>(false);
  const [openMeteoTelemetry, setOpenMeteoTelemetry] = useState<any>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isAdvisoriesOpen, setIsAdvisoriesOpen] = useState<boolean>(false);

  // Core Data State
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [riverLevels, setRiverLevels] = useState<RiverObservation[]>([]);
  const [satelliteEvidence, setSatelliteEvidence] = useState<SatelliteEvidence | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedZone, setSelectedZone] = useState<ChennaiZone | null>(null);
  const [provenance, setProvenance] = useState<ProvenanceItem[]>([]);
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [validation, setValidation] = useState<ModelValidation | null>(null);

  // Official IMD Data State
  const [imdForecast, setImdForecast] = useState<IMDCityForecast | null>(null);
  const [imdCurrentWx, setImdCurrentWx] = useState<IMDCurrentWeather | null>(null);
  const [imdNowcast, setImdNowcast] = useState<IMDDistrictNowcast | null>(null);
  const [imdWarnings, setImdWarnings] = useState<IMDDistrictWarning | null>(null);
  const [imdAWS, setImdAWS] = useState<IMDAWSStation[]>([]);
  const [imdBasinQpf, setImdBasinQpf] = useState<IMDRiverBasinQPF[]>([]);
  const [imdCyclone, setImdCyclone] = useState<IMDCycloneSuite | null>(null);

  // Active Layers
  const [activeLayers, setActiveLayers] = useState({
    floodRisk: true,
    vulnerability: false,
    roads: true,
    facilities: true,
    resilientRoute: true
  });

  // Right Panel Tab
  const [activeTab, setActiveTab] = useState<'actions' | 'cascade' | 'evidence'>('actions');

  // Timeline State
  const [currentTimelineStep, setCurrentTimelineStep] = useState<string>('T0');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Counterfactual What-If State
  const [rainfallMultiplier, setRainfallMultiplier] = useState<number>(1.0);
  const [dischargeMultiplier, setDischargeMultiplier] = useState<number>(1.0);
  const [closedRoads, setClosedRoads] = useState<string[]>([]);
  const [boats, setBoats] = useState<number>(12);
  const [ambulances, setAmbulances] = useState<number>(24);
  const [ndrfTeams, setNdrfTeams] = useState<number>(8);
  const [priority, setPriority] = useState<string>('BALANCED');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Load Initial Data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [
        sumData, simData, alertsData, riverData, hazardData, facData, provData, healthData, valData,
        fcData, wxData, nowData, warnData, awsData, qpfData, cycData, routingData, omDeepData
      ] = await Promise.all([
        fetchDashboardSummary(isDemoMode),
        fetchSimulation({
          rainfall_multiplier: rainfallMultiplier,
          river_discharge_multiplier: dischargeMultiplier,
          closed_roads: closedRoads,
          available_boats: boats,
          available_ambulances: ambulances,
          available_ndrf_teams: ndrfTeams,
          emergency_priority: priority,
          use_demo_scenario: isDemoMode
        }),
        fetchAlerts(),
        fetchRiverLevels(),
        fetchFloodHazards(isDemoMode),
        fetchFacilities(isDemoMode),
        fetchProvenance(),
        fetchSystemHealth(),
        fetchModelValidation(),
        fetchIMDForecast(),
        fetchIMDCurrentWeather(),
        fetchIMDNowcast(),
        fetchIMDWarnings(),
        fetchIMDAWS(),
        fetchIMDBasinQPF(),
        fetchIMDCyclone(),
        fetchRiskAwareRoute(isDemoMode),
        fetchOpenMeteoDeepTelemetry()
      ]);

      setSummary(sumData);
      setSimulation(simData);
      setAlerts(alertsData);
      setRiverLevels(riverData);
      setSatelliteEvidence(hazardData.satellite_evidence);
      setFacilities(facData);
      setProvenance(provData.provenance);
      setHealth(healthData);
      setValidation(valData);
      setImdForecast(fcData);
      setImdCurrentWx(wxData);
      setImdNowcast(nowData);
      setImdWarnings(warnData);
      setImdAWS(awsData);
      setImdBasinQpf(qpfData);
      setImdCyclone(cycData);
      setRoutingComparison(routingData);
      setOpenMeteoTelemetry(omDeepData);

      // Default select the highest-risk zone for immediate inspection
      if (simData.zones && simData.zones.length > 0) {
        const sorted = [...simData.zones].sort((a, b) => b.flood_risk_score - a.flood_risk_score);
        setSelectedZone(sorted[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [isDemoMode]);

  // Execute What-If Counterfactual
  const handleRunCounterfactual = async () => {
    setIsSimulating(true);
    try {
      const simData = await fetchSimulation({
        rainfall_multiplier: rainfallMultiplier,
        river_discharge_multiplier: dischargeMultiplier,
        closed_roads: closedRoads,
        available_boats: boats,
        available_ambulances: ambulances,
        available_ndrf_teams: ndrfTeams,
        emergency_priority: priority,
        use_demo_scenario: isDemoMode
      });
      setSimulation(simData);

      // Dynamically sync header summary metrics with counterfactual result
      setSummary(prev => prev ? {
        ...prev,
        total_population_exposed: simData.total_affected_population,
        critical_facilities_threatened: simData.hospitals_at_risk_count,
        roads_at_risk_count: simData.roads_impassable_count,
        overall_risk_level: (simData.zones.some(z => z.flood_risk_score >= 85)
          ? 'EXTREME'
          : (simData.zones.some(z => z.flood_risk_score >= 70)
          ? 'SEVERE'
          : (simData.zones.some(z => z.flood_risk_score >= 50)
          ? 'HIGH'
          : (simData.zones.some(z => z.flood_risk_score >= 30) ? 'MODERATE' : 'LOW')))) as any
      } : prev);

      // Re-fetch routing comparison to reflect perturbed road accessibility
      try {
        const updatedRoute = await fetchRiskAwareRoute(isDemoMode);
        setRoutingComparison(updatedRoute);
      } catch (rErr) {
        console.warn('Route refresh notice:', rErr);
      }

      // Update selected zone if open
      if (selectedZone) {
        const updated = simData.zones.find(z => z.id === selectedZone.id);
        if (updated) setSelectedZone(updated);
      }
    } catch (err) {
      console.error('Counterfactual simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset Counterfactual Controls
  const handleResetCounterfactual = () => {
    setRainfallMultiplier(1.0);
    setDischargeMultiplier(1.0);
    setClosedRoads([]);
    setBoats(12);
    setAmbulances(24);
    setNdrfTeams(8);
    setPriority('BALANCED');
    loadInitialData();
  };

  const handleToggleRoad = (roadId: string) => {
    setClosedRoads(prev =>
      prev.includes(roadId) ? prev.filter(id => id !== roadId) : [...prev, roadId]
    );
  };

  const handleToggleLayer = (layerKey: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !(prev as any)[layerKey]
    }));
  };

  // Timeline Step Selection
  const handleSelectTimelineStep = async (step: string) => {
    setCurrentTimelineStep(step);
    try {
      const stepData = await fetchTimelineStep(step);
      if (stepData && simulation) {
        setRainfallMultiplier(stepData.rainfall_multiplier);
        const simData = await fetchSimulation({
          rainfall_multiplier: stepData.rainfall_multiplier,
          river_discharge_multiplier: dischargeMultiplier,
          closed_roads: closedRoads,
          available_boats: boats,
          available_ambulances: ambulances,
          available_ndrf_teams: ndrfTeams,
          emergency_priority: priority,
          use_demo_scenario: isDemoMode
        });
        setSimulation(simData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#0b0f17' }}>
      {/* Top Header */}
      <Header
        summary={summary}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
        onOpenHealth={() => setIsHealthOpen(true)}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenIMD={() => setIsIMDOpen(true)}
        onOpenRouting={() => setIsRoutingOpen(true)}
        onOpenOpenMeteo={() => setIsOpenMeteoOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenAdvisories={() => setIsAdvisoriesOpen(true)}
        onRefresh={loadInitialData}
        loading={loading}
      />

      {/* Main Command Center Layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        {/* LEFT SIDEBAR: Layers, Timeline & Official Alerts (290px) */}
        <div style={{
          width: '290px',
          background: '#0d131f',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '10px',
          overflowY: 'auto',
          zIndex: 15
        }}>
          <LayerControls
            layers={activeLayers}
            onToggleLayer={handleToggleLayer}
          />

          <TimelineController
            currentStep={currentTimelineStep}
            onSelectStep={handleSelectTimelineStep}
            isPlaying={isPlayingTimeline}
            onTogglePlay={() => setIsPlayingTimeline(!isPlayingTimeline)}
          />

          <AlertsFeed alerts={alerts} />
        </div>

        {/* CENTER MAIN CANVAS: Map & Inspector */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <MapLibreView
            zones={simulation ? simulation.zones : []}
            roads={simulation ? simulation.roads : []}
            facilities={facilities}
            selectedZone={selectedZone}
            onSelectZone={(z) => setSelectedZone(z)}
            activeLayers={activeLayers}
          />

          {/* Floating Zone Inspector */}
          {selectedZone && (
            <ZoneInspector
              zone={selectedZone}
              onClose={() => setSelectedZone(null)}
              facilities={facilities}
            />
          )}
        </div>

        {/* RIGHT OPERATIONS PANEL (390px) */}
        <div style={{
          width: '390px',
          background: '#0d131f',
          borderLeft: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15
        }}>
          {/* Panel Tab Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid #1e293b',
            background: '#111827'
          }}>
            <button
              onClick={() => setActiveTab('actions')}
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: activeTab === 'actions' ? '#38bdf8' : '#94a3b8',
                borderBottom: activeTab === 'actions' ? '2px solid #38bdf8' : '2px solid transparent',
                background: activeTab === 'actions' ? '#161f2e' : 'transparent'
              }}
            >
              <Target size={13} />
              Actions
            </button>

            <button
              onClick={() => setActiveTab('cascade')}
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: activeTab === 'cascade' ? '#f59e0b' : '#94a3b8',
                borderBottom: activeTab === 'cascade' ? '2px solid #f59e0b' : '2px solid transparent',
                background: activeTab === 'cascade' ? '#161f2e' : 'transparent'
              }}
            >
              <GitBranch size={13} />
              Cascades
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                color: activeTab === 'evidence' ? '#06b6d4' : '#94a3b8',
                borderBottom: activeTab === 'evidence' ? '2px solid #06b6d4' : '2px solid transparent',
                background: activeTab === 'evidence' ? '#161f2e' : 'transparent'
              }}
            >
              <Waves size={13} />
              Evidence
            </button>
          </div>

          {/* Panel Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {activeTab === 'actions' && (
              <ActionOptimizer
                recommendations={simulation ? simulation.recommendations : []}
                comparisons={simulation ? simulation.comparisons : []}
              />
            )}

            {activeTab === 'cascade' && (
              <CascadingView cascade={simulation ? simulation.cascade : null} />
            )}

            {activeTab === 'evidence' && (
              <HydrometricPanel
                riverLevels={riverLevels}
                satelliteEvidence={satelliteEvidence}
              />
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM DOCK: What-If Counterfactual Simulator */}
      <CounterfactualDock
        rainfallMultiplier={rainfallMultiplier}
        onChangeRainfall={setRainfallMultiplier}
        dischargeMultiplier={dischargeMultiplier}
        onChangeDischarge={setDischargeMultiplier}
        closedRoads={closedRoads}
        onToggleRoad={handleToggleRoad}
        boats={boats}
        onChangeBoats={setBoats}
        ambulances={ambulances}
        onChangeAmbulances={setAmbulances}
        ndrfTeams={ndrfTeams}
        onChangeNdrfTeams={setNdrfTeams}
        priority={priority}
        onChangePriority={setPriority}
        onRunSimulation={handleRunCounterfactual}
        onReset={handleResetCounterfactual}
        isSimulating={isSimulating}
      />

      {/* Modals & Drawers */}
      <ProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
        provenance={provenance}
      />

      <SystemHealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
        health={health}
      />

      <ValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        validation={validation}
      />

      <IMDWeatherModal
        isOpen={isIMDOpen}
        onClose={() => setIsIMDOpen(false)}
        forecast={imdForecast}
        currentWx={imdCurrentWx}
        nowcast={imdNowcast}
        warnings={imdWarnings}
        awsStations={imdAWS}
        basinQpf={imdBasinQpf}
        cyclone={imdCyclone}
      />

      <RiskAwareRoutingModal
        isOpen={isRoutingOpen}
        onClose={() => setIsRoutingOpen(false)}
        routingData={routingComparison}
      />

      <OpenMeteoModal
        isOpen={isOpenMeteoOpen}
        onClose={() => setIsOpenMeteoOpen(false)}
        telemetry={openMeteoTelemetry}
      />

      {/* HW01 Agentic AI Copilot & Multilingual Advisory Broadcast Studio */}
      <CopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        isDemoMode={isDemoMode}
      />

      <AdvisoryStudioModal
        isOpen={isAdvisoriesOpen}
        onClose={() => setIsAdvisoriesOpen(false)}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};

export default App;
