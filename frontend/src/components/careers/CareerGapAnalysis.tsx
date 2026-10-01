import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Award, Clock, Calendar, CheckCircle2, AlertTriangle, Sparkles, Map, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CareerGapAnalysis: React.FC = () => {
  const { careerId } = useParams();
  const { updateProfile, user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (careerId) fetchGapAnalysis(careerId);
  }, [careerId]);

  const fetchGapAnalysis = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/careers/${id}/gap-analysis`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Gap analysis fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleSetTargetCareer = async () => {
    if (careerId) {
      await updateProfile({ targetCareerId: careerId });
      alert(`Set ${data?.career?.title || careerId} as your active target career!`);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-500 animate-pulse">
        Running Graph Engine Dependency Traversal & Mathematical Readiness Score...
      </div>
    );
  }

  const career = data?.career;
  const readiness = data?.readiness;
  const isCurrentTarget = user?.targetCareerId === careerId;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Back Link */}
      <Link to="/careers" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Careers Catalog
      </Link>

      {/* Main Career Header */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              Career Analysis
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {career?.averageSalary}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{career?.title}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{career?.description}</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSetTargetCareer}
            disabled={isCurrentTarget}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isCurrentTarget
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
            }`}
          >
            <Target className="w-4 h-4" />
            {isCurrentTarget ? 'Active Target Goal' : 'Set as My Target Goal'}
          </button>
          <button
            onClick={() => navigate(`/roadmap?careerId=${careerId}`)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all"
          >
            <Map className="w-4 h-4 text-indigo-400" />
            View Generated Roadmap
          </button>
        </div>
      </div>

      {/* Readiness Math Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Readiness Score */}
        <div className="glass-panel border border-indigo-500/30 p-6 rounded-3xl space-y-2 relative overflow-hidden">
          <span className="text-xs text-slate-400 font-mono uppercase">Mathematical Readiness</span>
          <p className="text-4xl font-extrabold text-white font-mono">{readiness?.readinessPercentage}%</p>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: `${readiness?.readinessPercentage}%` }} />
          </div>
        </div>

        {/* Metric 2: Confidence Score */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Dependency Confidence</span>
          <p className="text-4xl font-extrabold text-emerald-400 font-mono">{readiness?.confidenceScore}%</p>
          <p className="text-[11px] text-slate-400">Based on prerequisite completion factor</p>
        </div>

        {/* Metric 3: Hours Left */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase">Est. Learning Time Left</span>
          <p className="text-4xl font-extrabold text-white font-mono flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-400" /> {readiness?.totalEstimatedHoursLeft}h
          </p>
          <p className="text-[11px] text-slate-400">At {readiness?.learningVelocity} hrs/week velocity</p>
        </div>

        {/* Metric 4: Estimated Completion */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase font-mono">Estimated Weeks</span>
          <p className="text-4xl font-extrabold text-amber-400 font-mono flex items-center gap-2">
            <Calendar className="w-7 h-7 text-amber-400" /> ~{readiness?.estimatedWeeks} wks
          </p>
          <p className="text-[11px] text-slate-400">To achieve 100% readiness target</p>
        </div>
      </div>

      {/* Skill Gap Breakdown Matrix */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> Required Skills & Gap Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic comparison of your current skill levels vs industry target proficiencies.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            {readiness?.completedRequiredCount} of {readiness?.totalRequiredCount} Skills Mastered
          </span>
        </div>

        {/* Skills Table / List */}
        <div className="space-y-3">
          {readiness?.skillBreakdown?.map((item: any) => (
            <div
              key={item.skillId}
              className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.skillName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span>Importance Weight: <strong className="text-indigo-400">{item.importanceWeight}/10</strong></span>
                  <span>Est. Hours: <strong className="text-slate-200">{item.estimatedHours}h</strong></span>
                </div>
              </div>

              {/* Proficiency Level Comparison */}
              <div className="flex items-center gap-6">
                <div className="text-right space-y-1">
                  <div className="text-xs text-slate-400 font-mono">
                    Current: <span className="font-bold text-white">L{item.currentProficiency}</span> / Target: <span className="font-bold text-emerald-400">L{item.targetProficiency}</span>
                  </div>
                  <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'Mastered' ? 'bg-emerald-400' : 'bg-indigo-400'
                      }`}
                      style={{ width: `${(item.currentProficiency / item.targetProficiency) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold font-mono flex items-center gap-1.5 ${
                    item.status === 'Mastered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'In Progress'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {item.status === 'Mastered' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
