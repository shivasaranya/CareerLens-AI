'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { StudentProfile, Opportunity } from '@/types';
import { analyzeSkillGaps } from '@/lib/skill-gap-engine';

interface SkillGapMapProps {
  student: StudentProfile;
  opportunities: Opportunity[];
  onOpenWhatIfWithSkill: (skill: string) => void;
  onOpenRoadmapForSkill: (skill: string) => void;
}

export const SkillGapMap: React.FC<SkillGapMapProps> = ({
  student,
  opportunities,
  onOpenWhatIfWithSkill,
  onOpenRoadmapForSkill,
}) => {
  const gapItems = analyzeSkillGaps(student, opportunities);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Critical Gap' | 'Competitive Gap' | 'Future Gap'>('All');

  const filteredGaps = filterCategory === 'All'
    ? gapItems
    : gapItems.filter((g) => g.category === filterCategory);

  const highestImpactGap = gapItems[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
          <Layers className="w-4 h-4" />
          <span>Skill Gap Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          YOUR SKILL GAP MAP
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Connecting what you can do today with what top opportunities expect. We classify skills by actual hiring requirements, so you focus where it counts.
        </p>

        {/* What should the student do next? Callout */}
        {highestImpactGap && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-indigo-50/60 to-white border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Recommended Next Move</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {highestImpactGap.skill} is your highest-impact skill gap
              </h4>
              <p className="text-xs text-slate-600">
                Acquiring this competency could unlock ~{highestImpactGap.unlockPotentialCount} high-relevance positions and strengthen backend alignment.
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => onOpenWhatIfWithSkill(highestImpactGap.skill)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulate Impact</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* YOU HAVE vs OPPORTUNITY REQUIRES Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* YOU HAVE */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You Have (Verified Profile)</span>
            </div>
            <span className="font-mono text-xs text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              {student.skills.length} Capabilities
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {student.skills.map((s) => (
              <div
                key={s.name}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">{s.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{s.level} · {s.confidenceScore}% conf</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>

        {/* OPPORTUNITY REQUIRES */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Opportunity Requires</span>
            </div>
            <span className="font-mono text-xs text-indigo-700 font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
              {gapItems.length} Identified Gaps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {gapItems.slice(0, 8).map((g) => (
              <div
                key={g.skill}
                onClick={() => onOpenWhatIfWithSkill(g.skill)}
                className="p-3 bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 rounded-xl flex items-center justify-between cursor-pointer group transition-all shadow-2xs"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {g.skill}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    +{g.unlockPotentialCount} roles unlocked
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorized Gap Analysis Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            {(['All', 'Critical Gap', 'Competitive Gap', 'Future Gap'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Calibrated against 120+ student-accessible roles
          </p>
        </div>

        {/* Gap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredGaps.map((item) => (
            <div
              key={item.skill}
              className="bg-white rounded-2xl p-5 border border-[#E6EAF2] hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.category === 'Critical Gap'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.category === 'Competitive Gap'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    ~{item.estimatedLearningDays}d Prep
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#172033]">{item.skill}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6EAF2] flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-bold">
                  +{item.unlockPotentialCount} Unlocked
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onOpenWhatIfWithSkill(item.skill)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    What-If?
                  </button>
                  <button
                    onClick={() => onOpenRoadmapForSkill(item.skill)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Roadmap
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
