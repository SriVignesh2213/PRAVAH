import React from 'react';
import { Sliders, Play, AlertOctagon, RotateCcw, Anchor, Truck, Users } from 'lucide-react';

interface CounterfactualDockProps {
  rainfallMultiplier: number;
  onChangeRainfall: (val: number) => void;
  dischargeMultiplier: number;
  onChangeDischarge: (val: number) => void;
  closedRoads: string[];
  onToggleRoad: (roadId: string) => void;
  boats: number;
  onChangeBoats: (val: number) => void;
  ambulances: number;
  onChangeAmbulances: (val: number) => void;
  ndrfTeams: number;
  onChangeNdrfTeams: (val: number) => void;
  priority: string;
  onChangePriority: (val: string) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const CounterfactualDock: React.FC<CounterfactualDockProps> = ({
  rainfallMultiplier,
  onChangeRainfall,
  dischargeMultiplier,
  onChangeDischarge,
  closedRoads,
  onToggleRoad,
  boats,
  onChangeBoats,
  ambulances,
  onChangeAmbulances,
  ndrfTeams,
  onChangeNdrfTeams,
  priority,
  onChangePriority,
  onRunSimulation,
  onReset,
  isSimulating
}) => {
  const rainDeltaPct = Math.round((rainfallMultiplier - 1.0) * 100);

  return (
    <div style={{
      background: '#0d131f',
      borderTop: '1px solid #1e293b',
      padding: '10px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 25
    }}>
      {/* Title & Quick Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={14} color="#06b6d4" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
            WHAT-IF COUNTERFACTUAL SIMULATOR
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            Interactive scenario perturbation &amp; real-time recalculation
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onReset}
            style={{
              background: '#161f2e',
              border: '1px solid #334155',
              padding: '3px 8px',
              borderRadius: '3px',
              color: '#94a3b8',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={11} />
            Reset Baseline
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            style={{
              background: '#0284c7',
              border: '1px solid #38bdf8',
              color: '#f8fafc',
              fontSize: '11px',
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(2, 132, 199, 0.4)'
            }}
          >
            <Play size={13} fill="#f8fafc" />
            {isSimulating ? 'RECALCULATING...' : 'RUN COUNTERFACTUAL'}
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 1.5fr 1.5fr 1fr',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Rainfall Slider */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
            <span style={{ color: '#94a3b8' }}>Rainfall Anomaly:</span>
            <b className="font-mono" style={{ color: rainDeltaPct > 0 ? '#f87171' : '#34d399' }}>
              {rainDeltaPct > 0 ? `+${rainDeltaPct}%` : `${rainDeltaPct}%`}
            </b>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.05"
            value={rainfallMultiplier}
            onChange={(e) => onChangeRainfall(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#06b6d4' }}
          />
        </div>

        {/* River Discharge Slider */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px' }}>
            <span style={{ color: '#94a3b8' }}>River Surge Discharge:</span>
            <b className="font-mono" style={{ color: '#38bdf8' }}>{dischargeMultiplier.toFixed(2)}x</b>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.6"
            step="0.05"
            value={dischargeMultiplier}
            onChange={(e) => onChangeDischarge(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8' }}
          />
        </div>

        {/* Road Closures Toggles */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '3px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>
            Arterial Failure Overrides:
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'road-01', label: 'Velachery Rd' },
              { id: 'road-03', label: 'Mudichur Rd' },
              { id: 'road-02', label: 'GST Rd' }
            ].map(r => {
              const isClosed = closedRoads.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => onToggleRoad(r.id)}
                  style={{
                    padding: '2px 6px',
                    fontSize: '9px',
                    borderRadius: '2px',
                    background: isClosed ? '#7f1d1d' : '#1e293b',
                    color: isClosed ? '#fca5a5' : '#cbd5e1',
                    border: isClosed ? '1px solid #dc2626' : '1px solid #334155'
                  }}
                >
                  {r.label}: {isClosed ? 'CUT' : 'OPEN'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Resources */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '3px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>
            Emergency Resource Inventory:
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Anchor size={11} color="#06b6d4" />
              <span style={{ color: '#64748b' }}>Boats:</span>
              <b className="font-mono" style={{ color: '#f8fafc' }}>{boats}</b>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={11} color="#38bdf8" />
              <span style={{ color: '#64748b' }}>Ambulances:</span>
              <b className="font-mono" style={{ color: '#f8fafc' }}>{ambulances}</b>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={11} color="#fbbf24" />
              <span style={{ color: '#64748b' }}>NDRF:</span>
              <b className="font-mono" style={{ color: '#f8fafc' }}>{ndrfTeams}</b>
            </div>
          </div>
        </div>

        {/* Strategy Priority */}
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '3px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '2px' }}>
            Objective Priority:
          </div>
          <select
            value={priority}
            onChange={(e) => onChangePriority(e.target.value)}
            style={{
              background: '#0d131f',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: '10px',
              padding: '2px 4px',
              borderRadius: '2px',
              width: '100%'
            }}
          >
            <option value="BALANCED">Balanced Multi-Objective</option>
            <option value="VULNERABLE_FIRST">Protect Vulnerable Elders First</option>
            <option value="RAPID_RESPONSE">Minimize Ambulance Travel Time</option>
          </select>
        </div>
      </div>
    </div>
  );
};
