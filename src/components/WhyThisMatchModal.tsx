'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  HelpCircle, 
  Cpu, 
  ArrowRight
} from 'lucide-react';
import { MatchResult } from '@/types';

interface WhyThisMatchModalProps {
  matchResult: MatchResult | null;
  onClose: () => void;
  onOpenRoadmap?: (match: MatchResult) => void;
  onOpenWhatIf?: () => void;
  defaultTab?: 'why' | 'why-not-100';
}

export const WhyThisMatchModal: React.FC<WhyThisMatchModalProps> = ({
  matchResult,
  onClose,
  onOpenRoadmap,
  onOpenWhatIf,
  defaultTab = 'why',
}) => {
  const [activeTab, setActiveTab] = useState<'why' | 'why-not-100'>(defaultTab);

  if (!matchResult) return null;

  const { opportunity, overallMatchScore, breakdown, matchedSkills, partialSkills, missingSkills, aiExplanation, whyNot100Explanation, fastestImprovementTip } = matchResult;

  const breakdownMetrics = [
    { label: 'Skills Overlap', score: breakdown.skillsScore, color: 'bg-indigo-600' },
    { label: 'Project Relevance', score: breakdown.projectsScore, color: 'bg-violet-600' },
    { label: 'Career Alignment', score: breakdown.careerInterestScore, color: 'bg-blue-600' },
    { label: 'Education Match', score: breakdown.educationScore, color: 'bg-emerald-600' },
    { label: 'Prior Experience', score: breakdown.experienceScore, color: 'bg-amber-500' },
    { label: 'Eligibility Criteria', score: breakdown.eligibilityScore, color: 'bg-teal-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#E6EAF2] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-[#172033]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Cpu className="w-4 h-4" />
            <span>Explainable AI Intelligence Panel</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight">
                {opportunity.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {opportunity.organization} · {opportunity.location}
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-extrabold text-base shadow-2xs">
              {overallMatchScore}% MATCH
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('why')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'why'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why This Match?</span>
          </button>
          <button
            onClick={() => setActiveTab('why-not-100')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'why-not-100'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Why am I not 100%?</span>
          </button>
        </div>

        {/* TAB 1: WHY THIS MATCH? */}
        {activeTab === 'why' && (
          <div className="space-y-6">
            {/* Grounded AI Natural Language Narrative */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Grounded Assessment</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {aiExplanation}
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Transparent Factor Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {breakdownMetrics.map((met, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-700 font-semibold">{met.label}</span>
                      <span className="font-mono font-bold text-slate-900">{met.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${met.color} rounded-full`}
                        style={{ width: `${met.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Granular Match Comparison: Strong vs Partial vs Missing */}
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Strong Matches ({matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {partialSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Partial Matches ({partialSkills.length})
                  </span>
                  <div className="space-y-1">
                    {partialSkills.map((p, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between"
                      >
                        <span className="font-semibold">⚠ {p.skill}</span>
                        <span className="text-[11px] text-amber-800">{p.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {missingSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Missing Gaps ({missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((m, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-medium"
                      >
                        ✗ {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WHY NOT 100%? */}
        {activeTab === 'why-not-100' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Primary Gap Drivers Identified</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {whyNot100Explanation}
              </p>
            </div>

            {/* Highest-impact gaps list */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Top Factors Preventing A 100% Match
              </span>
              <div className="space-y-2">
                {missingSkills.slice(0, 3).map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-700 font-bold">
                        0{i + 1}
                      </span>
                      <span className="font-bold text-sm text-[#172033]">{gap}</span>
                    </div>
                    <span className="text-xs text-indigo-600 font-mono font-semibold">
                      High Impact Factor
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fastest Improvement Recommendation */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fastest Improvement Action</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {fastestImprovementTip}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-[#E6EAF2] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenWhatIf) onOpenWhatIf();
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate in What-If</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenRoadmap) onOpenRoadmap(matchResult);
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore 14-Day Preparation Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
