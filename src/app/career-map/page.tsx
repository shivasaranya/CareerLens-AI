'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { CareerMapGraph } from '@/components/CareerMapGraph';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  Opportunity, 
  StudentProfile, 
  AuthUser 
} from '@/types';
import { 
  getStoredOpportunities, 
  getCurrentUser, 
  setCurrentUser, 
  getUserProfile, 
  saveUserProfile, 
  signOut 
} from '@/lib/storage';
import { 
  GitBranch, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Compass, 
  Briefcase 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CareerMapPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setOpportunities(getStoredOpportunities());

    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user) {
      const prof = getUserProfile(user.id);
      setStudent(prof);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);
  const hasCareerGoal = Boolean(student?.careerGoal && student.careerGoal.trim().length > 0);

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}! Career map re-calibrated.`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    router.push('/');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">
        Loading Career Map...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-indigo-200 text-slate-900 shadow-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab="career-map"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'skill-map') router.push('/skill-map');
          else if (tab === 'what-if') router.push('/what-if');
          else if (tab === 'profile') router.push('/profile');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>Career Intelligence Topology</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
                Explore Your Career Map
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                See how your current skills can grow into different career paths.
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                onClick={() => router.push('/skill-map')}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>View Skill Map</span>
              </button>
              <button
                onClick={() => router.push('/skill-gaps')}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <span>Analyze Skill Gaps</span>
              </button>
            </div>
          </div>

          {/* Prompt when career goal is NOT set */}
          {!hasCareerGoal ? (
            <div className="bg-gradient-to-r from-amber-50 via-indigo-50/50 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Your career goal is not set yet.</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Choose a career goal to activate customized pathway calibration.
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  CareerLens AI provides realistic exploration across 6 technical disciplines. Select a target destination below to see required skills, gaps, and matching opportunities dynamically highlighted.
                </p>
              </div>

              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center space-x-2 self-start md:self-auto cursor-pointer"
              >
                <Target className="w-4 h-4 text-slate-950" />
                <span>Choose My Career Goal</span>
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                  <span>Active Target Goal</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{student!.careerGoal}</h2>
                <p className="text-xs text-indigo-200">
                  Visual graph highlighting compatibility with your {student!.skills.length} foundational skills.
                </p>
              </div>

              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
              >
                Change Career Goal
              </button>
            </div>
          )}

          {/* Interactive Visual Graph Component */}
          <CareerMapGraph
            student={student}
            opportunities={opportunities}
            onSelectCareerGoal={handleUpdateGoal}
            onOpenGoalModal={() => setIsGoalModalOpen(true)}
            onNavigateToOpportunities={() => router.push('/opportunities')}
          />
        </div>
      </main>

      {/* Career Goal Modal */}
      <CareerGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={student?.careerGoal || ''}
        onUpdateGoal={handleUpdateGoal}
      />

      {/* Onboarding & Auth Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={(prof) => {
          setStudent(prof);
          saveUserProfile(currentUser?.id || 'user-shiva-saranya', prof);
        }}
        initialProfile={student}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user: AuthUser) => {
          setCurrentUserState(user);
          const prof = getUserProfile(user.id);
          setStudent(prof);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
