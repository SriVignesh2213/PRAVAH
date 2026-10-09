import React from 'react';
import { X, Navigation, AlertTriangle, ShieldCheck, ArrowRight, Clock, MapPin } from 'lucide-react';

interface RiskAwareRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routingData: any;
}

export const RiskAwareRoutingModal: React.FC<RiskAwareRoutingModalProps> = ({
  isOpen,
  onClose,
  routingData
}) => {
  if (!isOpen) return null;

  const data = routingData || {
    origin: { name: 'Guindy Command Depot (80.208, 13.012)' },
    destination: { name: 'Velachery Emergency Hospital (80.222, 12.965)' },
    fastest_route: {
      name: 'Direct Arterial (Velachery Main Road)',
      distance_km: 6.4,
      nominal_time_min: 14.0,
      flood_risk_pct: 88,
      road_failure_prob_pct: 82,
      effective_risk_adjusted_time_min: 78.5,
      status: 'IMPASSABLE / SUBMERGED',
      hazard_warning: '1.1m standing water at Velachery Lake overflow point. High risk of vehicle stranding.'
    },
    safest_route: {
      name: 'AEGIS Resilient Corridor (GST - Inner Ring Bypass)',
      distance_km: 9.2,
      nominal_time_min: 18.5,
      flood_risk_pct: 8,
      road_failure_prob_pct: 5,
      effective_risk_adjusted_time_min: 24.2,
      status: 'CLEAR & RESILIENT',
      hazard_warning: 'Elevated causeways remain free from inundation.'
    },
    effective_time_saved_min: 54.3,
    recommendation: 'Divert all emergency transports via Safest Resilient Route. Direct path will strand ambulances.'
  };

  const f = data.fastest_route || {};
  const s = data.safest_route || {};

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#0284c7', padding: '6px', borderRadius: '4px' }}>
              <Navigation size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#f8fafc', letterSpacing: '0.02em' }}>
                Risk-Aware Emergency Route Optimization
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Uncertainty-penalized pathfinding: Shortest Travel Time vs Inundation Survival Probability
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Corridor Waypoints */}
          <div style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: '4px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#38bdf8" />
              <span style={{ color: '#94a3b8' }}>Origin:</span>
              <strong style={{ color: '#f1f5f9' }}>{data.origin?.name || 'Guindy Command Depot'}</strong>
            </div>
            <ArrowRight size={14} color="#64748b" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#10b981" />
              <span style={{ color: '#94a3b8' }}>Destination:</span>
              <strong style={{ color: '#f1f5f9' }}>{data.destination?.name || 'Velachery Medical Camp'}</strong>
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* FASTEST ROUTE (Naïve) */}
            <div style={{
              background: '#131c2e',
              border: '1px solid #ef4444',
              borderRadius: '4px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '0.04em' }}>
                  NAÏVE FASTEST ROUTE (DIJKSTRA)
                </span>
                <span className="badge-tag badge-extreme" style={{ fontSize: '10px' }}>
                  HIGH STRANDING RISK
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                {f.name || 'Direct Arterial (Velachery Main Road)'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginTop: '4px' }}>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#64748b' }}>Nominal Time</div>
                  <div className="font-mono" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>
                    {f.nominal_time_min} min
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#64748b' }}>Distance</div>
                  <div className="font-mono" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>
                    {f.distance_km} km
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#f87171' }}>Flood Probability</div>
                  <div className="font-mono" style={{ color: '#f87171', fontWeight: 700, fontSize: '13px' }}>
                    {f.flood_risk_pct}%
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#fb923c' }}>Road Failure Prob</div>
                  <div className="font-mono" style={{ color: '#fb923c', fontWeight: 700, fontSize: '13px' }}>
                    {f.road_failure_prob_pct}%
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px',
                borderRadius: '3px',
                fontSize: '11px',
                color: '#fca5a5',
                display: 'flex',
                gap: '6px'
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{f.hazard_warning}</span>
              </div>
            </div>

            {/* SAFEST ROUTE (AEGIS Resilient) */}
            <div style={{
              background: '#131c2e',
              border: '1px solid #10b981',
              borderRadius: '4px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
                  AEGIS SAFEST RESILIENT ROUTE
                </span>
                <span className="badge-tag badge-low" style={{ fontSize: '10px' }}>
                  RECOMMENDED
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                {s.name || 'GST - Inner Ring Bypass'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginTop: '4px' }}>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#64748b' }}>Nominal Time</div>
                  <div className="font-mono" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>
                    {s.nominal_time_min} min
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#64748b' }}>Distance</div>
                  <div className="font-mono" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>
                    {s.distance_km} km
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#34d399' }}>Flood Probability</div>
                  <div className="font-mono" style={{ color: '#34d399', fontWeight: 700, fontSize: '13px' }}>
                    {s.flood_risk_pct}%
                  </div>
                </div>
                <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '3px' }}>
                  <div style={{ color: '#38bdf8' }}>Road Failure Prob</div>
                  <div className="font-mono" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>
                    {s.road_failure_prob_pct}%
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px',
                borderRadius: '3px',
                fontSize: '11px',
                color: '#6ee7b7',
                display: 'flex',
                gap: '6px'
              }}>
                <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{s.hazard_warning}</span>
              </div>
            </div>
          </div>

          {/* Mathematical Rationale & Decision Banner */}
          <div style={{
            background: '#161f2e',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
              <Clock size={14} />
              <span>DECISION INTELLIGENCE GAIN: {data.effective_time_saved_min || 54.3} MINUTES SAVED IN REALITY</span>
            </div>
            <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Standard GPS navigators minimize nominal travel time ({f.nominal_time_min} min vs {s.nominal_time_min} min) and send ambulances down Velachery Main Road.
              However, with an 88% flood probability and 1.1m standing water, vehicles encounter impassable gridlock, incurring a massive stranding penalty ({f.effective_risk_adjusted_time_min} effective min).
              AEGIS EARTH's resilient corridor costs an extra 4.5 nominal minutes but guarantees 95% passability on elevated causeways.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#0284c7',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
