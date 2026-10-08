from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# 1) Weather Code Reference dictionary (01-99)
WEATHER_CODE_MAP: Dict[str, str] = {
    "01": "Clouds generally dissolving or becoming less developed",
    "02": "State of sky on the whole unchanged",
    "03": "Clouds generally forming or developing",
    "04": "Visibility reduced by smoke",
    "05": "Haze",
    "10": "Mist",
    "13": "Lightning visible, no thunder heard",
    "17": "Thunderstorm, no precipitation at observation time",
    "20": "Drizzle (not freezing)",
    "21": "Rain (not freezing) not falling as showers",
    "25": "Showers of rain",
    "29": "Thunderstorm (with or without precipitation)",
    "50": "Drizzle, intermittent slight",
    "51": "Drizzle, continuous slight",
    "60": "Rain, intermittent slight",
    "61": "Rain, continuous slight",
    "62": "Rain, intermittent moderate",
    "63": "Rain, continuous moderate",
    "64": "Rain, intermittent heavy",
    "65": "Rain, continuous heavy",
    "80": "Rain shower(s), slight",
    "81": "Rain shower(s), moderate or heavy",
    "82": "Rain shower(s), violent",
    "91": "Slight rain with thunderstorm during preceding hour",
    "92": "Moderate/heavy rain with thunderstorm during preceding hour",
    "95": "Thunderstorm, slight/moderate, with rain at observation",
    "97": "Thunderstorm, heavy, with torrential rain at observation"
}

# 2) Wind Direction Description Map
WIND_DIRECTION_MAP: Dict[int, str] = {
    0: "Calm",
    20: "North-northeasterly",
    50: "Northeasterly",
    70: "East-northeasterly",
    90: "Easterly",
    110: "East-southeasterly",
    140: "Southeasterly",
    160: "South-southeasterly",
    180: "Southerly",
    200: "South-southwesterly",
    230: "Southwesterly",
    250: "West-southwesterly",
    270: "Westerly",
    290: "West-northwesterly",
    320: "Northwesterly",
    340: "North-northwesterly",
    360: "Northerly"
}

# 3) Warning Code Descriptions (District Warnings)
WARNING_CODE_MAP: Dict[int, str] = {
    1: "No Warning",
    2: "Heavy Rain",
    3: "Heavy Snow",
    4: "Thunderstorm & Lightning, Squall etc",
    5: "Hailstorm",
    6: "Dust Storm",
    7: "Dust Raising Winds",
    8: "Strong Surface Winds",
    9: "Heat Wave",
    10: "Hot Day",
    11: "Warm Night",
    12: "Cold Wave",
    13: "Cold Day",
    14: "Ground Frost",
    15: "Fog",
    16: "Very Heavy Rain",
    17: "Extremely Heavy Rain"
}

# 4) Warning Color Codes
WARNING_COLOR_MAP: Dict[int, Dict[str, str]] = {
    1: {"name": "Red", "hex": "#FF0000", "severity": "WARNING_TAKE_ACTION"},
    2: {"name": "Orange", "hex": "#FFA500", "severity": "ALERT_BE_PREPARED"},
    3: {"name": "Yellow", "hex": "#FFFF00", "severity": "WATCH_BE_UPDATED"},
    4: {"name": "Green", "hex": "#7CFC00", "severity": "NO_WARNING"}
}

# 5) Nowcast Categories (Cat1 to Cat19)
NOWCAST_CAT_MAP: Dict[int, str] = {
    1: "No Weather",
    2: "Light rain (< 5 mm/hr)",
    3: "Light snow (< 5 cm/hr)",
    4: "Light Thunderstorms (gusts < 40 kmph)",
    5: "Slight dust storm",
    6: "Low cloud to ground Lightning probability (< 30%)",
    7: "Moderate rain (5-15 mm/hr)",
    8: "Moderate snow (5-15 cm/hr)",
    9: "Moderate Thunderstorms (gusts 41-61 kmph)",
    10: "Moderate dust storm",
    11: "Moderate cloud to ground Lightning probability (30-60%)",
    12: "Heavy rain (> 15 mm/hr)",
    13: "Heavy snow (> 15 cm/hr)",
    14: "Severe Thunderstorms (gusts 62-87 kmph)",
    15: "Very Severe Thunderstorms (gusts > 87 kmph)",
    31: "Thunderstorms with Hail",
    32: "Severe dust storm (gusts > 61 kmph)",
    33: "High cloud to ground Lightning probability (> 60%)"
}

