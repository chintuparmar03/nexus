import React from 'react';
import { Settings, Sun, Moon, Download, Trash2, Bell, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleExportProfile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus_skill_graph_${user?.name || 'user'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Account Settings</h1>
      </div>

      <div className="glass-panel border border-slate-800 rounded-3xl p-8 space-y-6">
        {/* Appearance */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Interface Theme</h3>
            <p className="text-xs text-slate-400">Switch between dark mode and light mode aesthetics</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Export Data */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Export Skill Graph Data</h3>
            <p className="text-xs text-slate-400">Download a JSON snapshot of your skill graph and roadmap progress</p>
          </div>
          <button
            onClick={handleExportProfile}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 hover:bg-indigo-600/30 transition-colors"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h3 className="text-sm font-bold text-rose-400">Danger Zone</h3>
            <p className="text-xs text-slate-400">Permanently reset your skill graph and learning roadmap data</p>
          </div>
          <button
            onClick={() => alert('Account reset simulated!')}
            className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-2 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Reset Account Data
          </button>
        </div>
      </div>
    </div>
  );
};
