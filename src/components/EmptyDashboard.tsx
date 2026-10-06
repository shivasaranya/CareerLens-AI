'use client';

import React from 'react';
import { 
  Compass, 
  Sparkles, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Target, 
  CheckCircle2, 
  Layers, 
  GitBranch,
  Lock
} from 'lucide-react';

interface EmptyDashboardProps {
  onBuildProfile: () => void;
  onSignIn?: () => void;
  userName?: string;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  onBuildProfile,
  onSignIn,
  userName,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Central Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-8 sm:p-14 relative">
        {/* Decorative subtle ambient backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-50/80 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
              Opportunity Intelligence Engine
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight leading-tight">
            Your opportunity map <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">starts here.</span>
          </h1>

          {/* Prompt-mandated subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {userName ? `Welcome, ${userName}! ` : ''}
            Create your profile to discover opportunities that match your skills, interests and goals.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBuildProfile}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Build My Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onSignIn && (
              <button
                onClick={onSignIn}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Sign In to Existing Profile</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Takes ~3 minutes · Self-declared & evidence-backed skill options · Zero fake data
          </p>
        </div>

        {/* 3 Step Visual Pipeline */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-left pt-8 border-t border-slate-100">
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-[#172033]">Enter Your Real Details</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input your college, degree, graduation year, your actual skills with evidence, and projects.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-[#172033]">AI Understands Your Profile</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our 5-layer matching engine computes semantic alignment against 240+ verified opportunities.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-[#172033]">Unlock Your Custom Intelligence</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore your Opportunity Radar, Career DNA, actionable Skill Gaps, and What-If simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
