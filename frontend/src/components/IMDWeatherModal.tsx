import React from 'react';
import { X, CloudRain, Wind, Thermometer, Compass, Sun, Moon, AlertOctagon, Waves, ShieldAlert } from 'lucide-react';
import {
  IMDCityForecast,
  IMDCurrentWeather,
  IMDDistrictNowcast,
  IMDDistrictWarning,
  IMDAWSStation,
  IMDRiverBasinQPF,
  IMDCycloneSuite
} from '../types';

interface IMDWeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  forecast: IMDCityForecast | null;
  currentWx: IMDCurrentWeather | null;
  nowcast: IMDDistrictNowcast | null;
  warnings: IMDDistrictWarning | null;
  awsStations: IMDAWSStation[];
  basinQpf: IMDRiverBasinQPF[];
  cyclone: IMDCycloneSuite | null;
}

export const IMDWeatherModal: React.FC<IMDWeatherModalProps> = ({
  isOpen,
  onClose,
  forecast,
  currentWx,
  nowcast,
  warnings,
  awsStations,
  basinQpf,
  cyclone
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '16px'
    }}>
      <div style={{
        background: '#0d131f',
        border: '1px solid #334155',
        borderRadius: '6px',
        width: '920px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.85)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#1e293b', padding: '6px', borderRadius: '4px', border: '1px solid #334155' }}>
              <CloudRain size={18} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                INDIA METEOROLOGICAL DEPARTMENT (IMD) — OFFICIAL SERVICES
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Official National Endpoint: <span style={{ color: '#38bdf8' }}>https://api.imd.gov.in/api/v1</span> · Regional Met Centre (RMC) Chennai
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* 1. Live Nowcast Banner (Cat 1-19) */}
        {nowcast && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.12)',
            border: `1px solid ${nowcast.color_hex}`,
            borderLeft: `4px solid ${nowcast.color_hex}`,
            borderRadius: '4px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={15} color={nowcast.color_hex} />
                <span style={{ fontWeight: 800, color: '#fca5a5', fontSize: '12px', textTransform: 'uppercase' }}>
                  {nowcast.severity_level} (IMD District Nowcast)
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '10px', color: '#cbd5e1' }}>
                Issued: {nowcast.time_of_issue_ist} IST · Valid Upto: {nowcast.valid_upto_ist} IST
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#f8fafc', fontWeight: 600 }}>
              {nowcast.message}
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>
              Code: Cat{nowcast.warning_code} ({nowcast.warning_desc}) · Color Code: {nowcast.color_code}
            </div>
          </div>
        )}

        {/* 2. Current Weather Observation (current_wx) */}
        {currentWx && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '4px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>
                Current Weather Telemetry (API /current_wx · {currentWx.station_name})
              </span>
              <span className="badge-tag badge-cyan font-mono">{currentWx.date_of_observation} {currentWx.time_of_observation_utc} UTC</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Temperature</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {currentWx.temperature_c.toFixed(1)}°C
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>24h Rainfall</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                  {currentWx.last_24_hrs_rainfall_mm.toFixed(1)} mm
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Pressure (MSLP)</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {currentWx.mslp_hpa.toFixed(1)} hPa
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Wind (Direction/Speed)</div>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                  {currentWx.wind_direction_desc} @ {currentWx.wind_speed_kmph} km/h
                </div>
              </div>

              <div style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Relative Humidity</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                  {currentWx.humidity_pct.toFixed(0)}%
                </div>
              </div>
            </div>

            <div style={{ marginTop: '8px', fontSize: '10px', color: '#cbd5e1', background: '#0d131f', padding: '6px 10px', borderRadius: '2px' }}>
              <b>Weather Code {currentWx.weather_code}:</b> {currentWx.weather_desc} · Nebulosity: {currentWx.nebulosity_oktas}/8 oktas
            </div>
          </div>
        )}

        {/* 3. 7-Day City Weather Forecast (cityforecastloc) */}
        {forecast && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '4px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>
                7-Day City Weather Forecast (API /cityforecastloc · Lat: {forecast.latitude}, Lon: {forecast.longitude})
              </span>
              <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: '#94a3b8' }}>
                <span>Sunrise: {forecast.sunrise_time}</span>
                <span>Sunset: {forecast.sunset_time}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {forecast.seven_day_forecast.map(day => (
                <div
                  key={day.day}
                  style={{
                    background: '#0d131f',
                    border: '1px solid #1e293b',
                    borderRadius: '3px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '10px'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>Day {day.day}</div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '11px' }}>
                    {day.max_temp_c ? `${day.max_temp_c}°C` : '--'}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '9px' }}>
                    Min: {day.min_temp_c ? `${day.min_temp_c}°C` : '--'}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '9px', lineHeight: '1.2', marginTop: '2px' }}>
                    {day.forecast}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. River Basin QPF & AWS Stations Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '10px' }}>
          {/* River Basin QPF */}
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: '8px' }}>
              River Basin QPF (API /basinqpf · Chennai FMO)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {basinQpf.map(b => (
                <div key={b.obj_id} style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b', fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#38bdf8' }}>
                    <span>{b.basin}</span>
                    <span>AAP: {b.average_areal_precipitation_mm} mm</span>
                  </div>
                  <div style={{ color: '#94a3b8', margin: '2px 0' }}>Sub-basin: {b.sub_basin} (Area: {b.area_sqkm} km²)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', color: '#cbd5e1', fontSize: '9px', marginTop: '4px' }}>
                    <div>D1: <b>{b.day1_qpf_mm}</b></div>
                    <div>D2: <b>{b.day2_qpf_mm}</b></div>
                    <div>D3: <b>{b.day3_qpf_mm}</b></div>
                    <div>D4: <b>{b.day4_qpf_mm}</b></div>
                    <div>D5: <b>{b.day5_qpf_mm}</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tamil Nadu AWS Stations */}
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '4px', padding: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: '8px' }}>
              Tamil Nadu AWS/ARG Network (API /aws_data?sid=25)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {awsStations.map(st => (
                <div key={st.id} style={{ background: '#0d131f', padding: '8px', borderRadius: '3px', border: '1px solid #1e293b', fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f8fafc' }}>
                    <span>{st.station_name}</span>
                    <span className="font-mono" style={{ color: '#34d399' }}>{st.temp_c}°C</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '9px', marginTop: '3px' }}>
                    <span>RH: {st.humidity_pct}%</span>
                    <span>Wind: {st.wind_speed_kmph} km/h</span>
                    <span>MSLP: {st.mslp_hpa} hPa</span>
                    <span>Feels Like: {st.feels_like_c}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Cyclone Track & Cone of Uncertainty (cyclone_track & cyclone_cou) */}
        {cyclone && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '4px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>
                Cyclone Tracking &amp; Cone of Uncertainty (API /cyclone_track · /cyclone_cou)
              </span>
              <span className="badge-tag badge-severe font-mono">{cyclone.track.cyclone_name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '10px' }}>
              {[...cyclone.track.observed, ...cyclone.track.forecast].map((p, idx) => (
                <div key={idx} style={{ background: '#0d131f', padding: '6px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 700 }}>{p.date_time}</div>
                  <div style={{ color: '#cbd5e1' }}>Lat: {p.lat}°N, Lon: {p.lon}°E</div>
                  <div style={{ color: '#fca5a5', fontWeight: 600 }}>{p.msw_kmph} km/h</div>
                  <div style={{ color: '#94a3b8', fontSize: '8px' }}>{p.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
