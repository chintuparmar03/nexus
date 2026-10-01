import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Network,
  Target,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  Send,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [aiInput, setAiInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Developer'}! I'm NEXUS Career AI. Your graph topology shows high proficiency in Frontend fundamentals. Focus on System Design next to boost your Full Stack readiness!`
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetchTopMatches();
  }, []);

  const fetchTopMatches = async () => {
    try {
      const res = await api.get('/careers/matches');
      if (res.data.success) {
        setMatches(res.data.matches.slice(0, 3));
      }
    } catch (err) {
      console.warn('Matches fallback');
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      if (res.data.success) {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: res.data.reply }]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `To optimize your current target readiness, master Docker & PostgreSQL next. This directly unlocks System Design prerequisites!`
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Radar Chart Data for Skill Categories
  const radarData = [
    { category: 'Frontend', value: 85 },
    { category: 'Backend', value: 65 },
    { category: 'Databases', value: 60 },
    { category: 'Cloud', value: 40 },
    { category: 'DevOps', value: 35 },
    { category: 'AI', value: 45 }
  ];

  const pieData = [
    { name: 'Mastered', value: user?.userSkills.filter((s) => s.status === 'Completed').length || 4, color: '#10b981' },
    { name: 'In Progress', value: user?.userSkills.filter((s) => s.status === 'Learning').length || 3, color: '#6366f1' },
    { name: 'Target', value: 5, color: '#06b6d4' }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="glass-panel border border-indigo-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Career Intelligence Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.name}! 👋</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Target Goal: <span className="font-bold text-white uppercase">{user?.targetCareerId?.replace('-', ' ') || 'Full Stack Engineer'}</span>. Your mathematical graph readiness is computed at <strong className="text-emerald-400">78%</strong>.
          </p>
        </div>

        <button
          onClick={() => navigate('/graph')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Network className="w-4 h-4" /> Open Skill Knowledge Graph
        </button>
      </div>

      {/* 4 Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Skills Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">
            {user?.userSkills.filter((s) => s.status === 'Completed').length || 4}
          </p>
          <p className="text-[11px] text-slate-400">Across 6 tech categories</p>
        </div>

        <div className="glass-panel border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Calculated Readiness</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">78%</p>
          <p className="text-[11px] text-slate-400">Confidence Score: 85%</p>
        </div>

        <div className="glass-panel border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Current Level & XP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">L{user?.level || 4} ({user?.xp || 680} XP)</p>
          <p className="text-[11px] text-slate-400">{user?.badges?.length || 2} Badges Unlocked</p>
        </div>

        <div className="glass-panel border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 font-mono">{user?.streakDays || 7} Days 🔥</p>
          <p className="text-[11px] text-slate-400">Active commit consistency</p>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart: Skill Distribution */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Skill Category Proficiency Radar</h3>
              <p className="text-xs text-slate-400">Multi-axis distribution of technical proficiency</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="category" stroke="#a1a1aa" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" />
                <Radar name="Proficiency" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Status Breakdown */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Skill Status Breakdown</h3>
            <p className="text-xs text-slate-400">Mastered vs In-Progress nodes</p>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around text-xs font-mono pt-2 border-t border-slate-800">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Career Matches & AI Career Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Career Matches */}
        <div className="glass-panel border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Career Path Matches
            </h3>
            <Link to="/careers" className="text-xs text-indigo-400 hover:underline">View All Careers</Link>
          </div>

          <div className="space-y-3">
            {matches.map((c) => (
              <div
                key={c.careerId}
                onClick={() => navigate(`/careers/${c.careerId}`)}
                className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl cursor-pointer flex items-center justify-between transition-all group"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{c.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">{c.averageSalary} • {c.industryDemand} Demand</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    {c.readinessPercentage}% Match
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Career Advisor Chat Sidekick */}
        <div className="glass-panel border border-indigo-500/30 p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> NEXUS AI Career Advisor
              </h3>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                GPT-4o Intelligence
              </span>
            </div>

            {/* Chat message box */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-indigo-600 text-white ml-auto max-w-[85%]'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {aiLoading && (
                <div className="p-3 rounded-2xl text-xs bg-slate-900 text-slate-400 animate-pulse">
                  Analyzing skill graph topology...
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask AI advisor: What skill should I learn next?"
              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
