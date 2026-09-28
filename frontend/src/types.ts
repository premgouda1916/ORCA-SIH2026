export interface PFZ {
  id: string;
  latitude: number;
  longitude: number;
  advisory_time: string;
  region: string;
  depth_meters: number;
  distance_km?: number;
  direction?: string;
  sst_celsius: number;
  chlorophyll_mg_m3: number;
  valid_until: string;
  source: string;
  status: string;
}

export interface Weather {
  location: string;
  timestamp: string;
  wind_speed_knots: number;
  wind_direction: string;
  wave_height_meters: number;
  wave_period_seconds: number;
  sea_state: string;
  lightning_risk: string;
  cyclone_alert: string;
  source: string;
}

export interface Hazard {
  id: string;
  type: string;
  severity: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  start_time: string;
  end_time: string;
  description: string;
  source: string;
}

export interface Geofence {
  id: string;
  name: string;
  type: string;
  coordinates: number[][];
  danger_level: string;
  description: string;
}

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface Route {
  id: string;
  name: string;
  waypoints: RouteWaypoint[];
  distance_km: number;
  safety_score: number;
  intersects_geofence: boolean;
  avoided_hazards: string[];
  estimated_travel_time: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  source: string;
}

export interface Evidence {
  primary_sources: string[];
  retrieved_at: string;
  confidence: string;
  data_status: string;
  coverage_info: Record<string, any>;
}

export interface AgentTrace {
  agent: string;
  status: 'running' | 'completed' | 'warning' | 'failed';
  duration_ms: number;
  findings: string;
}

export interface ChatResponse {
  query: string;
  language: string;
  intent: string;
  answer: string;
  nearest_pfz?: PFZ;
  weather?: Weather;
  route?: Route;
  hazards: Hazard[];
  geofences: Geofence[];
  risk_level: 'LOW' | 'CAUTION' | 'HIGH' | 'UNSAFE';
  risk_factors: string[];
  agent_traces: AgentTrace[];
  evidence: Evidence;
  data_status: 'LIVE' | 'CACHED' | 'DEMO';
  timestamp: string;
}
