import httpx
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from app.integrations.base import BaseDataProvider
from app.core.config import settings
from app.core.logging import logger

class OpenMeteoProvider(BaseDataProvider):
    """
    Open-Meteo High-Resolution Atmospheric & Hydrological Engine.
    Leverages Open-Meteo's open parameters for Chennai Basin (13.06°N, 80.269968°E):
    - Multi-altitude vertical wind shear (10m, 80m, 120m, 180m)
    - Liquid precipitation breakdown: Total Precipitation vs Stratiform Rain vs Convective Showers
    - Atmospheric saturation: Dew Point, Apparent Temp, Relative Humidity
    - Barometric depression & cyclonic inflow tracking (MSLP & Surface Pressure)
    - 7-day hourly forecasts (168 hours)
    """
    def __init__(self):
        super().__init__(name="Open-Meteo Atmospheric Engine")
        self.base_url = settings.OPEN_METEO_BASE_URL
        self.lat = 13.06
        self.lon = 80.269968

    def has_credentials(self) -> bool:
        return True # Open-Meteo is open-access and free

    async def fetch_live(self) -> Dict[str, Any]:
        """Fetch comprehensive Open-Meteo parameters for Chennai Basin"""
        hourly_vars = [
            "temperature_2m",
            "relative_humidity_2m",
            "dew_point_2m",
            "apparent_temperature",
            "rain",
            "precipitation",
            "precipitation_probability",
            "showers",
            "wind_speed_10m",
            "wind_speed_80m",
            "wind_speed_120m",
            "wind_speed_180m",
            "wind_direction_10m",
            "wind_direction_80m",
            "wind_direction_120m",
            "wind_direction_180m",
            "pressure_msl",
            "surface_pressure"
        ]
        current_vars = [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "showers",
            "wind_speed_10m",
            "wind_direction_10m",
            "surface_pressure",
            "pressure_msl"
        ]

        params = {
            "latitude": self.lat,
            "longitude": self.lon,
            "hourly": ",".join(hourly_vars),
            "current": ",".join(current_vars),
            "forecast_days": 7,
            "timezone": "Asia/Kolkata"
        }
        url = f"{self.base_url}/v1/forecast"
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            return self._normalize(data)

    def _normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize and derive advanced meteorological diagnostics"""
        current = raw.get("current", {})
        hourly = raw.get("hourly", {})
        times: List[str] = hourly.get("time", [])

        # Time series extracts
        precip_series = hourly.get("precipitation", [])
        rain_series = hourly.get("rain", [])
        showers_series = hourly.get("showers", [])
        prob_series = hourly.get("precipitation_probability", [])
        temp_series = hourly.get("temperature_2m", [])
        dew_series = hourly.get("dew_point_2m", [])
        app_temp_series = hourly.get("apparent_temperature", [])
        w10_series = hourly.get("wind_speed_10m", [])
        w80_series = hourly.get("wind_speed_80m", [])
        w120_series = hourly.get("wind_speed_120m", [])
        w180_series = hourly.get("wind_speed_180m", [])
        d10_series = hourly.get("wind_direction_10m", [])
        d80_series = hourly.get("wind_direction_80m", [])
        d180_series = hourly.get("wind_direction_180m", [])
        mslp_series = hourly.get("pressure_msl", [])
        surf_p_series = hourly.get("surface_pressure", [])

        # 24-hour metrics
        h24_len = min(24, len(times))
        total_precip_24h = round(sum(precip_series[:h24_len]), 1) if precip_series else 0.0
        total_rain_24h = round(sum(rain_series[:h24_len]), 1) if rain_series else 0.0
        total_showers_24h = round(sum(showers_series[:h24_len]), 1) if showers_series else 0.0
        max_prob_24h = max(prob_series[:h24_len]) if prob_series else 0
        peak_intensity_mm_hr = max(precip_series[:h24_len]) if precip_series else 0.0

        # Current conditions
        curr_temp = current.get("temperature_2m", 28.5)
        curr_humidity = current.get("relative_humidity_2m", 86)
        curr_app_temp = current.get("apparent_temperature", 32.8)
        curr_precip = current.get("precipitation", 0.0)
        curr_rain = current.get("rain", 0.0)
        curr_showers = current.get("showers", 0.0)
        curr_w10 = current.get("wind_speed_10m", 18.5)
        curr_d10 = current.get("wind_direction_10m", 65)
        curr_mslp = current.get("pressure_msl", 1008.2)
        curr_surf_p = current.get("surface_pressure", 1006.5)

        # Multi-altitude wind shear at current / index 0
        w80_val = w80_series[0] if w80_series else curr_w10 * 1.3
        w120_val = w120_series[0] if w120_series else curr_w10 * 1.45
        w180_val = w180_series[0] if w180_series else curr_w10 * 1.6
        wind_shear_180_10 = round(w180_val - curr_w10, 1)

        # Dew point depression (T - Td)
        curr_dew = dew_series[0] if dew_series else curr_temp - 2.5
        dew_point_depression = round(curr_temp - curr_dew, 1)

        # Barometric depression evaluation
        min_mslp_48h = min(mslp_series[:48]) if mslp_series else curr_mslp
        if min_mslp_48h < 998.0:
            baro_status = "DEEP_CYCLONIC_DEPRESSION"
        elif min_mslp_48h < 1004.0:
            baro_status = "ACTIVE_LOW_PRESSURE_AREA"
        elif min_mslp_48h < 1010.0:
            baro_status = "MONSOON_TROUGH_INFLOW"
        else:
            baro_status = "NORMAL_ANTICYCLONIC"

        # Convective flash-flood surge index
        # High showers + low dew point depression + vertical wind shear = severe cloudburst trigger
        convective_index = min(100.0, (total_showers_24h / 80.0) * 45.0 + ((100.0 - dew_point_depression * 10) * 0.35) + (wind_shear_180_10 * 1.2))
        convective_index = round(max(10.0, convective_index), 1)

        # Build clean hourly 24h preview table
        hourly_preview = []
        for i in range(h24_len):
            hourly_preview.append({
                "time": times[i].split("T")[-1] if "T" in times[i] else times[i],
                "precipitation_mm": precip_series[i] if i < len(precip_series) else 0.0,
                "rain_mm": rain_series[i] if i < len(rain_series) else 0.0,
                "showers_mm": showers_series[i] if i < len(showers_series) else 0.0,
                "probability_pct": prob_series[i] if i < len(prob_series) else 0,
                "temp_c": temp_series[i] if i < len(temp_series) else curr_temp,
                "wind_10m_kmh": w10_series[i] if i < len(w10_series) else curr_w10,
                "wind_180m_kmh": w180_series[i] if i < len(w180_series) else w180_val,
                "mslp_hpa": mslp_series[i] if i < len(mslp_series) else curr_mslp
            })

        # 7-day daily summaries
        daily_summaries = []
        for day in range(7):
            start_idx = day * 24
            end_idx = min(start_idx + 24, len(times))
            if start_idx < len(times):
                day_precip = sum(precip_series[start_idx:end_idx]) if precip_series else 0.0
                day_showers = sum(showers_series[start_idx:end_idx]) if showers_series else 0.0
                day_max_p = max(prob_series[start_idx:end_idx]) if prob_series else 0
                day_max_temp = max(temp_series[start_idx:end_idx]) if temp_series else curr_temp
                day_min_temp = min(temp_series[start_idx:end_idx]) if temp_series else curr_temp - 4.0
                day_date = times[start_idx].split("T")[0]
                daily_summaries.append({
                    "date": day_date,
                    "day_label": f"Day {day + 1}",
                    "total_precipitation_mm": round(day_precip, 1),
                    "convective_showers_mm": round(day_showers, 1),
                    "max_rain_probability_pct": day_max_p,
                    "max_temp_c": round(day_max_temp, 1),
                    "min_temp_c": round(day_min_temp, 1)
                })

        return {
            "source": "Open-Meteo High-Resolution NWP",
            "provider_url": "https://api.open-meteo.com/v1/forecast",
            "timestamp": current.get("time", datetime.now(timezone.utc).isoformat()),
            "coordinates": {
                "latitude": self.lat,
                "longitude": self.lon,
                "basin": "Chennai Urban Catchment (GCC)"
            },
            "current_conditions": {
                "temperature_c": curr_temp,
                "apparent_temperature_c": curr_app_temp,
                "relative_humidity_pct": curr_humidity,
                "dew_point_c": curr_dew,
                "dew_point_depression_c": dew_point_depression,
                "precipitation_mm": curr_precip,
                "stratiform_rain_mm": curr_rain,
                "convective_showers_mm": curr_showers,
                "surface_pressure_hpa": curr_surf_p,
                "pressure_msl_hpa": curr_mslp,
                "wind_10m": {
                    "speed_kmh": curr_w10,
                    "direction_deg": curr_d10
                }
            },
            "vertical_wind_shear": {
                "altitude_10m_kmh": curr_w10,
                "altitude_80m_kmh": round(w80_val, 1),
                "altitude_120m_kmh": round(w120_val, 1),
                "altitude_180m_kmh": round(w180_val, 1),
                "shear_delta_180_10_kmh": wind_shear_180_10,
                "shear_characterization": "STRONG_MONSOON_INFLOW" if wind_shear_180_10 > 15.0 else "MODERATE_BOUNDARY_LAYER_SHEAR"
            },
            "barometric_diagnostics": {
                "current_mslp_hpa": curr_mslp,
                "min_forecast_mslp_hpa": round(min_mslp_48h, 1),
                "pressure_state": baro_status,
                "low_pressure_signature": min_mslp_48h < 1005.0
            },
            "rainfall_forecast_24h": {
                "total_precipitation_mm": total_precip_24h,
                "stratiform_rain_mm": total_rain_24h,
                "convective_showers_mm": total_showers_24h,
                "peak_hourly_intensity_mm_hr": round(peak_intensity_mm_hr, 1),
                "max_probability_pct": max_prob_24h,
                "convective_cloudburst_risk_index": convective_index
            },
            "hourly_24h_series": hourly_preview,
            "daily_7d_forecast": daily_summaries,
            "is_live_stream": True
        }

    def get_fallback_data(self) -> Dict[str, Any]:
        """Grounded Chennai Extreme Monsoon Fallback (Michaung / Nov 2015 baseline)"""
        now = datetime.now(timezone.utc).isoformat()
        return {
            "source": "Open-Meteo High-Resolution NWP (Cached Baseline)",
            "provider_url": "https://api.open-meteo.com/v1/forecast",
            "timestamp": now,
            "coordinates": {
                "latitude": self.lat,
                "longitude": self.lon,
                "basin": "Chennai Urban Catchment (GCC)"
            },
            "current_conditions": {
                "temperature_c": 27.4,
                "apparent_temperature_c": 31.8,
                "relative_humidity_pct": 94,
                "dew_point_c": 26.2,
                "dew_point_depression_c": 1.2,
                "precipitation_mm": 18.5,
                "stratiform_rain_mm": 8.0,
                "convective_showers_mm": 10.5,
                "surface_pressure_hpa": 1001.2,
                "pressure_msl_hpa": 1002.8,
                "wind_10m": {
                    "speed_kmh": 28.5,
                    "direction_deg": 65
                }
            },
            "vertical_wind_shear": {
                "altitude_10m_kmh": 28.5,
                "altitude_80m_kmh": 41.2,
                "altitude_120m_kmh": 48.0,
                "altitude_180m_kmh": 54.5,
                "shear_delta_180_10_kmh": 26.0,
                "shear_characterization": "STRONG_MONSOON_INFLOW"
            },
            "barometric_diagnostics": {
                "current_mslp_hpa": 1002.8,
                "min_forecast_mslp_hpa": 997.5,
                "pressure_state": "ACTIVE_LOW_PRESSURE_AREA",
                "low_pressure_signature": True
            },
            "rainfall_forecast_24h": {
                "total_precipitation_mm": 168.0,
                "stratiform_rain_mm": 110.0,
                "convective_showers_mm": 58.0,
                "peak_hourly_intensity_mm_hr": 36.5,
                "max_probability_pct": 95,
                "convective_cloudburst_risk_index": 88.5
            },
            "hourly_24h_series": [
                {"time": "00:00", "precipitation_mm": 12.0, "rain_mm": 8.0, "showers_mm": 4.0, "probability_pct": 85, "temp_c": 27.2, "wind_10m_kmh": 24.0, "wind_180m_kmh": 46.0, "mslp_hpa": 1004.0},
                {"time": "03:00", "precipitation_mm": 18.5, "rain_mm": 11.0, "showers_mm": 7.5, "probability_pct": 90, "temp_c": 26.8, "wind_10m_kmh": 28.0, "wind_180m_kmh": 52.0, "mslp_hpa": 1002.5},
                {"time": "06:00", "precipitation_mm": 26.0, "rain_mm": 16.0, "showers_mm": 10.0, "probability_pct": 95, "temp_c": 26.5, "wind_10m_kmh": 32.0, "wind_180m_kmh": 58.0, "mslp_hpa": 1001.0},
                {"time": "09:00", "precipitation_mm": 34.5, "rain_mm": 20.0, "showers_mm": 14.5, "probability_pct": 95, "temp_c": 27.0, "wind_10m_kmh": 34.0, "wind_180m_kmh": 62.0, "mslp_hpa": 999.5},
                {"time": "12:00", "precipitation_mm": 28.0, "rain_mm": 18.0, "showers_mm": 10.0, "probability_pct": 92, "temp_c": 27.5, "wind_10m_kmh": 30.0, "wind_180m_kmh": 56.0, "mslp_hpa": 1000.5},
                {"time": "15:00", "precipitation_mm": 22.0, "rain_mm": 14.0, "showers_mm": 8.0, "probability_pct": 88, "temp_c": 27.8, "wind_10m_kmh": 26.0, "wind_180m_kmh": 50.0, "mslp_hpa": 1001.8},
                {"time": "18:00", "precipitation_mm": 15.0, "rain_mm": 11.0, "showers_mm": 4.0, "probability_pct": 80, "temp_c": 27.4, "wind_10m_kmh": 22.0, "wind_180m_kmh": 44.0, "mslp_hpa": 1002.6},
                {"time": "21:00", "precipitation_mm": 12.0, "rain_mm": 9.0, "showers_mm": 3.0, "probability_pct": 75, "temp_c": 27.1, "wind_10m_kmh": 20.0, "wind_180m_kmh": 40.0, "mslp_hpa": 1003.5}
            ],
            "daily_7d_forecast": [
                {"date": "2026-10-08", "day_label": "Day 1 (Today)", "total_precipitation_mm": 168.0, "convective_showers_mm": 58.0, "max_rain_probability_pct": 95, "max_temp_c": 28.2, "min_temp_c": 25.4},
                {"date": "2026-10-09", "day_label": "Day 2", "total_precipitation_mm": 135.0, "convective_showers_mm": 42.0, "max_rain_probability_pct": 90, "max_temp_c": 28.5, "min_temp_c": 25.6},
                {"date": "2026-10-10", "day_label": "Day 3", "total_precipitation_mm": 82.0, "convective_showers_mm": 24.0, "max_rain_probability_pct": 80, "max_temp_c": 29.1, "min_temp_c": 26.0},
                {"date": "2026-10-11", "day_label": "Day 4", "total_precipitation_mm": 44.0, "convective_showers_mm": 12.0, "max_rain_probability_pct": 65, "max_temp_c": 30.2, "min_temp_c": 26.2},
                {"date": "2026-10-12", "day_label": "Day 5", "total_precipitation_mm": 22.0, "convective_showers_mm": 5.0, "max_rain_probability_pct": 45, "max_temp_c": 31.0, "min_temp_c": 26.5},
                {"date": "2026-10-13", "day_label": "Day 6", "total_precipitation_mm": 10.0, "convective_showers_mm": 2.0, "max_rain_probability_pct": 30, "max_temp_c": 31.5, "min_temp_c": 26.8},
                {"date": "2026-10-14", "day_label": "Day 7", "total_precipitation_mm": 4.0, "convective_showers_mm": 0.0, "max_rain_probability_pct": 20, "max_temp_c": 32.0, "min_temp_c": 27.0}
            ],
            "is_live_stream": False
        }

open_meteo_provider = OpenMeteoProvider()
