from typing import Dict, Any, List
from app.services.gis_service import generate_safe_route, check_geofence_intersection
from app.services.mock_data import SAMPLE_GEOFENCES, SAMPLE_HAZARDS

class RouteGISAgent:
    """Specialized GIS agent for spatial reasoning, geofence collision detection, and safe maritime navigation routing."""

    def compute_route_and_geofences(self, start_lat: float, start_lon: float, end_lat: float, end_lon: float) -> Dict[str, Any]:
        # Check start or end intersection with restricted geofences
        intersected = check_geofence_intersection(end_lat, end_lon, SAMPLE_GEOFENCES)
        
        # Calculate safe route
        route = generate_safe_route(start_lat, start_lon, end_lat, end_lon, SAMPLE_HAZARDS, SAMPLE_GEOFENCES)

        return {
            "route": route,
            "all_geofences": SAMPLE_GEOFENCES,
            "geofence_conflict": len(intersected) > 0,
            "intersected_geofences": intersected
        }

route_gis_agent = RouteGISAgent()
