'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Cpu, 
  Target, 
  Layers, 
  Search, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Award, 
  Code2, 
  FlaskConical, 
  Users,
  CheckCircle2,
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { HeroVisualization } from './HeroVisualization';
import { Opportunity } from '@/types';

interface LandingPageProps {
  onBuildProfile: () => void;
  onExploreOpportunities: () => void;
  onSignIn?: () => void;
  opportunities: Opportunity[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onBuildProfile,
  onExploreOpportunities,
  onSignIn,
  opportunities,
}) => {
  const categoryStats = [
    { label: 'Internships', count: 18, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Full-time Jobs', count: 24, icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Research Fellowships', count: 9, icon: FlaskConical, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Hackathons', count: 14, icon: Trophy, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Fellowships', count: 7, icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Scholarships', count: 11, icon: GraduationCap, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { label: 'Competitions', count: 12, icon: Target, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Apprenticeships', count: 6, icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
  ];

  return (
    <div className="min-h-screen text-[#172033] light-mesh-bg pb-20 relative overflow-hidden">
      {/* Subtle background floating decorative blobs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-violet-100/35 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Welcome to CareerLens AI
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#172033] leading-[1.15]">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
              CareerLens AI
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Build your profile to discover opportunities matched to your skills, interests and career goals.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onBuildProfile}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Create My Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onSignIn ? (
              <button
                onClick={onSignIn}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-[#E6EAF2] hover:border-slate-300 font-semibold text-sm shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={onExploreOpportunities}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-[#E6EAF2] hover:border-slate-300 font-semibold text-sm shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Explore Opportunities</span>
              </button>
            )}
          </div>

          {/* Transparent System Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Opportunity Intelligence:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-mono">✓ 5-Layer Matching</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-mono">✓ Evidence-Backed Verification</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">✓ What-If Simulator</span>
          </div>
        </div>

        {/* Hero Interactive Visualization */}
        <div className="mt-12 max-w-5xl mx-auto">
          <HeroVisualization onExplore={onExploreOpportunities} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6EAF2]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600 mb-2">
            The Closed-Loop Framework
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
            How CareerLens AI Works
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Moving beyond passive job scrapers. A systematic 5-step intelligence engine that actively prepares you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Understand Me',
              desc: 'Parses your verified project commits, coursework, certifications, and learning velocity into an evidence-backed Career DNA.',
              icon: Cpu,
              color: 'text-indigo-600 border-indigo-200 bg-indigo-50',
            },
            {
              step: '02',
              title: 'Discover Opportunities',
              desc: 'Continuously monitors verified internships, research labs, hackathons, and high-impact fellowships matching your background.',
              icon: Search,
              color: 'text-blue-600 border-blue-200 bg-blue-50',
            },
            {
              step: '03',
              title: 'Explain the Match',
              desc: 'Transparently breaks down every score across Skills, Projects, and Education. Never leaves you guessing "Why this match?"',
              icon: Target,
              color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
            },
            {
              step: '04',
              title: 'Close the Gap',
              desc: 'Identifies critical vs competitive skill gaps and delivers a practical, step-by-step 14-day preparation roadmap.',
              icon: Layers,
              color: 'text-amber-600 border-amber-200 bg-amber-50',
            },
            {
              step: '05',
              title: 'Unlock Better Paths',
              desc: 'Simulate What-If career and skill changes to see exactly how many high-tier opportunities open up in real time.',
              icon: Sparkles,
              color: 'text-violet-600 border-violet-200 bg-violet-50',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E6EAF2] shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.step}</span>
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-[#172033] mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Opportunity Universe Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6EAF2]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-600 mb-2">
            Beyond Standard Job Boards
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
            The Opportunity Universe
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Students need more than just job listings. CareerLens tracks the full spectrum of academic and industry acceleration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryStats.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={onExploreOpportunities}
                className="bg-white rounded-2xl p-5 border border-[#E6EAF2] shadow-xs hover:shadow-md hover:border-indigo-200 cursor-pointer text-center group transition-all"
              >
                <div className={`inline-flex p-3 rounded-xl border mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#172033]">{cat.label}</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono font-medium">{cat.count}+ Active Tracks</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why CareerLens Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E6EAF2]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-2">
            Next-Gen Differentiation
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
            Why CareerLens Stands Out
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Explainable AI Engine',
              desc: 'No arbitrary black-box scores. Inspect exact percentages for skills, project alignment, and educational requirements on every single match.',
              icon: Target,
            },
            {
              title: 'Potential-Based Matching',
              desc: 'Identifies opportunities you are 70% ready for today, and shows how you can realistically become an 89%+ candidate with 14 days of targeted prep.',
              icon: Cpu,
            },
            {
              title: 'Skill-Gap Intelligence',
              desc: 'Separates critical hard prerequisites from competitive nice-to-haves so you prioritize learning what genuinely unlocks offers.',
              icon: Layers,
            },
            {
              title: 'What-If Opportunity Simulation',
              desc: 'Simulate learning AWS, Docker, or AI. Instantly watch your opportunity radar expand and calculate your estimated unlocked roles.',
              icon: Sparkles,
            },
            {
              title: 'Trust & Safety Shield',
              desc: 'Detects scam postings, unverified Telegram recruiters, and dubious registration fees before you apply. Protects student safety.',
              icon: ShieldCheck,
            },
            {
              title: 'Personalized 14-Day Roadmap',
              desc: 'Step-by-step milestones with tangible deliverables, STAR resume bullet guides, and verified evidence to produce.',
              icon: GitBranch,
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E6EAF2] shadow-xs hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#172033]">{feat.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 text-center border border-indigo-200 relative overflow-hidden shadow-sm bg-gradient-to-b from-indigo-50/80 via-white to-white">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
              Build your opportunity map today.
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              See the opportunity. Understand the gap. Build your future.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBuildProfile}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Create My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreOpportunities}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#E6EAF2] hover:border-slate-300 text-slate-700 font-semibold text-sm shadow-2xs transition-all cursor-pointer"
              >
                <span>Browse Live Opportunity Radar</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
