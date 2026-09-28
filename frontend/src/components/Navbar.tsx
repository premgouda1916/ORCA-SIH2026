import React from 'react';
import { Waves, ShieldAlert, Cpu, Globe, Database } from 'lucide-react';

interface NavbarProps {
  dataStatus: 'LIVE' | 'CACHED' | 'DEMO';
  selectedLang: string;
  onLanguageChange: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ dataStatus, selectedLang, onLanguageChange }) => {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-cyan-500/20 px-6 py-3 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <Waves className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              ORCA
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold tracking-wide">
              Smart India Hackathon 2026
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 font-medium">
              PS #26176
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-tight">
            Marine EcOsystem Reasoning with Collaborative Agents | Team <span className="text-cyan-300 font-semibold">INNOVEXA</span>
          </p>
        </div>
      </div>

      {/* Right Controls: Data Transparency Status + Language Selector */}
      <div className="flex items-center space-x-4">
        {/* Data Status Transparency Badge */}
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">DATA STATUS:</span>
          {dataStatus === 'LIVE' && (
            <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 live-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE INCOIS</span>
            </span>
          )}
          {dataStatus === 'CACHED' && (
            <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>CACHED SNAPSHOT</span>
            </span>
          )}
          {dataStatus === 'DEMO' && (
            <span className="flex items-center space-x-1.5 text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>DEMO MODE</span>
            </span>
          )}
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Globe className="w-4 h-4 text-teal-400" />
          <select
            value={selectedLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900 text-white">English (EN)</option>
            <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
            <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
            <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>
    </header>
  );
};
