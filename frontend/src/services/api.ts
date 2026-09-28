import axios from 'axios';
import type { ChatResponse, PFZ, Weather, Hazard, Geofence, Alert } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8008').replace(/\/$/, '');
const API_BASE = `${BASE_URL}/api`;

export const api = {
  async askTheSea(query: string, userLat = 12.8700, userLon = 74.8800, language = 'en', sessionId = 'session_1'): Promise<ChatResponse> {
    const res = await axios.post<ChatResponse>(`${API_BASE}/chat`, {
      query,
      user_latitude: userLat,
      user_longitude: userLon,
      language,
      session_id: sessionId
    });
    return res.data;
  },

  async getPFZs(): Promise<{ data: PFZ[]; status: string }> {
    const res = await axios.get(`${API_BASE}/pfz`);
    return res.data;
  },

  async getWeather(): Promise<{ data: Weather; status: string }> {
    const res = await axios.get(`${API_BASE}/weather`);
    return res.data;
  },

  async getHazards(): Promise<{ data: Hazard[]; status: string }> {
    const res = await axios.get(`${API_BASE}/hazards`);
    return res.data;
  },

  async getGeofences(): Promise<{ data: Geofence[]; status: string }> {
    const res = await axios.get(`${API_BASE}/geofences`);
    return res.data;
  },

  async getAlerts(): Promise<{ data: Alert[]; status: string }> {
    const res = await axios.get(`${API_BASE}/alerts`);
    return res.data;
  },

  async getAnalytics(): Promise<any> {
    const res = await axios.get(`${API_BASE}/analytics`);
    return res.data;
  },

  async getEvidence(): Promise<any> {
    const res = await axios.get(`${API_BASE}/evidence`);
    return res.data;
  }
};
