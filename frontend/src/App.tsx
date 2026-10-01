import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { SkillGraphCanvas } from './components/graph/SkillGraphCanvas';
import { CareersPage } from './pages/CareersPage';
import { CareerGapAnalysis } from './components/careers/CareerGapAnalysis';
import { InteractiveRoadmap } from './components/roadmap/InteractiveRoadmap';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPages } from './pages/AuthPages';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-61px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Landing & Auth pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPages />} />

            {/* Protected App pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AnalyticsDashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/graph"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SkillGraphCanvas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/careers"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CareersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/careers/:careerId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CareerGapAnalysis />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <InteractiveRoadmap />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AchievementsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
