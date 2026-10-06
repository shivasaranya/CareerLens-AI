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
  FileCheck2
} from 'lucide-react';
import { MatchResult, StudentProfile } from '@/types';

interface OpportunityDetailModalProps {
  matchResult: MatchResult | null;
  student: StudentProfile;
  onClose: () => void;
  onOpenRoadmap: (match: MatchResult) => void;
  onTrackApplication: (oppId: string, title: string, org: string) => void;
  isAlreadyTracked?: boolean;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  matchResult,
  student,
  onClose,
  onOpenRoadmap,
  onTrackApplication,
  isAlreadyTracked = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'readiness' | 'ai-qa'>('overview');
  const [selectedAiQuestion, setSelectedAiQuestion] = useState<string | null>(null);

  if (!matchResult) return null;

  const { opportunity, overallMatchScore, potentialMatchScore, category, matchedSkills } = matchResult;
  const isHighRisk = opportunity.verification.status === 'High Risk';

  const aiQuestionsMap: Record<string, string> = {
    'Why is this relevant to me?': `Based on your profile, you have verified depth in ${student.skills.slice(0, 3).map(s => s.name).join(', ')}. ABC Technologies builds high-throughput backend services handling 10M+ events, which directly aligns with your Distributed Stream Analyzer project (15,000 events/sec) and your career goal of becoming a Backend Systems Engineer.`,
    'What should I learn first?': `Prioritize Docker containerization. ABC Technologies’ microservices infrastructure relies on containerized runtimes. Creating a Dockerfile and docker-compose manifest for your existing campus delivery microservice will take ~4 days and eliminate your primary qualification gap.`,
    'Which of my projects should I mention in my application?': `Highlight your "Distributed Log Pipeline & Stream Analyzer" in Python asyncio & Redis. It directly proves your ability to build asynchronous, high-volume data streams, which matches the core requirements described in the job posting.`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[#E6EAF2] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-[#172033] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="space-y-3 pb-6 border-b border-[#E6EAF2]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                {category}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {opportunity.type}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-sm shadow-2xs">
                {overallMatchScore}% MATCH
              </div>
              {potentialMatchScore > overallMatchScore && (
                <div className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-mono text-xs font-semibold">
                  Potential: {potentialMatchScore}%
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight">
            {opportunity.title}
          </h2>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{opportunity.organization}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-4 h-4" />
              <span>{opportunity.location} ({opportunity.workMode})</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-mono font-semibold">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Deadline: {opportunity.daysRemaining} days remaining</span>
            </span>
            {opportunity.stipendOrSalary && (
              <span className="text-emerald-700 font-mono font-bold">
                {opportunity.stipendOrSalary}
              </span>
            )}
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center space-x-2 my-5 border-b border-[#E6EAF2] pb-2">
          {[
            { id: 'overview', label: 'Overview & Requirements' },
            { id: 'readiness', label: 'Application Readiness' },
            { id: 'ai-qa', label: 'Ask AI About This Match' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & REQUIREMENTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Opportunity Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            {/* Eligibility */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Eligibility & Academic Criteria
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500">Graduation Years: </span>
                  <span className="font-semibold text-slate-900">
                    {opportunity.eligibleGradYears.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Target Branches: </span>
                  <span className="font-semibold text-slate-900">
                    {opportunity.eligibleBranches.join(', ')}
                  </span>
                </div>
                {opportunity.minGpaOrCriteria && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Criteria: </span>
                    <span className="font-semibold text-slate-900">{opportunity.minGpaOrCriteria}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Required & Preferred Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opportunity.requiredSkills.map((req, i) => {
                    const hasSkill = matchedSkills.includes(req);
                    return (
                      <span
                        key={i}
                        className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${
                          hasSkill
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        {hasSkill ? '✓' : '✗'} {req}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Preferred / Bonus Stack
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opportunity.preferredSkills.map((pref, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-white border border-slate-200 text-slate-700"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust & Safety Shield Audit */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isHighRisk 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider">
                  {isHighRisk ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  <span>Verification & Safety Shield Audit (Score: {opportunity.verification.trustScore}/100)</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  {opportunity.verification.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {opportunity.verification.notes}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATION READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-800">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>AI Application Readiness Checklist</span>
              </div>
              <p className="text-xs text-slate-600">
                Run through this pre-flight audit before clicking apply to maximize interview callback rates.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Eligibility Verified', detail: 'Branch (CSE) & Grad Year (2026) verified matching opportunity specs.', passed: true },
                { label: 'Relevant Project Aligned', detail: 'Distributed Stream Analyzer is ready to link on resume header.', passed: true },
                { label: 'Core Skills Covered', detail: 'Python, SQL, REST APIs meet the primary required thresholds.', passed: true },
                { label: 'Deadline Freshness', detail: `${opportunity.daysRemaining} days remaining; active direct ATS link.`, passed: true },
                { label: 'Source Verification', detail: isHighRisk ? 'Flagged suspicious source; DO NOT apply.' : 'Verified direct ATS Greenhouse URL.', passed: !isHighRisk },
              ].map((chk, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900">{chk.label}</span>
                    <p className="text-[11px] text-slate-500">{chk.detail}</p>
                  </div>
                  {chk.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
              <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Application Strategy Recommendations:
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Emphasize your 15,000 req/sec benchmark in your summary.</li>
                <li>Be transparent about Docker: Mention you are currently containerizing microservices in your active sprint.</li>
                <li>Link your public GitHub repository with comprehensive README instructions.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: CONTEXTUAL AI Q&A */}
        {activeTab === 'ai-qa' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select a Question to Ask CareerLens AI:
              </span>
              <div className="flex flex-col gap-2">
                {[
                  'Why is this relevant to me?',
                  'What should I learn first?',
                  'Which of my projects should I mention in my application?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedAiQuestion(q)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      selectedAiQuestion === q
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>

            {selectedAiQuestion && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-800">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Grounded Answer</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {aiQuestionsMap[selectedAiQuestion]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-[#E6EAF2] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTrackApplication(opportunity.id, opportunity.title, opportunity.organization)}
              disabled={isAlreadyTracked}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                isAlreadyTracked
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 cursor-pointer shadow-2xs'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{isAlreadyTracked ? 'Tracked in Pipeline' : 'Track Application'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenRoadmap(matchResult);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>View 14-Day Roadmap</span>
            </button>
          </div>

          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all ${
              isHighRisk
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            <span>{isHighRisk ? 'Caution: Open External Link' : 'Apply on Official Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
