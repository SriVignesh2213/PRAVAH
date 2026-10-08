import React from 'react';
import { X, Activity, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SystemHealth } from '../types';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: SystemHealth[];
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ isOpen, onClose, health }) => {
  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <span className="badge-tag badge-low font-mono">CONNECTED</span>;
      case 'USING_CACHE':
        return <span className="badge-tag badge-cyan font-mono">CACHED (FRESH)</span>;
      case 'DEGRADED':
        return <span className="badge-tag badge-severe font-mono">DEGRADED</span>;
      case 'NO_CREDENTIALS':
        return <span className="badge-tag badge-high font-mono">OPTIONAL / DEMO</span>;
      default:
        return <span className="badge-tag badge-high font-mono">STANDBY / DEMO</span>;
    }
  };

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
        width: '700px',
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
            <Activity size={16} color="#10b981" />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
              SOURCE HEALTH &amp; ADAPTER STATUS
            </span>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Real-time status of all external telemetry adapters. PRAVAH utilizes non-blocking graceful fallback with cached state to guarantee operational uptime.
        </div>

        {/* Health Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {health.map((h, i) => (
            <div
              key={i}
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'grid',
                gridTemplateColumns: '1.8fr 1fr 0.8fr 1.5fr',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px'
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>{h.name}</span>
              </div>

              <div>
                {getStatusBadge(h.status)}
              </div>

              <div className="font-mono" style={{ color: '#94a3b8', fontSize: '10px' }}>
                {h.latency_ms !== null ? `${h.latency_ms} ms` : 'Local'}
              </div>

              <div style={{ color: '#64748b', fontSize: '10px' }}>
                {h.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
