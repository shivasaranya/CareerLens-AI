'use client';

import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { MatchResult } from '@/types';

interface OpportunityCardProps {
  matchResult: MatchResult;
  onWhyMatch: (match: MatchResult) => void;
  onWhyNot100: (match: MatchResult) => void;
  onViewRoadmap: (match: MatchResult) => void;
  onViewDetails: (match: MatchResult) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  matchResult,
  onWhyMatch,
  onWhyNot100,
  onViewRoadmap,
  onViewDetails,
}) => {
  const { opportunity, overallMatchScore, potentialMatchScore, category, matchedSkills, missingSkills } = matchResult;
  const isHighRisk = opportunity.verification.status === 'High Risk';
  const isNeedsVerification = opportunity.verification.status === 'Needs Verification';

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all relative flex flex-col justify-between shadow-xs hover:shadow-md ${
      isHighRisk 
        ? 'border-red-200 bg-red-50/20' 
        : overallMatchScore >= 85 
        ? 'border-indigo-200/90 hover:border-indigo-300' 
        : 'border-[#E6EAF2] hover:border-slate-300'
    }`}>
      {/* Top Banner Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
              category === 'Apply Now'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : category === 'Strong Match'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : category === 'Near-Fit'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {category}
            </span>

            {/* Opportunity Type */}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
              {opportunity.type}
            </span>

            {/* Work Mode */}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500">
              {opportunity.workMode}
            </span>
          </div>

          {/* Match Score Indicator with Ring style */}
          <div className="text-right flex-shrink-0">
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl font-mono font-extrabold text-sm ${
              overallMatchScore >= 85
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : overallMatchScore >= 65
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{overallMatchScore}% MATCH</span>
            </div>

            {/* Potential Match comparison if gap exists */}
            {potentialMatchScore > overallMatchScore && (
              <p className="text-[10px] text-indigo-600 font-mono font-semibold mt-0.5 flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Potential: {potentialMatchScore}%</span>
              </p>
            )}
          </div>
        </div>

        {/* Title and Organization */}
        <h4 
          className="text-base sm:text-lg font-bold text-[#172033] tracking-tight hover:text-indigo-600 transition-colors cursor-pointer" 
          onClick={() => onViewDetails(matchResult)}
        >
          {opportunity.title}
        </h4>

        <div className="flex flex-wrap items-center text-xs text-slate-600 gap-y-1 gap-x-3 mt-1.5 font-medium">
          <span className="flex items-center space-x-1 text-slate-800">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.organization}</span>
          </span>

          <span className="flex items-center space-x-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{opportunity.location}</span>
          </span>

          <span className={`flex items-center space-x-1 font-mono font-semibold ${
            opportunity.daysRemaining <= 4 ? 'text-rose-600' : 'text-slate-500'
          }`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>Deadline: {opportunity.daysRemaining} days</span>
          </span>
        </div>

        {/* Trust & Verification Pill */}
        <div className="mt-3">
          {isHighRisk ? (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>SAFETY SHIELD ALERT: High Risk (Trust {opportunity.verification.trustScore}/100)</span>
              </div>
              <p className="text-[11px] text-red-700 leading-tight">
                {opportunity.verification.notes}
              </p>
            </div>
          ) : isNeedsVerification ? (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Needs Verification (Trust {opportunity.verification.trustScore}/100)</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Direct ATS (Trust {opportunity.verification.trustScore}/100)</span>
            </div>
          )}
        </div>

        {/* Skill Alignment Preview */}
        <div className="mt-4 space-y-2">
          {/* Matched Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Matching:
            </span>
            {matchedSkills.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-medium"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{s}</span>
              </span>
            ))}
          </div>

          {/* Missing Skills / Gaps */}
          {missingSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Gaps:
              </span>
              {missingSkills.slice(0, 2).map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-medium"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>{s}</span>
                </span>
              ))}
              {missingSkills.length > 2 && (
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  +{missingSkills.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Button Strip */}
      <div className="mt-5 pt-3.5 border-t border-[#E6EAF2] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onWhyMatch(matchResult)}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why This Match?</span>
          </button>

          <button
            onClick={() => onWhyNot100(matchResult)}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-[#E6EAF2] text-xs font-medium transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <span>Why not 100%?</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {category === 'Near-Fit' && (
            <button
              onClick={() => onViewRoadmap(matchResult)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Get Ready</span>
            </button>
          )}

          <button
            onClick={() => onViewDetails(matchResult)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors cursor-pointer"
          >
            <span>View Match</span>
            <ArrowRight className="w-3 h-3 text-indigo-100" />
          </button>
        </div>
      </div>
    </div>
  );
};
