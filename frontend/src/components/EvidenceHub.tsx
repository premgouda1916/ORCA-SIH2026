import React from 'react';
import { FileCheck2, ExternalLink, Globe, Database, ShieldCheck, Award } from 'lucide-react';

export const EvidenceHub: React.FC = () => {
  const sources = [
    {
      name: 'INCOIS Potential Fishing Zone (PFZ) WebGIS',
      url: 'https://www.incois.gov.in/MarineFisheries/PfzWebGis',
      coverage: '1,223 Spatial WebGIS Nodes | 14 Indian Maritime Sectors',
      description: 'Satellite SST (MODIS/Oceansat) and Chlorophyll-a ocean color composites derived daily for coastal fisher advisories.'
    },
    {
      name: 'INCOIS Ocean State Forecast (OSF)',
      url: 'https://incois.gov.in/oceanservices/osfforecast.jsp',
      coverage: '586 Official Fish Landing Centres',
      description: 'High-resolution hydrodynamic modeling for wave height, swell period, surface wind, and current forecasts.'
    },
    {
      name: 'INCOIS ERDDAP Data Server',
      url: 'https://erddap.incois.gov.in/',
      coverage: 'Oceansat-2 / Oceansat-3 (EOS-06) WMS Services',
      description: 'Standardized RESTful & WMS geospatial data endpoints for SST, Chlorophyll, and Sea Surface Height Anomaly (SSHA).'
    },
    {
      name: 'Bhuvan ISRO NRSC Marine GIS Portal',
      url: 'https://bhuvan.nrsc.gov.in/',
      coverage: 'Pan-India Marine Boundaries & Protected Geofences',
      description: 'National Earth observation database for Marine Protected Areas (MPA), naval defense corridors, and maritime limits.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-xl">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">ORCA EVIDENCE HUB & DATA AUDIT</h2>
            <p className="text-xs text-slate-400">Verifiable Space Oceanography Sources & INCOIS Coverage Metadata</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1.5 rounded-lg border border-amber-500/40">
            SIH Problem ID: #26176
          </span>
        </div>
      </div>

      {/* Verified INCOIS Coverage Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <Database className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <span className="text-2xl font-black text-cyan-300">1,223</span>
          <p className="text-xs font-bold text-slate-200">INCOIS WebGIS Nodes</p>
          <p className="text-[11px] text-slate-400">Spatial marine grid points covering Indian Exclusive Economic Zone (EEZ)</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <Globe className="w-6 h-6 text-teal-400 mx-auto mb-2" />
          <span className="text-2xl font-black text-teal-300">586</span>
          <p className="text-xs font-bold text-slate-200">Fish Landing Centres</p>
          <p className="text-[11px] text-slate-400">Integrated coastal monitoring stations from Gujarat to West Bengal</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center space-y-1">
          <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <span className="text-2xl font-black text-emerald-300">14</span>
          <p className="text-xs font-bold text-slate-200">Advisory Sectors</p>
          <p className="text-[11px] text-slate-400">High-resolution coastal zones with localized PFZ forecast bulletins</p>
        </div>
      </div>

      {/* Primary Data Sources Repository List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">
          Primary Space & Oceanography Data Integrations
        </h3>
        <div className="space-y-3">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-cyan-300">{src.name}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {src.coverage}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{src.description}</p>
              </div>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 ml-4 p-2 bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all flex items-center space-x-1 text-xs"
              >
                <span>Verify Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
