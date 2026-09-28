import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { JudgeDemoToolbar } from './components/JudgeDemoToolbar';
import { AskTheSeaChat } from './components/AskTheSeaChat';
import { MarineMap } from './components/MarineMap';
import { AlertsPanel } from './components/AlertsPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { EvidenceHub } from './components/EvidenceHub';
import { api } from './services/api';
import type { ChatResponse, PFZ, Hazard, Geofence, Route, Alert } from './types';
import { ShieldCheck, MapPin, Fish, CloudLightning, Compass, Bell, BarChart2, FileCheck2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [dataStatus, setDataStatus] = useState<'LIVE' | 'CACHED' | 'DEMO'>('CACHED');
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Marine State
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [pfzs, setPfzs] = useState<PFZ[]>([]);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Initial Data Load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [pfzRes, hazRes, geoRes, altRes, anaRes] = await Promise.all([
        api.getPFZs(),
        api.getHazards(),
        api.getGeofences(),
        api.getAlerts(),
        api.getAnalytics()
      ]);

      setPfzs(pfzRes.data);
      setHazards(hazRes.data);
      setGeofences(geoRes.data);
      setAlerts(altRes.data);
      setAnalyticsData(anaRes);
      setDataStatus('CACHED');
    } catch (err) {
      console.warn('Backend server offline or starting. Using structured demo dataset.');
      setDataStatus('DEMO');
    }
  };

  const handleSendMessage = async (queryText: string) => {
    setIsLoading(true);
    try {
      const response = await api.askTheSea(queryText, 12.8700, 74.8800, selectedLang);
      setChatResponse(response);
      if (response.data_status) {
        setDataStatus(response.data_status as any);
      }
      if (response.nearest_pfz && !pfzs.some(p => p.id === response.nearest_pfz?.id)) {
        setPfzs(prev => [response.nearest_pfz!, ...prev]);
      }
    } catch (err) {
      console.error('Error querying ORCA Orchestrator:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        dataStatus={dataStatus}
        selectedLang={selectedLang}
        onLanguageChange={setSelectedLang}
      />

      {/* SIH Judge Demo Preset Toolbar */}
      <JudgeDemoToolbar
        onSelectQuery={handleSendMessage}
        isLoading={isLoading}
      />

      {/* Main Body: Sidebar + Dynamic Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={alerts.length}
        />

        {/* Dynamic Workspace Panel */}
        <main className="flex-1 p-4 lg:p-5 overflow-hidden flex flex-col min-h-0">
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
              {/* Left Column: Ask the Sea Chat */}
              <div className="lg:col-span-7 h-full">
                <AskTheSeaChat
                  onSendMessage={handleSendMessage}
                  chatResponse={chatResponse}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Embedded Interactive Marine GIS Map */}
              <div className="lg:col-span-5 h-full flex flex-col glass-panel p-4 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Real-Time GIS Spatial Context</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-[11px] text-cyan-400 hover:underline font-semibold"
                  >
                    Expand Map →
                  </button>
                </div>
                <div className="flex-1">
                  <MarineMap
                    pfzs={pfzs}
                    hazards={hazards}
                    geofences={geofences}
                    route={chatResponse?.route}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-[calc(100vh-145px)] flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-cyan-300">INTERACTIVE MARINE GIS COMMAND CENTER</h2>
                  <p className="text-xs text-slate-400">Leaflet ocean map with layer control: PFZ markers, wave height, restricted geofences, and safe corridors.</p>
                </div>
              </div>
              <div className="flex-1">
                <MarineMap
                  pfzs={pfzs}
                  hazards={hazards}
                  geofences={geofences}
                  route={chatResponse?.route}
                />
              </div>
            </div>
          )}

          {activeTab === 'pfz' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-emerald-400 flex items-center space-x-2">
                    <Fish className="w-5 h-5" />
                    <span>POTENTIAL FISHING ZONE (PFZ) INTELLIGENCE</span>
                  </h2>
                  <p className="text-xs text-slate-400">INCOIS Sector 7 & 8 Active Advisories</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pfzs.map((pfz) => (
                  <div key={pfz.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-400 text-xs">{pfz.id}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">ACTIVE</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200">{pfz.region}</p>
                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                      <p>Distance: <span className="font-bold text-cyan-300">{pfz.distance_km || 24.5} km</span></p>
                      <p>SST: <span className="font-bold text-rose-300">{pfz.sst_celsius}°C</span></p>
                      <p>Chlorophyll: <span className="font-bold text-emerald-300">{pfz.chlorophyll_mg_m3} mg/m³</span></p>
                      <p>Depth: <span className="text-slate-400">{pfz.depth_meters} meters</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <CloudLightning className="w-6 h-6 text-teal-400" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-100">WEATHER & OCEAN STATE FORECAST</h2>
                  <p className="text-xs text-slate-400">INCOIS High Resolution Hydrodynamic Forecast</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block uppercase">Wind Speed</span>
                  <span className="text-xl font-bold text-cyan-400">16.5 knots</span>
                  <p className="text-[10px] text-slate-500 mt-1">Direction: WNW (290°)</p>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block uppercase">Wave Swell Height</span>
                  <span className="text-xl font-bold text-teal-400">1.8 meters</span>
                  <p className="text-[10px] text-slate-500 mt-1">Period: 7.2 seconds</p>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block uppercase">Sea State</span>
                  <span className="text-xl font-bold text-amber-400">MODERATE</span>
                  <p className="text-[10px] text-slate-500 mt-1">Small crafts caution</p>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block uppercase">Lightning Risk</span>
                  <span className="text-xl font-bold text-amber-400">MODERATE</span>
                  <p className="text-[10px] text-slate-500 mt-1">Thunderstorm off Malpe</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <Compass className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-base font-extrabold text-slate-100">NAVIGATION & GEOFENCE SAFETY ENGINE</h2>
                  <p className="text-xs text-slate-400">Prohibited Naval Defense Zones & Coral Marine Protected Areas</p>
                </div>
              </div>
              <div className="space-y-3">
                {geofences.map((gf) => (
                  <div key={gf.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-amber-400">{gf.name}</h3>
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                        {gf.type} ({gf.danger_level})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{gf.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && <AlertsPanel alerts={alerts} />}

          {activeTab === 'analytics' && <AnalyticsPanel analyticsData={analyticsData} />}

          {activeTab === 'evidence' && <EvidenceHub />}
        </main>
      </div>
    </div>
  );
}

export default App;