class IMDCityForecastDay(BaseModel):
    day: int
    date: str
    max_temp_c: Optional[float] = None
    min_temp_c: Optional[float] = None
    forecast: str

class IMDCityForecast(BaseModel):
    station_code: str
    station_name: str
    date_of_observation: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    today_max_temp: Optional[float] = None
    today_max_departure: Optional[float] = None
    today_min_temp: Optional[float] = None
    today_min_departure: Optional[float] = None
    past_24_hrs_rainfall_mm: float = 0.0
    relative_humidity_0830: Optional[float] = None
    relative_humidity_1730: Optional[float] = None
    sunrise_time: Optional[str] = None
    sunset_time: Optional[str] = None
    moonrise_time: Optional[str] = None
    moonset_time: Optional[str] = None
    seven_day_forecast: List[IMDCityForecastDay] = []

class IMDCurrentWeather(BaseModel):
    station_id: str
    station_name: str
    date_of_observation: str
    time_of_observation_utc: str
    mslp_hpa: float
    wind_direction_code: int
    wind_direction_desc: str
    wind_speed_kmph: float
    temperature_c: float
    weather_code: str
    weather_desc: str
    nebulosity_oktas: int # 0-8
    humidity_pct: float
    last_24_hrs_rainfall_mm: float

class IMDDistrictNowcast(BaseModel):
    station_name: str
    date: str
    warning_code: int
    warning_desc: str
    message: str
    time_of_issue_ist: str
    valid_upto_ist: str
    color_code: int
    color_hex: str
    severity_level: str

class IMDDistrictWarning(BaseModel):
    obj_id: str
    district: str
    date_of_issue: str
    utc_time: str
    day_1_codes: List[int]
    day_1_text: str
    day_1_color: str
    day_2_codes: List[int]
    day_2_text: str
    day_2_color: str
    day_3_codes: List[int]
    day_3_text: str
    day_3_color: str
    day_4_codes: List[int]
    day_4_text: str
    day_4_color: str
    day_5_codes: List[int]
    day_5_text: str
    day_5_color: str

class IMDDistrictRainfall(BaseModel):
    district: str
    date: str
    daily_actual_mm: float
    daily_normal_mm: float
    daily_departure_pct: str
    daily_category: str # LE, E, N, D, LD, NR, ND
    daily_category_desc: str
    cumulative_actual_mm: float
    cumulative_normal_mm: float

class IMDAWSStation(BaseModel):
    id: str
    call_sign: str
    station_name: str
    district: str
    state: str
    date: str
    time_utc: str
    temp_c: float
    dew_point_c: Optional[float] = None
    humidity_pct: float
    wind_direction_deg: int
    wind_speed_kmph: float
    mslp_hpa: float
    latitude: float
    longitude: float
    weather_code: str
    feels_like_c: float

class IMDRiverBasinQPF(BaseModel):
    obj_id: str
    date: str
    fmo: str
    basin: str
    sub_basin: str
    area_sqkm: float
    day1_qpf_mm: str
    day2_qpf_mm: str
    day3_qpf_mm: str
    day4_qpf_mm: str
    day5_qpf_mm: str
    average_areal_precipitation_mm: float

class IMDCyclonePoint(BaseModel):
    date_time: str
    lat: float
    lon: float
    msw_kmph: str
    category: str

class IMDCycloneTrack(BaseModel):
    cyclone_name: str
    observed: List[IMDCyclonePoint]
    forecast: List[IMDCyclonePoint]

class IMDCycloneWindWarning(BaseModel):
    polygon_27kt: Optional[Dict[str, Any]] = None
    polygon_34kt: Optional[Dict[str, Any]] = None
    polygon_50kt: Optional[Dict[str, Any]] = None
    polygon_64kt: Optional[Dict[str, Any]] = None

class IMDCycloneConeOfUncertainty(BaseModel):
    cone_polygon: Dict[str, Any] # GeoJSON MultiPolygon
