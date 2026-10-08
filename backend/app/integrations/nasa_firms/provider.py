import httpx
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.integrations.base import BaseDataProvider
from app.core.config import settings

class NasaFirmsProvider(BaseDataProvider):
    def __init__(self):
        super().__init__(name="NASA FIRMS (VIIRS / MODIS Fire & Thermal)")

    def has_credentials(self) -> bool:
        return bool(settings.NASA_FIRMS_MAP_KEY)

    async def fetch_live(self) -> List[Dict[str, Any]]:
        """Fetch thermal anomalies / active fire detections for South India bounding box"""
        # Chennai bbox approx: 80,12,81,14
        url = f"{settings.NASA_FIRMS_BASE_URL}/area/csv/{settings.NASA_FIRMS_MAP_KEY}/VIIRS_SNPP_NRT/80,12,81,14/1"
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            lines = resp.text.strip().split("\n")
            records = []
            if len(lines) > 1:
                header = lines[0].split(",")
                for line in lines[1:]:
                    parts = line.split(",")
                    if len(parts) == len(header):
                        records.append(dict(zip(header, parts)))
            return records

    def get_fallback_data(self) -> List[Dict[str, Any]]:
        """Multi-hazard baseline: Zero significant thermal anomalies in Chennai during active flood scenario"""
        return []

nasa_firms_provider = NasaFirmsProvider()
