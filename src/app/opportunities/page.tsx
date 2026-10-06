'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { WhyThisMatchModal } from '@/components/WhyThisMatchModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  Opportunity, 
  StudentProfile, 
  AuthUser, 
  MatchResult, 
  OpportunityType, 
  WorkMode,
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
  Search, 
  Filter, 
  Compass, 
  Briefcase, 
  Trophy, 
  FlaskConical, 
  GraduationCap, 
  Award, 
  Zap, 
  Users, 
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'match' | 'trust'>('deadline');

  // Modals
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<{ opp: Opportunity; match?: MatchResult | null } | null>(null);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<MatchResult | null>(null);
  const [whyModalType, setWhyModalType] = useState<'why' | 'why-not-100'>('why');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const opps = getStoredOpportunities();
    setOpportunities(opps);

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

  // Evaluate matches only if profile exists
  const matchResults: MatchResult[] = useMemo(() => {
    if (!hasProfile || !student) return [];
    return rankOpportunities(opportunities, student);
  }, [opportunities, student, hasProfile]);

  const matchResultsMap = useMemo(() => {
    const map = new Map<string, MatchResult>();
    matchResults.forEach((m) => map.set(m.opportunity.id, m));
    return map;
  }, [matchResults]);

  // Filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Type filter
      if (selectedType !== 'All') {
        if (selectedType === 'Jobs' && opp.type !== 'Full-time') return false;
        else if (selectedType !== 'Jobs' && opp.type !== selectedType) return false;
      }

      // Work Mode
      if (selectedWorkMode !== 'All' && opp.workMode !== selectedWorkMode) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = opp.organization.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesSkill = opp.requiredSkills.some((s) => s.toLowerCase().includes(q)) || opp.preferredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesLoc = opp.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesSkill && !matchesLoc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return a.daysRemaining - b.daysRemaining;
      } else if (sortBy === 'trust') {
        return (b.verification?.trustScore || 0) - (a.verification?.trustScore || 0);
      } else if (sortBy === 'match' && hasProfile) {
        const scoreA = matchResultsMap.get(a.id)?.overallMatchScore || 0;
        const scoreB = matchResultsMap.get(b.id)?.overallMatchScore || 0;
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [opportunities, selectedType, selectedWorkMode, searchQuery, sortBy, hasProfile, matchResultsMap]);

  // Auth & Profile Handlers
  const handleAuthSuccess = (user: AuthUser, isNewUser: boolean) => {
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
    showToast(`Profile created for ${newProfile.name}! Opportunity intelligence unlocked.`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    setApplications([]);
    showToast('Signed out.');
  };

  const handleTrackApplication = (oppId: string, title: string, org: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
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
      notes: 'Added from Opportunity Discovery portal.',
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    saveUserApplications(currentUser.id, updated);
    showToast(`Added "${title}" to your Application Pipeline!`);
  };

  const categoryPills = [
    { id: 'All', label: 'All Opportunities' },
    { id: 'Jobs', label: 'Jobs' },
    { id: 'Internship', label: 'Internships' },
    { id: 'Hackathon', label: 'Hackathons' },
    { id: 'Research', label: 'Research' },
    { id: 'Scholarship', label: 'Scholarships' },
    { id: 'Fellowship', label: 'Fellowships' },
    { id: 'Competition', label: 'Competitions' },
    { id: 'Apprenticeship', label: 'Apprenticeships' },
    { id: 'Startup Program', label: 'Startup Programs' },
  ];

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Opportunities...</div>;
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
        activeTab="opportunities"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'what-if') router.push('/what-if');
          else if (tab === 'admin') router.push('/dashboard');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Header Banner */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Opportunity Intelligence Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
            Discover Your Next Opportunity
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Explore jobs, internships, hackathons, research programs and more from verified global organizations.
          </p>

          {!hasProfile && (
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">Want to see how you match these roles?</strong>
                  <span className="text-slate-500">Create your profile to unlock 5-layer match percentages, missing skill analysis, and preparation roadmaps.</span>
                </div>
              </div>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm shadow-indigo-600/20 whitespace-nowrap cursor-pointer"
              >
                <span>Create My Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 mb-8">
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities by title, organization, skills (Python, Cloud, AI), or location..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categoryPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedType(pill.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === pill.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Secondary Facets (Work Mode & Sorting) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Work Mode:</span>
              {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedWorkMode === mode
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="deadline">Upcoming Deadline</option>
                <option value="trust">Trust Score</option>
                {hasProfile && <option value="match">Highest Match Score</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-semibold">
          <span>Showing {filteredOpportunities.length} opportunities</span>
          {hasProfile && (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              ✓ Match scores calibrated for {student!.name}
            </span>
          )}
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                matchResult={matchResultsMap.get(opp.id)}
                hasProfile={hasProfile}
                onWhyMatch={(match) => {
                  setSelectedMatchForModal(match);
                  setWhyModalType('why');
                }}
                onWhyNot100={(match) => {
                  setSelectedMatchForModal(match);
                  setWhyModalType('why-not-100');
                }}
                onViewDetails={(selectedOpp, match) => {
                  setSelectedOppForDetail({ opp: selectedOpp, match });
                }}
                onBuildProfile={() => setIsOnboardingOpen(true)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-bold">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#172033]">No opportunities found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or clearing some category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedWorkMode('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Opportunity Details Modal */}
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

      {/* Why This Match Modal */}
      <WhyThisMatchModal
        matchResult={selectedMatchForModal}
        onClose={() => setSelectedMatchForModal(null)}
        onOpenRoadmap={() => {}}
        onOpenWhatIf={() => router.push('/what-if')}
        defaultTab={whyModalType}
      />

      {/* 8-Step Profile Creation Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
