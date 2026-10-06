'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Cpu, 
  Percent, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export const HeroVisualization: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: 'Student Profile',
      tag: 'Step 1: Ingestion',
      icon: User,
      color: 'bg-indigo-600 text-white',
      badge: 'Verified Evidence',
      detailTitle: 'User Profile & Evidence Portfolio',
      detailContent: 'Your declared skills, GitHub projects, coursework milestones, and real credentials.',
      previewMetrics: [
        { label: 'Technical Depth', val: 'Real Skills' },
        { label: 'Evidence Verified', val: '100% User Owned' },
      ],
    },
    {
      id: 1,
      title: 'AI Matching Engine',
      tag: 'Step 2: 5-Layer Analysis',
      icon: Cpu,
      color: 'bg-violet-600 text-white',
      badge: 'Multi-Factor Engine',
      detailTitle: 'Semantic + Eligibility Cross-Check',
      detailContent: 'Layer 1 filters grad year (2026). Layer 2 matches vector skill embeddings. Layer 3 ranks weighted alignment.',
      previewMetrics: [
        { label: 'Catalogue Evaluated', val: '240+ roles' },
        { label: 'Eligibility Pass', val: '94%' },
      ],
    },
    {
      id: 2,
      title: '94% Match Identified',
      tag: 'Step 3: Explainable Fit',
      icon: Percent,
      color: 'bg-emerald-600 text-white',
      badge: 'Top Fit',
      detailTitle: 'Software Engineer Intern — ABC Technologies',
      detailContent: 'Matches core distributed systems focus. Background in Python, SQL, REST APIs aligns with 91% of day-to-day requirements.',
      previewMetrics: [
        { label: 'Skills Overlap', val: '91%' },
        { label: 'Project Relevance', val: '94%' },
      ],
    },
    {
      id: 3,
      title: 'Skill Gap Intelligence',
      tag: 'Step 4: Why Not 100%?',
      icon: AlertTriangle,
      color: 'bg-amber-500 text-white',
      badge: 'Critical Gap',
      detailTitle: 'Remaining 6% Gap Isolated',
      detailContent: 'Target role prefers containerization (Docker) and AWS microservices. Not yet verified in student public repos.',
      previewMetrics: [
        { label: 'Missing Core', val: 'Docker' },
        { label: 'Target Effort', val: '14 Days' },
      ],
    },
    {
      id: 4,
      title: '+17 Unlocked Opportunities',
      tag: 'Step 5: What-If Simulation',
      icon: Sparkles,
      color: 'bg-indigo-600 text-white',
      badge: 'Unlocks Available',
      detailTitle: 'Simulated Change: +Docker & AWS',
      detailContent: 'Profile readiness jumps across 17 additional cloud & backend roles at Zepto, Zerodha, and stealth ventures.',
      previewMetrics: [
        { label: 'New Match Rate', val: '96%' },
        { label: 'Roles Unlocked', val: '+17 Opportunities' },
      ],
    },
  ];

  // Auto-cycle gently every 4 seconds unless user manually interacts
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const current = steps[activeStep];

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-sm relative overflow-hidden">
      {/* Background subtle light ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#E6EAF2] gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
              Live Opportunity Intelligence Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive demonstration: Click any node below to simulate the career intelligence loop
          </p>
        </div>

        <button
          onClick={onExplore}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 group cursor-pointer"
        >
          <span>Launch Full Interactive Engine</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 5-Step Pipeline Breadcrumb / Progress Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6 relative z-10">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isActive = idx === activeStep;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl text-left transition-all relative overflow-hidden border cursor-pointer ${
                isActive
                  ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                  : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${st.color} shadow-xs`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">0{idx + 1}</span>
              </div>
              <p
                className={`text-xs font-bold truncate ${
                  isActive ? 'text-[#172033]' : 'text-slate-600'
                }`}
              >
                {st.title}
              </p>
              <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-500">
                <span>{st.badge}</span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Active State Card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 transition-all relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                {current.tag}
              </span>
              <span className="text-xs text-slate-500 font-medium">{current.badge}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#172033] tracking-tight">
              {current.detailTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {current.detailContent}
            </p>
          </div>

          {/* Metric Highlights */}
          <div className="flex sm:flex-row gap-3 w-full md:w-auto">
            {current.previewMetrics.map((met, i) => (
              <div
                key={i}
                className="bg-white border border-[#E2E8F0] rounded-xl p-3 min-w-[120px] text-center shadow-xs"
              >
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  {met.label}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-indigo-600 font-mono mt-0.5">
                  {met.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Prompt */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-600">Explainable AI verification active. No black-box guesses.</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-[11px] text-indigo-600 font-semibold">
            <span>Next Phase:</span>
            <span className="text-slate-700">
              {activeStep < 4 ? steps[activeStep + 1].title : 'Action & Application Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
