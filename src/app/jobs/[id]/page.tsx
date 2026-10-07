'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { Opportunity, StudentProfile, AuthUser, MatchResult, ApplicationTrackerItem } from '@/types';
import { 
  getStoredOpportunities, 
  getCurrentUser, 
  getUserProfile, 
  saveUserProfile,
  getUserApplications,
  saveUserApplications,
  signOut 
} from '@/lib/storage';
import { evaluateMatch } from '@/lib/matching-engine';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  Layers, 
  ChevronRight,
  BookmarkCheck,
  Check
} from 'lucide-react';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

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
      const apps = getUserApplications(user.id);
      if (apps.some((a) => a.opportunityId === jobId)) {
        setHasApplied(true);
      }
    }
  }, [jobId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const job = useMemo(() => {
    return opportunities.find((o) => o.id === jobId);
  }, [opportunities, jobId]);

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

  const match: MatchResult | null = useMemo(() => {
    if (!job || !hasProfile || !student) return null;
    return evaluateMatch(job, student);
  }, [job, student, hasProfile]);

  const handleTrackApplication = () => {
    if (!currentUser || !job) {
      setIsAuthModalOpen(true);
      return;
    }
    const existingApps = getUserApplications(currentUser.id);
    if (!existingApps.some((a) => a.opportunityId === job.id)) {
      const updated: ApplicationTrackerItem[] = [
        ...existingApps,
        {
          id: `app-${Date.now()}`,
          userId: currentUser.id,
          opportunityId: job.id,
          title: job.title,
          organization: job.organization,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          notes: `Applied on official portal (${job.applicationUrl || job.officialUrl || 'Direct Link'})`,
        },
      ];
      saveUserApplications(currentUser.id, updated);
    }
    setHasApplied(true);
    showToast('Application tracked on your Dashboard!');
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
        Loading Role Details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
        <Navbar
          activeTab="jobs"
          setActiveTab={(tab) => {
            if (tab === 'landing') router.push('/');
            else if (tab === 'dashboard') router.push('/dashboard');
            else if (tab === 'jobs') router.push('/jobs');
            else if (tab === 'opportunities') router.push('/opportunities');
            else if (tab === 'career-map') router.push('/career-map');
            else if (tab === 'skill-map') router.push('/skill-map');
            else if (tab === 'skill-gaps') router.push('/skill-gaps');
            else if (tab === 'what-if') router.push('/what-if');
          }}
          student={student}
          currentUser={currentUser}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-black text-slate-900">Opportunity Not Found</h1>
          <p className="text-sm text-slate-500">The requested job or opportunity id does not exist in the active catalogue.</p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Back to Jobs
          </button>
        </main>
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

      {/* Top Navbar */}
      <Navbar
        activeTab="jobs"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'career-map') router.push('/career-map');
          else if (tab === 'skill-map') router.push('/skill-map');
          else if (tab === 'skill-gaps') router.push('/skill-gaps');
          else if (tab === 'what-if') router.push('/what-if');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Back */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => router.push('/jobs')}
            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Jobs</span>
          </button>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-xs">{job.title}</span>
        </div>

        {/* Primary Role Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {job.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {job.workMode}
                </span>
                {job.verification?.status === 'Verified' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Source
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="flex items-center space-x-1 text-slate-900 font-bold">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{job.organization}</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{job.location}</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Deadline: {job.deadline}</span>
                </span>
              </div>
            </div>

            {/* Application CTA Box */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
              <a
                href={job.applicationUrl || job.officialUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTrackApplication}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer text-center"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleTrackApplication}
                className={`px-5 py-2.5 rounded-2xl border font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  hasApplied
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {hasApplied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookmarkCheck className="w-3.5 h-3.5" />}
                <span>{hasApplied ? 'Tracked as Applied' : 'Track Application'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: About the Role */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-3">
              <h2 className="text-base font-black text-slate-900 tracking-tight">About the Role</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {job.overview || job.description}
              </p>
            </div>

            {/* Section: Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-3">
                <h2 className="text-base font-black text-slate-900 tracking-tight">Responsibilities</h2>
                <ul className="space-y-2 text-sm text-slate-600">
                  {job.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section: Required Skills & Preferred Skills */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight mb-2">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((s, idx) => {
                    const isCandidateSkill = student?.skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase());
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${
                          isCandidateSkill
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isCandidateSkill ? <span>✓ {s}</span> : <span>{s}</span>}
                      </span>
                    );
                  })}
                </div>
              </div>

              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Preferred Skills (Bonus)</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Eligibility & Experience */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-black text-slate-900 tracking-tight">Eligibility Criteria</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience Level</span>
                  <strong className="text-xs font-bold text-slate-800 block mt-1">{job.experienceLevel || 'Fresher'}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Graduation Years</span>
                  <strong className="text-xs font-bold text-slate-800 block mt-1">
                    {job.eligibleGradYears.length > 0 ? job.eligibleGradYears.join(', ') : 'Open to all cohorts'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible Disciplines</span>
                  <strong className="text-xs font-bold text-slate-800 block mt-1">
                    {job.eligibleBranches.join(', ')}
                  </strong>
                </div>

                {job.minGpaOrCriteria && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree & Academic Criteria</span>
                    <p className="text-xs text-slate-700 mt-1">{job.minGpaOrCriteria}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column (1 col): Match Evaluation & Source Meta */}
          <div className="space-y-6">
            {/* Section: Your Match (Section 23) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Your Match</h3>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  AI Evaluation
                </span>
              </div>

              {hasProfile && match ? (
                <div className="space-y-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-mono text-4xl font-black text-indigo-600">
                      {match.overallMatchScore}%
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">AI-estimated fit</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {match.aiExplanation}
                  </p>

                  {/* Strengths */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Your Strengths</span>
                    {match.matchedSkills.length > 0 ? (
                      <div className="space-y-1">
                        {match.matchedSkills.slice(0, 3).map((s, idx) => (
                          <div key={idx} className="text-xs text-emerald-700 flex items-center space-x-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No exact skill matches demonstrated yet.</p>
                    )}
                  </div>

                  {/* Gaps */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-rose-700 block">Your Gaps</span>
                    {match.missingSkills.length > 0 ? (
                      <div className="space-y-1">
                        {match.missingSkills.slice(0, 3).map((s, idx) => (
                          <div key={idx} className="text-xs text-rose-700 flex items-center space-x-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 ml-1" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium">No major missing prerequisites!</p>
                    )}
                  </div>

                  {/* Eligibility check */}
                  {match.eligibilityIssue && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      <strong className="block font-bold">Eligibility Notice:</strong>
                      <span className="text-[11px] mt-0.5 block">{match.eligibilityIssue}</span>
                    </div>
                  )}

                  <button
                    onClick={() => router.push(`/what-if?addSkill=${encodeURIComponent(match.missingSkills[0] || 'Docker')}`)}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Simulate Closing Gap</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-center py-2">
                  <p className="text-xs text-slate-500">
                    Create your profile to see your personalized AI-estimated match score, strengths, and missing prerequisites.
                  </p>
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Build Profile to See Fit
                  </button>
                </div>
              )}
            </div>

            {/* Section: Compensation & Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3.5 text-xs">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Overview & Timeline</h3>

              {job.stipendOrSalary && (
                <div className="flex items-start space-x-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Compensation</span>
                    <strong className="text-slate-800 block text-xs">{job.stipendOrSalary}</strong>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Deadline</span>
                  <strong className="text-slate-800 block text-xs">{job.deadline} ({job.daysRemaining} days left)</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Employment Type</span>
                  <strong className="text-slate-800 block text-xs">{job.employmentType || 'Permanent Full-time'}</strong>
                </div>
              </div>

              {job.source && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div>Source: <strong className="text-slate-700">{job.source}</strong></div>
                  <div>Last Checked: <strong className="text-slate-700">{job.lastChecked || 'Recent'}</strong></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Onboarding & Auth Modals */}
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
