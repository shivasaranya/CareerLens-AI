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
  Sparkles,
  Lock,
  ExternalLink
} from 'lucide-react';
import { MatchResult, Opportunity } from '@/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchResult?: MatchResult | null;
  hasProfile: boolean;
  onWhyMatch?: (match: MatchResult) => void;
  onWhyNot100?: (match: MatchResult) => void;
  onViewRoadmap?: (match: MatchResult) => void;
  onViewDetails: (opp: Opportunity, match?: MatchResult | null) => void;
  onBuildProfile?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  matchResult,
  hasProfile,
  onWhyMatch,
  onWhyNot100,
  onViewRoadmap,
  onViewDetails,
  onBuildProfile,
}) => {
  const isHighRisk = opportunity.verification?.status === 'High Risk';
  const isNeedsVerification = opportunity.verification?.status === 'Needs Verification';
  const score = matchResult ? matchResult.overallMatchScore : null;
  const category = matchResult ? matchResult.category : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between group">
      {/* Top Banner Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Opportunity Type Pill */}
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              {opportunity.type}
            </span>

            {/* Work Mode */}
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
              {opportunity.workMode}
            </span>

            {/* Trust Status */}
            {opportunity.verification?.status === 'Verified' ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Source</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Needs Verification</span>
              </span>
            )}
          </div>

          {/* Match Score Badge OR "Create profile" CTA */}
          <div className="text-right flex-shrink-0">
            {hasProfile && matchResult ? (
              <div>
                <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl font-mono font-black text-xs ${
                  score! >= 85
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : score! >= 65
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{category} · {score}%</span>
                </div>
                {matchResult.potentialMatchScore > score! && (
                  <p className="text-[10px] text-indigo-600 font-mono font-bold mt-0.5 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Potential: {matchResult.potentialMatchScore}%</span>
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={onBuildProfile}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-[11px] font-bold transition-all cursor-pointer"
                title="Create your profile to see your calculated match"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Create profile to view match</span>
              </button>
            )}
          </div>
        </div>

        {/* Opportunity Title */}
        <h3
          onClick={() => onViewDetails(opportunity, matchResult)}
          className="text-lg font-black text-[#172033] tracking-tight hover:text-indigo-600 transition-colors cursor-pointer mt-2"
        >
          {opportunity.title}
        </h3>

        {/* Organization & Location Meta */}
        <div className="flex flex-wrap items-center text-xs text-slate-600 gap-y-1 gap-x-3 mt-1.5 font-medium">
          <span className="flex items-center space-x-1 text-slate-800 font-bold">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.organization}</span>
          </span>

          <span className="flex items-center space-x-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.location}</span>
          </span>

          <span className="flex items-center space-x-1 font-mono font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Deadline: {opportunity.deadline}</span>
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Required & Preferred Skills */}
        <div className="mt-4 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Relevant Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map((s) => {
              const isMatched = matchResult?.matchedSkills?.includes(s);
              return (
                <span
                  key={s}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-semibold border ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isMatched && <Check className="w-3 h-3 text-emerald-600 inline mr-1 -mt-0.5" />}
                  {s}
                </span>
              );
            })}
            {opportunity.preferredSkills.slice(0, 2).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-lg text-[11px] font-mono text-slate-500 bg-white border border-dashed border-slate-200"
              >
                + {s}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria note */}
        {opportunity.minGpaOrCriteria && (
          <div className="mt-3 text-[11px] text-slate-500">
            <strong className="text-slate-700">Eligibility:</strong> {opportunity.minGpaOrCriteria}
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        {hasProfile && matchResult ? (
          <div className="flex items-center space-x-1.5">
            {onWhyMatch && (
              <button
                onClick={() => onWhyMatch(matchResult)}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
              >
                Why This Match?
              </button>
            )}
            {onWhyNot100 && (
              <button
                onClick={() => onWhyNot100(matchResult)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Why not 100%?
              </button>
            )}
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-slate-500">
            Source: <strong className="text-slate-700">{opportunity.source}</strong>
          </div>
        )}

        <button
          onClick={() => onViewDetails(opportunity, matchResult)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>View Opportunity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
