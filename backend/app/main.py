from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any, List

from app.schemas import ChatRequest, ChatResponse
from app.agents.orchestrator import orchestrator_agent
from app.services.mock_data import (
    SAMPLE_PFZS,
    SAMPLE_WEATHER,
    SAMPLE_HAZARDS,
    SAMPLE_GEOFENCES,
    SAMPLE_ALERTS,
    INCOIS_METADATA
)
from app.services.gis_service import generate_safe_route

app = FastAPI(
    title="ORCA — Marine EcOsystem Reasoning with Collaborative Agents",
    description="Smart India Hackathon 2026 Prototype API (Problem ID: 26176 | Team INNOVEXA)",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "ORCA Marine Decision Support Engine",
        "sih_problem_id": "26176",
        "team": "INNOVEXA",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
def ask_the_sea(request: ChatRequest):
    """Primary Ask the Sea Conversational Agent Endpoint."""
    try:
        response = orchestrator_agent.process_user_query(
            query=request.query,
            user_lat=request.user_latitude or 12.8700,
            user_lon=request.user_longitude or 74.8800,
            requested_lang=request.language or "en",
            session_id=request.session_id or "default_session"
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestrator Error: {str(e)}")

@app.get("/api/pfz")
def get_pfz_advisories():
    return {
        "status": "CACHED",
        "source": "INCOIS PFZ WebGIS",
        "count": len(SAMPLE_PFZS),
        "data": SAMPLE_PFZS
    }

@app.get("/api/ocean")
def get_ocean_state():
    return {
        "status": "CACHED",
        "source": "INCOIS ERDDAP Satellite SST & Chlorophyll-a",
        "data": {
            "sst_avg_celsius": 28.6,
            "chlorophyll_avg_mg_m3": 3.5,
            "upwelling_index": "MODERATE",
            "current_speed_knots": 1.2,
            "current_direction": "SW"
        }
    }

@app.get("/api/weather")
def get_weather_forecast():
    return {
        "status": "CACHED",
        "source": "INCOIS Ocean State Forecast",
        "data": SAMPLE_WEATHER
    }

@app.get("/api/hazards")
def get_active_hazards():
    return {
        "status": "CACHED",
        "source": "INCOIS & IMD Advisories",
        "count": len(SAMPLE_HAZARDS),
        "data": SAMPLE_HAZARDS
    }

@app.get("/api/geofences")
def get_geofences():
    return {
        "status": "CACHED",
        "source": "NRSC / Bhuvan Maritime GIS",
        "count": len(SAMPLE_GEOFENCES),
        "data": SAMPLE_GEOFENCES
    }

@app.get("/api/routes")
def get_safe_route(
    start_lat: float = 12.8700,
    start_lon: float = 74.8800,
    end_lat: float = 12.9200,
    end_lon: float = 74.6500
):
    route = generate_safe_route(start_lat, start_lon, end_lat, end_lon, SAMPLE_HAZARDS, SAMPLE_GEOFENCES)
    return {
        "status": "COMPUTED",
        "data": route
    }

@app.get("/api/alerts")
def get_proactive_alerts():
    return {
        "status": "ACTIVE",
        "count": len(SAMPLE_ALERTS),
        "data": SAMPLE_ALERTS
    }

@app.get("/api/evidence")
def get_evidence_metadata():
    return {
        "coverage": INCOIS_METADATA,
        "data_sources": [
            {"name": "INCOIS PFZ WebGIS", "url": "https://www.incois.gov.in/MarineFisheries/PfzWebGis", "nodes": 1223},
            {"name": "INCOIS Ocean State Forecast", "url": "https://incois.gov.in/oceanservices/osfforecast.jsp", "nodes": 586},
            {"name": "INCOIS ERDDAP WMS", "url": "https://erddap.incois.gov.in/erddap/wms/", "nodes": "Global/Indian Ocean"},
            {"name": "Bhuvan / NRSC ISRO", "url": "https://bhuvan.nrsc.gov.in/", "nodes": "Pan-India GIS"}
        ]
    }

@app.get("/api/analytics")
def get_analytics_data():
    """Returns historical/trend data for SST, Chlorophyll, Wave Height, and PFZ productivity."""
    return {
        "sst_trend": [
            {"date": "Sep 22", "sst": 28.1, "threshold": 28.5},
            {"date": "Sep 23", "sst": 28.3, "threshold": 28.5},
            {"date": "Sep 24", "sst": 28.6, "threshold": 28.5},
            {"date": "Sep 25", "sst": 28.9, "threshold": 28.5},
            {"date": "Sep 26", "sst": 29.1, "threshold": 28.5},
            {"date": "Sep 27", "sst": 28.7, "threshold": 28.5},
            {"date": "Sep 28", "sst": 28.6, "threshold": 28.5}
        ],
        "chlorophyll_trend": [
            {"date": "Sep 22", "chl": 2.1},
            {"date": "Sep 23", "chl": 2.5},
            {"date": "Sep 24", "chl": 3.2},
            {"date": "Sep 25", "chl": 4.1},
            {"date": "Sep 26", "chl": 3.8},
            {"date": "Sep 27", "chl": 3.5},
            {"date": "Sep 28", "chl": 3.8}
        ],
        "wave_trend": [
            {"time": "00:00", "wave_height": 1.2},
            {"time": "04:00", "wave_height": 1.4},
            {"time": "08:00", "wave_height": 1.8},
            {"time": "12:00", "wave_height": 2.1},
            {"time": "16:00", "wave_height": 1.9},
            {"time": "20:00", "wave_height": 1.5}
        ],
        "productivity_factors": [
            {"factor": "Optimal Thermal Range (SST)", "contribution": "35%"},
            {"factor": "Chlorophyll-a Bloom Index", "contribution": "40%"},
            {"factor": "Coastal Upwelling Currents", "contribution": "15%"},
            {"factor": "Salinity & Dissolved Oxygen", "contribution": "10%"}
        ]
    }

# Serve built frontend static files in production if frontend/dist exists
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

