import React from 'react';
import { Target, CheckCircle, TrendingUp, Clock, Shield, ArrowRight } from 'lucide-react';
import { RecommendedAction, CounterfactualComparison } from '../types';

interface ActionOptimizerProps {
  recommendations: RecommendedAction[];
  comparisons: CounterfactualComparison[];
}

export const ActionOptimizer: React.FC<ActionOptimizerProps> = ({ recommendations, comparisons }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Before / After Comparison Card */}
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '4px',
        padding: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <TrendingUp size={14} color="#38bdf8" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Current Standard Plan vs. AEGIS EARTH Optimized Plan
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {comparisons.map((c, i) => (
            <div
              key={i}
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                padding: '6px 8px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px'
              }}
            >
              <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{c.metric}</div>
              <div style={{ color: '#94a3b8' }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>BASELINE</span>
                {c.baseline_value}
              </div>
              <div style={{ color: '#38bdf8', fontWeight: 700 }}>
                <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>AEGIS EARTH</span>
                {c.aegis_value || c.pravah_value}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge-tag badge-low">{c.improvement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Recommended Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Optimal Interventions (Ranked by RAS)
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Google OR-Tools Solved</span>
        </div>

        {recommendations.map(action => (
          <div
            key={action.id}
            style={{
              background: '#111827',
              border: '1px solid #1e293b',
              borderLeft: action.rank === 1 ? '3px solid #06b6d4' : '3px solid #334155',
              borderRadius: '3px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: action.rank === 1 ? '#0e7490' : '#1e293b',
                  color: '#f8fafc',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '2px'
                }}>
                  RANK #{action.rank}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>
                  {action.title}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: '10px', fontWeight: 700, color: '#38bdf8' }}>
                RAS: {action.ras_score.toFixed(1)}
              </div>
            </div>

            {/* Impact Metric Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', fontSize: '9px' }}>
              <div style={{ background: '#0d131f', padding: '4px', borderRadius: '2px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b' }}>Protected</div>
                <div className="font-mono" style={{ color: '#34d399', fontWeight: 700 }}>
                  +{action.expected_people_protected.toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '4px', borderRadius: '2px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b' }}>Time Delta</div>
                <div className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
                  -{action.response_time_improvement_min.toFixed(1)}m
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '4px', borderRadius: '2px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b' }}>Cost (Est)</div>
                <div className="font-mono" style={{ color: '#fbbf24', fontWeight: 700 }}>
                  ₹{action.operational_cost_inr.toLocaleString()}
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '4px', borderRadius: '2px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b' }}>Confidence</div>
                <div className="font-mono" style={{ color: '#a78bfa', fontWeight: 700 }}>
                  {action.confidence.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Why justification list */}
            <div style={{ background: '#0d131f', padding: '6px 8px', borderRadius: '2px', fontSize: '10px', color: '#cbd5e1' }}>
              <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '9px', marginBottom: '3px', textTransform: 'uppercase' }}>
                Decision Justification &amp; Rationale:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {action.detailed_why.map((w, idx) => (
                  <div key={idx} style={{ lineHeight: '1.3' }}>{w}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
