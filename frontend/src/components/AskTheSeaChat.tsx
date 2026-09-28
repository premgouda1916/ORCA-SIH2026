import React, { useState } from 'react';
import type { ChatResponse } from '../types';
import { Send, Bot, User, ShieldCheck, AlertTriangle, Compass, Fish, Waves } from 'lucide-react';
import { AgentExecutionPanel } from './AgentExecutionPanel';

interface AskTheSeaChatProps {
  onSendMessage: (query: string) => void;
  chatResponse: ChatResponse | null;
  isLoading: boolean;
}

export const AskTheSeaChat: React.FC<AskTheSeaChatProps> = ({ onSendMessage, chatResponse, isLoading }) => {
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim() && !isLoading) {
      onSendMessage(inputQuery);
      setInputQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel p-4 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>ASK THE SEA — Conversational Marine Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Ask natural language questions about fishing zones, safety, weather, routing, and marine productivity.
          </p>
        </div>
      </div>

      {/* Main Conversation & Evidence Display (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 py-3 pr-2 my-1 custom-scrollbar">
        {!chatResponse && !isLoading && (
          <div className="glass-panel p-6 lg:p-8 rounded-2xl text-center border border-cyan-500/20 max-w-2xl mx-auto my-4 space-y-4">
            <div className="w-14 h-14 bg-cyan-950/80 border border-cyan-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              <Bot className="w-7 h-7 text-cyan-400 animate-bounce" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              Welcome to ORCA Decision Support
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type any marine query below or select a judge prompt from the toolbar above. ORCA coordinates 7 specialized AI agents to analyze INCOIS Earth observation datasets, wave forecasts, and GIS boundaries.
            </p>
            <div className="grid grid-cols-2 gap-2 text-left pt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-cyan-300">📍 Spatial Reasoning:</span>
                <p className="text-[11px] text-slate-400 mt-1">Nearest PFZ distance, bearing, and geofence collision detection.</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-teal-300">⚡ Hazard Correlation:</span>
                <p className="text-[11px] text-slate-400 mt-1">High wave swell, lightning, and cyclone risk synthesis.</p>
              </div>
            </div>

            {/* Initial Chat Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center space-x-2 bg-slate-950/90 p-2 rounded-xl border border-cyan-500/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-lg transition-all mt-4">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask ORCA: e.g. 'Is it safe to go fishing tomorrow morning near Mangaluru?'"
                className="flex-1 bg-transparent text-slate-100 text-xs px-3 py-2 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Ask ORCA</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* User Question */}
        {chatResponse && (
          <div className="flex items-start space-x-3 justify-end">
            <div className="bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/40 p-4 rounded-2xl max-w-xl shadow-lg">
              <div className="flex items-center space-x-2 text-xs text-cyan-300 font-bold mb-1">
                <User className="w-3.5 h-3.5" />
                <span>USER QUERY</span>
              </div>
              <p className="text-sm text-slate-100 font-medium">{chatResponse.query}</p>
            </div>
          </div>
        )}

        {/* ORCA Agent Response Card */}
        {chatResponse && (
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-4">
            {/* Header Badge & Risk */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-cyan-300">ORCA MARINE INTELLIGENCE</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Session Context: Multi-turn Memory Active | Lang: {chatResponse.language.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="flex items-center space-x-2">
                {chatResponse.risk_level === 'LOW' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>LOW RISK</span>
                  </span>
                )}
                {chatResponse.risk_level === 'CAUTION' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/50 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>CAUTION</span>
                  </span>
                )}
                {(chatResponse.risk_level === 'HIGH' || chatResponse.risk_level === 'UNSAFE') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{chatResponse.risk_level}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Answer Text Block (Response) */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-44 lg:max-h-52 overflow-y-auto custom-scrollbar shadow-inner">
              {chatResponse.answer}
            </div>

            {/* Chat Input Bar (Placed AFTER response text, directly ABOVE Key Fact Cards Grid) */}
            <form onSubmit={handleSubmit} className="relative flex items-center space-x-2 bg-slate-950/90 p-2 rounded-xl border border-cyan-500/30 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-lg transition-all my-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask ORCA: e.g. 'Is it safe to go fishing tomorrow morning near Mangaluru?'"
                className="flex-1 bg-transparent text-slate-100 text-xs px-3 py-2 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Ask ORCA</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Key Fact Cards Grid (NEAREST PFZ, SEA & WEATHER STATE, SAFE NAVIGATION ROUTE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Nearest PFZ Card */}
              {chatResponse.nearest_pfz && (
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs mb-1">
                    <Fish className="w-4 h-4" />
                    <span>NEAREST PFZ</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{chatResponse.nearest_pfz.id}</p>
                  <p className="text-[11px] text-slate-400">{chatResponse.nearest_pfz.region}</p>
                  <div className="mt-2 text-[11px] text-slate-300 space-y-0.5">
                    <p>Distance: <span className="font-bold text-cyan-300">{chatResponse.nearest_pfz.distance_km} km ({chatResponse.nearest_pfz.direction})</span></p>
                    <p>SST: {chatResponse.nearest_pfz.sst_celsius}°C | Chlorophyll: {chatResponse.nearest_pfz.chlorophyll_mg_m3} mg/m³</p>
                  </div>
                </div>
              )}

              {/* Weather & Wave State */}
              {chatResponse.weather && (
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs mb-1">
                    <Waves className="w-4 h-4" />
                    <span>SEA & WEATHER STATE</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{chatResponse.weather.sea_state} SEA</p>
                  <p className="text-[11px] text-slate-400">Wind: {chatResponse.weather.wind_speed_knots} kts ({chatResponse.weather.wind_direction})</p>
                  <div className="mt-2 text-[11px] text-slate-300 space-y-0.5">
                    <p>Wave Swell: <span className="font-bold text-teal-300">{chatResponse.weather.wave_height_meters} m</span></p>
                    <p>Lightning: {chatResponse.weather.lightning_risk} | Cyclone: {chatResponse.weather.cyclone_alert}</p>
                  </div>
                </div>
              )}

              {/* Safe Route Summary */}
              {chatResponse.route && (
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs mb-1">
                    <Compass className="w-4 h-4" />
                    <span>SAFE NAVIGATION ROUTE</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{chatResponse.route.name}</p>
                  <p className="text-[11px] text-slate-400">Total Distance: {chatResponse.route.distance_km} km</p>
                  <div className="mt-2 text-[11px] text-slate-300 space-y-0.5">
                    <p>Safety Score: <span className="font-bold text-blue-300">{chatResponse.route.safety_score}/100</span></p>
                    <p>Est Time: {chatResponse.route.estimated_travel_time}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Collaborative Agent Audit Panel */}
            <AgentExecutionPanel traces={chatResponse.agent_traces} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};
