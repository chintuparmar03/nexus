import React from 'react';
import { Award, Sparkles, Flame, Trophy, CheckCircle2, Lock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AchievementsPage: React.FC = () => {
  const { user } = useAuth();

  const allBadges = [
    {
      badgeId: 'graph-pioneer',
      name: 'Graph Pioneer',
      description: 'Mapped your first 10 skills on NEXUS Knowledge Graph',
      icon: 'Sparkles',
      isUnlocked: true,
      unlockedAt: '2026-09-01'
    },
    {
      badgeId: 'algo-master',
      name: 'Topological Strategist',
      description: 'Resolved all directed prerequisite dependencies for Fullstack path',
      icon: 'Trophy',
      isUnlocked: true,
      unlockedAt: '2026-09-15'
    },
    {
      badgeId: 'streak-7',
      name: '7-Day Learning Streak',
      description: 'Maintained active daily learning consistency for 7 consecutive days',
      icon: 'Flame',
      isUnlocked: true,
      unlockedAt: '2026-09-20'
    },
    {
      badgeId: 'readiness-80',
      name: '80% Readiness Master',
      description: 'Achieved 80%+ mathematical career readiness on target career goal',
      icon: 'Award',
      isUnlocked: false
    },
    {
      badgeId: 'ai-collaborator',
      name: 'AI Career Collaborator',
      description: 'Consulted NEXUS Explainable AI Advisor 10+ times for interview prep',
      icon: 'Zap',
      isUnlocked: false
    }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
          <Award className="w-3.5 h-3.5" />
          <span>Gamification Engine & Achievements</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">XP, Levels & Badges</h1>
        <p className="text-xs text-slate-400">Earn XP by completing skill nodes, maintaining learning streaks, and mastering prerequisites.</p>
      </div>

      {/* Stats Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel border border-amber-500/30 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Current Level</span>
          <p className="text-4xl font-extrabold text-amber-400 font-mono">Level {user?.level || 4}</p>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, ((user?.xp || 680) % 200) / 2)}%` }} />
          </div>
        </div>

        <div className="glass-panel border border-indigo-500/30 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Total Experience Points</span>
          <p className="text-4xl font-extrabold text-indigo-400 font-mono">{user?.xp || 680} XP</p>
          <p className="text-xs text-slate-400">+50 XP per skill node mastered</p>
        </div>

        <div className="glass-panel border border-rose-500/30 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Active Streak</span>
          <p className="text-4xl font-extrabold text-rose-400 font-mono">{user?.streakDays || 7} Days 🔥</p>
          <p className="text-xs text-slate-400">Streak multiplier active</p>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Unlockable Platform Badges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((b) => (
            <div
              key={b.badgeId}
              className={`p-5 rounded-2xl border transition-all ${
                b.isUnlocked
                  ? 'bg-slate-900/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  b.isUnlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-900 text-slate-600'
                }`}>
                  {b.isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                {b.isUnlocked && (
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold">
                    Unlocked
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{b.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
