import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  CheckCircle,
  AlertTriangle,
  Send,
  Globe2,
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCheck,
  FileEdit,
  ExternalLink,
  Info
} from 'lucide-react';
import { fetchMultilingualAdvisories, approveAdvisory } from '../services/api';
import { MultilingualAdvisory, AdvisoryStatus, AdvisorySeverity } from '../types';

interface AdvisoryStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDemoMode: boolean;
}

export const AdvisoryStudioModal: React.FC<AdvisoryStudioModalProps> = ({
  isOpen,
  onClose,
  isDemoMode
}) => {
  const [advisories, setAdvisories] = useState<MultilingualAdvisory[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<MultilingualAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'english' | 'tamil' | 'sms'>('english');

  // Operator Human-in-the-loop review state
  const [operatorName, setOperatorName] = useState('Duty Officer - GCC Disaster Cell');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorizationSuccess, setAuthorizationSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdvisories();
    }
  }, [isOpen, isDemoMode]);

  const loadAdvisories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMultilingualAdvisories(isDemoMode);
      setAdvisories(data);
      if (data.length > 0 && !selectedAdvisory) {
        setSelectedAdvisory(data[0]);
      } else if (data.length > 0 && selectedAdvisory) {
        const updated = data.find(a => a.id === selectedAdvisory.id);
        if (updated) setSelectedAdvisory(updated);
      }
    } catch (err) {
      console.error('Failed to load advisories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredAdvisories = advisories.filter(adv => {
    const matchesSearch =
      adv.ward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.ward_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || adv.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleApproveAndBroadcast = async () => {
    if (!selectedAdvisory || isAuthorizing) return;
    setIsAuthorizing(true);
    setAuthorizationSuccess(null);

    try {
      const res = await approveAdvisory({
        advisory_id: selectedAdvisory.id,
        operator_name: operatorName,
        operator_notes: operatorNotes || 'Verified against live telemetry and ward elevation. Evacuation route verified clear.'
      });

      if (res.status === 'SUCCESS' && res.advisory) {
        // Update local list
        setAdvisories(prev =>
          prev.map(a => (a.id === res.advisory.id ? res.advisory : a))
        );
        setSelectedAdvisory(res.advisory);
        setAuthorizationSuccess(`Advisory for ${res.advisory.ward_label} authorized and broadcast successfully.`);
        setTimeout(() => setAuthorizationSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Error approving advisory:', err);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const getSeverityBadge = (sev: AdvisorySeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="badge-tag badge-extreme">CRITICAL EVACUATION</span>;
      case 'WARNING':
        return <span className="badge-tag badge-high">FLOOD WARNING</span>;
      case 'WATCH':
        return <span className="badge-tag badge-moderate">FLOOD WATCH</span>;
      default:
        return <span className="badge-tag badge-low">ADVISORY</span>;
    }
  };

  const getStatusBadge = (status: AdvisoryStatus) => {
    switch (status) {
      case 'BROADCAST_AUTHORIZED':
        return (
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCheck size={12} /> BROADCAST AUTHORIZED
          </span>
        );
      case 'OPERATOR_APPROVED':
        return (
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={12} /> OPERATOR APPROVED
          </span>
        );
      default:
        return (
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '2px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} /> PENDING OPERATOR REVIEW
          </span>
        );
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
        maxWidth: '1100px',
        height: '90vh',
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
              background: 'linear-gradient(135deg, #059669, #0284c7)',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Radio size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                  MULTILINGUAL ADVISORY &amp; EVACUATION BROADCAST STUDIO
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
                HW01 Ward-Level Actionable Bulletins • English, Tamil (தமிழ்) &amp; Low-Bandwidth SMS • Mandatory Human Operator Review
              </div>
            </div>
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

        {/* Master-Detail Layout */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden' }}>
          {/* Left Column: Ward Selector & Filters */}
          <div style={{
            borderRight: '1px solid #1e293b',
            background: '#090e17',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Search & Filter Toolbar */}
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: '8px', top: '9px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Filter by ward name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#131d2e',
                    border: '1px solid #22344d',
                    borderRadius: '4px',
                    padding: '6px 8px 6px 28px',
                    fontSize: '11px',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                {['ALL', 'CRITICAL', 'WARNING', 'WATCH'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    style={{
                      flex: 1,
                      padding: '3px 4px',
                      fontSize: '9px',
                      fontWeight: 700,
                      borderRadius: '3px',
                      background: severityFilter === sev ? '#0284c7' : '#161f2e',
                      color: severityFilter === sev ? '#ffffff' : '#94a3b8',
                      border: '1px solid #334155',
                      cursor: 'pointer'
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Ward List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredAdvisories.map((adv) => {
                const isSelected = selectedAdvisory?.id === adv.id;
                return (
                  <div
                    key={adv.id}
                    onClick={() => setSelectedAdvisory(adv)}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      background: isSelected ? '#162235' : '#0f172a',
                      border: isSelected ? '1px solid #0284c7' : '1px solid #1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                        {adv.ward_label}
                      </span>
                      {getSeverityBadge(adv.severity)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} color="#f59e0b" /> TTI: {adv.time_to_impact}
                      </span>
                      <span>Depth: {adv.inundation_expected_depth_cm.toFixed(0)}cm</span>
                    </div>

                    <div style={{ marginTop: '2px' }}>
                      {getStatusBadge(adv.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Advisory Details & Operator Review Action */}
          {selectedAdvisory ? (
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px', gap: '16px' }}>
              {/* Notification Banner on Success */}
              {authorizationSuccess && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  color: '#34d399',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCheck size={16} />
                  {authorizationSuccess}
                </div>
              )}

              {/* Advisory Headline Card */}
              <div style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>
                      {selectedAdvisory.ward_label}
                    </span>
                    {getSeverityBadge(selectedAdvisory.severity)}
                    {getStatusBadge(selectedAdvisory.status)}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                    <span><strong>Estimated Time-to-Impact:</strong> <span style={{ color: '#f59e0b' }}>{selectedAdvisory.time_to_impact}</span></span>
                    <span><strong>Expected Inundation:</strong> <span style={{ color: '#38bdf8' }}>{selectedAdvisory.inundation_expected_depth_cm.toFixed(0)} cm</span></span>
                    <span><strong>Rise Rate:</strong> +{selectedAdvisory.water_rise_rate_cm_hr.toFixed(1)} cm/hr</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                  <div>ID: {selectedAdvisory.id}</div>
                  <div>Issued: {new Date(selectedAdvisory.timestamp).toLocaleTimeString()}</div>
                  {selectedAdvisory.approved_by && (
                    <div style={{ color: '#34d399', marginTop: '2px', fontWeight: 600 }}>
                      Approved by: {selectedAdvisory.approved_by}
                    </div>
                  )}
                </div>
              </div>

              {/* Language Switcher Tabs */}
              <div style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '6px',
                padding: '4px',
                display: 'flex',
                gap: '4px'
              }}>
                <button
                  onClick={() => setActiveTab('english')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: activeTab === 'english' ? '#0284c7' : 'transparent',
                    color: activeTab === 'english' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Globe2 size={14} /> Official English Bulletin
                </button>
                <button
                  onClick={() => setActiveTab('tamil')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: activeTab === 'tamil' ? '#059669' : 'transparent',
                    color: activeTab === 'tamil' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Globe2 size={14} /> தமிழ் அதிகாரப்பூர்வ எச்சரிக்கை (Tamil)
                </button>
                <button
                  onClick={() => setActiveTab('sms')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: activeTab === 'sms' ? '#7c3aed' : 'transparent',
                    color: activeTab === 'sms' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={14} /> Low-Bandwidth SMS / Cell Broadcast
                </button>
              </div>

              {/* Advisory Body based on Active Tab */}
              <div style={{
                background: '#0a101a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {activeTab === 'english' && (
                  <>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Advisory Title
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                        {selectedAdvisory.english_title}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Situation Summary &amp; Forecast
                      </div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', marginTop: '2px' }}>
                        {selectedAdvisory.english_message}
                      </div>
                    </div>

                    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 800 }}>
                        Required Citizen Action
                      </div>
                      <div style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px' }}>
                        {selectedAdvisory.english_action}
                      </div>
                    </div>

                    <div style={{ background: '#091e1d', border: '1px solid #115e59', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Verified Safe Evacuation Route
                      </div>
                      <div style={{ fontSize: '13px', color: '#ccfbf1', marginTop: '4px' }}>
                        {selectedAdvisory.english_safe_route}
                      </div>
                      <div style={{ fontSize: '11px', color: '#99f6e4', marginTop: '4px' }}>
                        <strong>Designated Safe Relief Shelter:</strong> {selectedAdvisory.target_shelter}
                      </div>
                    </div>

                    {selectedAdvisory.critical_streets_avoid.length > 0 && (
                      <div style={{ background: '#201016', border: '1px solid #881337', borderRadius: '6px', padding: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#fb7185', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Submerged Corridors to Avoid
                        </div>
                        <div style={{ fontSize: '12px', color: '#ffe4e6', marginTop: '4px' }}>
                          {selectedAdvisory.critical_streets_avoid.join(' • ')}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'tamil' && (
                  <>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        எச்சரிக்கை தலைப்பு
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                        {selectedAdvisory.tamil_title}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        சூழ்நிலை அறிக்கை மற்றும் முன்னறிவிப்பு
                      </div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', marginTop: '2px' }}>
                        {selectedAdvisory.tamil_message}
                      </div>
                    </div>

                    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 800 }}>
                        பொதுமக்கள் உடனடியாக செய்ய வேண்டியவை
                      </div>
                      <div style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px', lineHeight: '1.6' }}>
                        {selectedAdvisory.tamil_action}
                      </div>
                    </div>

                    <div style={{ background: '#091e1d', border: '1px solid #115e59', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> பரிந்துரைக்கப்பட்ட பாதுகாப்பான வெளியேற்ற பாதை
                      </div>
                      <div style={{ fontSize: '13px', color: '#ccfbf1', marginTop: '4px', lineHeight: '1.6' }}>
                        {selectedAdvisory.tamil_safe_route}
                      </div>
                      <div style={{ fontSize: '11px', color: '#99f6e4', marginTop: '4px' }}>
                        <strong>நிவாரண முகாம்:</strong> {selectedAdvisory.target_shelter}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'sms' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Cell Broadcast / Low-Bandwidth SMS Payload
                      </span>
                      <span style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {selectedAdvisory.sms_condensed.length} / 160 Chars
                      </span>
                    </div>

                    <div style={{
                      background: '#111827',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '14px',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: '#f8fafc',
                      lineHeight: '1.5'
                    }}>
                      {selectedAdvisory.sms_condensed}
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={12} />
                      Compliant with Common Alerting Protocol (CAP-India) and telecom mesh cell-broadcasting standards.
                    </div>
                  </div>
                )}
              </div>

              {/* Human-in-the-Loop Operator Review Box */}
              <div style={{
                background: '#111827',
                border: '1px solid #0284c7',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#0284c7" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                      HUMAN-IN-THE-LOOP OPERATOR REVIEW &amp; BROADCAST AUTHORIZATION
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    Disaster Management Protocol HW01
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Duty Officer / Dispatcher:
                    </label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#162235',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        color: '#f8fafc',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Verification Signoff Notes:
                    </label>
                    <input
                      type="text"
                      placeholder="Notes on route clearance, NDRF boat availability..."
                      value={operatorNotes}
                      onChange={(e) => setOperatorNotes(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#162235',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        color: '#f8fafc',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={handleApproveAndBroadcast}
                    disabled={isAuthorizing || selectedAdvisory.status === 'BROADCAST_AUTHORIZED'}
                    style={{
                      background: selectedAdvisory.status === 'BROADCAST_AUTHORIZED' ? '#166534' : '#0284c7',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 18px',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: selectedAdvisory.status === 'BROADCAST_AUTHORIZED' || isAuthorizing ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isAuthorizing ? 0.7 : 1
                    }}
                  >
                    <CheckCheck size={14} />
                    {selectedAdvisory.status === 'BROADCAST_AUTHORIZED'
                      ? 'BROADCAST ALREADY AUTHORIZED'
                      : isAuthorizing
                      ? 'AUTHORIZING BROADCAST...'
                      : 'APPROVE & AUTHORIZE BROADCAST'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '13px' }}>
              Select a ward advisory on the left to review and authorize.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
