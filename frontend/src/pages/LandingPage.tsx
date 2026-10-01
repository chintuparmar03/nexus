import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Network, Target, Map, Award, ArrowRight, CheckCircle2, Cpu, Shield, Zap, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-0 w-[500px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Skill Knowledge Graph Engine • Career Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Architect Your Tech Career with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Graph Algorithms & Explainable AI
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          NEXUS maps your technical skill graph, computes deterministic career readiness scores, resolves directed prerequisite dependencies, and builds your optimal learning roadmap.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/graph"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <Network className="w-5 h-5" />
            Explore Interactive Skill Graph
          </Link>
          <Link
            to="/careers"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Target className="w-5 h-5 text-indigo-400" />
            Analyze Career Readiness
          </Link>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="glass-panel border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden group">
            <div className="bg-slate-950/80 rounded-2xl border border-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-3">
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  Calculated Readiness: 78%
                </span>
                <h3 className="text-xl font-bold text-white">Full Stack Engineer Trajectory</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  12 Mastered Skills • 3 Missing Core Prerequisites • Shortest Learning Path: 45 Hours
                </p>
              </div>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 border border-slate-800"
              >
                Launch Sandbox <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Enterprise Career Intelligence Features</h2>
          <p className="text-xs text-slate-400">Powered by graph algorithm backends and explainable AI advisors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-3 glow-card">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Skill Knowledge Graph</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive React Flow visualizer with color-coded nodes, directed prerequisite edges, zoom/pan controls, and detailed side drawer analysis.
            </p>
          </div>

          <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-3 glow-card">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Graph Algorithm Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Topological sorting, dependency traversal, cycle detection, PageRank centrality scoring, and Dijkstra shortest learning paths.
            </p>
          </div>

          <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-3 glow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Explainable AI Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI explains why to learn each skill, provides technical interview question prep, resume bullet recommendations, and weekly career advice.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 lg:px-8 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 NEXUS – AI Powered Personal Skill Graph & Career Intelligence Platform.</p>
      </footer>
    </div>
  );
};
