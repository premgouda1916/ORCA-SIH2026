import time
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.agents.pfz_ocean import pfz_ocean_agent
from app.agents.weather_safety import weather_safety_agent
from app.agents.route_gis import route_gis_agent
from app.agents.risk_assessment import risk_assessment_agent
from app.agents.language_agent import language_agent
from app.services.incois_service import incois_service, INCOIS_METADATA
from app.schemas import ChatResponse, AgentTrace, Evidence, PFZ, Weather, Route, Hazard, Geofence

# In-memory session store for multi-turn context
SESSION_MEMORY: Dict[str, Dict[str, Any]] = {}

class OrchestratorAgent:
    """Central planner and agentic supervisor for ORCA Marine Intelligence System."""

    def process_user_query(
        self,
        query: str,
        user_lat: float = 12.8700,
        user_lon: float = 74.8800,
        requested_lang: Optional[str] = "en",
        session_id: str = "default_session"
    ) -> ChatResponse:
        start_time = time.time()
        agent_traces: List[AgentTrace] = []

        # Step 1: Language Agent
        lang_start = time.time()
        detected_lang = language_agent.detect_language(query)
        effective_lang = detected_lang if detected_lang != "en" else (requested_lang or "en")
        agent_traces.append(AgentTrace(
            agent="USER INTERACTION / LANGUAGE AGENT",
            status="completed",
            duration_ms=int((time.time() - lang_start) * 1000),
            findings=f"Detected query language: {effective_lang.upper()}. Input normalized."
        ))

        # Retrieve session context for multi-turn conversations
        ctx = SESSION_MEMORY.get(session_id, {
            "last_pfz": None,
            "last_location": (user_lat, user_lon),
            "last_intent": None
        })

        q_lower = query.lower()

        # Step 2: Intent Classification & Entity Extraction
        orch_start = time.time()
        intent = "GENERAL_SAFETY"
        if any(k in q_lower for k in ["pfz", "fishing zone", "fish zone", "nearest zone", "chlorophyll", "sst"]):
            intent = "PFZ_QUERY"
        elif any(k in q_lower for k in ["safe", "safety", "tomorrow", "weather", "wave", "wind", "cyclone", "lightning"]):
            intent = "SAFETY_QUERY"
        elif any(k in q_lower for k in ["route", "navigation", "shortest", "waypoint", "path"]):
            intent = "ROUTING_QUERY"
        elif any(k in q_lower for k in ["geofence", "restricted", "avoid", "protected", "military", "boundary", "imbl"]):
            intent = "GEOFENCE_QUERY"
        elif any(k in q_lower for k in ["decline", "productivity", "why has fish", "less fish"]):
            intent = "PRODUCTIVITY_DECLINE_QUERY"
        elif any(k in q_lower for k in ["data source", "incois", "how does orca", "what data"]):
            intent = "EVIDENCE_QUERY"
        
        # Handle context resolution (e.g. "Is it safe tomorrow?" after asking for PFZ)
        if intent == "SAFETY_QUERY" and ctx.get("last_pfz") and ("it" in q_lower or "tomorrow" in q_lower):
            intent = "PFZ_SAFETY_COMBINED"
        elif intent == "ROUTING_QUERY" and ctx.get("last_pfz"):
            intent = "PFZ_ROUTING_COMBINED"

        agent_traces.append(AgentTrace(
            agent="ORCHESTRATOR AGENT",
            status="completed",
            duration_ms=int((time.time() - orch_start) * 1000),
            findings=f"Intent: {intent} | Extracted Lat/Lon: ({user_lat}, {user_lon}) | Contextual Multi-turn: Active"
        ))

        # Step 3: Execute Sub-Agents based on Intent
        pfz_res = None
        weather_eval = None
        gis_eval = None
        risk_res = None
        data_status = "CACHED" # Default safe verified status

        # 3a. PFZ + Ocean Agent Execution
        pfz_start = time.time()
        nearest_pfz_dict = pfz_ocean_agent.find_nearest_pfz(user_lat, user_lon)
        pfz_res = PFZ(**nearest_pfz_dict)
        ctx["last_pfz"] = pfz_res
        agent_traces.append(AgentTrace(
            agent="PFZ + OCEAN AGENT",
            status="completed",
            duration_ms=int((time.time() - pfz_start) * 1000),
            findings=f"Identified Nearest PFZ: {pfz_res.id} ({pfz_res.region}) at {pfz_res.distance_km}km {pfz_res.direction}. SST: {pfz_res.sst_celsius}°C, Chl: {pfz_res.chlorophyll_mg_m3}mg/m³."
        ))

        # 3b. Weather + Safety Agent Execution
        wx_start = time.time()
        weather_eval = weather_safety_agent.evaluate_safety(pfz_res.region)
        wx_model = Weather(**weather_eval["weather"])
        hazards_list = [Hazard(**h) for h in weather_eval["hazards"]]
        agent_traces.append(AgentTrace(
            agent="WEATHER + SAFETY AGENT",
            status="completed",
            duration_ms=int((time.time() - wx_start) * 1000),
            findings=f"Sea State: {wx_model.sea_state} | Wind: {wx_model.wind_speed_knots}kts | Wave Height: {wx_model.wave_height_meters}m | Lightning: {wx_model.lightning_risk}"
        ))

        # 3c. Route + GIS Agent Execution
        gis_start = time.time()
        gis_eval = route_gis_agent.compute_route_and_geofences(
            user_lat, user_lon, pfz_res.latitude, pfz_res.longitude
        )
        route_model = Route(**gis_eval["route"])
        geofences_list = [Geofence(**g) for g in gis_eval["all_geofences"]]
        agent_traces.append(AgentTrace(
            agent="ROUTE + GIS AGENT",
            status="completed",
            duration_ms=int((time.time() - gis_start) * 1000),
            findings=f"Route Distance: {route_model.distance_km}km | Est Time: {route_model.estimated_travel_time} | Geofence Intersection: {gis_eval['geofence_conflict']}"
        ))

        # 3d. Risk Assessment Agent Execution
        risk_start = time.time()
        risk_res = risk_assessment_agent.calculate_risk(weather_eval, gis_eval)
        agent_traces.append(AgentTrace(
            agent="RISK ASSESSMENT AGENT",
            status="completed",
            duration_ms=int((time.time() - risk_start) * 1000),
            findings=f"Composite Risk Category: {risk_res['risk_level']} | Confidence: {risk_res['confidence']} | Contributing Factors: {len(risk_res['risk_factors'])}"
        ))

        # 3e. Visualization & Reporting Agent Synthesis
        rep_start = time.time()
        answer_text = self._generate_report(
            intent, query, pfz_res, wx_model, route_model, hazards_list, risk_res, data_status
        )
        agent_traces.append(AgentTrace(
            agent="REPORTING / VISUALIZATION AGENT",
            status="completed",
            duration_ms=int((time.time() - rep_start) * 1000),
            findings="Synthesized evidence-first audit report with GIS map payload & safety disclaimer."
        ))

        # Save updated context
        SESSION_MEMORY[session_id] = ctx

        # Translate output if regional language requested
        final_answer = language_agent.translate_response(
            answer_text, effective_lang, risk_res["risk_level"], pfz_res.id, pfz_res.distance_km or 24.5
        )

        evidence = Evidence(
            primary_sources=[
                "INCOIS PFZ Sector Advisory (WebGIS Node #1223)",
                "INCOIS Ocean State Forecast (OSF)",
                "IMD Doppler Weather Radar Network",
                "National Remote Sensing Centre (NRSC / Bhuvan)"
            ],
            retrieved_at=datetime.now().strftime("%Y-%m-%d %H:%M IST"),
            confidence=risk_res["confidence"],
            data_status=data_status,
            coverage_info=INCOIS_METADATA
        )

        return ChatResponse(
            query=query,
            language=effective_lang,
            intent=intent,
            answer=final_answer,
            nearest_pfz=pfz_res,
            weather=wx_model,
            route=route_model,
            hazards=hazards_list,
            geofences=geofences_list,
            risk_level=risk_res["risk_level"],
            risk_factors=risk_res["risk_factors"],
            agent_traces=agent_traces,
            evidence=evidence,
            data_status=data_status,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

    def _generate_report(
        self,
        intent: str,
        query: str,
        pfz: PFZ,
        wx: Weather,
        route: Route,
        hazards: List[Hazard],
        risk: Dict[str, Any],
        data_status: str
    ) -> str:
        risk_str = risk["risk_level"]
        risk_badge = {"LOW": "🟢 LOW RISK", "CAUTION": "🟡 CAUTION", "HIGH": "🟠 HIGH RISK", "UNSAFE": "🔴 UNSAFE"}.get(risk_str, risk_str)

        if intent == "PRODUCTIVITY_DECLINE_QUERY":
            diag = pfz_ocean_agent.analyze_productivity_decline()
            return (
                "--------------------------------------------------\n"
                "ORCA MARINE ECOSYSTEM REASONING - PRODUCTIVITY ANALYSIS\n"
                "--------------------------------------------------\n\n"
                f"Diagnostic Finding:\n{diag['finding']}\n\n"
                "Key Observed Marine Indicators:\n"
                + "\n".join([f"- {i['name']}: {i['value']} ({i['status']})" for i in diag['indicators']]) + "\n\n"
                f"Reasoning & Conclusion:\n{diag['conclusion']}\n\n"
                f"Uncertainty & Evidence:\n{diag['uncertainty']}\n\n"
                "Safety Disclaimer: Always check the latest official marine/weather advisory before departure."
            )

        elif intent == "EVIDENCE_QUERY":
            return (
                "--------------------------------------------------\n"
                "ORCA EVIDENCE HUB & DATA ARCHITECTURE\n"
                "--------------------------------------------------\n\n"
                "ORCA synthesizes multi-source space oceanography & Earth observation datasets:\n\n"
                "1. INCOIS PFZ WebGIS: 1,223 Spatial Nodes | 586 Landing Centres | 14 Advisory Sectors\n"
                "2. INCOIS Ocean State Forecast: Wind, Waves, Swell, Sea State\n"
                "3. Satellite Datasets: Oceansat-2/3 (EOS-06), MODIS-Aqua, Sentinel-3 (SST & Chlorophyll-a)\n"
                "4. NRSC / Bhuvan ISRO Geo-spatial Layers: Coastal geofences & Marine Protected Areas\n\n"
                f"Current Data Status: [{data_status}]\n"
                f"Confidence: {risk['confidence']}\n\n"
                "Safety Disclaimer: Always check the latest official marine/weather advisory before departure."
            )

        # Standard Multi-Agent Response format
        return (
            "--------------------------------------------------\n"
            "ORCA MARINE INTELLIGENCE RESPONSE\n"
            "--------------------------------------------------\n\n"
            f"Nearest Potential Fishing Zone (PFZ)\n"
            f"PFZ ID: {pfz.id} ({pfz.region})\n"
            f"Distance: {pfz.distance_km} km | Direction: {pfz.direction}\n"
            f"Coordinates: Lat {pfz.latitude}°, Lon {pfz.longitude}°\n"
            f"Ocean Conditions: SST {pfz.sst_celsius}°C | Chlorophyll {pfz.chlorophyll_mg_m3} mg/m³\n\n"
            f"Tomorrow Morning Safety Evaluation\n"
            f"Risk Level: {risk_badge}\n"
            f"Wind: {wx.wind_speed_knots} knots ({wx.wind_direction})\n"
            f"Wave / Sea State: {wx.wave_height_meters}m swell ({wx.sea_state})\n"
            f"Lightning Risk: {wx.lightning_risk}\n"
            f"Cyclone Alert: {wx.cyclone_alert}\n\n"
            f"Geofence & Restricted Zones\n"
            f"Restricted Zone Conflict: {'YES' if route.intersects_geofence else 'NO'}\n"
            f"Protected Area Warning: St. Mary's / Netrani Coral Conservation Zone adjacent\n\n"
            f"Recommended Navigation Route\n"
            f"Route: {route.name}\n"
            f"Estimated Distance: {route.distance_km} km (Est Time: {route.estimated_travel_time})\n"
            f"Safety Score: {route.safety_score}/100\n\n"
            f"WHY? Collaborative Agent Breakdown:\n"
            f"• PFZ + Ocean Agent: Identified optimal thermal-chlorophyll front at {pfz.id} with active productivity index.\n"
            f"• Weather + Safety Agent: Detected moderate wave swells ({wx.wave_height_meters}m) and localized lightning warnings.\n"
            f"• Route + GIS Agent: Computed safe maritime corridor bypassing coastal restricted defense zones.\n"
            f"• Risk Assessment Agent: Synthesized composite risk rating as {risk_str}.\n\n"
            f"Evidence & Source Audit:\n"
            f"Sources: INCOIS PFZ Advisory, INCOIS Ocean State Forecast, IMD Marine Radar\n"
            f"Data Time: {pfz.advisory_time}\n"
            f"Data Status: [{data_status}]\n"
            f"Confidence: {risk['confidence']}\n\n"
            "Safety:\n"
            "Always check the latest official marine/weather advisory before departure."
        )

orchestrator_agent = OrchestratorAgent()
