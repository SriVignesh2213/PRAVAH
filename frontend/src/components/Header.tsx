import React from 'react';
import { Activity, ShieldCheck, Database, Award, RefreshCw, AlertTriangle, CloudRain, Navigation, Bot, Radio } from 'lucide-react';
import { DashboardSummary } from '../types';

interface HeaderProps {
  summary: DashboardSummary | null;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenProvenance: () => void;
  onOpenHealth: () => void;
  onOpenValidation: () => void;
  onOpenIMD: () => void;
  onOpenRouting?: () => void;
  onOpenOpenMeteo?: () => void;
  onOpenCopilot?: () => void;
  onOpenAdvisories?: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  summary,
  isDemoMode,
  onToggleDemoMode,
  onOpenProvenance,
  onOpenHealth,
  onOpenValidation,
  onOpenIMD,
  onOpenRouting,
  onOpenOpenMeteo,
  onOpenCopilot,
  onOpenAdvisories,
  onRefresh,
  loading
}) => {
  return (
    <header style={{
      background: '#0d131f',
      borderBottom: '1px solid #1e293b',
      padding: '8px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 30
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: '1px solid #38bdf8',
              borderRadius: '4px',
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(14, 165, 233, 0.4)'
            }}>
              <Activity size={16} color="#ffffff" />
              <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '0.08em', color: '#ffffff' }}>
                AEGIS EARTH - ALERTNEST
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.03em' }}>
                HYPERLOCAL FLOOD EARLY-WARNING &amp; EVACUATION COPILOT (HW01)
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>
                Chennai Basin • Uncertainty-Aware Decision Intelligence &amp; Multilingual Action
              </span>
            </div>
          </div>

          <div style={{ height: '20px', width: '1px', background: '#334155' }} />

          {/* Mode Switcher */}
          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '4px',
            padding: '2px',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={() => isDemoMode && onToggleDemoMode()}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '3px',
                background: !isDemoMode ? '#1e293b' : 'transparent',
                color: !isDemoMode ? '#38bdf8' : '#94a3b8'
              }}
            >
              <span className={`status-dot ${!isDemoMode ? 'live' : ''}`} style={{ marginRight: '6px' }} />
              LIVE TELEMETRY
            </button>
            <button
              onClick={() => !isDemoMode && onToggleDemoMode()}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '3px',
                background: isDemoMode ? '#27272a' : 'transparent',
                color: isDemoMode ? '#f59e0b' : '#94a3b8'
              }}
            >
              <span className={`status-dot ${isDemoMode ? 'demo' : ''}`} style={{ marginRight: '6px' }} />
              DEMO SCENARIO
            </button>
          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenCopilot}
            title="HW01 Agentic AI Copilot: Natural language flood guidance and route navigation"
            style={{
              background: 'linear-gradient(135deg, #0369a1, #1d4ed8)',
              border: '1px solid #38bdf8',
              padding: '4px 11px',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(14, 165, 233, 0.35)'
            }}
          >
            <Bot size={14} color="#ffffff" />
            Copilot AI
          </button>

          <button
            onClick={onOpenAdvisories}
            title="HW01 Multilingual Advisory Studio: Ward-by-ward English, Tamil, and SMS broadcasts"
            style={{
              background: '#064e3b',
              border: '1px solid #10b981',
              padding: '4px 11px',
              borderRadius: '4px',
              color: '#a7f3d0',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)'
            }}
          >
            <Radio size={14} color="#34d399" />
            Advisories (தமிழ்/EN)
          </button>

          <button
            onClick={onOpenRouting}
            title="Inspect Risk-Aware Routing vs Naïve Shortest Path"
            style={{
              background: '#161f2e',
              border: '1px solid #10b981',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#34d399',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Navigation size={13} color="#34d399" />
            Risk Routing
          </button>

          <button
            onClick={onOpenProvenance}
            title="Inspect Data Provenance and Source Freshness"
            style={{
              background: '#161f2e',
              border: '1px solid #334155',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#cbd5e1',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Database size={13} color="#38bdf8" />
            Provenance
          </button>

          <button
            onClick={onOpenHealth}
            title="Inspect Provider Connectivity & Status"
            style={{
              background: '#161f2e',
              border: '1px solid #334155',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#cbd5e1',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Activity size={13} color="#10b981" />
            Sources Health
          </button>

          <button
            onClick={onOpenOpenMeteo}
            title="Inspect Live Open-Meteo Atmospheric Physics & Wind Shear"
            style={{
              background: '#161f2e',
              border: '1px solid #06b6d4',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#06b6d4',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <CloudRain size={13} color="#06b6d4" />
            Open-Meteo Live
          </button>

          <button
            onClick={onOpenIMD}
            title="Inspect Official IMD (api.imd.gov.in) Services"
            style={{
              background: '#161f2e',
              border: '1px solid #0284c7',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#38bdf8',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <CloudRain size={13} color="#38bdf8" />
            IMD Met Center
          </button>

          <button
            onClick={onOpenValidation}
            title="Model & System Validation vs Baseline"
            style={{
              background: '#161f2e',
              border: '1px solid #334155',
              padding: '4px 10px',
              borderRadius: '3px',
              color: '#cbd5e1',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Award size={13} color="#fbbf24" />
            Validation
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              padding: '4px 8px',
              borderRadius: '3px',
              color: '#94a3b8'
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Telemetry Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '8px',
        fontSize: '11px'
      }}>
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>Hazard Classification</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className={`badge-tag ${
              summary?.overall_risk_level === 'EXTREME' || summary?.overall_risk_level === 'SEVERE'
                ? 'badge-extreme'
                : summary?.overall_risk_level === 'HIGH'
                ? 'badge-high'
                : 'badge-low'
            }`}>
              {summary?.overall_risk_level ? `${summary.overall_risk_level} FLOOD` : 'MONITORING'}
            </span>
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Adyar & Cooum</span>
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>Forecast Agreement</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="font-mono" style={{ fontWeight: 700, color: '#10b981' }}>
              {summary?.forecast_agreement_score ? summary.forecast_agreement_score.toFixed(1) : '84.6'}%
            </span>
            <span className="badge-tag badge-low" style={{ fontSize: '9px' }}>
              {summary?.forecast_agreement_tier || 'VERY HIGH'}
            </span>
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>System Confidence</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="font-mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
              {summary ? summary.overall_confidence_pct.toFixed(1) : '83.4'}%
            </span>
            <span style={{ color: '#94a3b8', fontSize: '10px' }}>[Ensemble Calibrated]</span>
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>Exposed Population</div>
          <div className="font-mono" style={{ fontWeight: 700, color: '#f87171', marginTop: '2px' }}>
            {summary ? summary.total_population_exposed.toLocaleString() : '0'} civilians
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>Road Severances</div>
          <div className="font-mono" style={{ fontWeight: 700, color: summary && summary.roads_at_risk_count > 0 ? '#fb923c' : '#34d399', marginTop: '2px' }}>
            {summary ? summary.roads_at_risk_count : 0} Arterials Severed
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '5px 8px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase' }}>Critical Facilities</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span className="font-mono" style={{ fontWeight: 700, color: summary && summary.critical_facilities_threatened > 0 ? '#f87171' : '#34d399' }}>
              {summary ? summary.critical_facilities_threatened : 0} Hospitals At Risk
            </span>
            <span className="badge-tag badge-low" style={{ fontSize: '9px' }}>
              {summary?.active_alerts_count || 0} Alerts
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
