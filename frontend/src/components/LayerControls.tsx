import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

interface LayerControlsProps {
  layers: {
    floodRisk: boolean;
    vulnerability: boolean;
    roads: boolean;
    facilities: boolean;
    resilientRoute: boolean;
  };
  onToggleLayer: (layerKey: string) => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ layers, onToggleLayer }) => {
  const layerItems = [
    { key: 'floodRisk', label: 'Flood Risk Inundation', desc: 'Predicted spatial inundation envelope', color: '#ef4444' },
    { key: 'vulnerability', label: 'Vulnerability Index', desc: 'Density & demographic accessibility', color: '#f59e0b' },
    { key: 'roads', label: 'Road Status & Severances', desc: 'Impassable & at-risk arterials', color: '#f43f5e' },
    { key: 'facilities', label: 'Critical Infrastructure', desc: 'Hospitals, Shelters, Substations', color: '#10b981' },
    { key: 'resilientRoute', label: 'PRAVAH Resilient Bypass', desc: 'Risk-adjusted evacuation corridor', color: '#06b6d4' }
  ];

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e293b',
      borderRadius: '4px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
        <Layers size={14} color="#38bdf8" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Geospatial Layers
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {layerItems.map(item => {
          const active = (layers as any)[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '3px',
                background: active ? '#161f2e' : 'transparent',
                border: active ? '1px solid #334155' : '1px solid transparent',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: active ? '#f8fafc' : '#94a3b8' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {active ? <Eye size={13} color="#38bdf8" /> : <EyeOff size={13} color="#64748b" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
