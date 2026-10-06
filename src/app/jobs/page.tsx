'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { WhyThisMatchModal } from '@/components/WhyThisMatchModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  Opportunity, 
  StudentProfile, 
  AuthUser, 
  MatchResult, 
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
  Briefcase, 
  Sparkles, 
  MapPin, 
  Building2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  BadgePercent,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ROLE_CATEGORIES = [
  'All Roles',
  'Software Engineer',
  'AI / ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Backend Engineer',
  'Frontend Developer',
  'Cybersecurity Engineer',
];

const EXPERIENCE_OPTIONS = [
  'All Experience',
  'Fresher',
  '0–1 years',
  '1–2 years',
  '2–5 years',
  '5+ years',
];

const WORK_MODE_OPTIONS = [
  'All Modes',
  'Remote',
  'Hybrid',
  'On-site',
];

const EMPLOYMENT_OPTIONS = [
  'All Types',
  'Full-time',
  'Part-time',
  'Contract',
];

const POSTED_OPTIONS = [
  'Any Time',
  'Today',
  'Last 3 days',
  'Last week',
  'Last month',
];

export default function JobsPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedExperience, setSelectedExperience] = useState('All Experience');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All Modes');
  const [selectedEmployment, setSelectedEmployment] = useState('All Types');
  const [selectedPosted, setSelectedPosted] = useState('Any Time');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'recent'>('match');

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

  // Filter only jobs / full-time listings
  const filteredJobs = useMemo(() => {
    return opportunities.filter((opp) => {
      // Must be a job
      const isJob = opp.type === 'Job' || opp.type === 'Full-time';
      if (!isJob) return false;

      // Role Filter
      if (selectedRole !== 'All Roles') {
        const qRole = selectedRole.toLowerCase();
        const inTitle = opp.title.toLowerCase().includes(qRole);
        const inDesc = opp.description.toLowerCase().includes(qRole);
        if (!inTitle && !inDesc) return false;
      }

      // Experience Filter
      if (selectedExperience !== 'All Experience') {
        if (opp.experienceLevel && opp.experienceLevel !== selectedExperience) {
          return false;
        }
      }

      // Work Mode
      if (selectedWorkMode !== 'All Modes' && opp.workMode !== selectedWorkMode) {
        return false;
      }

      // Employment Type
      if (selectedEmployment !== 'All Types' && opp.employmentType && opp.employmentType !== selectedEmployment) {
        return false;
      }

      // Skill Filter
      if (selectedSkillFilter.trim()) {
        const sNorm = selectedSkillFilter.toLowerCase().trim();
        const hasSkill = opp.requiredSkills.some((s) => s.toLowerCase().includes(sNorm)) ||
                         opp.preferredSkills.some((s) => s.toLowerCase().includes(sNorm));
        if (!hasSkill) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = opp.organization.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesLoc = opp.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesSkills && !matchesLoc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match' && hasProfile) {
        const scoreA = matchResultsMap.get(a.id)?.overallMatchScore || 0;
        const scoreB = matchResultsMap.get(b.id)?.overallMatchScore || 0;
        return scoreB - scoreA;
      } else if (sortBy === 'deadline') {
        return a.daysRemaining - b.daysRemaining;
      } else {
        return (b.postedDate || '').localeCompare(a.postedDate || '');
      }
    });
  }, [
    opportunities,
    selectedRole,
    selectedExperience,
    selectedWorkMode,
    selectedEmployment,
    selectedSkillFilter,
    searchQuery,
    sortBy,
    hasProfile,
    matchResultsMap,
  ]);

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    setApplications([]);
    router.push('/');
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Jobs Discovery...</div>;
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
        activeTab="jobs"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'opportunities') router.push('/opportunities');
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
        {/* Header Section */}
        <div className="space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Job Discovery Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
            Find your next role
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Explore jobs aligned with your skills, experience and career direction. Verified postings from premier global technology leaders.
          </p>

          {!hasProfile && (
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">Want to see your AI-estimated match?</strong>
                  <span className="text-slate-500">Create your profile to calculate transparent match scores, verify eligibility, and spot skill gaps.</span>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Create My Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 mb-8">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs, companies or skills (e.g. Python, Google, AWS, Distributed Systems)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {/* Role Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Role Domain</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {ROLE_CATEGORIES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Experience</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Work Mode</label>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {WORK_MODE_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Employment</label>
              <select
                value={selectedEmployment}
                onChange={(e) => setSelectedEmployment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {EMPLOYMENT_OPTIONS.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="match">{hasProfile ? 'AI-Estimated Match' : 'Relevance'}</option>
                <option value="deadline">Application Deadline</option>
                <option value="recent">Recently Posted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> active job opportunities</span>
          {hasProfile && (
            <span className="text-indigo-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Calibrated for {student?.careerGoal || 'Software Engineer'}
            </span>
          )}
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const match = matchResultsMap.get(job.id);
            const score = match?.overallMatchScore || 0;
            const hasIssue = Boolean(match?.eligibilityIssue);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Organization, Location & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">{job.organization}</span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5">
                        {job.title}
                      </h3>
                    </div>
                    {job.verification?.status === 'Verified' && (
                      <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0" title="Verified Posting">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Metadata Chips: Full-time, Work Mode, Location */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-slate-600">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold">
                      {job.employmentType || 'Full-time'} · {job.experienceLevel || 'Entry Level'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold">
                      {job.location}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg font-semibold ${
                      job.workMode === 'Remote' ? 'bg-emerald-50 text-emerald-700' :
                      job.workMode === 'Hybrid' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.workMode}
                    </span>
                  </div>

                  {/* Public Compensation if available */}
                  {job.stipendOrSalary && (
                    <div className="mb-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] font-bold text-slate-800">
                      💰 {job.stipendOrSalary}
                    </div>
                  )}

                  {/* Required Skills */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Required Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.slice(0, 4).map((skill, sIdx) => {
                        const isStudentSkill = student?.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase());
                        return (
                          <span
                            key={sIdx}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isStudentSkill
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isStudentSkill ? `✓ ${skill}` : skill}
                          </span>
                        );
                      })}
                      {job.requiredSkills.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Match Status & Action */}
                <div className="pt-4 border-t border-slate-100 mt-2">
                  {hasProfile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-mono text-base font-black ${
                            hasIssue ? 'text-amber-600' :
                            score >= 80 ? 'text-emerald-600' :
                            score >= 60 ? 'text-indigo-600' : 'text-slate-600'
                          }`}>
                            {score}%
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">AI-estimated match</span>
                        </div>

                        {match && (
                          <button
                            onClick={() => {
                              setSelectedMatchForModal(match);
                              setWhyModalType('why');
                            }}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            View Match
                          </button>
                        )}
                      </div>

                      {hasIssue && (
                        <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Criteria consideration noted</span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedOppForDetail({ opp: job, match })}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>View Role Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-500 block italic">
                        Create your profile to see your match
                      </span>
                      <button
                        onClick={() => setSelectedOppForDetail({ opp: job, match: null })}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Explore Role</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No jobs match your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters or adjusting your search terms.</p>
            <button
              onClick={() => {
                setSelectedRole('All Roles');
                setSelectedExperience('All Experience');
                setSelectedWorkMode('All Modes');
                setSelectedEmployment('All Types');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

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

      {/* Why This Match Modal */}
      {selectedMatchForModal && (
        <WhyThisMatchModal
          matchResult={selectedMatchForModal}
          onClose={() => setSelectedMatchForModal(null)}
          onOpenWhatIf={() => router.push('/what-if')}
          defaultTab={whyModalType}
        />
      )}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={(prof) => {
          let activeUser = currentUser;
          if (!activeUser) {
            activeUser = {
              id: `user-${Date.now()}`,
              name: prof.name,
              email: prof.email || 'user@example.com',
              createdAt: new Date().toISOString(),
            };
            setCurrentUser(activeUser);
            setCurrentUserState(activeUser);
          }
          setStudent(prof);
          saveUserProfile(activeUser.id, prof);
          showToast(`Profile created for ${prof.name}! Matches calibrated.`);
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
