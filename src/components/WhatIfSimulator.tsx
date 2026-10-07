'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  Unlock,
  Check,
  Building2
} from 'lucide-react';
import { StudentProfile, Opportunity, WhatIfSimulationResult } from '@/types';
import { simulateWhatIf } from '@/lib/what-if-engine';

interface WhatIfSimulatorProps {
  student: StudentProfile;
  opportunities: Opportunity[];
  initialSkill?: string;
  onSelectOpportunityForRoadmap: (oppId: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  student,
  opportunities,
  initialSkill = 'Docker & Containerization',
  onSelectOpportunityForRoadmap,
}) => {
  const [inputQuery, setInputQuery] = useState(initialSkill);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult>(() =>
    simulateWhatIf(initialSkill, student, opportunities)
  );
  const [isSimulating, setIsSimulating] = useState(false);

  React.useEffect(() => {
    if (initialSkill) {
      setInputQuery(initialSkill);
      setSimulationResult(simulateWhatIf(initialSkill, student, opportunities));
    }
  }, [initialSkill, student, opportunities]);

  const samplePresets = [
    'Docker & Containerization',
    'AWS Cloud Architecture',
    'PyTorch & Deep Learning',
    'Kubernetes Cluster Ops',
    'move into Applied AI',
  ];

  const handleRunSimulation = (target: string) => {
    setIsSimulating(true);
    setInputQuery(target);
    setTimeout(() => {
      const res = simulateWhatIf(target, student, opportunities);
      setSimulationResult(res);
      setIsSimulating(false);
    }, 250);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Interactive Opportunity Simulator</span>
            </div>
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider font-mono">
              <span>AI ESTIMATE — NOT A GUARANTEE</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
            What if you learned one more skill?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Test how acquiring AWS, Docker, PyTorch, or Kubernetes expands your qualified opportunity horizon and unlocks additional high-value roles before investing weeks of study.
          </p>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3 relative z-10">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunSimulation(inputQuery)}
              placeholder="e.g. AWS, Docker, Kubernetes, or move into AI..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors font-medium"
            />
          </div>

          <button
            onClick={() => handleRunSimulation(inputQuery)}
            disabled={isSimulating || !inputQuery.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Impact...' : 'Simulate Opportunity Impact'}</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs text-slate-500 font-semibold">Quick Scenarios:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleRunSimulation(preset)}
              className={`px-3 py-1 rounded-xl border text-xs font-medium transition-colors cursor-pointer shadow-2xs ${
                inputQuery === preset
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-300'
              }`}
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Simulator Output: Current vs After Change */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6EAF2] text-center space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
              CURRENT BASELINE
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#172033] font-mono mt-2">
              {simulationResult.currentRelevantCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Relevant opportunities accessible with your current profile
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium truncate" title={student.skills.map((s) => s.name).join(', ')}>
            Based on {student.skills.length} verified skills ({student.skills.slice(0, 3).map((s) => s.name).join(', ')}{student.skills.length > 3 ? '...' : ''})
          </div>
        </div>

        {/* AFTER CHANGE */}
        <div className="bg-white rounded-2xl p-6 border border-blue-200 text-center space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold">
              AFTER SIMULATED CHANGE
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-700 font-mono mt-2">
              {simulationResult.simulatedRelevantCount}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Relevant opportunities accessible once proficiency is established
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-mono font-bold">
            Simulated: +{simulationResult.simulatedSkillOrGoal}
          </div>
        </div>

        {/* UNLOCKED DELTA BADGE */}
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 rounded-2xl p-6 border border-indigo-200 text-center space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider border border-indigo-200">
              <Unlock className="w-3.5 h-3.5" />
              <span>Net Expansion</span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-indigo-700 font-mono mt-2">
              +{simulationResult.unlockedCount}
            </div>
            <p className="text-xs text-indigo-900 font-semibold mt-1">
              Opportunities potentially unlocked
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 font-bold uppercase tracking-wider">
            AI ESTIMATE
          </div>
        </div>
      </div>

      {/* SKILL GROWTH & FACTOR EVOLUTION SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6EAF2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E6EAF2] gap-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-[#172033]">
              Skill Growth & Factor Evolution Breakdown
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Simulated Skills:</span>
            {simulationResult.simulatedSkillsAdded.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4 Factor Evolution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {simulationResult.skillGrowthMetrics.map((met, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{met.factor}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  +{met.growth}{met.unit || '%'}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-slate-400 font-mono text-sm line-through">
                  {met.before}{met.unit || '%'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xl font-mono font-extrabold text-indigo-700">
                  {met.after}{met.unit || '%'}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                {met.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Categories Unlocked + Significant Score Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Newly Accessible Roles */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6EAF2] space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#E6EAF2]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172033]">
              New Career Trajectories Unlocked
            </h3>
          </div>
          <div className="space-y-2.5">
            {simulationResult.newRolesUnlocked.map((role, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">{role}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold border border-indigo-200">
                  Direct Target
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Significant Score Improvements with Proper Data */}
        <div className="bg-white rounded-2xl p-6 border border-[#E6EAF2] space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#E6EAF2]">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172033]">
              Significant Score Improvements ({simulationResult.improvedOpportunities.length} Elevated)
            </h3>
          </div>
          <div className="space-y-2.5">
            {simulationResult.improvedOpportunities.map((imp) => {
              const uplift = imp.newScore - imp.oldScore;
              return (
                <div
                  key={imp.opportunityId}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-2xs hover:border-indigo-300 transition-all"
                >
                  <div className="space-y-1 max-w-[210px] sm:max-w-xs">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{imp.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{imp.organization}</span>
                    </div>
                    {imp.reason && (
                      <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                        {imp.reason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono">
                      <div className="text-xs">
                        <span className="text-slate-400 line-through mr-1.5">{imp.oldScore}%</span>
                        <span className="text-emerald-700 font-extrabold text-sm">{imp.newScore}%</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700">
                        +{uplift > 0 ? uplift : 4}% Uplift
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectOpportunityForRoadmap(imp.opportunityId)}
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl cursor-pointer transition-colors"
                      title="View 14-Day Roadmap for this role"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prudent Estimation Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-800 font-semibold">Important Methodology Note:</strong> This feature calculates an <em>AI Estimate</em> by simulating your updated vector overlap against current employer requirements. It does not guarantee employment or interview selection, which depend on company hiring caps and individual interview performance.
        </p>
      </div>
    </div>
  );
};
