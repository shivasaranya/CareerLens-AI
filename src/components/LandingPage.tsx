'use client';

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Award, 
  FlaskConical, 
  Users,
  CheckCircle2,
  TrendingUp,
  GitBranch,
  Target,
  ExternalLink,
  Layers,
  Zap,
  Lock,
  ChevronRight,
  Clock,
  Building,
  CheckCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { HeroCareerNetwork } from './HeroCareerNetwork';
import { Opportunity, OpportunityType } from '@/types';

interface LandingPageProps {
  onBuildProfile: () => void;
  onExploreOpportunities: (category?: OpportunityType | 'All') => void;
  onSignIn?: () => void;
  opportunities: Opportunity[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onBuildProfile,
  onExploreOpportunities,
  onSignIn,
  opportunities,
}) => {
  const opportunityCategories: {
    type: OpportunityType;
    label: string;
    icon: any;
    count: number;
    color: string;
    description: string;
  }[] = [
    { type: 'Internship', label: 'Internships', icon: Briefcase, count: 24, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', description: 'Industry and research internships with verified stipends and real mentors.' },
    { type: 'Full-time', label: 'Jobs', icon: Target, count: 32, color: 'text-blue-600 bg-blue-50 border-blue-200', description: 'Early-career and new-graduate roles matching your verified skills.' },
    { type: 'Hackathon', label: 'Hackathons', icon: Trophy, count: 18, color: 'text-amber-600 bg-amber-50 border-amber-200', description: 'Global and national hackathons with sponsor bounties and grand prizes.' },
    { type: 'Research', label: 'Research', icon: FlaskConical, count: 12, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', description: 'Institutional research fellowships at CERN, NASA, and leading AI labs.' },
    { type: 'Fellowship', label: 'Fellowships', icon: Award, count: 9, color: 'text-purple-600 bg-purple-50 border-purple-200', description: 'Prestigious funded programs for quantitative, open-source, and policy leaders.' },
    { type: 'Scholarship', label: 'Scholarships', icon: GraduationCap, count: 15, color: 'text-rose-600 bg-rose-50 border-rose-200', description: 'Non-repayable grants and STEM tuition awards from top global foundations.' },
    { type: 'Competition', label: 'Competitions', icon: Zap, count: 14, color: 'text-teal-600 bg-teal-50 border-teal-200', description: 'Algorithmic benchmarks, Microsoft Imagine Cup, and Kaggle challenges.' },
    { type: 'Apprenticeship', label: 'Apprenticeships', icon: Users, count: 8, color: 'text-violet-600 bg-violet-50 border-violet-200', description: 'Work-integrated learning tracks with enterprise conversion pathways.' },
  ];

  const featuredOpps = opportunities.slice(0, 4);

  return (
    <div className="min-h-screen text-[#172033] light-mesh-bg pb-12 relative overflow-hidden">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                AI Opportunity Intelligence Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#172033] leading-[1.12]">
              Your next opportunity is{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">
                closer than you think.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              CareerLens AI understands your skills, goals and potential — then connects you with opportunities where you can actually grow.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onBuildProfile}
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center space-x-2.5 group cursor-pointer"
              >
                <span>Build My Career Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onExploreOpportunities('All')}
                className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold text-sm shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Explore Opportunities</span>
              </button>
            </div>

            {/* Transparency Trust Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% User-Owned Profile</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center space-x-1 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Verified Source Portals</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center space-x-1 font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>What-If Simulator</span>
              </span>
            </div>
          </div>

          {/* Hero Right Column: Animated Career Network Graphic */}
          <div className="lg:col-span-6 w-full">
            <HeroCareerNetwork
              onExploreOpportunities={() => onExploreOpportunities('All')}
              onBuildProfile={onBuildProfile}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: "HOW IT WORKS" (4-STEP SECTION) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
            From profile to possibility.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            From raw coursework and repos to verified fits, clear skill gap analysis, and tailored preparation roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="text-lg font-black text-[#172033] mb-2">Build Your Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Tell CareerLens AI about your:
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Skills & Evidence</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Education & Coursework</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Projects & GitHub Repos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Custom Career Goals</span>
              </div>
            </div>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 font-mono font-black text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="text-lg font-black text-[#172033] mb-2">Discover</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              AI explores verified opportunities across 8 dimensions tailored strictly to your profile:
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                <span>Real industry roles & internships</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                <span>Global research fellowships</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                <span>Premier student hackathons</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                <span>STEM scholarships & grants</span>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono font-black text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="text-lg font-black text-[#172033] mb-2">Understand Your Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Transparent, explainable 5-layer intelligence. See exactly:
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                <span>Why you are matched</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                <span>What skills you already have</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                <span>Why it isn’t 100%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                <span>What makes you competitive</span>
              </div>
            </div>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black text-lg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              04
            </div>
            <h3 className="text-lg font-black text-[#172033] mb-2">Become Ready</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Turn gaps into opportunities with actionable AI guidance:
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Identified skill gaps</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Interactive What-If simulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Preparation roadmap & milestones</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Application readiness checklist</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OPPORTUNITY UNIVERSE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunity Universe</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight">
            One profile. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              A universe of opportunities.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Career growth isn’t a single job board listing. Explore hackathons, research labs, fellowships, and scholarships tailored to where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {opportunityCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.type}
                onClick={() => onExploreOpportunities(cat.type)}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-black text-[#172033] group-hover:text-indigo-600 transition-colors">
                      {cat.label}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      {cat.count}+ Roles
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
                  <span>Explore {cat.label}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: OPPORTUNITIES HAPPENING NOW (LIVE PREVIEW) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verified Openings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#172033] tracking-tight">
              Opportunities happening now
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Active programs with verified deadlines and official application portals.
            </p>
          </div>

          <button
            onClick={() => onExploreOpportunities('All')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredOpps.map((opp) => (
            <div
              key={opp.id}
              onClick={() => onExploreOpportunities('All')}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {opp.type}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600">{opp.workMode}</span>
                  </div>

                  {opp.verification?.status === 'Verified' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Source
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Needs Verification
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-[#172033] hover:text-indigo-600 transition-colors">
                  {opp.title}
                </h3>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{opp.organization}</span>
                  <span>·</span>
                  <span>{opp.location}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {opp.requiredSkills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: {opp.deadline}</span>
                </div>

                <div className="text-[11px] font-bold text-indigo-600 flex items-center space-x-1">
                  <span>Create profile to view fit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: TRUST & VERIFICATION SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Orb */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trust & Accountability</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Don't just find opportunities. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                Find opportunities you can trust.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-2xl">
              Fake job postings and expired portals waste critical preparation cycles. Every opportunity cataloged on CareerLens AI undergoes systematic multi-factor validation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Source Attribution</h4>
                  <p className="text-[11px] text-indigo-200/80 mt-0.5">
                    Clear attribution to official institutional portals (Google, NASA, CERN, Ministry of Education).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Deadline Freshness</h4>
                  <p className="text-[11px] text-indigo-200/80 mt-0.5">
                    Continuous monitoring ensures active registration windows with zero ghost positions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Eligibility Transparency</h4>
                  <p className="text-[11px] text-indigo-200/80 mt-0.5">
                    Strict branch, degree, and graduation year criteria verification to prevent wasted applications.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Application Link</h4>
                  <p className="text-[11px] text-indigo-200/80 mt-0.5">
                    Apply directly on official company ATS portals without intermediary fee redirects.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Explainability Callout (Section 13) */}
            <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Recommendations you can understand.</h3>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  CareerLens AI does not simply give an opaque number. It explains why each opportunity matches, which skills match, which requirements are missing, whether you are eligible, and what you can improve to become competitive.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Why this match?</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold">84% AI Match</span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                    <span>✓</span>
                    <span>Python</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                    <span>✓</span>
                    <span>Problem Solving</span>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                    <span>✓</span>
                    <span>CS/IT Background</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">Missing:</span>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="text-slate-400">○</span>
                    <span>SQL</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <span className="text-slate-400">○</span>
                    <span>Cloud Fundamentals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL LANDING CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-[#172033] tracking-tight leading-tight">
              Your next opportunity could start with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                one profile.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Tell CareerLens AI who you are. We’ll help you understand where you fit and what you can become.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onBuildProfile}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Build My Career Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onExploreOpportunities('All')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-sm shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>Explore Opportunities</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white pt-12 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
            {/* Col 1: Brand */}
            <div className="md:col-span-1 space-y-3">
              <BrandLogo size="md" showTagline={false} />
              <p className="text-xs text-slate-500 leading-relaxed">
                AI-powered opportunity intelligence for students.
              </p>
              <p className="text-[11px] text-slate-400 italic">
                “See the opportunity. Understand the gap. Build your future.”
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li>
                  <button onClick={() => onExploreOpportunities('All')} className="hover:text-indigo-600">
                    Opportunities
                  </button>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-indigo-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <button onClick={onBuildProfile} className="hover:text-indigo-600">
                    Build Profile
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Categories
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li>
                  <button onClick={() => onExploreOpportunities('Internship')} className="hover:text-indigo-600">
                    Internships
                  </button>
                </li>
                <li>
                  <button onClick={() => onExploreOpportunities('Hackathon')} className="hover:text-indigo-600">
                    Hackathons
                  </button>
                </li>
                <li>
                  <button onClick={() => onExploreOpportunities('Research')} className="hover:text-indigo-600">
                    Research Fellowships
                  </button>
                </li>
                <li>
                  <button onClick={() => onExploreOpportunities('Scholarship')} className="hover:text-indigo-600">
                    Scholarships
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Trust & Standards
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Organization Sources</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Zero Fake Profiles</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Isolated User Data</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>© 2026 CareerLens AI — All rights reserved.</p>
            <p>Built with Next.js & Artificial Intelligence</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
