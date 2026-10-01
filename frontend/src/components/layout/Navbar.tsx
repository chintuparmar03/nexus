import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, Sun, Moon, Award, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                NEXUS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Skill Graph
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/dashboard' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/graph"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/graph' ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Skill Graph
            </Link>
            <Link
              to="/careers"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname.startsWith('/careers') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Careers
            </Link>
            <Link
              to="/roadmap"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/roadmap' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Roadmap
            </Link>
          </nav>
        </div>

        {/* Center: Cmd+K Global Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search skills, careers, resources...</span>
            </span>
            <kbd className="bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded text-[10px] border border-slate-700">
              Cmd + K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* XP & Level Indicator */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                L{user.level}
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
                  <span>XP: {user.xp}</span>
                  <span className="text-amber-400 font-bold">{user.streakDays}🔥 Streak</span>
                </div>
                <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (user.xp % 200) / 2)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Profile Dropdown / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#121215] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="font-semibold text-sm text-white">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/achievements"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    Achievements & Badges
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors mt-1"
                    >
                      <ShieldAlert className="w-4 h-4 text-indigo-400" />
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
