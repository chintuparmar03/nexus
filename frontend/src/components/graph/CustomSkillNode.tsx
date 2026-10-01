import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Lock, Sparkles, Flame, Clock } from 'lucide-react';

export const CustomSkillNode = memo(({ data }: any) => {
  const { name, category, difficulty, status, isTarget, centralityScore, estimatedHours, proficiency } = data;

  let borderColor = 'border-slate-800';
  let bgColor = 'bg-slate-900/90';
  let badgeColor = 'bg-slate-800 text-slate-400';
  let icon = <Lock className="w-3.5 h-3.5 text-slate-500" />;

  if (status === 'Mastered') {
    borderColor = 'border-emerald-500/60 shadow-lg shadow-emerald-500/10';
    bgColor = 'bg-emerald-950/40';
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  } else if (status === 'In Progress') {
    borderColor = 'border-indigo-500/80 shadow-lg shadow-indigo-500/20';
    bgColor = 'bg-indigo-950/50';
    badgeColor = 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
    icon = <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />;
  } else if (status === 'Target') {
    borderColor = 'border-cyan-500/50 shadow-md shadow-cyan-500/10';
    bgColor = 'bg-slate-900/95';
    badgeColor = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    icon = <Flame className="w-4 h-4 text-cyan-400" />;
  }

  return (
    <div
      className={`w-52 p-3 rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-md transition-all duration-200 hover:scale-105 group cursor-pointer`}
    >
      {/* Target Edge Handles */}
      <Handle type="target" position={Position.Left} className="!bg-slate-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-slate-500 !w-2.5 !h-2.5" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
          {category}
        </span>
        <div className="flex items-center gap-1">
          {isTarget && (
            <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-rose-500/30">
              Career Goal
            </span>
          )}
          {icon}
        </div>
      </div>

      {/* Skill Name */}
      <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
        {name}
      </p>

      {/* Bottom Specs: Hours & Proficiency */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          {estimatedHours}h
        </span>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`w-1.5 h-1.5 rounded-full ${
                lvl <= proficiency
                  ? status === 'Mastered'
                    ? 'bg-emerald-400'
                    : 'bg-indigo-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
