import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit, Network, Users, Target } from 'lucide-react';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, skillsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { success: false } })),
        api.get('/skills')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
      if (skillsRes.data.success) {
        setSkills(skillsRes.data.skills);
      }
    } catch (err) {
      console.warn('Admin fallback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Administrator Console</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Taxonomy & System Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Registered Platform Users</span>
          <p className="text-3xl font-extrabold text-white font-mono">{stats?.stats?.totalUsers || 1480}</p>
        </div>
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Predefined Skill Taxonomy</span>
          <p className="text-3xl font-extrabold text-indigo-400 font-mono">{skills.length || 100}+ Skills</p>
        </div>
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Active Careers</span>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{stats?.stats?.totalCareers || 15} Paths</p>
        </div>
      </div>

      {/* Skills Management Table */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" /> Manage Skill Taxonomy
          </h3>
          <button
            onClick={() => alert('Add Skill Modal')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Add New Skill Node
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-3 px-4">Skill ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Est. Hours</th>
                <th className="py-3 px-4">Demand</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skills.slice(0, 15).map((s) => (
                <tr key={s.skillId} className="hover:bg-slate-900/50 text-slate-200">
                  <td className="py-3 px-4 text-indigo-400">{s.skillId}</td>
                  <td className="py-3 px-4 font-bold text-white font-sans">{s.name}</td>
                  <td className="py-3 px-4">{s.category}</td>
                  <td className="py-3 px-4">{s.difficulty}</td>
                  <td className="py-3 px-4">{s.estimatedHours}h</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{s.industryDemand}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button className="p-1 text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                    <button className="p-1 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
