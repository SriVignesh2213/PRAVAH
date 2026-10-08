import React from 'react';
import { GitBranch, AlertCircle, ArrowDown, ShieldAlert, Zap, HeartPulse, Truck } from 'lucide-react';
import { CascadeGraph } from '../types';

interface CascadingViewProps {
  cascade: CascadeGraph | null;
}

export const CascadingView: React.FC<CascadingViewProps> = ({ cascade }) => {
  if (!cascade) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'HAZARD': return <AlertCircle size={13} color="#ef4444" />;
      case 'ROAD': return <Truck size={13} color="#f43f5e" />;
      case 'FACILITY': return <HeartPulse size={13} color="#fbbf24" />;
      case 'POPULATION': return <ShieldAlert size={13} color="#f87171" />;
      default: return <GitBranch size={13} color="#38bdf8" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Summary Banner */}
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '4px',
        padding: '8px 10px',
        fontSize: '11px',
        color: '#cbd5e1',
        borderLeft: '3px solid #f59e0b'
      }}>
        <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px' }}>
          Cascading Infrastructure Impact Engine
        </div>
        <div>{cascade.propagation_summary}</div>
      </div>

      {/* Nodes & Edges Propagation Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {cascade.nodes.map((node, i) => {
          // Find outgoing edges from this node
          const outgoing = cascade.edges.filter(e => e.source === node.id);

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getNodeIcon(node.type)}
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>
                      {node.name}
                    </span>
                  </div>
                  <span className={`badge-tag ${node.status === 'CRITICAL' || node.status === 'IMPASSABLE' ? 'badge-extreme' : 'badge-high'}`} style={{ fontSize: '8px' }}>
                    {node.status}
                  </span>
                </div>

                <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.3' }}>
                  {node.description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '9px', color: '#64748b' }}>
                  <span>Type: {node.type}</span>
                  <span className="font-mono" style={{ color: '#f87171' }}>Threat Score: {node.risk_score.toFixed(0)}%</span>
                </div>
              </div>

              {/* Edge connectors */}
              {outgoing.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0', gap: '2px' }}>
                  {outgoing.map((edge, j) => (
                    <div key={j} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '9px',
                      color: '#38bdf8',
                      background: 'rgba(6, 182, 212, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '2px',
                      border: '1px dashed #0e7490'
                    }}>
                      <ArrowDown size={10} color="#06b6d4" />
                      <span><b>{edge.dependency_type}</b> ({edge.description})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
