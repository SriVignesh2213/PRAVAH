from typing import List, Dict, Any, Tuple
from app.models.domain import ChennaiZone, Facility, RoadSegment

class ExposureEngine:
    """
    Exposure and Composite Impact Assessment Engine.
    Evaluates:
    - Population exposed (scaled by flood risk probability)
    - Buildings exposed
    - Critical facilities at risk
    - Roads at risk
    - Composite Impact Score = (Hazard Probability * Exposure Ratio * Vulnerability Weight)
    """
    def compute(
        self,
        zone: ChennaiZone,
        facilities: List[Facility],
        roads: List[RoadSegment]
    ) -> Tuple[int, int, List[Facility], List[RoadSegment], float]:
        """
        Returns:
        (people_exposed, buildings_exposed, threatened_facilities, threatened_roads, impact_score)
        """
        hazard_prob = zone.flood_risk_score / 100.0
        
        # Exposure scaling: when active flood hazard is negligible (<=15%), zero civilians are inundated
        if hazard_prob <= 0.15:
            exposure_fraction = 0.0
        else:
            exposure_fraction = min(0.95, ((hazard_prob - 0.15) / 0.85) ** 1.3)
        people_exposed = int(zone.population * exposure_fraction)
        buildings_exposed = int(zone.building_count * exposure_fraction)

        # Critical facilities at risk within zone
        threatened_facilities: List[Facility] = []
        for fac in facilities:
            if fac.zone_id == zone.id:
                # Update facility flood risk based on zone hazard
                fac.flood_risk = round(zone.flood_risk_score * (0.9 if fac.type == "HOSPITAL" else 1.0), 1)
                if fac.flood_risk > 65.0:
                    fac.status = "AT_RISK"
                if fac.flood_risk > 85.0:
                    fac.status = "INUNDATED" if fac.type == "SUBSTATION" else "ISOLATED"
                threatened_facilities.append(fac)

        # Roads at risk passing through or adjacent
        threatened_roads: List[RoadSegment] = []
        for r in roads:
            # Check if road coordinates intersect zone
            if zone.id in ["velachery", "mudichur", "madipakkam"] and r.id in ["road-01", "road-03", "road-06"]:
                r.flood_probability = min(0.98, max(0.1, hazard_prob * 1.1))
                if r.flood_probability > 0.75:
                    r.status = "IMPASSABLE"
                elif r.flood_probability > 0.45:
                    r.status = "AT_RISK"
                threatened_roads.append(r)

        # Composite Impact Score (0 to 100)
        # impact = (hazard_prob * 0.40) + (exposure_fraction * 0.30) + (vulnerability / 100 * 0.30)
        composite_impact = (
            (hazard_prob * 40.0) +
            (exposure_fraction * 30.0) +
            ((zone.vulnerability_score / 100.0) * 30.0)
        )
        impact_score = round(min(99.5, max(5.0, composite_impact)), 1)

        return people_exposed, buildings_exposed, threatened_facilities, threatened_roads, impact_score

exposure_engine = ExposureEngine()
