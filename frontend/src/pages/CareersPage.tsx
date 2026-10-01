import React, { useState, useEffect } from 'react';
import { Target, Search, TrendingUp, Filter } from 'lucide-react';
import { CareerCard } from '../components/careers/CareerCard';
import { api } from '../services/api';

export const CareersPage: React.FC = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [demandFilter, setDemandFilter] = useState('All');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/careers');
      if (res.data.success) {
        setCareers(res.data.careers);
      }
    } catch (err) {
      console.warn('Careers fallback');
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesDemand = demandFilter === 'All' || c.industryDemand === demandFilter;
    return matchesSearch && matchesDemand;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Target className="w-3.5 h-3.5" />
          <span>Industry Career Profiles & Mathematical Gap Analysis</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Target Career Intelligence Catalog</h1>
        <p className="text-xs text-slate-400">
          Select any career role to run graph algorithms, calculate mathematical readiness, and reveal missing prerequisites.
        </p>
      </div>

      {/* Search & Filter bar */}
      <div className="glass-panel border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers (e.g. AI Engineer, Full Stack, DevOps)..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Demand:</span>
          {['All', 'Very High', 'High'].map((d) => (
            <button
              key={d}
              onClick={() => setDemandFilter(d)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                demandFilter === d ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-500 animate-pulse">
          Loading Career Profiles & Market Demand Data...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((c) => (
            <CareerCard key={c.careerId} career={c} readinessPct={c.careerId === 'fullstack-engineer' ? 78 : c.careerId === 'frontend-engineer' ? 85 : 62} />
          ))}
        </div>
      )}
    </div>
  );
};
