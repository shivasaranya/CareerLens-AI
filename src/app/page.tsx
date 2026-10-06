'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { OpportunityRadar } from '@/components/OpportunityRadar';
import { SkillGapMap } from '@/components/SkillGapMap';
import { WhatIfSimulator } from '@/components/WhatIfSimulator';
import { OpportunityGraph } from '@/components/OpportunityGraph';
import { PersonalizedRoadmap } from '@/components/PersonalizedRoadmap';
import { ApplicationTracker } from '@/components/ApplicationTracker';
import { AdminPanel } from '@/components/AdminPanel';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { WhyThisMatchModal } from '@/components/WhyThisMatchModal';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { OpportunityCopilot } from '@/components/OpportunityCopilot';
import { 
  StudentProfile, 
  Opportunity, 
  MatchResult, 
  ApplicationTrackerItem, 
  VerificationStatus,
  AuthUser 
} from '@/types';
import { SEED_OPPORTUNITIES } from '@/data/opportunities';
import { rankOpportunities } from '@/lib/matching-engine';
import { 
  getCurrentUser, 
  setCurrentUser, 
  signOut,
  registerUser,
  getUserProfile, 
  saveUserProfile, 
  getUserApplications, 
  saveUserApplications,
  getStoredOpportunities, 
  saveStoredOpportunities, 
  resetDemoData 
} from '@/lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<MatchResult | null>(null);
  const [whyModalType, setWhyModalType] = useState<'why' | 'why-not-100'>('why');
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<MatchResult | null>(null);
  const [activeRoadmapOpportunity, setActiveRoadmapOpportunity] = useState<Opportunity | null>(null);
  const [whatIfPreselectedSkill, setWhatIfPreselectedSkill] = useState<string>('AWS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user) {
      const prof = getUserProfile(user.id);
      setStudent(prof);
      setApplications(getUserApplications(user.id));
    } else {
      setStudent(null);
      setApplications([]);
    }
    setOpportunities(getStoredOpportunities());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Evaluate matches dynamically whenever student or opportunities change
  // Strictly calculated ONLY when the user has entered their profile!
  const matchResults: MatchResult[] = useMemo(() => {
    if (!student || !student.name || student.name.trim().length === 0) return [];
    return rankOpportunities(opportunities, student);
  }, [opportunities, student]);

  // Auth Handlers
  const handleAuthSuccess = (user: AuthUser, isNewUser: boolean) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    const existingProfile = getUserProfile(user.id);
    const userApps = getUserApplications(user.id);
    setApplications(userApps);

    if (existingProfile && existingProfile.name) {
      setStudent(existingProfile);
      showToast(`Welcome back, ${user.name}!`);
      setActiveTab('dashboard');
    } else {
      setStudent(null);
      showToast(`Account ready for ${user.name}. Let's build your profile!`);
      setIsOnboardingOpen(true);
    }
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    setApplications([]);
    setActiveTab('landing');
    showToast('Signed out. Your data remains safely stored.');
  };

  // Handle Profile Save
  const handleSaveProfile = (newProfile: StudentProfile) => {
    let activeUser = currentUser;
    // Auto-create or link user identity if not already authenticated
    if (!activeUser) {
      activeUser = registerUser(newProfile.name, newProfile.email || 'user@careerlens.ai');
      setCurrentUserState(activeUser);
      newProfile.userId = activeUser.id;
    }
    setStudent(newProfile);
    saveUserProfile(activeUser.id, newProfile);
    setActiveTab('dashboard');
    showToast(`Profile activated for ${newProfile.name}! Opportunity Intelligence generated.`);
  };

  // Handle Application Tracking
  const handleTrackApplication = (oppId: string, title: string, org: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const existing = applications.find((a) => a.opportunityId === oppId);
    if (existing) {
      showToast('Opportunity is already tracked in your pipeline.');
      return;
    }
    const newApp: ApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      userId: currentUser.id,
      opportunityId: oppId,
      title,
      organization: org,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Drafting',
      notes: 'Initial checklist reviewed. Tailoring application details.',
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveUserApplications(currentUser.id, updated);
    showToast(`Added "${title}" to your Application Pipeline!`);
  };

  const handleUpdateAppStatus = (id: string, newStatus: ApplicationTrackerItem['status']) => {
    if (!currentUser) return;
    const updated = applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setApplications(updated);
    saveUserApplications(currentUser.id, updated);
  };

  const handleRemoveApp = (id: string) => {
    if (!currentUser) return;
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    saveUserApplications(currentUser.id, updated);
    showToast('Removed opportunity from tracker.');
  };

  // Admin Actions
  const handleUpdateVerification = (id: string, status: VerificationStatus, trustScore: number) => {
    const updated = opportunities.map((o) =>
      o.id === id
        ? {
            ...o,
            verification: {
              ...o.verification,
              status,
              trustScore,
              notes: status === 'Verified' ? 'Manually verified by CareerLens administrator.' : o.verification.notes,
            },
          }
        : o
    );
    setOpportunities(updated);
    saveStoredOpportunities(updated);
    showToast(`Opportunity verification status set to ${status}.`);
  };

  const handleAddOpportunity = (opp: Opportunity) => {
    const updated = [opp, ...opportunities];
    setOpportunities(updated);
    saveStoredOpportunities(updated);
    showToast(`Added new opportunity: ${opp.title}`);
  };

  const handleDeleteOpportunity = (id: string) => {
    const updated = opportunities.filter((o) => o.id !== id);
    setOpportunities(updated);
    saveStoredOpportunities(updated);
    showToast('Deleted opportunity.');
  };

  const handleResetDemoData = () => {
    resetDemoData();
    setCurrentUserState(null);
    setStudent(null);
    setApplications([]);
    setOpportunities(SEED_OPPORTUNITIES);
    setActiveTab('landing');
    showToast('Session reset. Ready for a new user.');
  };

  // Navigation handlers
  const handleOpenWhyMatch = (match: MatchResult) => {
    setSelectedMatchForModal(match);
    setWhyModalType('why');
  };

  const handleOpenWhyNot100 = (match: MatchResult) => {
    setSelectedMatchForModal(match);
    setWhyModalType('why-not-100');
  };

  const handleOpenRoadmapFromMatch = (match: MatchResult) => {
    setActiveRoadmapOpportunity(match.opportunity);
    setActiveTab('roadmap');
  };

  const handleOpenRoadmapForSkill = (skill: string) => {
    const targetOpp = opportunities.find((o) =>
      o.requiredSkills.some((s) => s.toLowerCase() === skill.toLowerCase()) ||
      o.preferredSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    ) || opportunities[0];
    setActiveRoadmapOpportunity(targetOpp);
    setActiveTab('roadmap');
  };

  const handleOpenWhatIfWithSkill = (skill: string) => {
    setWhatIfPreselectedSkill(skill);
    setActiveTab('what-if');
  };

  const handleViewOpportunityDetails = (match: MatchResult) => {
    setSelectedMatchForDetail(match);
  };

  const defaultRoadmapOpp = activeRoadmapOpportunity || (matchResults.length > 0 ? matchResults[0].opportunity : opportunities[0]);
  const roadmapCurrentMatch = useMemo(() => {
    if (!defaultRoadmapOpp || matchResults.length === 0) return 0;
    const found = matchResults.find((m) => m.opportunity.id === defaultRoadmapOpp.id);
    return found ? found.overallMatchScore : 0;
  }, [defaultRoadmapOpp, matchResults]);

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'signin');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        onResetDemo={handleResetDemoData}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onBuildProfile={() => setIsOnboardingOpen(true)}
            onExploreOpportunities={() => setActiveTab('dashboard')}
            onSignIn={() => {
              setAuthModalMode('signin');
              setIsAuthModalOpen(true);
            }}
            opportunities={opportunities}
          />
        )}

        {/* Dashboard: If profile exists, show OpportunityRadar. If not, show EmptyDashboard */}
        {activeTab === 'dashboard' && (
          hasProfile ? (
            <OpportunityRadar
              student={student!}
              matchResults={matchResults}
              onWhyMatch={handleOpenWhyMatch}
              onWhyNot100={handleOpenWhyNot100}
              onViewRoadmap={handleOpenRoadmapFromMatch}
              onViewDetails={handleViewOpportunityDetails}
              onExploreGaps={() => setActiveTab('skill-gap')}
              onSimulateWhatIf={() => setActiveTab('what-if')}
            />
          ) : (
            <EmptyDashboard
              onBuildProfile={() => setIsOnboardingOpen(true)}
              onSignIn={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              userName={currentUser?.name}
            />
          )
        )}

        {/* Skill Gap Map: Only shown if profile exists */}
        {activeTab === 'skill-gap' && (
          hasProfile ? (
            <SkillGapMap
              student={student!}
              opportunities={opportunities}
              onOpenWhatIfWithSkill={handleOpenWhatIfWithSkill}
              onOpenRoadmapForSkill={handleOpenRoadmapForSkill}
            />
          ) : (
            <EmptyDashboard
              onBuildProfile={() => setIsOnboardingOpen(true)}
              onSignIn={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              userName={currentUser?.name}
            />
          )
        )}

        {/* What-If Simulator: Only shown if profile exists */}
        {activeTab === 'what-if' && (
          hasProfile ? (
            <WhatIfSimulator
              student={student!}
              opportunities={opportunities}
              initialSkill={whatIfPreselectedSkill}
              onSelectOpportunityForRoadmap={(oppId) => {
                const matched = opportunities.find((o) => o.id === oppId);
                if (matched) {
                  setActiveRoadmapOpportunity(matched);
                  setActiveTab('roadmap');
                }
              }}
            />
          ) : (
            <EmptyDashboard
              onBuildProfile={() => setIsOnboardingOpen(true)}
              onSignIn={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              userName={currentUser?.name}
            />
          )
        )}

        {/* Opportunity Graph: Only shown if profile exists */}
        {activeTab === 'graph' && (
          hasProfile ? (
            <OpportunityGraph
              student={student!}
              opportunities={opportunities}
              onSelectOpportunity={(opp) => {
                const matchedResult = matchResults.find((m) => m.opportunity.id === opp.id);
                if (matchedResult) {
                  setSelectedMatchForDetail(matchedResult);
                }
              }}
            />
          ) : (
            <EmptyDashboard
              onBuildProfile={() => setIsOnboardingOpen(true)}
              onSignIn={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              userName={currentUser?.name}
            />
          )
        )}

        {/* Personalized Roadmap: Only shown if profile exists */}
        {activeTab === 'roadmap' && (
          hasProfile ? (
            defaultRoadmapOpp && (
              <PersonalizedRoadmap
                opportunity={defaultRoadmapOpp}
                student={student!}
                currentMatch={roadmapCurrentMatch}
                onOpenOpportunityDetail={() => {
                  const matched = matchResults.find((m) => m.opportunity.id === defaultRoadmapOpp.id);
                  if (matched) setSelectedMatchForDetail(matched);
                }}
              />
            )
          ) : (
            <EmptyDashboard
              onBuildProfile={() => setIsOnboardingOpen(true)}
              onSignIn={() => {
                setAuthModalMode('signin');
                setIsAuthModalOpen(true);
              }}
              userName={currentUser?.name}
            />
          )
        )}

        {/* Application Tracker */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
            onRemoveApplication={handleRemoveApp}
            onExploreMore={() => setActiveTab('dashboard')}
          />
        )}

        {/* Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel
            opportunities={opportunities}
            onUpdateOpportunityVerification={handleUpdateVerification}
            onAddOpportunity={handleAddOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6EAF2] bg-white py-6 text-center text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">© 2026 CareerLens AI — AI Opportunity Intelligence Platform</p>
          <p className="italic text-slate-400">“The user creates the profile. AI understands the profile. AI finds the opportunities.”</p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* 8-Step Profile Creation Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      {/* Explainable Match & "Why not 100%?" Modal */}
      <WhyThisMatchModal
        matchResult={selectedMatchForModal}
        onClose={() => setSelectedMatchForModal(null)}
        onOpenRoadmap={handleOpenRoadmapFromMatch}
        onOpenWhatIf={() => setActiveTab('what-if')}
        defaultTab={whyModalType}
      />

      {/* Opportunity Detail & Readiness Checklist Drawer */}
      {selectedMatchForDetail && student && (
        <OpportunityDetailModal
          matchResult={selectedMatchForDetail}
          student={student}
          onClose={() => setSelectedMatchForDetail(null)}
          onOpenRoadmap={handleOpenRoadmapFromMatch}
          onTrackApplication={handleTrackApplication}
          isAlreadyTracked={Boolean(applications.some((a) => a.opportunityId === selectedMatchForDetail.opportunity.id))}
        />
      )}

      {/* AI Opportunity Copilot Drawer */}
      <OpportunityCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        student={student || { name: '', branch: '', institution: '' } as any}
        matchResults={matchResults}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsCopilotOpen(false);
        }}
        onOpenMatchDetails={(match) => {
          setSelectedMatchForDetail(match);
          setIsCopilotOpen(false);
        }}
      />
    </div>
  );
}
