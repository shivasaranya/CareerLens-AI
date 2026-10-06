'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
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
  computeDetailedSkillGaps, 
  DetailedSkillGap, 
  generateCareerRoadmap, 
  RoadmapPhase 
} from '@/lib/career-intelligence';
import { 
  Clock, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SkillGapsPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Modals & Selection
  const [selectedGap, setSelectedGap] = useState<DetailedSkillGap | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [roadmapSkills, setRoadmapSkills] = useState<string[]>([]);
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

  // Compute calculated skill gaps
  const calculatedGaps = useMemo(() => {
    if (!student || !hasCareerGoal) return [];
    return computeDetailedSkillGaps(student, opportunities);
  }, [student, hasCareerGoal, opportunities]);

  // Compute roadmap
  const roadmapPhases: RoadmapPhase[] = useMemo(() => {
    return generateCareerRoadmap(student?.careerGoal || '', student?.skills || []);
  }, [student]);

  const filteredGaps = useMemo(() => {
    if (filterPriority === 'All') return calculatedGaps;
    return calculatedGaps.filter((g) => g.priority === filterPriority);
  }, [calculatedGaps, filterPriority]);

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}! Skill gaps recalculated.`);
  };

  const handleAddToRoadmap = (skill: string) => {
    if (!roadmapSkills.includes(skill)) {
      setRoadmapSkills([...roadmapSkills, skill]);
      showToast(`${skill} added to your active Learning Roadmap!`);
    } else {
      showToast(`${skill} is already in your Learning Roadmap.`);
    }
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
        Loading Skill Gaps...
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
        activeTab="skill-gaps"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'career-map') router.push('/career-map');
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Opportunity Alignment Diagnostic</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
                Your Skill Gaps
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                Know exactly what you need to improve for your target career.
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                onClick={() => router.push('/career-map')}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>Career Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION 6: BEFORE CAREER GOAL IS SELECTED */}
          {!hasCareerGoal ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 via-rose-50/40 to-white rounded-3xl p-8 sm:p-10 border border-amber-200/90 shadow-sm text-center max-w-3xl mx-auto space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold shadow-2xs">
                  <Target className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                    Career goal required
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Choose a career goal to generate an accurate skill-gap analysis.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Your skill gaps will be calculated using your current skills, evidence, and the requirements of your chosen career path.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <Target className="w-4 h-4" />
                    <span>Choose Career Goal</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-amber-100 text-slate-500 text-[11px]">
                  CareerLens AI avoids arbitrary gap calculations. Gaps are derived strictly when evaluating your capability against active market prerequisites.
                </div>
              </div>

              {/* Starter Skills Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Initial Demonstrated Skills ({student?.skills.length || 0})
                  </span>
                  <span className="text-[11px] text-indigo-600 font-semibold">Ready for benchmark calibration</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(student?.skills || []).map((s) => (
                    <div key={s.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* SECTION 7, 8, 9, 10, 11, 12: AFTER CAREER GOAL IS SELECTED */
            <div className="space-y-8">
              {/* Active Target Role Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-cyan-300" />
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-200">
                      Active Benchmark Target
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{student!.careerGoal}</h2>
                  <p className="text-xs text-indigo-200 max-w-xl">
                    Compared against {opportunities.length} live opportunities and target expectations for {student!.careerGoal}.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
                    <span className="text-indigo-200 block text-[10px] uppercase font-bold">Identified Gaps</span>
                    <strong className="text-white font-mono text-base">{calculatedGaps.length} Skills</strong>
                  </div>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Change Goal
                  </button>
                </div>
              </div>

              {/* Priority Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <span className="text-slate-400 mr-2 text-[11px] uppercase tracking-wider font-bold">Filter By Priority:</span>
                  {(['All', 'Critical', 'High Priority', 'Moderate'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        filterPriority === p
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p === 'Critical' && '🔴 '}
                      {p === 'High Priority' && '🟠 '}
                      {p === 'Moderate' && '🟡 '}
                      <span>{p}</span>
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  Showing {filteredGaps.length} gaps
                </span>
              </div>

              {/* Skill Gaps Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGaps.map((gap) => (
                  <div
                    key={gap.skill}
                    onClick={() => setSelectedGap(gap)}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {gap.skill}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            gap.priority === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : gap.priority === 'High Priority'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Current Status</span>
                          <strong className="text-slate-700 font-medium">{gap.status}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Target Requirement</span>
                          <strong className="text-indigo-700 font-medium">{gap.targetLevel}</strong>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                        {gap.whyNeeded}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                        Used in {gap.relevantOpportunitiesCount} opps
                      </span>
                      <span className="text-indigo-600 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                        <span>Why & Actions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION 11: WHAT SHOULD I LEARN NEXT? (RECOMMENDED NEXT SKILLS) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Actionable Next Steps</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Recommended Next Skills
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ranked dynamically by role relevance, market frequency, and student gap size.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculatedGaps.slice(0, 3).map((gap, idx) => (
                    <div
                      key={gap.skill}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{gap.skill}</h4>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-1">
                          <div>
                            <span className="text-slate-400 font-semibold">Why this skill: </span>
                            <span>{gap.whyNeeded}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold">Target Level: </span>
                            <span className="font-bold text-indigo-700">{gap.targetLevel}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700">
                          <span className="font-bold block text-slate-900 mb-0.5">Recommended Action:</span>
                          {gap.actionSteps[0] || 'Build a verified project incorporating this competency.'}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleAddToRoadmap(gap.skill)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                            roadmapSkills.includes(gap.skill)
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {roadmapSkills.includes(gap.skill) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Added to Roadmap</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Roadmap</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 12: CAREER ROADMAP (Foundation -> Build -> Practice -> Prove -> Apply) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Progression Framework
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Your 5-Phase Career Roadmap for {student!.careerGoal}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Foundation → Build → Practice → Prove → Apply roadmap tuned to your verified credentials.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                  {roadmapPhases.map((phase, idx) => (
                    <div
                      key={phase.phase}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                            Phase {idx + 1}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              phase.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : phase.status === 'In Progress'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {phase.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-slate-900">{phase.phase}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{phase.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                        <span className="font-bold block text-slate-700">Milestone:</span>
                        <p className="line-clamp-2">{phase.milestones[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SECTION 9 & 13 & 14: SKILL GAP DETAIL MODAL */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-indigo-600 to-purple-600" />

            <button
              onClick={() => setSelectedGap(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedGap.priority === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {selectedGap.priority}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Opportunity Gap Diagnostic</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{selectedGap.skill}</h2>
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Capability</span>
                <strong className="text-slate-800">{selectedGap.currentLevel}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Requirement</span>
                <strong className="text-indigo-700">{selectedGap.targetLevel}</strong>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-800 block">Why this matters:</span>
              <p className="text-slate-600 leading-relaxed">{selectedGap.whyNeeded}</p>
            </div>

            {/* What you can do */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">What you can do:</span>
              <ul className="space-y-1 pl-4 list-disc text-slate-600">
                {selectedGap.actionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* Expected Impact (Labelled AI ESTIMATE) */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                Estimated Match Uplift (AI Estimate — Not a Guarantee)
              </span>
              <p className="text-indigo-950 leading-relaxed">{selectedGap.expectedImpact}</p>
            </div>

            {/* Section 13: What-If Connection Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Potential improvement:</span>
                <strong className="text-indigo-900 font-mono text-sm">
                  +{selectedGap.whatIfImprovementPoints} percentage points
                </strong>
                <span className="text-[10px] text-slate-400 block">
                  ~{selectedGap.unlockedOpportunitiesCount} new opportunities unlocked
                </span>
              </div>
              <button
                onClick={() => router.push('/what-if')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Simulate in What-If
              </button>
            </div>

            {/* Action Buttons: View Opportunities & Add to Roadmap */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => router.push('/opportunities')}
                className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>View Opportunities ({selectedGap.relevantOpportunitiesCount})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  handleAddToRoadmap(selectedGap.skill);
                  setSelectedGap(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Add to Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
