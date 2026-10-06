'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  StudentProfile, 
  Opportunity, 
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
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
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

  const handleAuthSuccess = (user: AuthUser, isNewUser: boolean) => {
    setCurrentUserState(user);
    const existing = getUserProfile(user.id);
    if (existing && existing.name) {
      setStudent(existing);
      showToast(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    } else {
      setIsOnboardingOpen(true);
    }
  };

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
    showToast(`Profile created for ${newProfile.name}!`);
    router.push('/dashboard');
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    showToast('Signed out successfully.');
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading CareerLens AI...</div>;
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

      {/* Top Navbar */}
      <Navbar
        activeTab="landing"
        setActiveTab={(tab) => {
          if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'what-if') router.push('/what-if');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'signin');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Standalone Landing Page */}
      <main className="flex-1">
        <LandingPage
          onBuildProfile={() => setIsOnboardingOpen(true)}
          onExploreOpportunities={(category) => {
            router.push('/opportunities');
          }}
          onSignIn={() => {
            setAuthModalMode('signin');
            setIsAuthModalOpen(true);
          }}
          opportunities={opportunities}
        />
      </main>

      {/* 8-Step Profile Creation Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
