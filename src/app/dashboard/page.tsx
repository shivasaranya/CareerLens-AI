'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { OpportunityRadar } from '@/components/OpportunityRadar';
import { CareerDNAView } from '@/components/CareerDNAView';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { WhyThisMatchModal } from '@/components/WhyThisMatchModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { HeroCareerNetwork } from '@/components/HeroCareerNetwork';
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
  saveUserApplications,
  signOut 
} from '@/lib/storage';
import { rankOpportunities } from '@/lib/matching-engine';
import { 
  Sparkles, 
  Target, 
  GitBranch, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Modals
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<{ opp: Opportunity; match?: MatchResult | null } | null>(null);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<MatchResult | null>(null);
  const [whyModalType, setWhyModalType] = useState<'why' | 'why-not-100'>('why');
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
      setApplications(getUserApplications(user.id));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

  // Dynamic AI Match Evaluation strictly for the authenticated user
  const matchResults: MatchResult[] = useMemo(() => {
    if (!hasProfile || !student) return [];
    return rankOpportunities(opportunities, student);
  }, [opportunities, student, hasProfile]);

  // Genuine dashboard metrics
  const dashboardStats = useMemo(() => {
    if (!hasProfile) return null;
    let strongCount = 0;
    let nearCount = 0;
    let upcomingDeadlines = 0;

    matchResults.forEach((m) => {
      if (m.overallMatchScore >= 80) strongCount++;
      else if (m.overallMatchScore >= 60) nearCount++;
      if (m.opportunity.daysRemaining <= 14) upcomingDeadlines++;
    });

    return {
      strongMatches: strongCount,
      nearMatches: nearCount,
      upcomingDeadlines,
      skillsCount: student?.skills.length || 0,
      projectsCount: student?.projects.length || 0,
    };
  }, [matchResults, hasProfile, student]);

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUserState(user);
    const existing = getUserProfile(user.id);
    if (existing && existing.name) {
      setStudent(existing);
      showToast(`Welcome back, ${user.name}!`);
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
    showToast(`Profile updated for ${newProfile.name}!`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    setApplications([]);
    router.push('/');
  };

  const handleTrackApplication = (oppId: string, title: string, org: string) => {
    if (!currentUser) return;
    const newApp: ApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      userId: currentUser.id,
      opportunityId: oppId,
      title,
      organization: org,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Drafting',
      notes: 'Added from personal dashboard.',
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveUserApplications(currentUser.id, updated);
    showToast(`Added "${title}" to your Application Pipeline!`);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Dashboard...</div>;
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
        activeTab="dashboard"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'opportunities') router.push('/opportunities');
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
          <div className="space-y-10">
            {/* 1. Welcome Banner & Live Overview Cards */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Your CareerLens Intelligence</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
                    Welcome back, {student!.name}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {student!.branch} · {student!.institution} · Graduating {student!.graduationYear}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push('/what-if')}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>What-If Simulator</span>
                  </button>
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* 5 Dynamic Overview Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Strong Matches</span>
                  <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">{dashboardStats?.strongMatches}</span>
                  <span className="text-[10px] text-slate-500 font-medium">≥80% alignment</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Near Matches</span>
                  <span className="font-mono text-2xl font-black text-indigo-600 mt-1 block">{dashboardStats?.nearMatches}</span>
                  <span className="text-[10px] text-slate-500 font-medium">60% – 79% alignment</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Skills Tracked</span>
                  <span className="font-mono text-2xl font-black text-[#172033] mt-1 block">{dashboardStats?.skillsCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium">Verified by evidence</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Projects Added</span>
                  <span className="font-mono text-2xl font-black text-violet-600 mt-1 block">{dashboardStats?.projectsCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium">Technical artifacts</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Urgent Deadlines</span>
                  <span className="font-mono text-2xl font-black text-rose-600 mt-1 block">{dashboardStats?.upcomingDeadlines}</span>
                  <span className="text-[10px] text-slate-500 font-medium">≤ 14 days remaining</span>
                </div>
              </div>
            </div>

            {/* 2. Signature Visual: "Your Opportunity Landscape" Interactive Graph */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#172033] tracking-tight">
                    Your Opportunity Landscape
                  </h2>
                  <p className="text-xs text-slate-500">
                    Interactive mapping of your declared skills through AI career pathways to active opportunities.
                  </p>
                </div>
              </div>

              <HeroCareerNetwork
                onExploreOpportunities={() => router.push('/opportunities')}
                onBuildProfile={() => setIsOnboardingOpen(true)}
              />
            </div>

            {/* 3. Career DNA Synthesis */}
            <CareerDNAView
              student={student!}
              onExploreGaps={() => router.push('/opportunities')}
              onSimulateWhatIf={() => router.push('/what-if')}
            />

            {/* 4. Opportunity Radar & Match Grid */}
            <OpportunityRadar
              student={student!}
              matchResults={matchResults}
              onWhyMatch={(match) => {
                setSelectedMatchForModal(match);
                setWhyModalType('why');
              }}
              onWhyNot100={(match) => {
                setSelectedMatchForModal(match);
                setWhyModalType('why-not-100');
              }}
              onViewRoadmap={() => {}}
              onViewDetails={(match) => {
                setSelectedOppForDetail({ opp: match.opportunity, match });
              }}
              onExploreGaps={() => router.push('/opportunities')}
              onSimulateWhatIf={() => router.push('/what-if')}
            />
          </div>
        ) : (
          <EmptyDashboard
            onBuildProfile={() => setIsOnboardingOpen(true)}
            onSignIn={() => setIsAuthModalOpen(true)}
            userName={currentUser?.name}
          />
        )}
      </main>

      {/* Modals */}
      {selectedOppForDetail && (
        <OpportunityDetailModal
          opportunity={selectedOppForDetail.opp}
          matchResult={selectedOppForDetail.match}
          student={student}
          onClose={() => setSelectedOppForDetail(null)}
          onTrackApplication={handleTrackApplication}
          onBuildProfile={() => {
            setSelectedOppForDetail(null);
            setIsOnboardingOpen(true);
          }}
          isAlreadyTracked={Boolean(applications.some((a) => a.opportunityId === selectedOppForDetail.opp.id))}
        />
      )}

      <WhyThisMatchModal
        matchResult={selectedMatchForModal}
        onClose={() => setSelectedMatchForModal(null)}
        onOpenRoadmap={() => {}}
        onOpenWhatIf={() => router.push('/what-if')}
        defaultTab={whyModalType}
      />

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
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
