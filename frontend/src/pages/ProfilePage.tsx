import React, { useState } from 'react';
import { User as UserIcon, GraduationCap, Github, Linkedin, Save, Sparkles, Award, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || 'Stanford University',
    degree: user?.degree || 'Computer Science',
    currentYear: user?.currentYear || 'Junior Year (3rd Year)',
    experienceLevel: user?.experienceLevel || 'Intermediate',
    preferredLearningHours: user?.preferredLearningHours || 10,
    githubProfile: user?.githubProfile || '',
    linkedinProfile: user?.linkedinProfile || ''
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Header */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-8 flex items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/40"
        />
        <div>
          <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Level {user?.level || 4} Engineer
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {user?.xp || 680} XP
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="glass-panel border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400" /> Personal & Academic Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-mono">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-mono">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-mono">Degree & Major</label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-mono">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e: any) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-mono">GitHub Profile Link</label>
            <input
              type="text"
              value={formData.githubProfile}
              onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-mono">Weekly Learning Hours Target</label>
            <input
              type="number"
              value={formData.preferredLearningHours}
              onChange={(e) => setFormData({ ...formData, preferredLearningHours: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          {saved ? <span className="text-xs font-mono text-emerald-400">✓ Profile updated successfully!</span> : <span />}
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
