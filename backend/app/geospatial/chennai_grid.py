from typing import List, Dict, Any
from app.models.domain import ChennaiZone, RiskClass

def get_chennai_zones_base() -> List[ChennaiZone]:
    """
    Returns the foundational geospatial zones for Greater Chennai Corporation (GCC)
    including polygon boundaries, centroids, elevations, waterway distances,
    and baseline population exposure.
    """
    zones_data = [
        {
            "id": "velachery",
            "name": "Velachery (Zone 13 - South GCC)",
            "ward_number": 177,
            "centroid": [80.2180, 12.9815],
            "elevation_m": 3.8,
            "distance_to_waterway_m": 180.0, # Pallikaranai Marshland / Veerangal Odai
            "population": 118400,
            "population_density_per_sqkm": 14200.0,
            "building_count": 18450,
            "drainage_index": 0.88,
            "coords": [
                [80.200, 12.995], [80.235, 12.995], [80.240, 12.965], [80.205, 12.965], [80.200, 12.995]
            ]
        },
        {
            "id": "mudichur",
            "name": "Mudichur - West Tambaram",
            "ward_number": 185,
            "centroid": [80.0680, 12.9150],
            "elevation_m": 4.2,
            "distance_to_waterway_m": 120.0, # Adyar River upstream
            "population": 74200,
            "population_density_per_sqkm": 8900.0,
            "building_count": 11200,
            "drainage_index": 0.92,
            "coords": [
                [80.045, 12.930], [80.090, 12.930], [80.090, 12.900], [80.045, 12.900], [80.045, 12.930]
            ]
        },
        {
            "id": "madipakkam",
            "name": "Madipakkam - Keelkattalai",
            "ward_number": 169,
            "centroid": [80.1961, 12.9647],
            "elevation_m": 3.2,
            "distance_to_waterway_m": 220.0, # Madipakkam Lake outflow
            "population": 96500,
            "population_density_per_sqkm": 15800.0,
            "building_count": 16800,
            "drainage_index": 0.85,
            "coords": [
                [80.180, 12.980], [80.210, 12.980], [80.210, 12.950], [80.180, 12.950], [80.180, 12.980]
            ]
        },
        {
            "id": "tnagar",
            "name": "T. Nagar (Thyagaraya Nagar)",
            "ward_number": 136,
            "centroid": [80.2341, 13.0418],
            "elevation_m": 9.5,
            "distance_to_waterway_m": 310.0, # Mambalam Canal
            "population": 142000,
            "population_density_per_sqkm": 24500.0,
            "building_count": 21400,
            "drainage_index": 0.72,
            "coords": [
                [80.215, 13.055], [80.250, 13.055], [80.250, 13.028], [80.215, 13.028], [80.215, 13.055]
            ]
        },
        {
            "id": "sholinganallur",
            "name": "Sholinganallur IT Corridor",
            "ward_number": 197,
            "centroid": [80.2279, 12.9010],
            "elevation_m": 5.1,
            "distance_to_waterway_m": 350.0, # Buckingham Canal
            "population": 110200,
            "population_density_per_sqkm": 9400.0,
            "building_count": 14200,
            "drainage_index": 0.65,
            "coords": [
                [80.210, 12.920], [80.255, 12.920], [80.255, 12.880], [80.210, 12.880], [80.210, 12.920]
            ]
        },
        {
            "id": "adyar",
            "name": "Adyar - Besant Nagar",
            "ward_number": 173,
            "centroid": [80.2565, 13.0012],
            "elevation_m": 6.8,
            "distance_to_waterway_m": 150.0, # Adyar Estuary
            "population": 125000,
            "population_density_per_sqkm": 16200.0,
            "building_count": 17600,
            "drainage_index": 0.45,
            "coords": [
                [80.240, 13.015], [80.275, 13.015], [80.275, 12.985], [80.240, 12.985], [80.240, 13.015]
            ]
        },
        {
            "id": "annanagar",
            "name": "Anna Nagar Central",
            "ward_number": 102,
            "centroid": [80.2100, 13.0850],
            "elevation_m": 14.2,
            "distance_to_waterway_m": 850.0, # Cooum River Northern Buffer
            "population": 160000,
            "population_density_per_sqkm": 19500.0,
            "building_count": 22100,
            "drainage_index": 0.38,
            "coords": [
                [80.190, 13.100], [80.230, 13.100], [80.230, 13.070], [80.190, 13.070], [80.190, 13.100]
            ]
        },
        {
            "id": "perambur",
            "name": "Perambur - Vyasarpadi",
            "ward_number": 71,
            "centroid": [80.2390, 13.1090],
            "elevation_m": 8.1,
            "distance_to_waterway_m": 290.0, # Otteri Nullah
            "population": 135400,
            "population_density_per_sqkm": 21000.0,
            "building_count": 19500,
            "drainage_index": 0.74,
            "coords": [
                [80.220, 13.125], [80.260, 13.125], [80.260, 13.095], [80.220, 13.095], [80.220, 13.125]
            ]
        },
        {
            "id": "royapuram",
            "name": "Royapuram - George Town",
            "ward_number": 52,
            "centroid": [80.2940, 13.1130],
            "elevation_m": 4.5,
            "distance_to_waterway_m": 420.0, # Buckingham Canal Northern Reach
            "population": 152000,
            "population_density_per_sqkm": 28400.0,
            "building_count": 23200,
            "drainage_index": 0.68,
            "coords": [
                [80.275, 13.130], [80.305, 13.130], [80.305, 13.090], [80.275, 13.090], [80.275, 13.130]
            ]
        },
        {
            "id": "kolathur",
            "name": "Kolathur - Retteri",
            "ward_number": 64,
            "centroid": [80.2150, 13.1240],
            "elevation_m": 10.3,
            "distance_to_waterway_m": 380.0, # Retteri Lake
            "population": 105800,
            "population_density_per_sqkm": 14100.0,
            "building_count": 15400,
            "drainage_index": 0.58,
            "coords": [
                [80.195, 13.140], [80.230, 13.140], [80.230, 13.110], [80.195, 13.110], [80.195, 13.140]
            ]
        }
    ]

    zones: List[ChennaiZone] = []
    for z in zones_data:
        geojson_geom = {
            "type": "Polygon",
            "coordinates": [z["coords"]]
        }
        zones.append(ChennaiZone(
            id=z["id"],
            name=z["name"],
            ward_number=z["ward_number"],
            geometry=geojson_geom,
            centroid=z["centroid"],
            elevation_m=z["elevation_m"],
            distance_to_waterway_m=z["distance_to_waterway_m"],
            population=z["population"],
            population_density_per_sqkm=z["population_density_per_sqkm"],
            building_count=z["building_count"],
            drainage_index=z["drainage_index"]
        ))
    return zones
