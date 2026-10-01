import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, TrendingUp, DollarSign, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface CareerCardProps {
  career: any;
  readinessPct?: number;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, readinessPct = 65 }) => {
  return (
    <div className="glass-panel border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] glow-card group">
      <div className="space-y-4">
        {/* Header Badge & Title */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {career.futureGrowth || '+22% growth'}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{career.title}</h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{career.description}</p>
        </div>

        {/* Salary & Demand Badges */}
        <div className="flex items-center gap-4 py-2 border-y border-slate-800/80 font-mono text-xs">
          <div className="flex items-center gap-1 text-slate-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{career.averageSalary}</span>
          </div>
          <div className="text-slate-400">
            Demand: <span className="text-indigo-400 font-bold">{career.industryDemand}</span>
          </div>
        </div>

        {/* Mathematical Career Readiness Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Calculated Readiness</span>
            <span className="font-bold text-white font-mono">{readinessPct}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                readinessPct >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : readinessPct >= 50
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                  : 'bg-gradient-to-r from-amber-500 to-rose-400'
              }`}
              style={{ width: `${readinessPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-5 mt-4 border-t border-slate-800/60">
        <Link
          to={`/careers/${career.careerId}`}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all group-hover:shadow-lg group-hover:shadow-indigo-600/20"
        >
          <span>Analyze Career Gap</span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};
