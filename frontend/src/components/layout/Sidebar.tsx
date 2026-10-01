import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, Target, Map, Award, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Skill Knowledge Graph', path: '/graph', icon: Network, highlight: true },
    { label: 'Career Intelligence', path: '/careers', icon: Target },
    { label: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { label: 'Achievements & XP', path: '/achievements', icon: Award },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Console', path: '/admin', icon: ShieldCheck, highlight: false });
  }

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Header Label */}
        <div className="px-3 pt-2">
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-semibold">
            Career Engine Navigation
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-800 text-white font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-indigo-400' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Target Goal Banner Card */}
      {user && (
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Target Career
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
              Active
            </span>
          </div>
          <p className="text-xs font-bold text-white capitalize">
            {user.targetCareerId ? user.targetCareerId.replace('-', ' ') : 'Full Stack Engineer'}
          </p>
          <div className="text-[11px] text-slate-400">
            Commitment: <span className="text-white font-mono">{user.preferredLearningHours || 10} hrs/week</span>
          </div>
        </div>
      )}
    </aside>
  );
};
