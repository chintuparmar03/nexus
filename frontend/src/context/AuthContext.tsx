import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserSkill {
  skillId: string;
  proficiency: number;
  status: 'Completed' | 'Learning' | 'WantToLearn';
  updatedAt: string;
}

export interface UserBadge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  college?: string;
  degree?: string;
  currentYear?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetCareerId?: string;
  preferredLearningHours: number;
  preferredLearningStyle: 'Visual' | 'Hands-on' | 'Theoretical';
  githubProfile?: string;
  linkedinProfile?: string;
  userSkills: UserSkill[];
  xp: number;
  level: number;
  streakDays: number;
  badges: UserBadge[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  googleAuth: (data: any) => Promise<boolean>;
  logout: () => void;
  updateUserSkill: (skillId: string, proficiency: number, status: 'Completed' | 'Learning' | 'WantToLearn') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexus_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data.success) {
        localStorage.setItem('nexus_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err: any) {
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        localStorage.setItem('nexus_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const googleAuth = async (data: any): Promise<boolean> => {
    try {
      const res = await api.post('/auth/google', data);
      if (res.data.success) {
        localStorage.setItem('nexus_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    setToken(null);
    setUser(null);
  };

  const updateUserSkill = async (skillId: string, proficiency: number, status: 'Completed' | 'Learning' | 'WantToLearn') => {
    try {
      if (token) {
        const res = await api.post('/skills/user-skill', { skillId, proficiency, status });
        if (res.data.success && user) {
          setUser({
            ...user,
            userSkills: res.data.userSkills,
            xp: res.data.currentXp,
            level: res.data.currentLevel
          });
        }
      }
    } catch (err) {
      console.error('Update skill error', err);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (token) {
        const res = await api.put('/auth/profile', data);
        if (res.data.success) setUser(res.data.user);
      }
    } catch (err) {
      console.error('Profile update error', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleAuth,
        logout,
        updateUserSkill,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
