import pytest
from app.forecasting.flood_risk import flood_risk_model
from app.uncertainty.engine import uncertainty_engine
from app.vulnerability.engine import vulnerability_engine
from app.cascade.graph import cascading_engine
from app.optimization.engine import resource_optimizer
from app.simulation.counterfactual import counterfactual_simulator
from app.models.domain import CounterfactualRequest, RiskClass
from app.geospatial.chennai_grid import get_chennai_zones_base
from app.integrations.routing.provider import routing_provider
from app.integrations.imd.provider import imd_provider
from app.integrations.sachet.provider import sachet_provider
from app.integrations.india_wris.provider import wris_provider

def test_flood_risk_model_high_rain():
    # 220mm rainfall, low elevation (3.8m), close to waterway
    score, risk_class, contrib = flood_risk_model.predict(
        rainfall_24h_mm=220.0,
        rainfall_intensity_mm_hr=32.0,
        elevation_m=3.8,
        distance_to_waterway_m=150.0,
        drainage_index=0.88,
        river_discharge_ratio=1.2,
        sar_flood_signal=True
    )
    assert score >= 70.0
    assert risk_class in [RiskClass.HIGH, RiskClass.SEVERE, RiskClass.EXTREME]
    assert "rainfall_accumulation" in contrib
    assert "terrain_low_elevation" in contrib

def test_uncertainty_engine_bounds():
    conf, interval, evidence, contradictions = uncertainty_engine.quantify(
        base_risk_score=85.0,
        rainfall_variance_ratio=0.15,
        has_gauge_reading=True,
        sar_observed=True,
        elevation_m=3.5,
        rainfall_mm=210.0
    )
    assert 0 <= conf <= 100
    assert interval[0] <= interval[1]
    assert len(evidence) > 0
    assert len(contradictions) > 0

def test_vulnerability_index():
    vuln, drivers = vulnerability_engine.calculate(
        population_density=18000.0,
        elevation_m=4.0,
        facility_count=1,
        drainage_index=0.85
    )
    assert vuln > 50.0
    assert len(drivers) > 0

def test_cascading_graph():
    graph = cascading_engine.build_cascade(rainfall_multiplier=1.25)
    assert len(graph.nodes) >= 6
    assert len(graph.edges) >= 5
    # Verify presence of critical road and hospital nodes
    node_ids = [n.id for n in graph.nodes]
    assert "N_RAIN" in node_ids
    assert "N_ROAD_VEL" in node_ids
    assert "N_HOSP_MIOT" in node_ids

def test_resource_optimization():
    zones = get_chennai_zones_base()
    # Mark Velachery & Mudichur as high risk
    for z in zones:
        if z.id in ["velachery", "mudichur"]:
            z.flood_risk_score = 88.0
            z.vulnerability_score = 75.0
            z.confidence = 82.0
        else:
            z.flood_risk_score = 30.0
            z.vulnerability_score = 40.0
            z.confidence = 80.0

    recs = resource_optimizer.optimize_resources(
        zones=zones,
        available_boats=10,
        available_ambulances=20,
        available_ndrf_teams=6,
        emergency_priority="BALANCED"
    )
    assert len(recs) > 0
    top = recs[0]
    assert top.rank == 1
    assert top.ras_score > 0
    assert top.expected_people_protected > 0
    assert len(top.detailed_why) >= 3

def test_risk_adjusted_routing():
    route_data = routing_provider.compute_risk_adjusted_route(
        start_coord=(80.21, 13.01),
        end_coord=(80.22, 12.98),
        segment_flood_probs={"road-01": 0.88}
    )
    assert "standard_route" in route_data
    assert "resilient_route" in route_data
    assert route_data["standard_route"]["is_severed"] is True
    assert route_data["resilient_route"]["is_severed"] is False

@pytest.mark.asyncio
async def test_counterfactual_simulation_recalculation():
    # Test baseline vs +50% rainfall recalculation
    base_res = await counterfactual_simulator.run_simulation(CounterfactualRequest(rainfall_multiplier=1.0))
    heavy_res = await counterfactual_simulator.run_simulation(CounterfactualRequest(rainfall_multiplier=1.5))

    # In +50% rain, affected population must be significantly higher
    assert heavy_res.total_affected_population > base_res.total_affected_population
    assert heavy_res.rainfall_change_pct == 50.0
    assert len(heavy_res.recommendations) > 0
    assert len(heavy_res.comparisons) > 0

@pytest.mark.asyncio
async def test_providers_fallback():
    imd_data, _, _ = await imd_provider.get_data()
    assert "rainfall" in imd_data
    sachet_data, _, _ = await sachet_provider.get_data()
    assert len(sachet_data) > 0
    wris_data, _, _ = await wris_provider.get_data()
    assert len(wris_data) > 0

