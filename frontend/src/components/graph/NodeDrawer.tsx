import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Clock, BookOpen, ExternalLink, Award, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface NodeDrawerProps {
  skillId: string | null;
  onClose: () => void;
  onSkillUpdated?: () => void;
}

export const NodeDrawer: React.FC<NodeDrawerProps> = ({ skillId, onClose, onSkillUpdated }) => {
  const { updateUserSkill } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'ai'>('overview');

  useEffect(() => {
    if (skillId) {
      fetchSkillDetails(skillId);
    }
  }, [skillId]);

  const fetchSkillDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/skills/${id}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Fallback details');
    } finally {
      setLoading(false);
    }
  };

  if (!skillId) return null;

  const handleProficiencyChange = async (newProf: number, newStatus: 'Completed' | 'Learning' | 'WantToLearn') => {
    await updateUserSkill(skillId, newProf, newStatus);
    fetchSkillDetails(skillId);
    if (onSkillUpdated) onSkillUpdated();
  };

  const skill = data?.skill;
  const userState = data?.userState;
  const ai = data?.aiInsight;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#121215] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {skill?.category || 'Skill'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {skill?.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">{skill?.name || skillId}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center border-b border-slate-800 px-5 text-xs font-medium bg-slate-900/20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Prerequisites
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'resources' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Learning Resources
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          AI Insights
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
            Computing Graph Topology & AI Insights...
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Description */}
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed">{skill?.description}</p>
                </div>

                {/* Quick Meta Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Est. Learning Time</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" /> {skill?.estimatedHours || 20} Hours
                    </span>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Industry Demand</span>
                    <span className="font-bold text-emerald-400">{skill?.industryDemand || 'High'}</span>
                  </div>
                </div>

                {/* User Mastery Status Control */}
                <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-400" /> Your Proficiency & Status
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                      {userState?.status || 'WantToLearn'}
                    </span>
                  </div>

                  {/* Rating level buttons */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleProficiencyChange(lvl, lvl >= 4 ? 'Completed' : 'Learning')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          (userState?.proficiency || 0) >= lvl
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        L{lvl}
                      </button>
                    ))}
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleProficiencyChange(5, 'Completed')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        userState?.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </button>
                    <button
                      onClick={() => handleProficiencyChange(3, 'Learning')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        userState?.status === 'Learning'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> In Progress
                    </button>
                  </div>
                </div>

                {/* Prerequisites Breakdown */}
                {data?.prerequisitesDetails?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" /> Directed Prerequisites
                    </h4>
                    <div className="space-y-2">
                      {data.prerequisitesDetails.map((p: any) => (
                        <div key={p.skillId} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs flex items-center justify-between">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Unlocked Skills */}
                {data?.nextSkillsDetails?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                      <ArrowRight className="w-4 h-4 text-cyan-400" /> Unlocks Next
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.nextSkillsDetails.map((n: any) => (
                        <span key={n.skillId} className="text-xs bg-slate-900 border border-slate-800 text-cyan-300 px-3 py-1 rounded-xl">
                          {n.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: RESOURCES */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Curated, high-quality documentation and video courses for {skill?.name}:</p>
                {(skill?.resources || []).map((res: any, i: number) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex items-center justify-between text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors block">{res.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{res.type} {res.isFree ? '• Free Resource' : ''}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                  </a>
                ))}
              </div>
            )}

            {/* TAB 3: AI INSIGHTS */}
            {activeTab === 'ai' && ai && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Why Learn {skill?.name}?
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{ai.whyLearn}</p>
                </div>

                {/* Interview Questions */}
                {ai.interviewQuestions?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-400" /> Interview Question Highlights
                    </h4>
                    {ai.interviewQuestions.map((q: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-200">Q: {q.question}</p>
                        <p className="text-slate-400 text-[11px]">A: {q.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resume Suggestions */}
                {ai.resumeBullets?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-2">Resume Impact Bullet Points</h4>
                    <ul className="space-y-2">
                      {ai.resumeBullets.map((b: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
