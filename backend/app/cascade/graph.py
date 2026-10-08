import networkx as nx
from typing import Dict, Any, List, Optional
from app.models.domain import CascadeGraph, CascadeNode, CascadeEdge, RoadSegment, Facility

class CascadingFailureEngine:
    """
    Cascading Disaster Failure Engine using NetworkX Directed Graph.
    Models propagation of hydrological disruptions into:
    - Transport arterials (road severances)
    - Power infrastructure (substation inundations)
    - Healthcare isolation (hospital delay escalations)
    - Shelter capacity compromises
    """
    def __init__(self):
        pass

    def build_cascade(
        self,
        rainfall_multiplier: float = 1.0,
        velachery_flood_risk: float = 87.0,
        mudichur_flood_risk: float = 92.0,
        roads: Optional[List[RoadSegment]] = None,
        facilities: Optional[List[Facility]] = None
    ) -> CascadeGraph:
        G = nx.DiGraph()

        # Dynamic calculation of road and infrastructure vulnerability
        r_vel = next((r for r in roads if r.id == "road-01"), None) if roads else None
        r_mud = next((r for r in roads if r.id == "road-03"), None) if roads else None

        vel_road_risk = round(r_vel.flood_probability * 100.0, 1) if r_vel else round(min(99.0, velachery_flood_risk * 1.01), 1)
        vel_road_status = r_vel.status.value if r_vel and hasattr(r_vel.status, 'value') else (str(r_vel.status) if r_vel else ("IMPASSABLE" if vel_road_risk >= 72 else "AT_RISK"))

        mud_road_risk = round(r_mud.flood_probability * 100.0, 1) if r_mud else round(min(99.0, mudichur_flood_risk * 1.02), 1)
        mud_road_status = r_mud.status.value if r_mud and hasattr(r_mud.status, 'value') else (str(r_mud.status) if r_mud else ("IMPASSABLE" if mud_road_risk >= 72 else "AT_RISK"))

        f_sub = next((f for f in facilities if f.id == "fac-sub-02"), None) if facilities else None
        f_miot = next((f for f in facilities if f.id == "fac-hosp-03"), None) if facilities else None
        f_shelt = next((f for f in facilities if f.id == "fac-shelt-03"), None) if facilities else None

        sub_risk = f_sub.flood_risk if f_sub else round(min(99.0, mudichur_flood_risk * 0.98), 1)
        sub_status = f_sub.status.value if f_sub and hasattr(f_sub.status, 'value') else (str(f_sub.status) if f_sub else ("INUNDATED" if sub_risk >= 80 else "AT_RISK"))

        miot_risk = f_miot.flood_risk if f_miot else round(min(99.0, (velachery_flood_risk * 0.4 + mudichur_flood_risk * 0.6) * 0.95), 1)
        miot_status = f_miot.status.value if f_miot and hasattr(f_miot.status, 'value') else (str(f_miot.status) if f_miot else ("ISOLATED" if miot_risk >= 70 else "AT_RISK"))

        shelt_risk = f_shelt.flood_risk if f_shelt else round(min(99.0, mudichur_flood_risk * 0.88), 1)
        shelt_status = f_shelt.status.value if f_shelt and hasattr(f_shelt.status, 'value') else (str(f_shelt.status) if f_shelt else ("AT_RISK" if shelt_risk >= 50 else "OPERATIONAL"))

        pop_risk = round(min(99.0, (mudichur_flood_risk * 0.55 + velachery_flood_risk * 0.45)), 1)
        pop_status = "SEVERE_IMPACT" if pop_risk >= 75 else ("MODERATE_IMPACT" if pop_risk >= 45 else "MINIMAL_IMPACT")

        is_dry = (velachery_flood_risk < 35.0 and mudichur_flood_risk < 35.0)
        rain_risk = round(min(100.0, max(2.5, velachery_flood_risk * 0.8)), 1) if is_dry else min(100.0, round(75.0 * rainfall_multiplier, 1))
        rain_status = "NORMAL" if is_dry else "ACTIVE"
        rain_name = "Atmospheric Inflow Telemetry" if is_dry else "Torrential Inflow Telemetry"
        rain_desc = "Live Open-Meteo & GloFAS observations indicate normal baseflow with no active precipitation surge." if is_dry else f"Atmospheric precipitation surge ({rainfall_multiplier:.2f}x baseline) over Adyar & Cooum catchments"

        # Nodes
        nodes = [
            CascadeNode(
                id="N_RAIN",
                name=rain_name,
                type="HAZARD",
                risk_score=rain_risk,
                status=rain_status,
                description=rain_desc
            ),
            CascadeNode(
                id="N_FLOOD_VEL",
                name="Velachery Floodplain Status",
                type="HAZARD",
                risk_score=velachery_flood_risk,
                status="CRITICAL" if velachery_flood_risk >= 70 else ("WARNING" if velachery_flood_risk >= 35 else "NORMAL"),
                description=f"Pallikaranai drainage basin & Veerangal Odai canal status (Risk: {velachery_flood_risk}%)"
            ),
            CascadeNode(
                id="N_FLOOD_MUD",
                name="Mudichur / Adyar River Margin",
                type="HAZARD",
                risk_score=mudichur_flood_risk,
                status="CRITICAL" if mudichur_flood_risk >= 70 else ("WARNING" if mudichur_flood_risk >= 35 else "NORMAL"),
                description=f"Adyar river discharge and embankment margin state (Risk: {mudichur_flood_risk}%)"
            ),
            CascadeNode(
                id="N_ROAD_VEL",
                name="Velachery Main Road Impassable",
                type="ROAD",
                risk_score=vel_road_risk,
                status=vel_road_status,
                description=f"Primary arterial connection between Guindy & South GCC (Inundation prob: {vel_road_risk}%)"
            ),
            CascadeNode(
                id="N_ROAD_MUD",
                name="Mudichur Main Road Impassable",
                type="ROAD",
                risk_score=mud_road_risk,
                status=mud_road_status,
                description=f"Bridge approaches to West Tambaram (Inundation prob: {mud_road_risk}%)"
            ),
            CascadeNode(
                id="N_SUB_MUD",
                name="Mudichur 110kV Substation Trip",
                type="FACILITY",
                risk_score=sub_risk,
                status=sub_status,
                description=f"Low yard elevation switchgear vulnerability; isolates ~42k connections (Risk: {sub_risk}%)"
            ),
            CascadeNode(
                id="N_HOSP_MIOT",
                name="MIOT Hospital Emergency Route Cut",
                type="FACILITY",
                risk_score=miot_risk,
                status=miot_status,
                description=f"Direct ambulance corridor along Adyar margin; escalates ETA (Risk: {miot_risk}%)"
            ),
            CascadeNode(
                id="N_SHELT_MUD",
                name="Mudichur Relief Shelter Overcapacity & Blackout",
                type="FACILITY",
                risk_score=shelt_risk,
                status=shelt_status,
                description=f"Community relief shelter backup generator dependency; ground water encroachment (Risk: {shelt_risk}%)"
            ),
            CascadeNode(
                id="N_POP_ISOL",
                name="Isolated Dense Residential Pocket",
                type="POPULATION",
                risk_score=pop_risk,
                status=pop_status,
                description=f"Civilians in low-lying pockets cut off from surface road evacuation (Exposure Threat: {pop_risk}%)"
            )
        ]

        # Edges (Dependencies & Propagation)
        edges = [
            CascadeEdge(
                source="N_RAIN",
                target="N_FLOOD_VEL",
                dependency_type="INUNDATES",
                impact_weight=0.92,
                description="Catchment runoff accumulates into Velachery depression"
            ),
            CascadeEdge(
                source="N_RAIN",
                target="N_FLOOD_MUD",
                dependency_type="INUNDATES",
                impact_weight=0.95,
                description="Upstream Chembarambakkam outflow surges into Adyar floodplain"
            ),
            CascadeEdge(
                source="N_FLOOD_VEL",
                target="N_ROAD_VEL",
                dependency_type="SEVERS_ACCESS_TO",
                impact_weight=0.88,
                description="Standing water renders Velachery Main Road impassable for light & medium vehicles"
            ),
            CascadeEdge(
                source="N_FLOOD_MUD",
                target="N_ROAD_MUD",
                dependency_type="SEVERS_ACCESS_TO",
                impact_weight=0.94,
                description="Adyar overflow severs Mudichur arterial bridge crossing"
            ),
            CascadeEdge(
                source="N_FLOOD_MUD",
                target="N_SUB_MUD",
                dependency_type="INUNDATES",
                impact_weight=0.89,
                description="Low yard elevation causes water ingress into transformer substations"
            ),
            CascadeEdge(
                source="N_ROAD_VEL",
                target="N_HOSP_MIOT",
                dependency_type="DELAYS_EVACUATION",
                impact_weight=0.84,
                description="Emergency ambulances forced into 18km detour via elevated bypass"
            ),
            CascadeEdge(
                source="N_SUB_MUD",
                target="N_SHELT_MUD",
                dependency_type="CUTS_POWER_TO",
                impact_weight=0.79,
                description="Substation trip severs grid power to community relief shelters"
            ),
            CascadeEdge(
                source="N_ROAD_MUD",
                target="N_POP_ISOL",
                dependency_type="ISOLATES",
                impact_weight=0.96,
                description="Complete road severance traps 28,400 residents without boat access"
            )
        ]

        # Populate NetworkX graph
        for node in nodes:
            G.add_node(node.id, **node.model_dump())
        for edge in edges:
            G.add_edge(edge.source, edge.target, **edge.model_dump())

        crit_count = len([n for n in nodes if n.status in ['CRITICAL', 'IMPASSABLE', 'INUNDATED', 'ISOLATED', 'SEVERE_IMPACT']])
        if crit_count == 0:
            summary = "Cascade Analysis: Real-time telemetry indicates all critical nodes operating within nominal tolerances. Zero cascading network failures active."
        else:
            summary = f"Cascade Analysis: Inflow surge ({rainfall_multiplier:.2f}x) propagates into {crit_count} critical infrastructure failure nodes. Primary vulnerabilities: {vel_road_status} arterial connectivity and {sub_status} substation grid isolation."

        return CascadeGraph(nodes=nodes, edges=edges, propagation_summary=summary)

cascading_engine = CascadingFailureEngine()
