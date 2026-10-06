'use client';

import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  BookmarkCheck,
  FileCheck2,
  Lock,
  Clock,
  Award,
  Layers,
  Check,
  Info
} from 'lucide-react';
import { MatchResult, Opportunity, StudentProfile } from '@/types';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  matchResult?: MatchResult | null;
  student: StudentProfile | null;
  onClose: () => void;
  onOpenRoadmap?: (match: MatchResult) => void;
  onTrackApplication?: (oppId: string, title: string, org: string) => void;
  onBuildProfile?: () => void;
  isAlreadyTracked?: boolean;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  matchResult,
  student,
  onClose,
  onOpenRoadmap,
  onTrackApplication,
  onBuildProfile,
  isAlreadyTracked = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'match' | 'organization'>('overview');

  if (!opportunity) return null;

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);
  const isHighRisk = opportunity.verification?.status === 'High Risk';
  const score = matchResult ? matchResult.overallMatchScore : null;

  const missingSkillsCount = matchResult?.missingSkills?.length || 0;
  const prepGapTier = missingSkillsCount <= 1 ? 'Small' : missingSkillsCount <= 3 ? 'Medium' : 'Significant';
  const prepGapColor = missingSkillsCount <= 1 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : missingSkillsCount <= 3 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-700 bg-slate-100 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto text-[#172033] max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                {opportunity.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                {opportunity.workMode}
              </span>
              {opportunity.verification?.status === 'Verified' ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Source</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Needs Verification</span>
                </span>
              )}
            </div>

            {hasProfile && matchResult && (
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-sm shadow-2xs">
                  {score}% MATCH
                </div>
                {matchResult.potentialMatchScore > score! && (
                  <div className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-xs font-semibold">
                    Potential: {matchResult.potentialMatchScore}%
                  </div>
                )}
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight leading-tight">
            {opportunity.title}
          </h2>

          <div className="flex flex-wrap items-center text-xs text-slate-600 gap-y-2 gap-x-4 font-semibold">
            <span className="flex items-center space-x-1.5 text-slate-800 font-bold">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>{opportunity.organization}</span>
            </span>

            <span className="flex items-center space-x-1.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{opportunity.location}</span>
            </span>

            <span className="flex items-center space-x-1.5 text-slate-600 font-mono">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Deadline: {opportunity.deadline}</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 py-3 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Overview & Eligibility
          </button>

          <button
            onClick={() => setActiveTab('match')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              activeTab === 'match'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Match Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'organization'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Organization & Trust Source
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="py-5 space-y-6 flex-1 overflow-y-auto">
          {/* TAB 1: Overview & Eligibility */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs sm:text-sm">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Overview
                </h4>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {opportunity.overview || opportunity.description}
                </p>
              </div>

              {/* Timeline & Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Timeline & Duration</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div>Application Deadline: <strong className="text-slate-800">{opportunity.deadline}</strong></div>
                    {opportunity.timeline?.duration && (
                      <div>Program Duration: <strong className="text-slate-800">{opportunity.timeline.duration}</strong></div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Compensation / Benefits</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div className="font-semibold text-emerald-700">
                      {opportunity.stipendOrSalary || opportunity.prizes || opportunity.benefits || 'Documented educational credential & mentorship'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Eligibility Criteria
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  {opportunity.minGpaOrCriteria && (
                    <div className="text-xs text-slate-700">
                      <strong className="text-slate-900">Academic Standing:</strong> {opportunity.minGpaOrCriteria}
                    </div>
                  )}
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">Eligible Branches:</strong> {opportunity.eligibleBranches.join(', ')}
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">Eligible Graduation Batches:</strong> {opportunity.eligibleGradYears.join(', ')}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.requiredSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Preferred Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.preferredSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Match Analysis */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              {hasProfile && matchResult ? (
                <div className="space-y-5">
                  {/* Top Match Score Box */}
                  <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                        Calculated Match Fit
                      </span>
                      <h3 className="text-2xl font-black text-[#172033]">
                        Your Match: {score}%
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Evaluated strictly against your declared skills, verified projects, and coursework.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${prepGapColor}`}>
                        Estimated Gap: {prepGapTier}
                      </div>
                    </div>
                  </div>

                  {/* 5-Layer Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      5-Layer Fit Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Skills</span>
                        <span className="font-mono font-extrabold text-sm text-slate-800">{matchResult.breakdown.skillsScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Projects</span>
                        <span className="font-mono font-extrabold text-sm text-slate-800">{matchResult.breakdown.projectsScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Education</span>
                        <span className="font-mono font-extrabold text-sm text-slate-800">{matchResult.breakdown.educationScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Goal Fit</span>
                        <span className="font-mono font-extrabold text-sm text-slate-800">{matchResult.breakdown.careerInterestScore}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Eligibility</span>
                        <span className="font-mono font-extrabold text-sm text-slate-800">{matchResult.breakdown.eligibilityScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* You already have vs Missing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You Already Have ({matchResult.matchedSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchResult.matchedSkills.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>You're Missing ({matchResult.missingSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchResult.missingSkills.length > 0 ? (
                          matchResult.missingSkills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
                              + {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold">Zero critical skills missing!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why it isn't 100% */}
                  {matchResult.whyNot100Explanation && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Why isn't this match 100%?
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {matchResult.whyNot100Explanation}
                      </p>
                    </div>
                  )}

                  {/* AI Explanation */}
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      AI Qualitative Explanation
                    </span>
                    <p className="text-xs text-indigo-900 leading-relaxed">
                      {matchResult.aiExplanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#172033]">
                      Personalized Match Analysis Locked
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      Create your profile to unlock personalized 5-layer match analysis, identify exact skill gaps, and view preparation roadmaps.
                    </p>
                  </div>
                  {onBuildProfile && (
                    <button
                      onClick={onBuildProfile}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      Build My Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Organization & Trust Source */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <span>{opportunity.organization}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div>
                    Source Attribution: <strong className="text-slate-800">{opportunity.source}</strong>
                  </div>
                  <div>
                    Last Audited: <strong className="text-slate-800">{opportunity.lastChecked}</strong>
                  </div>
                  <div>
                    Trust Index: <strong className="text-emerald-700">{opportunity.verification?.trustScore} / 100</strong>
                  </div>
                  <div>
                    Verification Status: <strong className="text-slate-800">{opportunity.verification?.status}</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                  {opportunity.verification?.notes}
                </p>
              </div>

              {opportunity.sourceUrl && (
                <div className="text-xs text-slate-500">
                  Verified official source URL: <a href={opportunity.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">{opportunity.sourceUrl} <ExternalLink className="w-3 h-3" /></a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {onTrackApplication && (
              <button
                onClick={() => onTrackApplication(opportunity.id, opportunity.title, opportunity.organization)}
                disabled={isAlreadyTracked}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 disabled:opacity-60 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                <span>{isAlreadyTracked ? 'Tracked in Pipeline' : 'Track Application'}</span>
              </button>
            )}

            {hasProfile && matchResult && onOpenRoadmap && (
              <button
                onClick={() => onOpenRoadmap(matchResult)}
                className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>Preparation Roadmap</span>
              </button>
            )}
          </div>

          {/* Official Application Button */}
          <a
            href={opportunity.officialUrl || opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all cursor-pointer"
          >
            <span>Apply on Official Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
