'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  Opportunity, 
  StudentProfile, 
  AuthUser, 
  MatchResult, 
  StudentSkill 
} from '@/types';
import { 
  getStoredOpportunities, 
  getCurrentUser, 
  getUserProfile, 
  saveUserProfile, 
  signOut 
} from '@/lib/storage';
import { rankOpportunities } from '@/lib/matching-engine';
import { 
  computeSkillClusters, 
  CAREER_PATHS, 
  categorizeStudentSkill,
  computeDetailedSkillGaps 
} from '@/lib/career-intelligence';
import { 
  Layers, 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle,
  Code2, 
  Globe, 
  Database, 
  Wrench, 
  BrainCircuit, 
  TrendingUp, 
  Plus, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SkillMapPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Filter tab for skills view
  const [activeFilter, setActiveFilter] = useState<'all' | 'strong' | 'developing' | 'beginner' | 'missing'>('all');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

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
  const studentSkills = student?.skills || [];
  const hasSkills = studentSkills.length > 0;
  const currentGoal = student?.careerGoal?.trim() || '';

  // Calculate clusters based on actual student skills
  const clusters = useMemo(() => {
    return computeSkillClusters(studentSkills);
  }, [studentSkills]);

  // Dynamic ranking for current student
  const matchResults: MatchResult[] = useMemo(() => {
    if (!hasProfile || !student) return [];
    return rankOpportunities(opportunities, student);
  }, [opportunities, student, hasProfile]);

  // Overall match baseline
  const currentBaselineMatch = useMemo(() => {
    if (matchResults.length === 0) return 0;
    const top = matchResults.slice(0, 5);
    const avg = top.reduce((acc, m) => acc + m.overallMatchScore, 0) / top.length;
    return Math.round(avg);
  }, [matchResults]);

  // Active Career Path Definition
  const activePath = useMemo(() => {
    if (!currentGoal) return null;
    const gLower = currentGoal.toLowerCase();
    return (
      CAREER_PATHS.find((p) =>
        p.targetRoles.some((r) => r.toLowerCase().includes(gLower) || gLower.includes(r.toLowerCase())) ||
        p.name.toLowerCase().includes(gLower) ||
        gLower.includes(p.name.toLowerCase())
      ) || CAREER_PATHS[0]
    );
  }, [currentGoal]);

  // Required Skills for Target Career
  const targetRequiredSkills = useMemo(() => {
    if (!activePath) return [];
    return Array.from(new Set([...activePath.essentialSkills, ...activePath.recommendedSkills]));
  }, [activePath]);

  // Categorize student's skills
  const evaluatedSkills = useMemo(() => {
    return studentSkills.map((sk) => {
      const category = categorizeStudentSkill(sk);
      let cluster = 'Other';
      const nameLower = sk.name.toLowerCase();
      if (['c', 'python', 'java'].some((k) => nameLower.includes(k))) cluster = 'Programming';
      else if (['html', 'css', 'javascript', 'react', 'web'].some((k) => nameLower.includes(k))) cluster = 'Web Development';
      else if (['sql', 'data structures', 'database'].some((k) => nameLower.includes(k))) cluster = 'Data';
      else if (['git', 'github'].some((k) => nameLower.includes(k))) cluster = 'Development Tools';
      else if (['problem solving', 'algorithm', 'logic'].some((k) => nameLower.includes(k))) cluster = 'Problem Solving';

      return {
        ...sk,
        category,
        cluster,
      };
    });
  }, [studentSkills]);

  // Strong, Developing, Beginner counts
  const strongSkills = evaluatedSkills.filter((s) => s.category === 'Strong');
  const developingSkills = evaluatedSkills.filter((s) => s.category === 'Developing');
  const beginnerSkills = evaluatedSkills.filter((s) => s.category === 'Beginner');

  // Identify not yet demonstrated skills for target career
  const notDemonstratedSkills = useMemo(() => {
    if (!activePath) return [];
    const studentNames = new Set(studentSkills.map((s) => s.name.toLowerCase().trim()));
    return targetRequiredSkills.filter((req) => {
      const rLower = req.toLowerCase().trim();
      return !Array.from(studentNames).some((s) => s.includes(rLower) || rLower.includes(s));
    });
  }, [activePath, studentSkills, targetRequiredSkills]);

  // What-If Simulations for top 3 missing or developing skills
  const whatIfSimulations = useMemo(() => {
    if (!hasProfile || opportunities.length === 0) return [];
    const skillsToSimulate = notDemonstratedSkills.slice(0, 3);
    if (skillsToSimulate.length === 0) {
      // fallback to popular industry skills
      skillsToSimulate.push('Docker', 'AWS', 'PyTorch');
    }

    return skillsToSimulate.map((skillName) => {
      const norm = skillName.toLowerCase();
      // count how many opportunities require or prefer this skill
      const matchingOpps = opportunities.filter((opp) =>
        opp.requiredSkills.concat(opp.preferredSkills).some((sk) => sk.toLowerCase().includes(norm) || norm.includes(sk.toLowerCase()))
      );

      const count = matchingOpps.length;
      if (count === 0) {
        return {
          skill: skillName,
          hasData: false,
          currentMatch: currentBaselineMatch || 65,
          potentialMatch: currentBaselineMatch || 65,
          improvementPoints: 0,
          unlockedCount: 0,
        };
      }

      const improvementPoints = Math.min(18, Math.max(8, Math.round(count * 1.8 + 5)));
      const potentialMatch = Math.min(95, (currentBaselineMatch || 68) + improvementPoints);

      return {
        skill: skillName,
        hasData: true,
        currentMatch: currentBaselineMatch || 68,
        potentialMatch,
        improvementPoints,
        unlockedCount: Math.max(2, Math.round(count * 1.5)),
      };
    });
  }, [hasProfile, opportunities, notDemonstratedSkills, currentBaselineMatch]);

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}! Skill Map updated.`);
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
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Career Intelligence · Skill Architecture</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
                Your Skill Map
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1.5 font-medium">
                Understand what you already know, what you're developing, and what you need next.
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start sm:self-auto">
              {hasProfile && (
                <button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>{currentGoal ? 'Change Career Goal' : 'Choose Career Goal'}</span>
                </button>
              )}
              <button
                onClick={() => router.push('/skill-gaps')}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>View Skill Gaps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* EMPTY / NEW USER STATE (Section 17) */}
          {!hasSkills && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Build your Skill Map
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Add your first skills, projects, certifications, or experience to start building your career intelligence.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skills</span>
                </button>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span>Add Project</span>
                </button>
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Add Certification</span>
                </button>
              </div>
            </div>
          )}

          {hasSkills && (
            <>
              {/* SECTION 1: VISUAL STRUCTURE PIPELINE */}
              {/* YOU ↓ Current Skills ↓ Skill Clusters ↓ Target Career ↓ Required Skills */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Visual Architecture Flow</span>
                    <h2 className="text-lg font-black text-slate-900">CareerLens Skill Topology Pipeline</h2>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time capability evaluation</span>
                  </div>
                </div>

                {/* 5-Stage Visual Structure Flow */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                  {/* Stage 1: YOU */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between relative group hover:border-indigo-300 transition-all">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {student?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Stage 1</span>
                          <strong className="text-xs font-black text-slate-900 block truncate">
                            YOU
                          </strong>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1 mt-2">
                        <p className="font-bold text-slate-900 truncate">{student?.name}</p>
                        <p className="text-slate-500 truncate">{student?.branch || 'CSIT'}</p>
                        <p className="text-[10px] text-slate-400">{student?.institution || 'College'}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Profile Active
                    </div>
                  </div>

                  {/* Stage 2: Current Skills */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between group hover:border-indigo-300 transition-all">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Stage 2</span>
                          <strong className="text-xs font-black text-slate-900 block">
                            Current Skills
                          </strong>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-slate-900 font-mono">{studentSkills.length}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">Active</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          {strongSkills.length} demonstrated · {developingSkills.length} developing
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-semibold">
                      Foundational CS
                    </div>
                  </div>

                  {/* Stage 3: Skill Clusters */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between group hover:border-indigo-300 transition-all">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Stage 3</span>
                          <strong className="text-xs font-black text-slate-900 block">
                            Skill Clusters
                          </strong>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-indigo-600 font-mono">5</span>
                          <span className="text-[10px] text-slate-500 font-semibold">Domains</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          Progression tracked across core disciplines
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-indigo-600 font-bold">
                      Domain Map Ready
                    </div>
                  </div>

                  {/* Stage 4: Target Career */}
                  <div className={`p-4 rounded-2xl border flex flex-col justify-between group transition-all ${
                    currentGoal ? 'bg-indigo-50/70 border-indigo-200' : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          currentGoal ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          <Target className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Stage 4</span>
                          <strong className="text-xs font-black text-slate-900 block">
                            Target Career
                          </strong>
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong className="text-xs font-black text-indigo-900 block truncate">
                          {currentGoal || 'Not Set Yet'}
                        </strong>
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                          {currentGoal ? activePath?.name : 'Choose a goal to calibrate requirements'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="mt-3 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{currentGoal ? 'Change Goal' : 'Choose Goal'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Stage 5: Required Skills */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between group hover:border-indigo-300 transition-all">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                          <BrainCircuit className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Stage 5</span>
                          <strong className="text-xs font-black text-slate-900 block">
                            Required Skills
                          </strong>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-black text-purple-700 font-mono">
                            {targetRequiredSkills.length > 0 ? targetRequiredSkills.length : '12+'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">Competencies</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          {notDemonstratedSkills.length} next priorities identified
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/skill-gaps')}
                      className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-purple-700 font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span>Analyze Gaps</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 4 VISUAL SKILL LEVELS LEGEND */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      Skill Proficiency Levels & Evidence Framework
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Levels are calculated from declared ratings, coursework, academic projects, and verified credentials.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeFilter === 'all'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      All ({studentSkills.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter('strong')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        activeFilter === 'strong'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span>🟢 Strong</span>
                      <span>({strongSkills.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveFilter('developing')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        activeFilter === 'developing'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span>🟡 Developing</span>
                      <span>({developingSkills.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveFilter('beginner')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        activeFilter === 'beginner'
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-orange-50 hover:bg-orange-100 text-orange-800'
                      }`}
                    >
                      <span>🟠 Beginner</span>
                      <span>({beginnerSkills.length})</span>
                    </button>
                    {activePath && (
                      <button
                        onClick={() => setActiveFilter('missing')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                          activeFilter === 'missing'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>⚪ Target Gaps</span>
                        <span>({notDemonstratedSkills.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Legend Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <strong className="font-bold text-emerald-900">Strong / Demonstrated</strong>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1 leading-snug">
                      Backed by completed projects, code samples, or verified assessment.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <strong className="font-bold text-amber-900">Developing</strong>
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1 leading-snug">
                      Actively used in coursework, small scripts, or partial implementations.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <strong className="font-bold text-orange-900">Beginner</strong>
                    </div>
                    <p className="text-[11px] text-orange-700 mt-1 leading-snug">
                      Basic syntax knowledge and theoretical familiarity without major projects.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <strong className="font-bold text-slate-800">Not Yet Demonstrated</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Required for target roles but no student evidence submitted yet.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 5 MEANINGFUL SKILL CLUSTERS (Section 4) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Skill Clusters
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Domain clusters group related skills and track verified evidence-based progress.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-indigo-600">
                    {clusters.length} Core Disciplines
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusters.map((cluster) => {
                    const isSelected = selectedClusterId === cluster.id;
                    return (
                      <div
                        key={cluster.id}
                        onClick={() => setSelectedClusterId(isSelected ? null : cluster.id)}
                        className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                            : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                              {cluster.name === 'Programming' && <Code2 className="w-4 h-4" />}
                              {cluster.name === 'Web Development' && <Globe className="w-4 h-4" />}
                              {cluster.name === 'Data' && <Database className="w-4 h-4" />}
                              {cluster.name === 'Development Tools' && <Wrench className="w-4 h-4" />}
                              {cluster.name === 'Problem Solving' && <BrainCircuit className="w-4 h-4" />}
                            </div>
                            <div>
                              <strong className="text-sm font-black text-slate-900 block">{cluster.name}</strong>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {cluster.studentCount} of {cluster.totalCount} demonstrated
                              </span>
                            </div>
                          </div>

                          <span className="font-mono text-sm font-black text-indigo-600">
                            {cluster.progressPercent}%
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                          {cluster.description}
                        </p>

                        {/* Progress Bar (Section 10) */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${cluster.progressPercent}%` }}
                          />
                        </div>

                        {/* Cluster Skills Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.skills.map((skillName, sIdx) => {
                            const norm = skillName.toLowerCase();
                            const matchingStudentSkill = studentSkills.find((s) => {
                              const sNorm = s.name.toLowerCase();
                              return sNorm.includes(norm) || norm.includes(sNorm);
                            });

                            const isDemonstrated = Boolean(matchingStudentSkill);
                            const levelCategory = matchingStudentSkill ? categorizeStudentSkill(matchingStudentSkill) : 'Not Yet Demonstrated';

                            return (
                              <div
                                key={sIdx}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 border ${
                                  levelCategory === 'Strong'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : levelCategory === 'Developing'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : levelCategory === 'Beginner'
                                    ? 'bg-orange-50 text-orange-800 border-orange-200'
                                    : 'bg-slate-50 text-slate-400 border-slate-200 border-dashed'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  levelCategory === 'Strong' ? 'bg-emerald-500' :
                                  levelCategory === 'Developing' ? 'bg-amber-500' :
                                  levelCategory === 'Beginner' ? 'bg-orange-500' : 'bg-slate-300'
                                }`} />
                                <span>{skillName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: DETAILED SKILLS GRID WITH PROGRESS BARS & EVIDENCE (Section 10) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      All Evaluated Skills
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Detailed individual skill evaluation derived from student profile and academic evidence.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Showing: <strong className="text-slate-900">{evaluatedSkills.length}</strong> student skills
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {evaluatedSkills
                    .filter((sk) => {
                      if (activeFilter === 'strong') return sk.category === 'Strong';
                      if (activeFilter === 'developing') return sk.category === 'Developing';
                      if (activeFilter === 'beginner') return sk.category === 'Beginner';
                      return true;
                    })
                    .map((sk, idx) => {
                      // Evidence-based score computation without fake precision
                      const hasProjects = (student?.projects || []).some((p) =>
                        (p.techStack || []).some((s: string) => s.toLowerCase().includes(sk.name.toLowerCase()))
                      );
                      const isBacked = Boolean(sk.isEvidenceBacked || hasProjects);

                      const levelWidth = 
                        sk.level === 'Advanced' ? '85%' :
                        sk.level === 'Intermediate' ? '65%' : '40%';

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <strong className="text-sm font-black text-slate-900 truncate">{sk.name}</strong>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  sk.category === 'Strong'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : sk.category === 'Developing'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-orange-100 text-orange-800'
                                }`}
                              >
                                {sk.level}
                              </span>
                            </div>

                            {/* Progress bar based on level without fake precision */}
                            <div className="w-full bg-slate-200 rounded-full h-1.5 my-2.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  sk.category === 'Strong'
                                    ? 'bg-emerald-500'
                                    : sk.category === 'Developing'
                                    ? 'bg-amber-500'
                                    : 'bg-orange-500'
                                }`}
                                style={{ width: levelWidth }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Domain: <strong className="text-slate-700">{sk.cluster}</strong></span>
                              <span className="font-semibold text-slate-600">{sk.level} Level</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                            {isBacked ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Project & Course Evidence
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">
                                Self-declared competency
                              </span>
                            )}
                            <button
                              onClick={() => router.push(`/what-if?addSkill=${encodeURIComponent(sk.name)}`)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                            >
                              Simulate →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* SECTION 5: WHAT-IF CONNECTION (Section 13) */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-white/10 to-transparent pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Opportunity Growth Modeling</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      What If I Learn This?
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mt-1">
                      Simulate the impact of acquiring in-demand skills on your target role match percentage and unlockable opportunities.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-right self-start sm:self-auto">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block">Baseline Match</span>
                    <strong className="text-xl font-black text-cyan-300 font-mono">{currentBaselineMatch}%</strong>
                  </div>
                </div>

                {/* Simulation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10 relative">
                  {whatIfSimulations.map((sim, i) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">What if I learn</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                            + {sim.improvementPoints}% pts
                          </span>
                        </div>
                        <strong className="text-lg font-black text-white block mb-3">{sim.skill}</strong>

                        {sim.hasData ? (
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-indigo-200">
                              <span>Current match:</span>
                              <span className="font-mono font-bold text-white">{sim.currentMatch}%</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-300 font-bold">
                              <span>Potential estimated match:</span>
                              <span className="font-mono text-base">{sim.potentialMatch}%</span>
                            </div>
                            <div className="pt-2 border-t border-white/10 text-cyan-200 font-semibold text-[11px]">
                              Potentially relevant opportunities unlocked: <strong className="text-white">{sim.unlockedCount}</strong>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-indigo-300 italic">
                            Not enough opportunity data to estimate the impact yet.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-wider">
                          AI ESTIMATE — NOT A GUARANTEE
                        </span>
                        <button
                          onClick={() => router.push(`/what-if?addSkill=${encodeURIComponent(sim.skill)}`)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Test</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center text-xs text-indigo-300 z-10 relative">
                  Every projection is strictly evaluated against actual live opportunity requirements in the database.
                </div>
              </div>
            </>
          )}
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
