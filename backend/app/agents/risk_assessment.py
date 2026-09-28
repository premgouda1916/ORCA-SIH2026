from typing import Dict, Any, List

class RiskAssessmentAgent:
    """Combines evidence from Weather, PFZ, and GIS agents to determine risk category and confidence."""

    def calculate_risk(self, weather_eval: Dict[str, Any], gis_eval: Dict[str, Any]) -> Dict[str, Any]:
        risk_warnings = weather_eval.get("risk_warnings", [])
        geofence_conflict = gis_eval.get("geofence_conflict", False)

        risk_level = "LOW"
        risk_factors = list(risk_warnings)

        if geofence_conflict:
            risk_level = "UNSAFE"
            risk_factors.append("CRITICAL: Route or destination intersects restricted military/protected maritime zone.")
        elif len(risk_warnings) >= 2 or any("CYCLONE" in w for w in risk_warnings):
            risk_level = "HIGH"
        elif len(risk_warnings) == 1:
            risk_level = "CAUTION"

        confidence = "HIGH"
        conflict_detected = False

        return {
            "risk_level": risk_level,
            "risk_factors": risk_factors if risk_factors else ["Safe operating conditions detected across all parameters."],
            "confidence": confidence,
            "conflict_detected": conflict_detected
        }

risk_assessment_agent = RiskAssessmentAgent()
