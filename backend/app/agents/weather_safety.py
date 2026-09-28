from typing import Dict, Any, List
from app.services.mock_data import SAMPLE_WEATHER, SAMPLE_HAZARDS

class WeatherSafetyAgent:
    """Specialized agent for Wind, Wave Height, Sea State, Cyclone, and Lightning safety evaluation."""

    def evaluate_safety(self, location_name: str = "Mangaluru Coast") -> Dict[str, Any]:
        w = SAMPLE_WEATHER
        hazards = SAMPLE_HAZARDS

        safety_factors = []
        risk_warnings = []

        # Wind evaluation
        if w["wind_speed_knots"] > 22.0:
            risk_warnings.append(f"Strong offshore wind detected ({w['wind_speed_knots']} knots). Small craft danger.")
        else:
            safety_factors.append(f"Moderate wind speed ({w['wind_speed_knots']} knots {w['wind_direction']}).")

        # Wave height evaluation
        if w["wave_height_meters"] >= 2.0:
            risk_warnings.append(f"High wave heights expected ({w['wave_height_meters']}m swell). Rough sea state.")
        else:
            safety_factors.append(f"Wave height within operable limits ({w['wave_height_meters']}m, period {w['wave_period_seconds']}s).")

        # Lightning evaluation
        if w["lightning_risk"] in ["MODERATE", "HIGH"]:
            risk_warnings.append("Isolated thunderstorm & lightning risk active near Malpe/Mangaluru coastal waters.")
        
        # Cyclone evaluation
        if w["cyclone_alert"] != "NONE":
            risk_warnings.append(f"CYCLONE WARNING ACTIVE: {w['cyclone_alert']}. Do NOT venture into deep sea.")
        else:
            safety_factors.append("No active cyclone warning reported by IMD/INCOIS.")

        return {
            "weather": w,
            "hazards": hazards,
            "safety_factors": safety_factors,
            "risk_warnings": risk_warnings
        }

weather_safety_agent = WeatherSafetyAgent()
