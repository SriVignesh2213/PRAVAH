import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Zap,
  Globe2,
  FileCheck,
  ShieldAlert,
  Compass,
  Layers,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { queryCopilot } from '../services/api';
import { CopilotQueryResponse } from '../types';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoMode: boolean;
}

interface MessageHistory {
  query: string;
  response: CopilotQueryResponse;
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    label: 'Velachery Evacuation Route',
    query: 'What is the safe evacuation route from Velachery avoiding inundated roads?'
  },
  {
    label: 'Ward 177 Time-to-Impact',
    query: 'What is the time-to-impact and predicted water rise for Ward 177 Velachery?'
  },
  {
    label: 'Shelter Status near Adyar',
    query: 'Show me nearest safe shelters and capacities around Adyar and Kotturpuram.'
  },
  {
    label: 'தமிழ் ஆலோசனை (Tamil Advisory)',
    query: 'வேளச்சேரி மற்றும் மடிப்பாக்கம் பகுதிக்கு அவசர பாதுகாப்பு வழி மற்றும் வெள்ள முன்னறிவிப்பு என்ன?'
  }
];

export const CopilotModal: React.FC<CopilotModalProps> = ({ isOpen, onClose, isDemoMode }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [activeLangTab, setActiveLangTab] = useState<'both' | 'en' | 'ta'>('both');

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputText).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    try {
      const res = await queryCopilot({
        query: q,
        use_demo_scenario: isDemoMode,
        language: 'en'
      });

      setHistory(prev => [
        {
          query: q,
          response: res,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      if (!queryToSend) setInputText('');
    } catch (err: any) {
      console.error('Failed to query Copilot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0d131f',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '960px',
        height: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#090e17'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                  AEGIS EARTH - ALERTNEST COPILOT
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isDemoMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: isDemoMode ? '#fbbf24' : '#38bdf8',
                  border: isDemoMode ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)'
                }}>
                  {isDemoMode ? 'SIMULATED BENCHMARK - CYCLONE MICHAUNG' : 'LIVE GROUNDED TELEMETRY'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Natural Language Disaster Decision Assistant • Multilingual (English &amp; தமிழ்) • Tool-Augmented Reasoning
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language filter pills */}
            <div style={{
              background: '#161f2e',
              border: '1px solid #334155',
              borderRadius: '4px',
              padding: '2px',
              display: 'flex',
              gap: '2px',
              fontSize: '11px'
            }}>
              <button
                onClick={() => setActiveLangTab('both')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: activeLangTab === 'both' ? '#0284c7' : 'transparent',
                  color: activeLangTab === 'both' ? '#ffffff' : '#94a3b8',
                  fontWeight: 600
                }}
              >
                Bilingual
              </button>
              <button
                onClick={() => setActiveLangTab('en')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: activeLangTab === 'en' ? '#0284c7' : 'transparent',
                  color: activeLangTab === 'en' ? '#ffffff' : '#94a3b8',
                  fontWeight: 600
                }}
              >
                English
              </button>
              <button
                onClick={() => setActiveLangTab('ta')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: activeLangTab === 'ta' ? '#0284c7' : 'transparent',
                  color: activeLangTab === 'ta' ? '#ffffff' : '#94a3b8',
                  fontWeight: 600
                }}
              >
                தமிழ் (Tamil)
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                color: '#94a3b8',
                background: '#161f2e',
                border: '1px solid #334155',
                borderRadius: '4px',
                padding: '6px',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{
          padding: '10px 20px',
          background: '#0b111a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Sparkles size={13} color="#38bdf8" /> Quick Queries:
          </span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset.query)}
              disabled={isLoading}
              style={{
                background: '#131d2e',
                border: '1px solid #22344d',
                borderRadius: '14px',
                padding: '4px 12px',
                fontSize: '11px',
                color: '#cbd5e1',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.color = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#22344d';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {history.length === 0 && (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              maxWidth: '520px',
              padding: '30px',
              color: '#64748b'
            }}>
              <div style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Bot size={32} color="#0ea5e9" />
              </div>
              <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                How can AEGIS EARTH - ALERTNEST Copilot assist you?
              </h3>
              <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#94a3b8' }}>
                Ask any question regarding localized flood risk, time-to-impact (TTI), safe evacuation corridors, shelter capacity, or multilingual advisories across Chennai wards.
              </p>
            </div>
          )}

          {history.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* User Question */}
              <div style={{
                alignSelf: 'flex-end',
                maxWidth: '75%',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px 8px 0px 8px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {item.query}
              </div>

              {/* Agent Response Card */}
              <div style={{
                alignSelf: 'flex-start',
                maxWidth: '95%',
                width: '100%',
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '8px 8px 8px 0px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
              }}>
                {/* Agent Tool Execution Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginRight: '4px' }}>
                    Agent Execution Trace:
                  </span>
                  {item.response.tools_invoked.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: '#38bdf8',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        borderRadius: '4px',
                        padding: '2px 7px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Zap size={10} color="#38bdf8" />
                      {tool}
                    </span>
                  ))}
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    color: '#64748b',
                    fontFamily: 'monospace'
                  }}>
                    {item.timestamp}
                  </span>
                </div>

                {/* English Content */}
                {(activeLangTab === 'both' || activeLangTab === 'en') && (
                  <div style={{
                    background: '#0d131f',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    padding: '12px 14px'
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#0ea5e9',
                      letterSpacing: '0.04em',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Globe2 size={12} /> OFFICIAL DISASTER BULLETIN (ENGLISH)
                    </div>
                    <div style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {item.response.answer}
                    </div>
                  </div>
                )}

                {/* Tamil Content */}
                {(activeLangTab === 'both' || activeLangTab === 'ta') && item.response.answer_tamil && (
                  <div style={{
                    background: '#0d131f',
                    border: '1px solid #1e3a47',
                    borderRadius: '6px',
                    padding: '12px 14px'
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#34d399',
                      letterSpacing: '0.04em',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Globe2 size={12} /> அதிகாரப்பூர்வ எச்சரிக்கை அறிக்கை (தமிழ்)
                    </div>
                    <div style={{ fontSize: '13px', color: '#ecfdf5', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {item.response.answer_tamil}
                    </div>
                  </div>
                )}

                {/* Evidence Sources & Suggested Actions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '4px',
                  paddingTop: '10px',
                  borderTop: '1px solid #1e293b'
                }}>
                  {/* Evidence Sources */}
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Grounded Evidence Feeds
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.response.evidence_sources.map((ev, eIdx) => (
                        <div key={eIdx} style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FileCheck size={12} color="#10b981" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Recommended Next Actions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.response.suggested_actions.map((act, aIdx) => (
                        <div key={aIdx} style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <ChevronRight size={12} color="#0ea5e9" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{
              alignSelf: 'flex-start',
              background: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#38bdf8'
            }}>
              <Loader2 size={16} className="animate-spin" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                AEGIS Agent fusing rainfall forecasts, hydrometric gauges, and computing safe evacuation routes...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '14px 20px',
          background: '#090e17',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ward risk, safe evacuation routes, time-to-impact, or Tamil advisories..."
            style={{
              flex: 1,
              background: '#131d2e',
              border: '1px solid #22344d',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#f8fafc',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            style={{
              background: '#0284c7',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 18px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputText.trim() ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={14} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};
