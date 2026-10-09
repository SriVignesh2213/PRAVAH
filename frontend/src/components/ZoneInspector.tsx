import React from 'react';
import { X, AlertTriangle, ShieldCheck, MapPin, Users, Building, HelpCircle } from 'lucide-react';
import { ChennaiZone, Facility } from '../types';

interface ZoneInspectorProps {
  zone: ChennaiZone | null;
  onClose: () => void;
  facilities: Facility[];
}

export const ZoneInspector: React.FC<ZoneInspectorProps> = ({ zone, onClose, facilities }) => {
  if (!zone) return null;

  const zoneFacilities = facilities.filter(f => f.zone_id === zone.id);

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      width: '320px',
      maxHeight: 'calc(100% - 32px)',
      overflowY: 'auto',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid #334155',
      borderRadius: '4px',
      padding: '12px',
      zIndex: 20,
      backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* Title & Close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={14} color="#38bdf8" />
            {zone.name}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
            {zone.ward_label || `Ward ${zone.ward_number}`} | Elevation: {zone.elevation_m.toFixed(1)}m MSL
          </div>
        </div>
        <button onClick={onClose} style={{ color: '#94a3b8', padding: '2px' }}>
          <X size={15} />
        </button>
      </div>

      {/* Flood Risk & Confidence Matrix */}
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
      }}>
        <div>
          <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase' }}>Flood Risk Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
            <span className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: zone.flood_risk_score > 70 ? '#f87171' : '#facc15' }}>
              {zone.flood_risk_score.toFixed(1)}
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>/ 100</span>
          </div>
          <span className={`badge-tag ${zone.flood_risk_score > 75 ? 'badge-extreme' : 'badge-high'}`} style={{ marginTop: '4px' }}>
            {zone.risk_class}
          </span>
        </div>

        <div>
          <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase' }}>Prediction Confidence</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
            <span className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
              {zone.confidence.toFixed(1)}%
            </span>
          </div>
          <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>
            Interval: [{zone.confidence_interval[0].toFixed(0)}% – {zone.confidence_interval[1].toFixed(0)}%]
          </div>
        </div>
      </div>

      {/* Demographics & Impact */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px' }}>Population Exposed</div>
          <div className="font-mono" style={{ fontWeight: 700, color: '#f8fafc', fontSize: '12px' }}>
            {zone.population.toLocaleString()}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '9px' }}>
            {zone.population_density_per_sqkm.toLocaleString()} / km²
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px', borderRadius: '3px' }}>
          <div style={{ color: '#64748b', fontSize: '9px' }}>Vulnerability Score</div>
          <div className="font-mono" style={{ fontWeight: 700, color: '#fb923c', fontSize: '12px' }}>
            {zone.vulnerability_score.toFixed(1)} / 100
          </div>
          <div style={{ color: '#94a3b8', fontSize: '9px' }}>Composite Index</div>
        </div>
      </div>

      {/* HW01 Hyperlocal Flood Early-Warning Metrics */}
      <div style={{
        background: '#0a1628',
        border: '1px solid #0284c7',
        borderRadius: '3px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
            HYPERLOCAL TIME-TO-IMPACT & INUNDATION
          </span>
          <span style={{
            fontSize: '9px',
            background: '#0369a1',
            color: '#e0f2fe',
            padding: '1px 5px',
            borderRadius: '2px',
            fontWeight: 700
          }}>
            HW01 COPILOT
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div style={{ background: '#0f172a', padding: '5px', borderRadius: '3px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Est. Time-to-Impact (TTI)</div>
            <div className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
              {zone.time_to_impact_hours ? `${zone.time_to_impact_hours.toFixed(1)} hrs` : 'N/A'}
            </div>
            {zone.time_to_impact_range_hours && (
              <div style={{ fontSize: '8px', color: '#64748b' }}>
                Range: [{zone.time_to_impact_range_hours[0]}h – {zone.time_to_impact_range_hours[1]}h]
              </div>
            )}
          </div>

          <div style={{ background: '#0f172a', padding: '5px', borderRadius: '3px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Peak Water Depth</div>
            <div className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: (zone.inundation_depth_cm || 0) > 60 ? '#f87171' : '#38bdf8', marginTop: '2px' }}>
              {zone.inundation_depth_cm ? `${zone.inundation_depth_cm.toFixed(0)} cm` : '0 cm'}
            </div>
            <div style={{ fontSize: '8px', color: '#64748b' }}>
              Rise rate: +{(zone.water_rise_rate_cm_hr || 0).toFixed(1)} cm/hr
            </div>
          </div>
        </div>

        {zone.nearest_shelter_name && (
          <div style={{ background: '#0f172a', padding: '5px 8px', borderRadius: '3px', border: '1px solid #1e293b', fontSize: '9px' }}>
            <span style={{ color: '#64748b' }}>Designated Safe Shelter: </span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{zone.nearest_shelter_name}</span>
            {zone.nearest_shelter_capacity && (
              <span style={{ color: '#94a3b8' }}> ({zone.nearest_shelter_capacity} cap.)</span>
            )}
          </div>
        )}

        {zone.critical_streets && zone.critical_streets.length > 0 && (
          <div style={{ fontSize: '9px' }}>
            <span style={{ color: '#f87171', fontWeight: 600 }}>At-Risk Streets to Avoid: </span>
            <span style={{ color: '#cbd5e1' }}>{zone.critical_streets.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Feature Contributions (SHAP-aligned explainability) */}
      <div style={{ background: '#0d131f', border: '1px solid #1e293b', padding: '8px', borderRadius: '3px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' }}>
          Model Feature Attribution (SHAP)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries(zone.feature_contributions || {}).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
              <span style={{ color: '#94a3b8' }}>{key.replace(/_/g, ' ')}</span>
              <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 600 }}>+{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty Breakdown: Evidence & Contradictions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
          Evidence &amp; Uncertainty Factors
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '10px' }}>
          {zone.supporting_evidence?.map((ev, i) => (
            <div key={i} style={{ color: '#34d399', lineHeight: '1.2' }}>{ev}</div>
          ))}
          {zone.contradictions?.map((con, i) => (
            <div key={i} style={{ color: '#f87171', lineHeight: '1.2' }}>{con}</div>
          ))}
        </div>
      </div>

      {/* Critical Facilities in Zone */}
      {zoneFacilities.length > 0 && (
        <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '6px', borderRadius: '3px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px', textTransform: 'uppercase' }}>
            Critical Facilities in Zone ({zoneFacilities.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {zoneFacilities.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span style={{ color: '#e2e8f0' }}>{f.name}</span>
                <span style={{ color: f.status === 'OPERATIONAL' ? '#34d399' : '#f87171', fontWeight: 600 }}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
