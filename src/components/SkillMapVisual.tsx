'use client';

import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Briefcase,
  Edit3
} from 'lucide-react';
import { StudentProfile, Opportunity, MatchResult } from '@/types';
import { analyzeSkillGaps } from '@/lib/skill-gap-engine';

interface SkillMapVisualProps {
  student: StudentProfile | null;
  opportunities: Opportunity[];
  matchResults?: MatchResult[];
  onChangeGoalClick?: () => void;
  onOpportunityClick?: (opp: Opportunity) => void;
}

export const SkillMapVisual: React.FC<SkillMapVisualProps> = ({
  student,
  opportunities,
  matchResults = [],
  onChangeGoalClick,
  onOpportunityClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'strong' | 'developing' | 'gaps'>('all');

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);
  const currentGoal = student?.careerGoal || 'Machine Learning Engineer';

  const skillGaps = student ? analyzeSkillGaps(student, opportunities) : [];

  // Categorize student skills
  const studentSkills = student?.skills || [];
  const strongSkills = studentSkills.filter(
    (s) => s.level === 'Advanced' || s.level === 'Intermediate' || (s.confidenceScore >= 60)
  );
  const developingSkills = studentSkills.filter(
    (s) => s.level === 'Beginner' || (s.confidenceScore < 60)
  );

  // Top 4 matching opportunities for current goal
  const topAlignedOpps = matchResults.slice(0, 4);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Student Skill Map</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Career Pathway & Skill Topology
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual progression from your verified capabilities through your career goal to role prerequisites and opportunities.
          </p>
        </div>

        {/* Change Goal Trigger */}
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Role</span>
            <span className="text-xs font-black text-indigo-700 block">{currentGoal}</span>
          </div>
          {onChangeGoalClick && (
            <button
              onClick={onChangeGoalClick}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change Goal</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Column Interactive Topology Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
        {/* Node 1: YOU */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {hasProfile ? student!.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 1 · Profile</span>
                <strong className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                  {hasProfile ? student!.name : 'Candidate'}
                </strong>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 space-y-1.5 mt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Education:</span>
                <span className="font-semibold truncate max-w-[90px]">{student?.branch || 'Computing'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grad Year:</span>
                <span className="font-semibold">{student?.graduationYear || 2026}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Skills:</span>
                <span className="font-bold text-indigo-600">{studentSkills.length}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Identity Verified
          </div>
        </div>

        {/* Node 2: Your Skills */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 2 · Your Skills</span>
                <strong className="text-xs font-bold text-slate-900">Demonstrated</strong>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {studentSkills.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic p-2 bg-white rounded-xl">
                  No skills declared yet. Add skills to map qualifications.
                </div>
              ) : (
                studentSkills.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200/70 text-[11px]">
                    <span className="font-bold text-slate-800 truncate max-w-[85px]">{s.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      s.level === 'Advanced' ? 'bg-emerald-50 text-emerald-700' :
                      s.level === 'Intermediate' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {s.level}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
            {strongSkills.length} Strong · {developingSkills.length} Developing
          </div>
        </div>

        {/* Node 3: Career Goal */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Step 3 · Goal</span>
                <strong className="text-xs font-black text-slate-900">Career Vector</strong>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-indigo-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Target Position</span>
              <strong className="text-sm font-black text-indigo-700 block mt-0.5">{currentGoal}</strong>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                Skill prerequisites are dynamically calibrated from target job postings.
              </p>
            </div>
          </div>
          {onChangeGoalClick && (
            <button
              onClick={onChangeGoalClick}
              className="mt-3 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Change trajectory</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Node 4: Target Role Skills & Gaps */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 4 · Gaps</span>
                <strong className="text-xs font-bold text-slate-900">Target Skills</strong>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {skillGaps.slice(0, 4).map((gap, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-white border border-slate-200/70 text-[11px] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="font-bold text-slate-800 truncate max-w-[80px]">{gap.skill}</span>
                  </div>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                    {gap.priority || 'Critical'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
            {skillGaps.length} priority gaps to bridge
          </div>
        </div>

        {/* Node 5: Aligned Opportunities */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Step 5 · Roles</span>
                <strong className="text-xs font-bold text-slate-900">Opportunity Fit</strong>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {topAlignedOpps.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpportunityClick && onOpportunityClick(m.opportunity)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200/70 text-[11px] cursor-pointer hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate max-w-[85px]">{m.opportunity.organization}</span>
                    <span className="font-mono text-[10px] font-black text-indigo-600">{m.overallMatchScore}%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{m.opportunity.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-indigo-600 font-bold flex items-center justify-between">
            <span>Ranked by AI match</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Breakdown Legend & Detailed Gap Explanations */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
          <span>Priority Gap Breakdown for {currentGoal}</span>
          <span className="text-xs text-slate-400 font-normal">· Calculated directly from role requirements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {skillGaps.slice(0, 3).map((gap, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <strong className="font-black text-slate-900">{gap.skill}</strong>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  gap.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                  gap.priority === 'High Priority' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {gap.priority || 'Critical'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {gap.whyNeeded || gap.description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Target: <strong className="text-slate-800">{gap.targetLevel || 'Intermediate'}</strong></span>
                <span className="text-indigo-600 font-bold">~{gap.estimatedLearningDays} days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
