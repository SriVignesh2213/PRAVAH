from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
from pathlib import Path

# Project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ROOT_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    ENVIRONMENT: str = "development"
    DEMO_MODE: bool = False
    LOG_LEVEL: str = "INFO"
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    CORS_ORIGINS: Optional[str] = "https://pravah-sooty.vercel.app,http://localhost:5173,http://localhost:3000"

    DATABASE_URL: str = "sqlite:///./pravah.db"

    # IMD (India Meteorological Department)
    IMD_API_KEY: Optional[str] = None
    IMD_BASE_URL: str = "https://api.imd.gov.in/api/v1"

    # NDMA SACHET
    SACHET_ENABLED: bool = True
    SACHET_RSS_URL: str = "https://sachet.ndma.gov.in/alerts/rss"

    # India-WRIS
    WRIS_API_KEY: Optional[str] = None
    WRIS_BASE_URL: str = "https://indiawris.gov.in/wris/api"

    # MOSDAC
    MOSDAC_USERNAME: Optional[str] = None
    MOSDAC_PASSWORD: Optional[str] = None
    MOSDAC_BASE_URL: str = "https://www.mosdac.gov.in/api"

    # Copernicus
    COPERNICUS_CLIENT_ID: Optional[str] = None
    COPERNICUS_CLIENT_SECRET: Optional[str] = None
    COPERNICUS_TOKEN_URL: str = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    COPERNICUS_CATALOG_URL: str = "https://catalogue.dataspace.copernicus.eu/resto/api"

    # NASA FIRMS
    NASA_FIRMS_MAP_KEY: Optional[str] = None
    NASA_FIRMS_BASE_URL: str = "https://firms.modaps.eosdis.nasa.gov/api"

    # Open-Meteo & GloFAS
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com"
    ELEVATION_API_URL: str = "https://api.open-meteo.com/v1/elevation"
    GLOFAS_ENABLED: bool = True
    GLOFAS_BASE_URL: str = "https://flood-api.open-meteo.com/v1/flood"

    # ECMWF Open Data
    ECMWF_ENABLED: bool = True
    ECMWF_DATA_PATH: Optional[str] = None

    # Sentinel-1 SAR Open Data
    SENTINEL1_ENABLED: bool = True
    SENTINEL1_DATA_PATH: Optional[str] = None

    # NWDP (National Water Data Portal) / CWC
    NWDP_ENABLED: bool = True
    NWDP_API_BASE_URL: str = "https://indiawris.gov.in/wris/api"

    # OSM / Overpass / Geocoding / Routing
    OVERPASS_API_URL: str = "https://overpass-api.de/api/interpreter"
    NOMINATIM_BASE_URL: str = "https://nominatim.openstreetmap.org"
    OSM_DATA_PATH: Optional[str] = None
    OSRM_BASE_URL: str = "https://router.project-osrm.org"

    # Optional IMD toggle
    IMD_ENABLED: bool = True

    # Operational system state: LIVE, CACHED, DEGRADED, OFFLINE_DEMO
    SYSTEM_MODE: str = "LIVE"

    # Optional LLM
    LLM_PROVIDER: str = "none"
    LLM_API_KEY: Optional[str] = None
    LLM_MODEL: Optional[str] = None

settings = Settings()
