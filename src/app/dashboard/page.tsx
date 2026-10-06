'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { OpportunityRadar } from '@/components/OpportunityRadar';
import { CareerDNAView } from '@/components/CareerDNAView';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { WhyThisMatchModal } from '@/components/WhyThisMatchModal';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { HeroCareerNetwork } from '@/components/HeroCareerNetwork';
import { SkillMapVisual } from '@/components/SkillMapVisual';
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
import { analyzeSkillGaps } from '@/lib/skill-gap-engine';
import { 
  Sparkles, 
  Target, 
  GitBranch, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Briefcase,
  Edit3,
  Compass,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Check,
  FolderGit2
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

  // Skill Gaps calculated from target role and real opportunities
  const skillGaps = useMemo(() => {
    if (!hasProfile || !student) return [];
    return analyzeSkillGaps(student, opportunities);
  }, [student, opportunities, hasProfile]);

  // Authentic Profile Completion Percentage calculation
  const profileCompletion = useMemo(() => {
    if (!student) return 0;
    let score = 0;
    if (student.name && student.email) score += 15;
    if (student.institution && student.branch) score += 20;
    if (student.skills && student.skills.length >= 3) score += 25;
    else if (student.skills && student.skills.length > 0) score += 15;
    if (student.projects && student.projects.length >= 1) score += 20;
    if (student.careerGoal && student.careerGoal.trim().length > 0) score += 10;
    if (student.preferences && student.preferences.types && student.preferences.types.length > 0) score += 10;
    return Math.min(100, score);
  }, [student]);

  // Dashboard Metrics
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
      priorityGapsCount: skillGaps.filter((g) => g.priority === 'Critical' || g.priority === 'High Priority').length,
      upcomingDeadlines,
      skillsCount: student?.skills.length || 0,
      projectsCount: student?.projects.length || 0,
    };
  }, [matchResults, skillGaps, hasProfile, student]);

  // Segregate Recommended Jobs vs Recommended Opportunities
  const recommendedJobs = useMemo(() => {
    return matchResults
      .filter((m) => m.opportunity.type === 'Job' || m.opportunity.type === 'Full-time')
      .slice(0, 3);
  }, [matchResults]);

  const recommendedOtherOpportunities = useMemo(() => {
    return matchResults
      .filter((m) => m.opportunity.type !== 'Job' && m.opportunity.type !== 'Full-time')
      .slice(0, 3);
  }, [matchResults]);

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}! Re-analyzing landscape...`);
  };

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
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'skill-map') router.push('/skill-map');
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
            {/* 1. Welcome Banner & Live Overview */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Opportunity Intelligence Dashboard</span>
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

              {/* Editable Career Goal Card with Re-Analyze Engine */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                <div className="space-y-1 z-10">
                  <div className="flex items-center space-x-2">
                    <Target className={`w-4 h-4 ${student?.careerGoal ? 'text-cyan-300' : 'text-amber-300'}`} />
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-200">
                      {student?.careerGoal ? 'Active Career Trajectory' : 'Career Goal'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {student?.careerGoal || 'Not set yet'}
                  </h2>
                  <p className="text-xs text-indigo-200 max-w-xl">
                    {student?.careerGoal
                      ? 'All match scores, skill gap priorities, and job rankings are dynamically calibrated to this career destination.'
                      : 'Set your career goal to unlock personalized opportunity recommendations, dynamic match scores, and skill roadmaps.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs">
                    <span className="text-indigo-200 block text-[10px] uppercase font-bold">Profile Depth</span>
                    <strong className="text-white font-black text-sm">{profileCompletion}% Complete</strong>
                  </div>

                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className={`px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
                      student?.careerGoal
                        ? 'bg-white hover:bg-slate-100 text-indigo-900'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {student?.careerGoal ? (
                      <>
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                        <span>Change Goal</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 text-slate-950" />
                        <span>Set My Career Goal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 5 Dynamic Overview Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {student?.careerGoal ? 'Strong Matches' : 'Verified Skills'}
                  </span>
                  <span className="font-mono text-2xl font-black text-emerald-600 mt-1 block">
                    {student?.careerGoal ? dashboardStats?.strongMatches : (student?.skills.length || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {student?.careerGoal ? '≥80% alignment' : 'Foundational skills'}
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {student?.careerGoal ? 'Near Matches' : 'Academic Projects'}
                  </span>
                  <span className="font-mono text-2xl font-black text-indigo-600 mt-1 block">
                    {student?.careerGoal ? dashboardStats?.nearMatches : (student?.projects.length || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {student?.careerGoal ? '60% – 79% alignment' : 'Coursework & practice'}
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {student?.careerGoal ? 'Priority Skill Gaps' : 'Work Experience'}
                  </span>
                  <span className="font-mono text-2xl font-black text-rose-600 mt-1 block">
                    {student?.careerGoal ? dashboardStats?.priorityGapsCount : (student?.experience.length || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {student?.careerGoal ? 'Critical for target goal' : 'No fake entries'}
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {student?.careerGoal ? 'Total Profile Skills' : 'Certifications'}
                  </span>
                  <span className="font-mono text-2xl font-black text-[#172033] mt-1 block">
                    {student?.careerGoal ? dashboardStats?.skillsCount : (student?.certifications.length || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {student?.careerGoal ? 'Backed by evidence' : 'None added yet'}
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {student?.careerGoal ? 'Urgent Deadlines' : 'Career Destination'}
                  </span>
                  <span className="font-mono text-2xl font-black text-amber-600 mt-1 block">
                    {student?.careerGoal ? dashboardStats?.upcomingDeadlines : 'Unset'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {student?.careerGoal ? '≤ 14 days remaining' : 'Ready to configure'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Status & Readiness Checklist (Section 7) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>Profile Status & Readiness Indicator</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent overview based strictly on verified inputs.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold">
                  {profileCompletion}% Complete
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Profile created</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">✓ Basic information</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Skills</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    ✓ Initial skills added ({student!.skills.length} foundational skills)
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Projects</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    ✓ Academic projects added ({student!.projects.length} starter projects)
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 font-bold">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    <span>Experience</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">○ No professional experience yet</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 font-bold">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    <span>Certifications</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">○ None added</p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${student?.careerGoal ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'}`}>
                  <div className={`flex items-center space-x-2 font-bold ${student?.careerGoal ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {student?.careerGoal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-amber-500 inline-block flex-shrink-0" />
                    )}
                    <span>Career Goal</span>
                  </div>
                  <p className={`text-[11px] mt-1 font-medium ${student?.careerGoal ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {student?.careerGoal ? `✓ ${student.careerGoal}` : '○ Not set'}
                  </p>
                </div>

                <div className={`p-3.5 rounded-2xl border ${student?.careerInterests && student.careerInterests.length > 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`flex items-center space-x-2 font-bold ${student?.careerInterests && student.careerInterests.length > 0 ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {student?.careerInterests && student.careerInterests.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    )}
                    <span>Interests</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${student?.careerInterests && student.careerInterests.length > 0 ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {student?.careerInterests && student.careerInterests.length > 0 ? `✓ ${student.careerInterests.join(', ')}` : '○ Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 8: AI RECOMMENDATION BEHAVIOR */}
            {!student?.careerGoal ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto text-cyan-300 shadow-inner">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="max-w-2xl mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Set your career goal to unlock personalized opportunity recommendations.
                    </h2>
                    <p className="text-sm text-indigo-200 leading-relaxed">
                      CareerLens AI does not assume or pretend to know your preferred career. Once you select or enter your career goal, the platform dynamically analyzes your skills, projects, and coursework to calculate real match scores, priority skill gaps, and learning roadmaps.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-2xl mx-auto">
                    {[
                      'Software Engineer',
                      'Web Development',
                      'Frontend Developer',
                      'Backend Engineer',
                      'Data Scientist',
                      'AI/ML Engineer',
                      'Cloud Engineer',
                      'Cybersecurity Engineer',
                    ].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleUpdateGoal(role)}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer"
                      >
                        + {role}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition-all inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <Target className="w-4 h-4 text-slate-950" />
                      <span>Set My Career Goal</span>
                    </button>
                  </div>
                </div>

                {/* Initial Starter Skills & Projects Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Foundational Starter Skills ({student!.skills.length})</span>
                      </div>
                      <button
                        onClick={() => router.push('/profile')}
                        className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Manage in Profile
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {student!.skills.map((s) => (
                        <div key={s.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{s.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {s.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                        <FolderGit2 className="w-4 h-4 text-indigo-600" />
                        <span>Academic / Personal Projects ({student!.projects.length})</span>
                      </div>
                      <button
                        onClick={() => router.push('/profile')}
                        className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Manage in Profile
                      </button>
                    </div>
                    <div className="space-y-2">
                      {student!.projects.map((p) => (
                        <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 2. Top Recommended Jobs Section */}
                <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Recommended Jobs</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Highest AI-estimated matches for your verified skills and target role.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/jobs')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore all jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((m) => (
                  <div
                    key={m.opportunity.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500">{m.opportunity.organization}</span>
                        <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {m.overallMatchScore}% match
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 line-clamp-2 mb-2">
                        {m.opportunity.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                        <span>{m.opportunity.location}</span>
                        <span>·</span>
                        <span>{m.opportunity.workMode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOppForDetail({ opp: m.opportunity, match: m })}
                      className="w-full py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Top Recommended Opportunities (Internships, Hackathons, Research, Fellowships) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    <span>Recommended Opportunities (Internships, Hackathons, Research)</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    High-impact global programs to build your portfolio and gain credentials.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/opportunities')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore opportunity universe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedOtherOpportunities.map((m) => (
                  <div
                    key={m.opportunity.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500">{m.opportunity.organization}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          {m.opportunity.type}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 line-clamp-2 mb-2">
                        {m.opportunity.title}
                      </h3>
                      <div className="text-[11px] text-slate-600 line-clamp-2 mb-3">
                        {m.opportunity.description}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {m.overallMatchScore}% match
                      </span>
                      <button
                        onClick={() => setSelectedOppForDetail({ opp: m.opportunity, match: m })}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Priority Skill Gaps Section (Derived from actual role data) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-rose-600" />
                    <span>Priority Skill Gaps for {student!.careerGoal || 'Target Role'}</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calculated from target role prerequisites minus your demonstrated profile skills.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/skill-map')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Skill Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skillGaps.slice(0, 3).map((gap, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-base font-black text-slate-900">{gap.skill}</strong>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        gap.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        gap.priority === 'High Priority' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {gap.priority || 'Critical'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Why do I need this?
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gap.whyNeeded || gap.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Current Level</span>
                        <strong className="text-slate-700 font-semibold">{gap.currentLevel || 'No demonstrated experience'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Target Level</span>
                        <strong className="text-indigo-700 font-semibold">{gap.targetLevel || 'Intermediate'}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-700">
                      <span className="font-bold block text-slate-900 mb-0.5">Recommended Action:</span>
                      {gap.recommendedAction || 'Build a dedicated GitHub project demonstrating this competency.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Signature Interactive Visual: Skill Map Topology */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#172033] tracking-tight">
                    Your Skill Map Topology
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live interactive mapping: YOU → Your Skills → Career Goal → Role Requirements → Opportunities.
                  </p>
                </div>
                <button
                  onClick={() => router.push('/skill-map')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <SkillMapVisual
                student={student}
                opportunities={opportunities}
                matchResults={matchResults}
                onChangeGoalClick={() => setIsGoalModalOpen(true)}
                onOpportunityClick={(opp) => setSelectedOppForDetail({ opp })}
              />
            </div>

            {/* 6. Career DNA Synthesis */}
            <CareerDNAView
              student={student!}
              onExploreGaps={() => router.push('/skill-map')}
              onSimulateWhatIf={() => router.push('/what-if')}
            />

            {/* 7. Comprehensive Opportunity Radar */}
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
              onExploreGaps={() => router.push('/skill-map')}
              onSimulateWhatIf={() => router.push('/what-if')}
            />
          </>
        )}
      </div>
    ) : (
      <EmptyDashboard
        onBuildProfile={() => setIsOnboardingOpen(true)}
        onSignIn={() => setIsAuthModalOpen(true)}
        userName={currentUser?.name}
      />
    )}
  </main>

  {/* Career Goal Modal */}
  <CareerGoalModal
    isOpen={isGoalModalOpen}
    onClose={() => setIsGoalModalOpen(false)}
    currentGoal={student?.careerGoal || ''}
    onUpdateGoal={handleUpdateGoal}
  />

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
