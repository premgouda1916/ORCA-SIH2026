import React from 'react';
import type { Alert } from '../types';
import { Bell, CloudLightning, Waves, Fish } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-950 border border-rose-500/40 rounded-xl">
            <Bell className="w-5 h-5 text-rose-400 animate-bounce" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-100">PROACTIVE MARINE ALERTS</h2>
            <p className="text-xs text-slate-400">Automated hazard monitoring for coastal waters & offshore sectors</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-rose-950/80 border border-rose-600 text-rose-300 font-bold rounded-full">
          {alerts.length} Active Advisories
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-xl transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {alt.type === 'LIGHTNING' && <CloudLightning className="w-4 h-4 text-amber-400" />}
                {alt.type === 'HIGH_WAVE' && <Waves className="w-4 h-4 text-blue-400" />}
                {alt.type === 'PFZ_OPPORTUNITY' && <Fish className="w-4 h-4 text-emerald-400" />}
                <h3 className="text-xs font-bold text-slate-200">{alt.title}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                  ? 'bg-rose-950 text-rose-300 border border-rose-600'
                  : alt.severity === 'CAUTION' || alt.severity === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-600'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
              }`}>
                {alt.severity}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
              <span>📍 Location: {alt.location}</span>
              <span>Time: {alt.timestamp}</span>
              <span>Source: {alt.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
