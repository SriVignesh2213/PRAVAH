import React from 'react';
import { X, Award, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { ModelValidation } from '../types';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: ModelValidation | null;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose, validation }) => {
  if (!isOpen || !validation) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d131f',
        border: '1px solid #334155',
        borderRadius: '6px',
        width: '680px',
        maxWidth: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="#fbbf24" />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
              MODEL &amp; DECISION SYSTEM VALIDATION
            </span>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid #78350f',
          padding: '6px 10px',
          borderRadius: '3px',
          fontSize: '11px',
          color: '#fde68a'
        }}>
          <b>Evaluation Benchmark:</b> {validation.evaluation_type}
        </div>

        {/* Machine Learning Statistical Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
            Predictive Model Metrics
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '10px', borderRadius: '3px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Flood Precision</div>
              <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                {(validation.metrics.flood_classifier_precision * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '10px', borderRadius: '3px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Flood Recall</div>
              <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {(validation.metrics.flood_classifier_recall * 100).toFixed(1)}%
              </div>
            </div>

            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '10px', borderRadius: '3px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>F1-Score</div>
              <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#a78bfa', marginTop: '2px' }}>
                {(validation.metrics.f1_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Operational Decision Impact (Baseline vs PRAVAH) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
            Operational Decision-Support Performance (Baseline vs. PRAVAH)
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '10px', borderRadius: '3px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Response Time Reduction</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#34d399' }}>
                  {validation.operational_impact.pravah_avg_response_time_min} min
                </span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>vs {validation.operational_impact.baseline_avg_response_time_min} min baseline</span>
              </div>
              <span className="badge-tag badge-low" style={{ marginTop: '4px' }}>
                -{validation.operational_impact.response_time_improvement_pct}% Latency Drop
              </span>
            </div>

            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '10px', borderRadius: '3px' }}>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Population Evacuation Gain</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                <span className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
                  +{validation.operational_impact.population_protection_gain_pct}%
                </span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>Additional Coverage</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '4px' }}>
                Prevented {validation.operational_impact.prevented_vehicle_stranding_incidents} critical ambulance waterlogging incidents.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
