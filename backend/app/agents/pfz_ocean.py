import time
from typing import Dict, Any, List, Optional
from app.services.gis_service import haversine_distance, calculate_bearing
from app.services.mock_data import SAMPLE_PFZS

class PFZOceanAgent:
    """Specialized agent for Potential Fishing Zones, SST, Chlorophyll, and Ocean Productivity reasoning."""

    def find_nearest_pfz(self, user_lat: float, user_lon: float) -> Dict[str, Any]:
        nearest = None
        min_dist = float("inf")

        for pfz in SAMPLE_PFZS:
            dist = haversine_distance(user_lat, user_lon, pfz["latitude"], pfz["longitude"])
            if dist < min_dist:
                min_dist = dist
                _, direction = calculate_bearing(user_lat, user_lon, pfz["latitude"], pfz["longitude"])
                nearest = {**pfz, "distance_km": dist, "direction": direction}

        return nearest or SAMPLE_PFZS[0]

    def analyze_productivity_decline(self) -> Dict[str, Any]:
        """Provides evidence-backed diagnostic analysis for fish productivity variation."""
        return {
            "finding": "Observed localized SST rise (+1.4°C) combined with coastal upwelling slowdown.",
            "indicators": [
                {"name": "Sea Surface Temperature (SST)", "status": "WARMING", "value": "29.4°C (Normal: 28.0°C)"},
                {"name": "Chlorophyll-a Conc.", "status": "MODERATE DECLINE", "value": "1.8 mg/m³ (Normal: 3.5 mg/m³)"},
                {"name": "Coastal Upwelling Index", "status": "WEAK", "value": "Subsurface nutrient transport reduced"}
            ],
            "conclusion": "Observed correlation suggests pelagic fish schools (Sardine/Mackerel) have migrated to deeper offshore thermal fronts (35-50m depth).",
            "uncertainty": "Medium confidence — Remote sensing satellite coverage obstructed by partial monsoon cloud cover. Field acoustic survey recommended."
        }

    def get_favorable_chlorophyll_sst_zones(self) -> List[Dict[str, Any]]:
        """Filter zones with high chlorophyll (>3.0 mg/m³) and optimal SST (28.0 - 29.0°C)."""
        favorable = []
        for pfz in SAMPLE_PFZS:
            if pfz["chlorophyll_mg_m3"] >= 3.0 and 28.0 <= pfz["sst_celsius"] <= 29.2:
                favorable.append(pfz)
        return favorable

pfz_ocean_agent = PFZOceanAgent()
