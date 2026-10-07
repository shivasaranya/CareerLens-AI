'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { Opportunity, StudentProfile, AuthUser } from '@/types';
import { 
  getStoredOpportunities, 
  getCurrentUser, 
  setCurrentUser,
  getUserProfile, 
  saveUserProfile,
  signOut 
} from '@/lib/storage';
import { Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function WhatIfContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillParam = searchParams.get('addSkill') || searchParams.get('skill') || 'Docker & Containerization';

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

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

  const handleSaveProfile = (newProfile: StudentProfile) => {
    let activeUser = currentUser;
    if (!activeUser) {
      activeUser = {
        id: `user-${Date.now()}`,
        name: newProfile.name,
        email: newProfile.email || 'user@example.com',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(activeUser);
      setCurrentUserState(activeUser);
    }
    setStudent(newProfile);
    saveUserProfile(activeUser.id, newProfile);
    showToast(`Profile updated for ${newProfile.name}!`);
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
        Loading What-If Simulator...
      </div>
    );
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
        activeTab="what-if"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'career-map') router.push('/career-map');
          else if (tab === 'skill-map') router.push('/skill-map');
          else if (tab === 'skill-gaps') router.push('/skill-gaps');
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
        {hasProfile ? (
          <WhatIfSimulator
            student={student!}
            opportunities={opportunities}
            initialSkill={skillParam}
            onSelectOpportunityForRoadmap={(oppId) => {
              router.push('/opportunities');
            }}
          />
        ) : (
          <EmptyDashboard
            onBuildProfile={() => setIsOnboardingOpen(true)}
            onSignIn={() => setIsAuthModalOpen(true)}
            userName={currentUser?.name}
          />
        )}
      </main>

      {/* Onboarding & Auth Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUserState(user);
          const prof = getUserProfile(user.id);
          if (prof && prof.name) {
            setStudent(prof);
          } else {
            setIsOnboardingOpen(true);
          }
        }}
      />
    </div>
  );
}

export default function WhatIfPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Simulator...</div>}>
      <WhatIfContent />
    </Suspense>
  );
}
