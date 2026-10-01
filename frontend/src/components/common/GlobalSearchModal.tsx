import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Network, Target, BookOpen, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [skills, setSkills] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && query.trim() !== '') {
      fetchSearchResults();
    }
  }, [query, isOpen]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const [skillsRes, careersRes] = await Promise.all([
        api.get(`/skills?search=${encodeURIComponent(query)}`),
        api.get('/careers')
      ]);

      if (skillsRes.data.success) {
        setSkills(skillsRes.data.skills.slice(0, 6));
      }
      if (careersRes.data.success) {
        const filteredCareers = careersRes.data.careers.filter((c: any) =>
          c.title.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
        );
        setCareers(filteredCareers.slice(0, 4));
      }
    } catch (err) {
      console.warn('Search API fallback');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#121215] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills (e.g. React, Python, Docker), careers, or docs..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Type anything to search NEXUS Skill Knowledge Graph & Career Intelligence...
            </div>
          ) : (
            <>
              {/* Skills Results */}
              {skills.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 mb-2 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-indigo-400" /> Skills & Technologies
                  </p>
                  <div className="space-y-1">
                    {skills.map((s) => (
                      <div
                        key={s.skillId}
                        onClick={() => {
                          navigate(`/graph?skill=${s.skillId}`);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white group-hover:text-indigo-300">{s.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                              {s.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{s.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Careers Results */}
              {careers.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2 mb-2 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" /> Career Paths
                  </p>
                  <div className="space-y-1">
                    {careers.map((c) => (
                      <div
                        key={c.careerId}
                        onClick={() => {
                          navigate(`/careers/${c.careerId}`);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-semibold text-white group-hover:text-emerald-300">{c.title}</span>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-semibold">{c.averageSalary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Search source: Predefined Skill Knowledge Graph</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
