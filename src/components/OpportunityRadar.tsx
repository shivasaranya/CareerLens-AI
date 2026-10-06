'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Target, 
  Rocket, 
  Sprout, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { OpportunityCard } from './OpportunityCard';
import { CareerDNAView } from './CareerDNAView';
import { MatchResult, StudentProfile, MatchCategory } from '@/types';

interface OpportunityRadarProps {
  student: StudentProfile;
  matchResults: MatchResult[];
  onWhyMatch: (match: MatchResult) => void;
  onWhyNot100: (match: MatchResult) => void;
  onViewRoadmap: (match: MatchResult) => void;
  onViewDetails: (match: MatchResult) => void;
  onExploreGaps: () => void;
  onSimulateWhatIf: () => void;
}

export const OpportunityRadar: React.FC<OpportunityRadarProps> = ({
  student,
  matchResults,
  onWhyMatch,
  onWhyNot100,
  onViewRoadmap,
  onViewDetails,
  onExploreGaps,
  onSimulateWhatIf,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'All' | MatchCategory>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedVerification, setSelectedVerification] = useState<string>('All');
  const [minMatch, setMinMatch] = useState<number>(0);

  // Compute counts for top overview counters
  const counts = useMemo(() => {
    let applyNow = 0;
    let strongMatch = 0;
    let nearFit = 0;
    let future = 0;

    matchResults.forEach((m) => {
      if (m.category === 'Apply Now') applyNow++;
      else if (m.category === 'Strong Match') strongMatch++;
      else if (m.category === 'Near-Fit') nearFit++;
      else future++;
    });

    return {
      applyNow,
      strongMatch,
      nearFit,
      future,
      total: matchResults.length,
    };
  }, [matchResults]);

  // Filter items based on query and facets
  const filteredMatches = useMemo(() => {
    return matchResults.filter((m) => {
      const opp = m.opportunity;
      const q = searchQuery.toLowerCase().trim();

      // Natural language / semantic intent matching
      if (q) {
        const titleMatch = opp.title.toLowerCase().includes(q);
        const orgMatch = opp.organization.toLowerCase().includes(q);
        const descMatch = opp.description.toLowerCase().includes(q);
        const skillMatch = opp.requiredSkills.some((s) => s.toLowerCase().includes(q)) || opp.preferredSkills.some((s) => s.toLowerCase().includes(q));
        const locMatch = opp.location.toLowerCase().includes(q);
        const typeMatch = opp.type.toLowerCase().includes(q);

        if (!titleMatch && !orgMatch && !descMatch && !skillMatch && !locMatch && !typeMatch) {
          return false;
        }
      }

      // Category tab
      if (selectedCategoryTab !== 'All' && m.category !== selectedCategoryTab) {
        return false;
      }

      // Type
      if (selectedType !== 'All' && opp.type !== selectedType) {
        return false;
      }

      // Mode
      if (selectedMode !== 'All' && opp.workMode !== selectedMode) {
        return false;
      }

      // Verification
      if (selectedVerification !== 'All' && opp.verification.status !== selectedVerification) {
        return false;
      }

      // Min Match
      if (m.overallMatchScore < minMatch) {
        return false;
      }

      return true;
    });
  }, [matchResults, searchQuery, selectedCategoryTab, selectedType, selectedMode, selectedVerification, minMatch]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Top Greeting & Career Readiness Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Opportunity Intelligence at a Glance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Good morning, {student.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {student.institution} · {student.branch} ({student.graduationYear})
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-indigo-600"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * 84) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono font-extrabold text-base text-[#172033]">84%</span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Profile Readiness
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-1 mt-0.5">
              <span>High Competitive Fit</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              4 opportunities ready to apply this week
            </p>
          </div>
        </div>
      </div>

      {/* Career DNA Integrated Section */}
      <CareerDNAView
        student={student}
        onExploreGaps={onExploreGaps}
        onSimulateWhatIf={onSimulateWhatIf}
      />

      {/* Opportunity Overview Counters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#172033] tracking-tight">
            Opportunity Intelligence Summary
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Evaluated 120+ active live listings
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedCategoryTab('Apply Now')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              selectedCategoryTab === 'Apply Now'
                ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
                : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-rose-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-600" /> Apply Now
              </span>
              <span className="font-mono font-extrabold text-2xl text-[#172033]">{counts.applyNow}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">High relevance + deadline approaching</p>
          </button>

          <button
            onClick={() => setSelectedCategoryTab('Strong Match')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              selectedCategoryTab === 'Strong Match'
                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Target className="w-4 h-4 text-emerald-600" /> Strong Matches
              </span>
              <span className="font-mono font-extrabold text-2xl text-[#172033]">{counts.strongMatch}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Excellent qualification alignment</p>
          </button>

          <button
            onClick={() => setSelectedCategoryTab('Near-Fit')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              selectedCategoryTab === 'Near-Fit'
                ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-blue-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Rocket className="w-4 h-4 text-blue-600" /> Potential Matches
              </span>
              <span className="font-mono font-extrabold text-2xl text-[#172033]">{counts.nearFit}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Achievable with 14-day prep</p>
          </button>

          <button
            onClick={() => setSelectedCategoryTab('Future')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              selectedCategoryTab === 'Future'
                ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-300'
                : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-purple-700 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sprout className="w-4 h-4 text-purple-600" /> Future Growth
              </span>
              <span className="font-mono font-extrabold text-2xl text-[#172033]">{counts.future}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Requires dedicated skill track</p>
          </button>
        </div>
      </div>

      {/* Search & Dynamic Filter Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6EAF2] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Natural Language Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder='Search by intent: "AI internships in Hyderabad" or "Backend remote"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryTab('All');
              setSelectedType('All');
              setSelectedMode('All');
              setSelectedVerification('All');
              setMinMatch(0);
            }}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Filter Badges & Facets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Apply Now', 'Strong Match', 'Near-Fit', 'Future'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategoryTab === tab
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Type dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Research">Research</option>
            <option value="Fellowship">Fellowship</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Competition">Competition</option>
            <option value="Apprenticeship">Apprenticeship</option>
          </select>

          {/* Work Mode */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Verification */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs shadow-2xs"
          >
            <option value="All">All Trust Statuses</option>
            <option value="Verified">Verified Only (High Trust)</option>
            <option value="Needs Verification">Needs Verification</option>
            <option value="High Risk">High Risk</option>
          </select>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Showing {filteredMatches.length} Opportunities Matching Criteria
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E6EAF2] space-y-3 shadow-xs">
            <Target className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-[#172033]">No opportunity matches yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No opportunities meet your exact active filters. Try broadening your criteria or exploring the What-If Simulator to expand your horizon.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryTab('All');
                setSelectedType('All');
                setSelectedMode('All');
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMatches.map((m) => (
              <OpportunityCard
                key={m.opportunity.id}
                matchResult={m}
                onWhyMatch={onWhyMatch}
                onWhyNot100={onWhyNot100}
                onViewRoadmap={onViewRoadmap}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
