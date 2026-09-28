from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union

class MarineObservation(BaseModel):
    source: str
    timestamp: str
    latitude: float
    longitude: float
    variable: str
    value: float
    unit: str
    quality: str = "GOOD"
    confidence: float = 0.95

class PFZ(BaseModel):
    id: str
    latitude: float
    longitude: float
    advisory_time: str
    region: str
    depth_meters: float
    distance_km: Optional[float] = None
    direction: Optional[str] = None
    sst_celsius: float
    chlorophyll_mg_m3: float
    valid_until: str
    source: str = "INCOIS PFZ Advisory"
    status: str = "ACTIVE"

class Weather(BaseModel):
    location: str
    timestamp: str
    wind_speed_knots: float
    wind_direction: str
    wave_height_meters: float
    wave_period_seconds: float
    sea_state: str
    lightning_risk: str # "NONE", "LOW", "MODERATE", "HIGH"
    cyclone_alert: str # "NONE", "WATCH", "WARNING"
    source: str = "INCOIS Ocean State Forecast"

class Hazard(BaseModel):
    id: str
    type: str # "HIGH_WAVE", "LIGHTNING", "CYCLONE", "STRONG_CURRENT"
    severity: str # "LOW", "MODERATE", "HIGH", "CRITICAL"
    latitude: float
    longitude: float
    radius_km: float
    start_time: str
    end_time: str
    description: str
    source: str = "INCOIS & IMD Advisories"

class Geofence(BaseModel):
    id: str
    name: str
    type: str # "RESTRICTED", "PROTECTED", "NAVY_RANGE", "MARITIME_BORDER"
    coordinates: List[List[float]] # [[lat, lon], ...]
    danger_level: str
    description: str

class RouteWaypoint(BaseModel):
    latitude: float
    longitude: float
    name: Optional[str] = None

class Route(BaseModel):
    id: str
    name: str
    waypoints: List[RouteWaypoint]
    distance_km: float
    safety_score: float # 0 to 100
    intersects_geofence: bool
    avoided_hazards: List[str]
    estimated_travel_time: str

class Alert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: str
    location: str
    latitude: float
    longitude: float
    timestamp: str
    source: str

class Evidence(BaseModel):
    primary_sources: List[str]
    retrieved_at: str
    confidence: str # "HIGH", "MEDIUM", "LOW"
    data_status: str # "LIVE", "CACHED", "DEMO"
    coverage_info: Dict[str, Any]

class AgentTrace(BaseModel):
    agent: str
    status: str # "running", "completed", "warning", "failed"
    duration_ms: int
    findings: str

class ChatRequest(BaseModel):
    query: str
    user_latitude: Optional[float] = 12.8700 # Default Mangaluru Coast
    user_longitude: Optional[float] = 74.8800
    language: Optional[str] = "en"
    session_id: Optional[str] = "default_session"

class ChatResponse(BaseModel):
    query: str
    language: str
    intent: str
    answer: str
    nearest_pfz: Optional[PFZ] = None
    weather: Optional[Weather] = None
    route: Optional[Route] = None
    hazards: List[Hazard] = []
    geofences: List[Geofence] = []
    risk_level: str # "LOW", "CAUTION", "HIGH", "UNSAFE"
    risk_factors: List[str] = []
    agent_traces: List[AgentTrace] = []
    evidence: Evidence
    data_status: str # "LIVE", "CACHED", "DEMO"
    timestamp: str
