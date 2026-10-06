'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';
import { Opportunity, StudentProfile, OpportunityRoadmap } from '@/types';
import { generateOpportunityRoadmap } from '@/lib/roadmap-engine';

interface PersonalizedRoadmapProps {
  opportunity: Opportunity;
  student: StudentProfile;
  currentMatch: number;
  onOpenOpportunityDetail: () => void;
}

export const PersonalizedRoadmap: React.FC<PersonalizedRoadmapProps> = ({
  opportunity,
  student,
  currentMatch,
  onOpenOpportunityDetail,
}) => {
  const roadmap: OpportunityRoadmap = generateOpportunityRoadmap(opportunity, student, currentMatch);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepCompletion = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Targeted 14-Day Action Roadmap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              GET READY: {opportunity.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {opportunity.organization} · A focused two-week blueprint to eliminate missing skills and raise your candidate qualification score.
            </p>
          </div>

          {/* Match Uplift Badge */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex-shrink-0 shadow-2xs">
            <div className="text-center font-mono">
              <div className="text-[10px] uppercase text-slate-500 font-bold">Current Fit</div>
              <div className="text-xl font-bold text-slate-700">{currentMatch}%</div>
            </div>

            <ArrowRight className="w-4 h-4 text-indigo-600" />

            <div className="text-center font-mono">
              <div className="text-[10px] uppercase text-indigo-600 font-bold">Target Fit</div>
              <div className="text-xl font-bold text-emerald-700">{roadmap.targetMatch}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Step Timeline */}
      <div className="space-y-4">
        {roadmap.steps.map((step, idx) => {
          const isDone = completedSteps.includes(idx);
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-xs ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-[#E6EAF2] hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E6EAF2]">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleStepCompletion(idx)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-transparent hover:border-indigo-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 mr-2">
                      {step.dayRange}
                    </span>
                    <h3 className={`text-base font-bold inline ${isDone ? 'line-through text-slate-400' : 'text-[#172033]'}`}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {step.estimatedEffortHours} Hours Effort
                  </span>
                </div>
              </div>

              {/* Step Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                {/* Learning Goal & Practical Task */}
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      Learning Goal:
                    </span>
                    <p className="text-slate-800 mt-0.5 leading-relaxed">{step.learningGoal}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      Practical Task:
                    </span>
                    <p className="text-slate-700 mt-0.5 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {step.practicalTask}
                    </p>
                  </div>
                </div>

                {/* Evidence & Resources */}
                <div className="space-y-2">
                  <div>
                    <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Tangible Evidence To Produce:
                    </span>
                    <p className="text-emerald-900 mt-0.5 font-medium">{step.evidenceToProduce}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      Recommended Resources:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {step.resources.map((res, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
        <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-800 font-semibold">Grounded Guidance:</strong> Following this roadmap prepares practical portfolio evidence to discuss in technical interviews. We do not promise employment; final outcomes depend on company selection criteria and interview rounds.
        </p>
      </div>
    </div>
  );
};
