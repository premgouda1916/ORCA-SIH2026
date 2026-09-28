import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { BarChart2, TrendingUp, Thermometer, Droplets, Waves, HelpCircle } from 'lucide-react';

interface AnalyticsPanelProps {
  analyticsData: any;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analyticsData }) => {
  const sstData = analyticsData?.sst_trend || [
    { date: "Sep 22", sst: 28.1 },
    { date: "Sep 23", sst: 28.3 },
    { date: "Sep 24", sst: 28.6 },
    { date: "Sep 25", sst: 28.9 },
    { date: "Sep 26", sst: 29.1 },
    { date: "Sep 27", sst: 28.7 },
    { date: "Sep 28", sst: 28.6 }
  ];

  const chlData = analyticsData?.chlorophyll_trend || [
    { date: "Sep 22", chl: 2.1 },
    { date: "Sep 23", chl: 2.5 },
    { date: "Sep 24", chl: 3.2 },
    { date: "Sep 25", chl: 4.1 },
    { date: "Sep 26", chl: 3.8 },
    { date: "Sep 27", chl: 3.5 },
    { date: "Sep 28", chl: 3.8 }
  ];

  const waveData = analyticsData?.wave_trend || [
    { time: "00:00", wave_height: 1.2 },
    { time: "04:00", wave_height: 1.4 },
    { time: "08:00", wave_height: 1.8 },
    { time: "12:00", wave_height: 2.1 },
    { time: "16:00", wave_height: 1.9 },
    { time: "20:00", wave_height: 1.5 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <span>MARINE ECOSYSTEM ANALYTICS & TRENDS</span>
          </h2>
          <p className="text-xs text-slate-400">Satellite oceanography trends & productivity correlation engine</p>
        </div>
        <span className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-cyan-300 font-mono">
          Illustrative Prototype Data (INCOIS ERDDAP Format)
        </span>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SST Trend Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>7-Day Sea Surface Temperature (°C)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Satellite MODIS-Aqua</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sstData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[27, 30]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="sst" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chlorophyll Trend Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span>Chlorophyll-a Concentration (mg/m³)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Oceansat-3 / Sentinel-3</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chlData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 6]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="chl" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Productivity Diagnosis Breakdown Card */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
        <h3 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Fish Productivity Decline Reasoning Engine</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          ORCA correlates satellite thermal fronts, chlorophyll concentration bloom maps, and coastal upwelling indices to evaluate catch variations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Optimal SST Range</span>
            <span className="text-sm font-bold text-rose-400">28.0 - 28.8°C</span>
            <p className="text-[10px] text-slate-500 mt-1">Pelagic aggregation boundary</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Min Chl Threshold</span>
            <span className="text-sm font-bold text-emerald-400">&gt; 3.0 mg/m³</span>
            <p className="text-[10px] text-slate-500 mt-1">Phytoplankton bloom proxy</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Upwelling Index</span>
            <span className="text-sm font-bold text-teal-400">Moderate Coastal</span>
            <p className="text-[10px] text-slate-500 mt-1">Subsurface nutrient transport</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Confidence Rating</span>
            <span className="text-sm font-bold text-cyan-300">88% Medium-High</span>
            <p className="text-[10px] text-slate-500 mt-1">Observed correlation</p>
          </div>
        </div>
      </div>
    </div>
  );
};
