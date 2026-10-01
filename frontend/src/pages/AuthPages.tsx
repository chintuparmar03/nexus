import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, GraduationCap, Target, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPages: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1);

  // Step 1 Payload
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Step 2 Payload
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('Computer Science');
  const [currentYear, setCurrentYear] = useState('Junior Year (3rd Year)');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [targetCareerId, setTargetCareerId] = useState('fullstack-engineer');
  const [preferredLearningHours, setPreferredLearningHours] = useState(10);

  // Step 3 Payload (Initial known skills)
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(['javascript', 'html-css']);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, register, googleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const success = await login(email, password);
    if (success) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from);
    } else {
      setErrorMsg('Invalid email or password. Please check your credentials or register a new account.');
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    const payload = {
      name,
      email,
      password,
      college,
      degree,
      currentYear,
      experienceLevel,
      targetCareerId,
      preferredLearningHours,
      initialSkillIds: selectedSkillIds
    };

    const success = await register(payload);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Registration failed. Please check if this email is already registered.');
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const success = await googleAuth({
      name: 'Google Developer',
      email: `dev-${Date.now()}@gmail.com`,
      googleId: `google-${Date.now()}`
    });
    if (success) navigate('/dashboard');
    setLoading(false);
  };

  const availableSkills = [
    { skillId: 'python', name: 'Python', category: 'Programming' },
    { skillId: 'javascript', name: 'JavaScript', category: 'Programming' },
    { skillId: 'typescript', name: 'TypeScript', category: 'Programming' },
    { skillId: 'html-css', name: 'HTML5 & CSS3', category: 'Frontend' },
    { skillId: 'react', name: 'React', category: 'Frontend' },
    { skillId: 'tailwind-css', name: 'Tailwind CSS', category: 'Frontend' },
    { skillId: 'node-js', name: 'Node.js & Express', category: 'Backend' },
    { skillId: 'postgresql', name: 'PostgreSQL & SQL', category: 'Databases' },
    { skillId: 'mongodb', name: 'MongoDB', category: 'Databases' },
    { skillId: 'docker', name: 'Docker', category: 'DevOps' },
    { skillId: 'aws', name: 'AWS Cloud', category: 'Cloud' },
    { skillId: 'machine-learning', name: 'Machine Learning', category: 'AI' }
  ];

  const toggleSkillSelection = (sId: string) => {
    setSelectedSkillIds((prev) => (prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]));
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-xl glass-panel border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isRegister ? `Create Your Account (${step}/3)` : 'Sign In to NEXUS'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister
              ? step === 1
                ? 'Step 1: Account Credentials'
                : step === 2
                ? 'Step 2: Academic Profile & Career Goal'
                : 'Step 3: Select Your Existing Skills'
              : 'Enter your credentials to access your personal skill knowledge graph'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isRegister && (
          <>
            <button
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
              </svg>
              Continue with Google Single Sign-On
            </button>

            <div className="flex items-center gap-3 text-slate-600 text-[10px] font-mono">
              <div className="flex-1 h-px bg-slate-800" />
              <span>OR EMAIL SIGN IN</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900 border border-slate-800 text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        {/* REGISTER MULTI-STEP WIZARD */}
        {isRegister && (
          <div className="space-y-4 text-xs">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@stanford.edu"
                    className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (name && email && password) setStep(2);
                    else setErrorMsg('Please fill in name, email, and password');
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <span>Continue to Academic Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-mono">University / College</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Stanford University"
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-mono">Degree Major</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-mono">Current Level</label>
                    <select
                      value={experienceLevel}
                      onChange={(e: any) => setExperienceLevel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-mono">Target Career Goal</label>
                    <select
                      value={targetCareerId}
                      onChange={(e) => setTargetCareerId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none"
                    >
                      <option value="fullstack-engineer">Full Stack Engineer</option>
                      <option value="frontend-engineer">Frontend Engineer</option>
                      <option value="backend-engineer">Backend Engineer</option>
                      <option value="ai-engineer">AI & LLM Engineer</option>
                      <option value="devops-cloud-engineer">DevOps & Cloud Engineer</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl bg-slate-900 text-slate-300 font-semibold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Skill Selection</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-slate-300">Select skills you already know to initialize your personalized graph topology:</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableSkills.map((s) => {
                    const isSelected = selectedSkillIds.includes(s.skillId);
                    return (
                      <div
                        key={s.skillId}
                        onClick={() => toggleSkillSelection(s.skillId)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{s.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-xl bg-slate-900 text-slate-300 font-semibold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Creating Account...' : 'Complete & Generate Skill Graph'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setStep(1);
                  setErrorMsg('');
                }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setStep(1);
                  setErrorMsg('');
                }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Register & Build Skill Graph
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
