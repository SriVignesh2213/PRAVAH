import React from 'react';
import { History, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface TimelineControllerProps {
  currentStep: string;
  onSelectStep: (step: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentStep,
  onSelectStep,
  isPlaying,
  onTogglePlay
}) => {
  const steps = ['T-6h', 'T-4h', 'T-2h', 'T-1h', 'T0', 'T+1h', 'T+2h'];

  const handlePrev = () => {
    const idx = steps.indexOf(currentStep);
    if (idx > 0) onSelectStep(steps[idx - 1]);
  };

  const handleNext = () => {
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) onSelectStep(steps[idx + 1]);
  };

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <History size={14} color="#f59e0b" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Event Replay & Forecast
          </span>
        </div>
        <span className="badge-tag badge-cyan font-mono">{currentStep}</span>
      </div>

      {/* Stepper Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {steps.map(step => {
          const isSelected = step === currentStep;
          return (
            <button
              key={step}
              onClick={() => onSelectStep(step)}
              style={{
                padding: '4px 0',
                fontSize: '10px',
                fontWeight: isSelected ? 700 : 500,
                borderRadius: '2px',
                background: isSelected ? '#1e293b' : 'transparent',
                color: isSelected ? '#38bdf8' : '#64748b',
                border: isSelected ? '1px solid #38bdf8' : '1px solid transparent'
              }}
            >
              {step}
            </button>
          );
        })}
      </div>

      {/* Transport Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '2px' }}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 'T-6h'}
          style={{ color: currentStep === 'T-6h' ? '#334155' : '#94a3b8' }}
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={onTogglePlay}
          style={{
            background: '#161f2e',
            border: '1px solid #334155',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc'
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 'T+2h'}
          style={{ color: currentStep === 'T+2h' ? '#334155' : '#94a3b8' }}
        >
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
};
