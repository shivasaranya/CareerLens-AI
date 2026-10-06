'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { SkillMapVisual } from '@/components/SkillMapVisual';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  Opportunity, 
  StudentProfile, 
  AuthUser, 
  MatchResult, 
  ApplicationTrackerItem 
} from '@/types';
import { 
  getStoredOpportunities, 
  getCurrentUser, 
  setCurrentUser,
  getUserProfile, 
  saveUserProfile, 
  getUserApplications,
  signOut 
} from '@/lib/storage';
import { rankOpportunities } from '@/lib/matching-engine';
import { Layers, Sparkles, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SkillMapPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Modals
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<{ opp: Opportunity; match?: MatchResult | null } | null>(null);
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

  const matchResults: MatchResult[] = useMemo(() => {
    if (!hasProfile || !student) return [];
    return rankOpportunities(opportunities, student);
  }, [opportunities, student, hasProfile]);

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}! Landscape recalculated.`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    router.push('/');
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Skill Map...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-indigo-200 text-slate-900 shadow-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab="skill-map"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'what-if') router.push('/what-if');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Skill Intelligence Topology</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
                Student Skill Map
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                Understand how your declared skills connect to your career destination, identify exact qualification gaps, and discover matching opportunities.
              </p>
            </div>

            {hasProfile && (
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
              >
                <Target className="w-4 h-4" />
                <span>Change Career Goal</span>
              </button>
            )}
          </div>

          {/* Skill Map Visualization */}
          <SkillMapVisual
            student={student}
            opportunities={opportunities}
            matchResults={matchResults}
            onChangeGoalClick={hasProfile ? () => setIsGoalModalOpen(true) : undefined}
            onOpportunityClick={(opp) => setSelectedOppForDetail({ opp })}
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

      {/* Opportunity Detail Modal */}
      {selectedOppForDetail && (
        <OpportunityDetailModal
          opportunity={selectedOppForDetail.opp}
          matchResult={selectedOppForDetail.match}
          student={student}
          onClose={() => setSelectedOppForDetail(null)}
          onBuildProfile={() => {
            setSelectedOppForDetail(null);
            setIsOnboardingOpen(true);
          }}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={(prof) => {
          if (!currentUser) return;
          setStudent(prof);
          saveUserProfile(currentUser.id, prof);
          showToast('Profile updated!');
        }}
        initialProfile={student}
        currentUser={currentUser}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUserState(user);
          const existing = getUserProfile(user.id);
          if (existing && existing.name) {
            setStudent(existing);
          } else {
            setIsOnboardingOpen(true);
          }
        }}
      />
    </div>
  );
}
