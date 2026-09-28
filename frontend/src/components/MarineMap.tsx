import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, LayerGroup, LayersControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import type { PFZ, Hazard, Geofence, Route } from '../types';
import { Layers, MapPin, ShieldAlert } from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs for high-impact marine visual styling
const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="background-color: #00f2fe; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px #00f2fe; animation: pulse 2s infinite;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

const createPFZIcon = (status = 'ACTIVE') =>
  L.divIcon({
    className: 'custom-pfz-marker',
    html: `<div style="background-color: #10b981; width: 22px; height: 22px; border-radius: 6px; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 0 10px #10b981;">🐟</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

const createHazardIcon = () =>
  L.divIcon({
    className: 'custom-hazard-marker',
    html: `<div style="background-color: #ef4444; width: 22px; height: 22px; border-radius: 50%; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 0 12px #ef4444;">⚡</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

interface MarineMapProps {
  userLat?: number;
  userLon?: number;
  pfzs: PFZ[];
  hazards: Hazard[];
  geofences: Geofence[];
  route?: Route | null;
  onSelectPFZ?: (pfz: PFZ) => void;
}

export const MarineMap: React.FC<MarineMapProps> = ({
  userLat = 12.8700,
  userLon = 74.8800,
  pfzs,
  hazards,
  geofences,
  route,
  onSelectPFZ
}) => {
  const mapCenter: [number, number] = [13.2000, 74.6000];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-cyan-500/30 glass-panel">
      {/* Map Control Info Overlay Header */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-xl text-xs flex items-center space-x-3 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
          <Layers className="w-4 h-4" />
          <span>ORCA Marine GIS Engine</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-300">
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>PFZ (Fish)</span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Hazard</span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Geofence</span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span><span>Safe Route</span></span>
        </div>
      </div>

      {/* Leaflet Map Rendering */}
      <MapContainer
        center={mapCenter}
        zoom={9}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <ZoomControl position="bottomright" />

        <LayersControl position="topright">
          {/* Base Map Layers (Clean, Free, No API Key Required) */}
          <LayersControl.BaseLayer checked name="Dark Marine Canvas (Esri)">
            <TileLayer
              attribution='&copy; Esri, GEBCO, NOAA, INCOIS WebGIS'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Oceanography Satellite Map (Esri)">
            <TileLayer
              attribution='&copy; Esri, GEBCO, NOAA, CHS, National Geographic'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={13}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OpenStreetMap Standard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* User Location Marker */}
          <LayersControl.Overlay checked name="Departure Port Location">
            <LayerGroup>
              <Marker position={[userLat, userLon]} icon={createUserIcon()}>
                <Popup>
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-cyan-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Vessel / User Departure Port</span>
                    </p>
                    <p className="text-slate-300">Mangaluru Harbor Sector</p>
                    <p className="text-slate-400 text-[10px]">Lat: {userLat}°, Lon: {userLon}°</p>
                  </div>
                </Popup>
              </Marker>
            </LayerGroup>
          </LayersControl.Overlay>

        {/* PFZ Markers */}
          <LayersControl.Overlay checked name="Potential Fishing Zones (PFZ)">
            <LayerGroup>
              {pfzs.map((pfz) => (
                <Marker
                  key={pfz.id}
                  position={[pfz.latitude, pfz.longitude]}
                  icon={createPFZIcon(pfz.status)}
                  eventHandlers={{
                    click: () => onSelectPFZ && onSelectPFZ(pfz)
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1.5 p-1">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                        <span className="font-bold text-emerald-400">{pfz.id}</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">{pfz.status}</span>
                      </div>
                      <p className="font-semibold text-slate-200">{pfz.region}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                        <div>SST: <span className="font-bold text-cyan-300">{pfz.sst_celsius}°C</span></div>
                        <div>Chl: <span className="font-bold text-teal-300">{pfz.chlorophyll_mg_m3} mg/m³</span></div>
                        <div>Depth: <span className="text-slate-400">{pfz.depth_meters}m</span></div>
                        <div>Dist: <span className="font-bold text-amber-300">{pfz.distance_km || 24.5} km</span></div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic pt-1">Source: {pfz.source}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Hazards Overlay */}
          <LayersControl.Overlay checked name="Active Marine Hazards">
            <LayerGroup>
              {hazards.map((haz) => (
                <React.Fragment key={haz.id}>
                  <Marker position={[haz.latitude, haz.longitude]} icon={createHazardIcon()}>
                    <Popup>
                      <div className="text-xs space-y-1 p-1">
                        <span className="font-bold text-rose-400 flex items-center space-x-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{haz.type} WARNING</span>
                        </span>
                        <p className="text-slate-200 text-[11px] leading-tight">{haz.description}</p>
                        <p className="text-[10px] text-slate-400">Source: {haz.source}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[haz.latitude, haz.longitude]}
                    radius={(haz.radius_km || 15) * 1000}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1.5, dashArray: '4, 4' }}
                  />
                </React.Fragment>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Geofence Polygons */}
          <LayersControl.Overlay checked name="Restricted Maritime Geofences">
            <LayerGroup>
              {geofences.map((gf) => {
                const positions: [number, number][] = gf.coordinates.map(c => [c[0], c[1]]);
                return (
                  <Polygon
                    key={gf.id}
                    positions={positions}
                    pathOptions={{
                      color: gf.danger_level === 'CRITICAL' ? '#f59e0b' : '#3b82f6',
                      fillColor: gf.danger_level === 'CRITICAL' ? '#f59e0b' : '#3b82f6',
                      fillOpacity: 0.25,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 p-1">
                        <span className="font-bold text-amber-400">{gf.name}</span>
                        <p className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono inline-block">
                          TYPE: {gf.type} ({gf.danger_level})
                        </p>
                        <p className="text-slate-300 text-[11px] mt-1">{gf.description}</p>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Safe Route Polyline */}
          {route && (
            <LayersControl.Overlay checked name="ORCA Safe Navigation Corridor">
              <LayerGroup>
                <Polyline
                  positions={route.waypoints.map(w => [w.latitude, w.longitude])}
                  pathOptions={{ color: '#00f2fe', weight: 4, opacity: 0.9, dashArray: '8, 8' }}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
};
