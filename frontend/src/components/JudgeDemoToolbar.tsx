import React from 'react';
import { Award, Zap } from 'lucide-react';

interface JudgeDemoToolbarProps {
  onSelectQuery: (query: string) => void;
  isLoading: boolean;
}

export const JudgeDemoToolbar: React.FC<JudgeDemoToolbarProps> = ({ onSelectQuery, isLoading }) => {
  const judgePresets = [
    { label: "1. PFZ + Tomorrow Safety", query: "What is the nearest PFZ and is it safe to go tomorrow morning?" },
    { label: "2. Fishing Zones to Avoid", query: "Which fishing zones should I avoid due to hazards?" },
    { label: "3. Safest Route Calculation", query: "What is the safest route to the nearest PFZ?" },
    { label: "4. High Chlorophyll & SST", query: "Show me areas with high chlorophyll and favorable SST." },
    { label: "5. Fish Productivity Decline", query: "Why has fish productivity declined in this region?" },
    { label: "6. Cyclone & Lightning Risks", query: "Are there any cyclone or lightning risks tomorrow?" },
    { label: "7. Restricted Defense Zone", query: "Am I entering a restricted area or marine protected zone?" },
    { label: "8. Kannada Query (ಕನ್ನಡ)", query: "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗುವುದು ಸುರಕ್ಷಿತವೇ?" },
    { label: "9. Follow-up Context Test", query: "What about the route?" }
  ];

  return (
    <div className="bg-slate-900/95 border-b border-cyan-500/30 px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-3">
      <div className="flex items-center space-x-2 shrink-0">
        <Award className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
          Judge Demo Mode:
        </span>
      </div>
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {judgePresets.map((preset, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => onSelectQuery(preset.query)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-cyan-950 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
