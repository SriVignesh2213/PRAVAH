import React from 'react';
import { AlertCircle, ShieldAlert, Radio } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsFeedProps {
  alerts: AlertItem[];
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts }) => {
  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e293b',
      borderRadius: '4px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '260px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={14} color="#ef4444" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Official Alerts (NDMA SACHET)
          </span>
        </div>
        <span className="badge-tag badge-extreme font-mono">{alerts.length} Active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              background: '#0d131f',
              border: '1px solid #292524',
              borderLeft: '3px solid #dc2626',
              borderRadius: '2px',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fca5a5' }}>
                {alert.headline}
              </span>
              <span className="badge-tag badge-extreme" style={{ fontSize: '8px' }}>
                {alert.severity}
              </span>
            </div>

            <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: '1.3' }}>
              {alert.instruction}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', fontSize: '9px', color: '#64748b' }}>
              <span>Area: {alert.area_desc}</span>
              <span style={{ color: '#38bdf8' }}>Source: {alert.source_agency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
