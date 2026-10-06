'use client';

import React, { useState } from 'react';
import { 
  StudentProfile, 
  Opportunity 
} from '@/types';
import { 
  CAREER_PATHS, 
  CareerPathItem, 
  computeSkillClusters 
} from '@/lib/career-intelligence';
import { 
  User, 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Code2,
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
  Palette,
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface CareerMapGraphProps {
  student: StudentProfile | null;
  opportunities: Opportunity[];
  onSelectCareerGoal: (goal: string) => void;
  onOpenGoalModal: () => void;
  onNavigateToOpportunities?: (filterSkill?: string) => void;
}

export const CareerMapGraph: React.FC<CareerMapGraphProps> = ({
  student,
  opportunities,
  onSelectCareerGoal,
  onOpenGoalModal,
  onNavigateToOpportunities,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>('software-engineering');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const hasGoal = Boolean(student?.careerGoal && student.careerGoal.trim().length > 0);
  const currentGoalLower = (student?.careerGoal || '').toLowerCase().trim();

  // Find if current goal matches a specific path
  const matchedPath = CAREER_PATHS.find((p) =>
    p.targetRoles.some((r) => r.toLowerCase().includes(currentGoalLower) || currentGoalLower.includes(r.toLowerCase())) ||
    p.name.toLowerCase().includes(currentGoalLower) ||
    currentGoalLower.includes(p.name.toLowerCase())
  );

  const activePath = CAREER_PATHS.find((p) => p.id === selectedPathId) || CAREER_PATHS[0];
  const clusters = student ? computeSkillClusters(student.skills) : [];

  // Calculate alignment score for active path based on student skills
  const studentSkillNames = (student?.skills || []).map((s) => s.name.toLowerCase());
  const pathSkills = [...activePath.essentialSkills, ...activePath.recommendedSkills];
  const matchedSkillsCount = pathSkills.filter((ps) =>
    studentSkillNames.some((sn) => sn.includes(ps.toLowerCase()) || ps.toLowerCase().includes(sn))
  ).length;
  const alignmentPercent = Math.min(95, Math.max(20, Math.round((matchedSkillsCount / pathSkills.length) * 100)));

  // Relevant opportunities for active path
  const relevantOpps = opportunities.filter((opp) => {
    const oppText = (opp.title + ' ' + opp.requiredSkills.join(' ') + ' ' + opp.description).toLowerCase();
    return activePath.targetRoles.some((r) => oppText.includes(r.toLowerCase())) ||
           activePath.essentialSkills.some((s) => oppText.includes(s.toLowerCase()));
  }).slice(0, 3);

  const getPathIcon = (id: string) => {
    switch (id) {
      case 'software-engineering': return Code2;
      case 'ai-machine-learning': return Cpu;
      case 'data': return Database;
      case 'cloud-devops': return Cloud;
      case 'cybersecurity': return ShieldCheck;
      case 'product-design': return Palette;
      default: return Target;
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Graph Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Visual Graph Architecture */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Interactive Career Pathways Architecture
              </span>
              <p className="text-xs text-slate-600 mt-0.5">
                Click any path to explore target roles, skill compatibility, and live opportunities.
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Live Synced with Profile</span>
            </div>
          </div>

          {/* Interactive Flow Architecture: YOU -> SKILLS -> CLUSTERS -> PATHWAYS */}
          <div className="relative">
            {/* SVG Connecting Flow Lines (Background) */}
            <svg className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '380px' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Connecting bezier curves */}
              <path d="M 120 70 C 220 70, 220 160, 320 160" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
              <path d="M 440 160 C 520 160, 520 80, 620 80" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
              <path d="M 440 160 C 520 160, 520 180, 620 180" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
              <path d="M 440 160 C 520 160, 520 280, 620 280" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
            </svg>

            {/* Step 1: YOU & Foundations Node */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
              {/* Left Column: YOU + Foundational Skills */}
              <div className="lg:col-span-4 space-y-4">
                {/* Node: YOU */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                      {student?.name ? student.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Root Node · YOU</span>
                      <h4 className="font-extrabold text-sm text-slate-900">{student?.name || 'Candidate'}</h4>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                    <div>{student?.institution || 'Engineering College'}</div>
                    <div className="text-slate-400">{student?.branch || 'CSIT'} · 2nd Year Student</div>
                  </div>
                </div>

                {/* Node: Foundational Skill Clusters */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Skill Clusters ({clusters.length})
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">
                      {student?.skills.length || 0} Skills
                    </span>
                  </div>
                  <div className="space-y-2">
                    {clusters.map((c) => (
                      <div key={c.id} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">{c.name}</span>
                          <span className="font-mono text-slate-500 font-bold">{c.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(8, c.progressPercent)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle & Right: The 6 Clickable Career Paths */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Select Career Pathway</span>
                  </span>
                  {hasGoal && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      Active Goal: {student?.careerGoal}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CAREER_PATHS.map((path) => {
                    const isSelected = selectedPathId === path.id;
                    const isStudentGoalPath = matchedPath?.id === path.id;
                    const Icon = getPathIcon(path.id);

                    return (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => setSelectedPathId(path.id)}
                        className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        {isStudentGoalPath && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider">
                            Active Goal
                          </div>
                        )}

                        <div>
                          <div className="flex items-center space-x-2.5 mb-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{path.name}</h4>
                              <span className="text-[10px] text-slate-400">{path.category}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-600 line-clamp-2 my-2 leading-relaxed">
                            {path.description}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                          <span className="text-slate-400">{path.targetRoles.length} Target Roles</span>
                          <span className={isSelected ? 'text-indigo-700 font-bold' : 'text-slate-500'}>
                            Explore Path →
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Career Path Deep Dive Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Career Path Deep Dive: {activePath.name}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activePath.name} Pathway
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              {activePath.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Your Current Alignment</span>
              <strong className="text-indigo-700 font-black text-base">{alignmentPercent}% Match</strong>
            </div>

            <button
              onClick={() => onSelectCareerGoal(activePath.targetRoles[0] || activePath.name)}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Set as My Career Goal</span>
            </button>
          </div>
        </div>

        {/* 3 Columns: Target Roles | Essential Skills | Relevant Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Roles */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              1. Target Roles in {activePath.name}
            </span>
            <div className="space-y-2">
              {activePath.targetRoles.map((role) => {
                const isCurrent = (student?.careerGoal || '').toLowerCase() === role.toLowerCase();
                return (
                  <div
                    key={role}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => onSelectCareerGoal(role)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      {isCurrent ? 'Current Goal' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Essential & Recommended Skills */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Required Competencies
            </span>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Essential Prerequisites:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePath.essentialSkills.map((sk) => {
                    const hasSkill = studentSkillNames.some((sn) => sn.includes(sk.toLowerCase()) || sk.toLowerCase().includes(sn));
                    return (
                      <span
                        key={sk}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 ${
                          hasSkill
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {hasSkill && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        <span>{sk}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Recommended Additions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePath.recommendedSkills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Relevant Live Opportunities */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                3. Relevant Opportunities
              </span>
              <span className="text-[10px] font-mono text-indigo-600 font-bold">
                {relevantOpps.length} matched
              </span>
            </div>

            <div className="space-y-2.5">
              {relevantOpps.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 line-clamp-1">{opp.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 flex-shrink-0">
                      {opp.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{opp.organization} · {opp.location}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => onNavigateToOpportunities && onNavigateToOpportunities()}
                className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Explore All Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
