'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Cpu, 
  GitBranch, 
  Trophy, 
  FlaskConical, 
  Layers,
  Zap
} from 'lucide-react';

interface HeroCareerNetworkProps {
  onExploreOpportunities?: () => void;
  onBuildProfile?: () => void;
}

export const HeroCareerNetwork: React.FC<HeroCareerNetworkProps> = ({
  onExploreOpportunities,
  onBuildProfile,
}) => {
  const [activeNode, setActiveNode] = useState<string>('all');
  const [pulseIndex, setPulseIndex] = useState<number>(0);

  // Subtle cyclic pulse beam
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const skills = [
    { id: 'python', label: 'Python', level: 'Verified', color: 'bg-indigo-600', x: 25, y: 22 },
    { id: 'ml', label: 'PyTorch / AI', level: 'Verified', color: 'bg-violet-600', x: 28, y: 44 },
    { id: 'cloud', label: 'Cloud & Docker', level: 'Growing', color: 'bg-cyan-600', x: 26, y: 66 },
    { id: 'data', label: 'SQL & Systems', level: 'Verified', color: 'bg-blue-600', x: 24, y: 86 },
  ];

  const careerPaths = [
    { id: 'path-ml', title: 'ML & AI Engineer', fit: '94% Fit', color: 'text-violet-700 bg-violet-50 border-violet-200', x: 55, y: 26 },
    { id: 'path-swe', title: 'Backend Systems', fit: '92% Fit', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', x: 55, y: 52 },
    { id: 'path-cloud', title: 'Cloud Architect', fit: '88% Fit', color: 'text-cyan-700 bg-cyan-50 border-cyan-200', x: 55, y: 78 },
  ];

  const opportunities = [
    {
      id: 'opp-1',
      title: 'Google Summer of Code',
      org: 'Open Source',
      type: 'Internship',
      match: '94% Match',
      icon: Briefcase,
      color: 'border-indigo-200 bg-white',
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'opp-2',
      title: "NASA L'SPACE Academy",
      org: 'Planetary Exploration',
      type: 'Research',
      match: '91% Match',
      icon: FlaskConical,
      color: 'border-violet-200 bg-white',
      badgeColor: 'bg-violet-600 text-white',
    },
    {
      id: 'opp-3',
      title: 'Smart India Hackathon',
      org: 'Govt. of India',
      type: 'Hackathon',
      match: '96% Match',
      icon: Trophy,
      color: 'border-emerald-200 bg-white',
      badgeColor: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-white to-slate-50/80 border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 overflow-hidden select-none">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-800 tracking-tight uppercase">
            Live Career Intelligence Graph
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% User Owned Evidence
          </span>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="relative my-6 min-h-[380px] sm:min-h-[420px] flex items-center justify-between">
        {/* SVG Animated Connector Beams */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Smooth bezier curves connecting Center -> Skills -> Paths -> Opportunities */}
          <path
            d="M 50 200 C 90 200, 100 85, 140 85"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <path
            d="M 50 200 C 90 200, 100 160, 140 160"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <path
            d="M 50 200 C 90 200, 100 240, 140 240"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />
          <path
            d="M 50 200 C 90 200, 100 320, 140 320"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
          />

          {/* Connecting Skills to Paths */}
          <path
            d="M 230 85 C 280 85, 270 120, 310 120"
            stroke={pulseIndex === 0 ? 'url(#beamGrad)' : '#E2E8F0'}
            strokeWidth={pulseIndex === 0 ? '3' : '2'}
            fill="none"
            filter={pulseIndex === 0 ? 'url(#glow)' : undefined}
          />
          <path
            d="M 230 160 C 280 160, 270 120, 310 120"
            stroke={pulseIndex === 1 ? 'url(#beamGrad)' : '#E2E8F0'}
            strokeWidth={pulseIndex === 1 ? '3' : '2'}
            fill="none"
          />
          <path
            d="M 230 160 C 280 160, 270 200, 310 200"
            stroke={pulseIndex === 2 ? 'url(#beamGrad)' : '#E2E8F0'}
            strokeWidth={pulseIndex === 2 ? '3' : '2'}
            fill="none"
          />
          <path
            d="M 230 240 C 280 240, 270 280, 310 280"
            stroke={pulseIndex === 3 ? 'url(#beamGrad)' : '#E2E8F0'}
            strokeWidth={pulseIndex === 3 ? '3' : '2'}
            fill="none"
          />

          {/* Connecting Paths to Live Opportunities */}
          <path
            d="M 460 120 C 510 120, 500 90, 540 90"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 460 200 C 510 200, 500 200, 540 200"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 460 280 C 510 280, 500 310, 540 310"
            stroke="#CBD5E1"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* 1. Origin Node: "YOU" */}
        <div className="relative z-10 flex flex-col items-center flex-shrink-0">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 p-1 shadow-lg shadow-indigo-600/30 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Origin</span>
                <span className="text-sm sm:text-base font-black text-[#172033] tracking-tight">YOU</span>
              </div>
            </div>
            {/* Ping aura */}
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500 opacity-20 blur-sm -z-10 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-2 text-center">
            Your Profile
          </span>
        </div>

        {/* 2. Skills Column */}
        <div className="relative z-10 flex flex-col space-y-3 sm:space-y-4 pl-3 sm:pl-8">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
            Skills & Evidence
          </span>
          {skills.map((s, idx) => (
            <div
              key={s.id}
              className={`p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all duration-200 cursor-pointer ${
                pulseIndex === idx ? 'ring-2 ring-indigo-500/30 shadow-md' : ''
              }`}
              onMouseEnter={() => setActiveNode(s.id)}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-xs font-bold text-slate-800">{s.label}</span>
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                ✓ {s.level}
              </div>
            </div>
          ))}
        </div>

        {/* 3. AI Career Paths Column */}
        <div className="relative z-10 flex flex-col space-y-4 sm:space-y-6 px-2 sm:px-6">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
            AI Career Paths
          </span>
          {careerPaths.map((p, idx) => (
            <div
              key={p.id}
              className={`p-3 sm:p-3.5 rounded-2xl bg-white border shadow-xs transition-all duration-300 hover:scale-105 cursor-pointer ${p.color}`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-[#172033]">{p.title}</span>
              </div>
              <span className="text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-indigo-700 shadow-2xs">
                {p.fit}
              </span>
            </div>
          ))}
        </div>

        {/* 4. Live Opportunities Floating Cards */}
        <div className="relative z-10 hidden md:flex flex-col space-y-3 pl-2 sm:pl-6 max-w-[210px]">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">
            Matched Universe
          </span>
          {opportunities.map((opp) => {
            const Icon = opp.icon;
            return (
              <div
                key={opp.id}
                className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                onClick={onExploreOpportunities}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{opp.type}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${opp.badgeColor}`}>
                    {opp.match}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-[#172033] line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {opp.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{opp.org}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Prompt */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-medium">
            AI dynamically maps every opportunity from your actual skills and projects.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {onBuildProfile && (
            <button
              onClick={onBuildProfile}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Build My Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
