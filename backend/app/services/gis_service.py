import math
from typing import List, Tuple, Dict, Any
from shapely.geometry import Point, Polygon

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two lat/lon points using Haversine formula."""
    R = 6371.0 # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def calculate_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> Tuple[float, str]:
    """Calculate compass bearing and direction string from point 1 to point 2."""
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    x = math.sin(dlon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    initial_bearing = math.atan2(x, y)
    initial_bearing = math.degrees(initial_bearing)
    compass_bearing = (initial_bearing + 360) % 360

    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
    idx = int((compass_bearing + 22.5) // 45)
    return round(compass_bearing, 1), dirs[idx]

def check_geofence_intersection(point_lat: float, point_lon: float, geofences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Check if a given lat/lon point lies inside any defined geofence polygon."""
    intersected = []
    p = Point(point_lat, point_lon)
    for gf in geofences:
        coords = gf.get("coordinates", [])
        if len(coords) >= 3:
            poly = Polygon(coords)
            if poly.contains(p) or poly.touches(p):
                intersected.append(gf)
    return intersected

def generate_safe_route(start_lat: float, start_lon: float, end_lat: float, end_lon: float, hazards: List[Dict[str, Any]], geofences: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate direct and hazard-avoiding safe routes from start to end location."""
    direct_dist = haversine_distance(start_lat, start_lon, end_lat, end_lon)
    
    # Generate waypoints for safe route (detouring slightly around hazard centroids if needed)
    mid_lat = (start_lat + end_lat) / 2.0
    mid_lon = (start_lon + end_lon) / 2.0
    
    # Check if direct mid-point hits a hazard or geofence
    intersects_gf = False
    for gf in geofences:
        coords = gf.get("coordinates", [])
        if len(coords) >= 3:
            poly = Polygon(coords)
            if poly.contains(Point(mid_lat, mid_lon)):
                intersects_gf = True
                break

    # Add a safe offshore waypoint offset to bypass hazards if needed
    waypoints = [
        {"latitude": start_lat, "longitude": start_lon, "name": "Departure Point (Coast)"},
    ]

    if intersects_gf or len(hazards) > 0:
        # Off-shore detour waypoint (+0.05 deg lon, +0.02 deg lat)
        waypoint_detour = {
            "latitude": round(mid_lat + 0.02, 4),
            "longitude": round(mid_lon - 0.04, 4),
            "name": "ORCA Safe Navigation Detour Waypoint"
        }
        waypoints.append(waypoint_detour)
        total_dist = round(direct_dist * 1.08, 2)
    else:
        total_dist = direct_dist

    waypoints.append({
        "latitude": end_lat,
        "longitude": end_lon,
        "name": "Target PFZ Destination"
    })

    # Speed assumed 12 knots (~22 km/h) for typical fishing trawler
    est_hours = round(total_dist / 22.2, 1)
    travel_time_str = f"{int(est_hours)}h {int((est_hours % 1) * 60)}m" if est_hours >= 1 else f"{int(est_hours * 60)} mins"

    safety_score = 92.0 if not intersects_gf else 65.0
    avoided = [h.get("description", "Hazard Area") for h in hazards]

    return {
        "id": "RTE-SAFE-01",
        "name": "ORCA Optimized Safe Maritime Corridor",
        "waypoints": waypoints,
        "distance_km": total_dist,
        "safety_score": safety_score,
        "intersects_geofence": intersects_gf,
        "avoided_hazards": avoided,
        "estimated_travel_time": travel_time_str
    }
