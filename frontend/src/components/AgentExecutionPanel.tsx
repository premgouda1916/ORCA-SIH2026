import React from 'react';
import type { AgentTrace } from '../types';
import { Cpu, CheckCircle2, Clock } from 'lucide-react';

interface AgentExecutionPanelProps {
  traces: AgentTrace[];
  isLoading: boolean;
}

export const AgentExecutionPanel: React.FC<AgentExecutionPanelProps> = ({ traces, isLoading }) => {
  const defaultAgents = [
    { name: "USER INTERACTION / LANGUAGE AGENT", role: "Multilingual NLU & Intent Extraction" },
    { name: "ORCHESTRATOR AGENT", role: "Autonomous Planning & Task Routing" },
    { name: "PFZ + OCEAN AGENT", role: "PFZ, SST & Chlorophyll-a Reasoning" },
    { name: "WEATHER + SAFETY AGENT", role: "Wind, Waves, Swell & Hazard Risk" },
    { name: "ROUTE + GIS AGENT", role: "Geofence Collision & Safe Corridor Routing" },
    { name: "RISK ASSESSMENT AGENT", role: "Multi-Source Risk & Conflict Engine" },
    { name: "REPORTING / VISUALIZATION AGENT", role: "Evidence-Backed GIS Payload Generation" }
  ];

  return (
    <div className="glass-panel rounded-xl p-4 border border-cyan-500/20">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Collaborative Agent Execution Trace
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          7 Collaborative Agents Active
        </span>
      </div>

      <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
        {defaultAgents.map((agentItem, idx) => {
          const matchedTrace = traces.find(t => t.agent === agentItem.name);
          const isDone = Boolean(matchedTrace);
          
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border transition-all text-xs ${
                isLoading && idx === (traces.length % defaultAgents.length)
                  ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-200 live-pulse'
                  : isDone
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                  : 'bg-slate-950/40 border-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isLoading && idx === (traces.length % defaultAgents.length) ? (
                    <Clock className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 ml-1"></span>
                  )}
                  <span className="font-bold text-slate-200">{agentItem.name}</span>
                </div>
                {matchedTrace && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded">
                    {matchedTrace.duration_ms}ms
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-6">
                {matchedTrace ? matchedTrace.findings : agentItem.role}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
