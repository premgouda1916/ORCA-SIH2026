import React from 'react';
import { 
  MessageSquare, 
  MapPin, 
  Fish, 
  CloudLightning, 
  Compass, 
  Bell, 
  BarChart2, 
  FileCheck2 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, alertCount }) => {
  const menuItems = [
    { id: 'chat', label: 'Ask the Sea', icon: MessageSquare, badge: 'AI Agent' },
    { id: 'map', label: 'Marine GIS Map', icon: MapPin, badge: 'Live GIS' },
    { id: 'pfz', label: 'PFZ Intelligence', icon: Fish },
    { id: 'weather', label: 'Weather & Safety', icon: CloudLightning },
    { id: 'routes', label: 'Routes & Geofences', icon: Compass },
    { id: 'alerts', label: 'Proactive Alerts', icon: Bell, alertBadge: alertCount },
    { id: 'analytics', label: 'Ecosystem Analytics', icon: BarChart2 },
    { id: 'evidence', label: 'Evidence Hub', icon: FileCheck2 }
  ];

  return (
    <aside className="w-64 glass-panel h-[calc(100vh-61px)] border-r border-slate-800 flex flex-col justify-between py-4 px-3">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
          Marine Decision Support
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                  {item.badge}
                </span>
              )}
              {item.alertBadge !== undefined && item.alertBadge > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 border border-rose-600 text-rose-300 font-bold animate-pulse">
                  {item.alertBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-center">
          <p className="text-[11px] font-bold text-slate-300">INCOIS WebGIS Integration</p>
          <p className="text-[10px] text-slate-500 mt-0.5">1,223 Spatial Nodes Connected</p>
        </div>
      </div>
    </aside>
  );
};
