import httpx
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.integrations.base import BaseDataProvider
from app.models.domain import Facility, FacilityType, FacilityStatus, RoadSegment, RoadStatus
from app.core.config import settings
from app.core.logging import logger

class OSMProvider(BaseDataProvider):
    def __init__(self):
        super().__init__(name="OpenStreetMap / Overpass API")

    def has_credentials(self) -> bool:
        # Public OSM Overpass API requires no private key
        return True

    async def fetch_live(self) -> Dict[str, Any]:
        """Fetch targeted emergency facilities in Chennai bounding box via Overpass"""
        # Targeted query for emergency hospitals and shelters in Chennai
        query = """
        [out:json][timeout:10];
        (
          node["amenity"="hospital"](12.90,80.10,13.15,80.30);
          node["amenity"="shelter"](12.90,80.10,13.15,80.30);
        );
        out 15;
        """
        headers = {
            "User-Agent": "PRAVAH-DisasterIntelligence/1.0 (emergency-gis@pravah.gov.in)",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(settings.OVERPASS_API_URL, data={"data": query}, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            elements = data.get("elements", [])
            facilities: List[Facility] = []
            for el in elements:
                name = el.get("tags", {}).get("name", "Emergency Medical Facility")
                f_type = FacilityType.HOSPITAL if el.get("tags", {}).get("amenity") == "hospital" else FacilityType.SHELTER
                facilities.append(Facility(
                    id=f"osm-{el['id']}",
                    name=name,
                    type=f_type,
                    lat=el["lat"],
                    lon=el["lon"],
                    capacity=250,
                    current_occupancy=40,
                    status=FacilityStatus.OPERATIONAL,
                    flood_risk=15.0,
                    zone_id="central"
                ))
            if facilities:
                return {"facilities": facilities}

        return self.get_fallback_data()

    def get_fallback_data(self) -> Dict[str, Any]:
        """Grounded Chennai critical infrastructure (Hospitals, Shelters, Substations, Arterial Roads)"""
        facilities = [
            Facility(
                id="fac-hosp-01",
                name="Rajiv Gandhi Govt General Hospital (RGGGH)",
                type=FacilityType.HOSPITAL,
                lat=13.0825,
                lon=80.2769,
                capacity=1500,
                current_occupancy=890,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=12.0,
                zone_id="royapuram"
            ),
            Facility(
                id="fac-hosp-02",
                name="Government Stanley Medical College Hospital",
                type=FacilityType.HOSPITAL,
                lat=13.1070,
                lon=80.2870,
                capacity=1200,
                current_occupancy=750,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=18.0,
                zone_id="royapuram"
            ),
            Facility(
                id="fac-hosp-03",
                name="MIOT International Multi-Speciality Hospital",
                type=FacilityType.HOSPITAL,
                lat=13.0238,
                lon=80.1856,
                capacity=650,
                current_occupancy=510,
                status=FacilityStatus.AT_RISK, # Adjacent to Adyar River bank (historically inundated in 2015)
                flood_risk=86.0,
                zone_id="mudichur"
            ),
            Facility(
                id="fac-hosp-04",
                name="Apollo Hospitals Greams Road",
                type=FacilityType.HOSPITAL,
                lat=13.0563,
                lon=80.2522,
                capacity=700,
                current_occupancy=420,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=22.0,
                zone_id="tnagar"
            ),
            Facility(
                id="fac-hosp-05",
                name="Dr. Kamakshi Memorial Hospital (Velachery-Pallikaranai)",
                type=FacilityType.HOSPITAL,
                lat=12.9515,
                lon=80.2087,
                capacity=400,
                current_occupancy=320,
                status=FacilityStatus.AT_RISK,
                flood_risk=78.0,
                zone_id="velachery"
            ),
            Facility(
                id="fac-shelt-01",
                name="GCC Community Relief Center - Velachery West",
                type=FacilityType.SHELTER,
                lat=12.9780,
                lon=80.2130,
                capacity=1200,
                current_occupancy=410,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=45.0,
                zone_id="velachery"
            ),
            Facility(
                id="fac-shelt-02",
                name="St. Thomas Mount Cantonment Relief Center",
                type=FacilityType.SHELTER,
                lat=13.0030,
                lon=80.1980,
                capacity=1500,
                current_occupancy=280,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=15.0,
                zone_id="madipakkam"
            ),
            Facility(
                id="fac-shelt-03",
                name="Mudichur High School Flood Relief Shelter",
                type=FacilityType.SHELTER,
                lat=12.9190,
                lon=80.0720,
                capacity=800,
                current_occupancy=650,
                status=FacilityStatus.AT_RISK,
                flood_risk=82.0,
                zone_id="mudichur"
            ),
            Facility(
                id="fac-shelt-04",
                name="GCC Community Hall - T. Nagar Venkatnarayana",
                type=FacilityType.SHELTER,
                lat=13.0380,
                lon=80.2390,
                capacity=950,
                current_occupancy=210,
                status=FacilityStatus.OPERATIONAL,
                flood_risk=30.0,
                zone_id="tnagar"
            ),
            Facility(
                id="fac-sub-01",
                name="TANGEDCO 230kV Substation - Velachery",
                type=FacilityType.SUBSTATION,
                lat=12.9690,
                lon=80.2210,
                capacity=230,
                current_occupancy=0,
                status=FacilityStatus.AT_RISK,
                flood_risk=81.0,
                zone_id="velachery"
            ),
            Facility(
                id="fac-sub-02",
                name="TANGEDCO 110kV Substation - Mudichur",
                type=FacilityType.SUBSTATION,
                lat=12.9120,
                lon=80.0650,
                capacity=110,
                current_occupancy=0,
                status=FacilityStatus.INUNDATED,
                flood_risk=93.0,
                zone_id="mudichur"
            )
        ]

        roads = [
            RoadSegment(
                id="road-01",
                name="Velachery Main Road (Vijayanagar - Guindy)",
                coordinates=[[80.222, 12.970], [80.218, 12.985], [80.210, 13.008]],
                length_km=4.8,
                status=RoadStatus.IMPASSABLE,
                flood_probability=0.88,
                baseline_time_min=12.0,
                risk_adjusted_time_min=42.0,
                is_critical_artery=True
            ),
            RoadSegment(
                id="road-02",
                name="GST Road (Airport - Kathipara - Guindy)",
                coordinates=[[80.170, 12.985], [80.189, 13.003], [80.208, 13.012]],
                length_km=6.2,
                status=RoadStatus.AT_RISK,
                flood_probability=0.62,
                baseline_time_min=15.0,
                risk_adjusted_time_min=28.5,
                is_critical_artery=True
            ),
            RoadSegment(
                id="road-03",
                name="Mudichur Main Road (Tambaram - Mudichur)",
                coordinates=[[80.118, 12.923], [80.088, 12.918], [80.065, 12.912]],
                length_km=5.4,
                status=RoadStatus.IMPASSABLE,
                flood_probability=0.94,
                baseline_time_min=11.0,
                risk_adjusted_time_min=55.0,
                is_critical_artery=True
            ),
            RoadSegment(
                id="road-04",
                name="Rajiv Gandhi Salai (OMR IT Corridor)",
                coordinates=[[80.248, 12.985], [80.235, 12.940], [80.228, 12.901]],
                length_km=9.5,
                status=RoadStatus.PASSABLE,
                flood_probability=0.35,
                baseline_time_min=18.0,
                risk_adjusted_time_min=22.0,
                is_critical_artery=True
            ),
            RoadSegment(
                id="road-05",
                name="Inner Ring Road (Jawaharlal Nehru Salai)",
                coordinates=[[80.205, 13.010], [80.208, 13.050], [80.212, 13.085]],
                length_km=8.8,
                status=RoadStatus.PASSABLE,
                flood_probability=0.28,
                baseline_time_min=16.0,
                risk_adjusted_time_min=19.0,
                is_critical_artery=True
            ),
            RoadSegment(
                id="road-06",
                name="Madipakkam - Keelkattalai Link Road",
                coordinates=[[80.196, 12.965], [80.185, 12.952]],
                length_km=3.2,
                status=RoadStatus.IMPASSABLE,
                flood_probability=0.89,
                baseline_time_min=8.0,
                risk_adjusted_time_min=36.0,
                is_critical_artery=False
            )
        ]

        return {"facilities": facilities, "roads": roads}

osm_provider = OSMProvider()
