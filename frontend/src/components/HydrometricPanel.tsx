import React from 'react';
import { Waves, Satellite, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { RiverObservation, SatelliteEvidence } from '../types';

interface HydrometricPanelProps {
  riverLevels: RiverObservation[];
  satelliteEvidence: SatelliteEvidence | null;
}

export const HydrometricPanel: React.FC<HydrometricPanelProps> = ({ riverLevels, satelliteEvidence }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Satellite SAR Panel */}
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '4px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Satellite size={14} color="#06b6d4" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Satellite Evidence (Copernicus Sentinel-1)
            </span>
          </div>
          <span className="badge-tag badge-cyan font-mono">C-Band SAR</span>
        </div>

        {satelliteEvidence && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Latest Observation:</span>
              <span className="font-mono" style={{ color: '#f8fafc' }}>{satelliteEvidence.acquisition_time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Cloud Limitation:</span>
              <span style={{ color: '#34d399' }}>{satelliteEvidence.cloud_limitation}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Flood-Change Signal:</span>
              <span className="badge-tag badge-extreme font-mono">{satelliteEvidence.flood_signal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Sensor Confidence:</span>
              <span className="font-mono" style={{ color: '#38bdf8' }}>{satelliteEvidence.confidence.toFixed(1)}%</span>
            </div>
            <div style={{ background: '#111827', padding: '6px', borderRadius: '2px', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.3' }}>
              {satelliteEvidence.summary}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '9px', marginTop: '2px' }}>
              <Info size={11} />
              <span>SAR provides empirical backscatter evidence; integrated with hydro-models to avoid false positives.</span>
            </div>
          </div>
        )}
      </div>

      {/* River Gauging Stations (India-WRIS / CWC) */}
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '4px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Waves size={14} color="#38bdf8" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              River Telemetry (India-WRIS / CWC)
            </span>
          </div>
          <span className="badge-tag badge-high font-mono">Live Stations</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {riverLevels.map(st => {
            const hasData = st.observation_status === 'LIVE' && st.current_level_m !== null;
            return (
              <div
                key={st.station_id}
                style={{
                  background: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '3px',
                  padding: '6px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#f8fafc' }}>
                    {st.station_name}
                  </span>
                  <span style={{
                    fontSize: '8px',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    background: hasData ? '#065f46' : '#27272a',
                    color: hasData ? '#6ee7b7' : '#a1a1aa'
                  }}>
                    {hasData ? st.trend : 'UNOBSERVED'}
                  </span>
                </div>

                {hasData ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', fontSize: '9px', marginTop: '2px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Current: </span>
                      <b className="font-mono" style={{ color: '#f87171' }}>{st.current_level_m}m</b>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Danger: </span>
                      <span className="font-mono" style={{ color: '#94a3b8' }}>{st.danger_level_m}m</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Discharge: </span>
                      <b className="font-mono" style={{ color: '#38bdf8' }}>{st.discharge_cusecs?.toLocaleString()} cusecs</b>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#f59e0b', fontSize: '9px', fontStyle: 'italic', marginTop: '2px' }}>
                    No recent observation available from source
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