@pytest.mark.asyncio
async def test_imd_official_services():
    # 1. 7-Day City Forecast
    city_fc = await imd_provider.get_city_forecast("43279")
    assert city_fc.station_code == "43279"
    assert len(city_fc.seven_day_forecast) == 7
    assert city_fc.past_24_hrs_rainfall_mm > 0

    # 2. Current Weather (current_wx)
    curr_wx = await imd_provider.get_current_weather("43279")
    assert curr_wx.station_id == "43279"
    assert curr_wx.mslp_hpa > 900.0
    assert curr_wx.wind_direction_desc != ""
    assert curr_wx.weather_desc != ""

    # 3. District Nowcast (Cat 1-19)
    nowcast = await imd_provider.get_district_nowcast("CHENNAI")
    assert nowcast.color_code in [1, 2, 3, 4]
    assert nowcast.color_hex.startswith("#")

    # 4. District Warnings (Codes 1-17)
    warnings = await imd_provider.get_district_warning("573")
    assert warnings.district == "CHENNAI"
    assert len(warnings.day_1_codes) > 0

    # 5. Tamil Nadu AWS Stations
    aws_stations = await imd_provider.get_tamil_nadu_aws_stations()
    assert len(aws_stations) >= 3
    assert aws_stations[0].state == "TAMIL_NADU"

    # 6. River Basin QPF
    qpf = await imd_provider.get_river_basin_qpf()
    assert len(qpf) >= 2
    assert "ADYAR" in qpf[0].basin

    # 7. Cyclone Track & Cone of Uncertainty
    track = await imd_provider.get_cyclone_track()
    assert len(track.observed) > 0
    cone = await imd_provider.get_cyclone_cone()
    assert cone.cone_polygon["type"] == "MultiPolygon"

@pytest.mark.asyncio
async def test_open_data_stack():
    from app.integrations.open_meteo.provider import open_meteo_provider
    from app.integrations.glofas.provider import glofas_provider
    from app.integrations.ecmwf.provider import ecmwf_provider
    from app.integrations.sentinel1.provider import sentinel1_provider
    from app.integrations.nwdp.provider import nwdp_provider
    from app.integrations.osrm.provider import osrm_provider
    from app.services.data_fusion.fusion_engine import fusion_engine

    # Open-Meteo
    om_data, _, _ = await open_meteo_provider.get_data()
    assert "Open-Meteo" in om_data["source"] or "open-meteo" in om_data["source"]
    assert "rainfall_forecast_24h" in om_data or "rainfall_24h_mm" in om_data
    assert "vertical_wind_shear" in om_data or "hourly_precipitation" in om_data

    # GloFAS
    glofas_data, _, _ = await glofas_provider.get_data()
    assert glofas_data["hydrological_risk_signal"] in [
        "NORMAL_BASEFLOW", "MODERATE_RUNOFF", "ELEVATED_RIVER_DISCHARGE", "SEVERE_HYDROLOGIC_SURGE"
    ]
    assert "peak_forecast_discharge_m3s" in glofas_data

    # ECMWF Open Data
    ecmwf_data, _, _ = await ecmwf_provider.get_data()
    assert ecmwf_data["forecast_rainfall_24h_mm"] >= 0.0

    # Sentinel-1 SAR Local Pipeline
    sar_data, _, _ = await sentinel1_provider.get_data()
    assert sar_data["flood_evidence_score"] > 70.0
    assert "flood_polygons_geojson" in sar_data

    # NWDP / CWC
    nwdp_data, _, _ = await nwdp_provider.get_data()
    assert len(nwdp_data) >= 3
    assert nwdp_data[0]["station_id"].startswith("CWC-")

    # Multi-source Data Fusion & Forecast Agreement Score
    fusion = await fusion_engine.fuse_evidence()
    assert "forecast_agreement" in fusion
    assert fusion["forecast_agreement"]["score_pct"] >= 50.0
    assert fusion["forecast_agreement"]["tier"] in ["VERY_HIGH", "HIGH", "MODERATE", "LOW (HIGH_DISPERSION)"]
    assert fusion["fusion_confidence_pct"] >= 50.0

    # Risk-Aware Routing (Fastest vs Safest)
    route_comp = osrm_provider.compute_risk_aware_route()
    assert "fastest_route" in route_comp
    assert "safest_route" in route_comp
    assert route_comp["fastest_route"]["flood_risk_pct"] > route_comp["safest_route"]["flood_risk_pct"]
    assert route_comp["effective_time_saved_min"] > 0


