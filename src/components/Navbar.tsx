'use client';

import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Target, 
  GitBranch, 
  Layers, 
  MapPin, 
  Bot, 
  ShieldCheck, 
  RotateCcw, 
  BookmarkCheck,
  CheckCircle2,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { StudentProfile, AuthUser } from '@/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile | null;
  currentUser: AuthUser | null;
  onOpenOnboarding: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onToggleCopilot?: () => void;
  isCopilotOpen?: boolean;
  onResetDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  currentUser,
  onOpenOnboarding,
  onOpenAuth,
  onSignOut,
  onToggleCopilot,
  isCopilotOpen = false,
  onResetDemo,
}) => {
  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

  // Dynamic Profile Completion calculation
  let profileCompletion = 0;
  if (student) {
    if (student.name && student.email) profileCompletion += 15;
    if (student.institution && student.branch) profileCompletion += 20;
    if (student.skills && student.skills.length >= 3) profileCompletion += 25;
    else if (student.skills && student.skills.length > 0) profileCompletion += 15;
    if (student.projects && student.projects.length >= 1) profileCompletion += 20;
    if (student.careerGoal && student.careerGoal.trim().length > 0) profileCompletion += 10;
    if (student.preferences && student.preferences.types && student.preferences.types.length > 0) profileCompletion += 10;
    profileCompletion = Math.min(100, profileCompletion);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* TOP LEFT: CareerLens AI Logo */}
          <div className="flex items-center">
            <div onClick={() => setActiveTab('landing')} className="cursor-pointer">
              <BrandLogo size="md" showTagline={false} />
            </div>
          </div>

          {/* CENTER Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'landing'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {hasProfile && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'text-indigo-700 bg-indigo-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'opportunities'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Opportunities</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'jobs'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('career-map')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'career-map'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
              <span>Career Map</span>
            </button>

            <button
              onClick={() => setActiveTab('skill-map')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'skill-map'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skill Map</span>
            </button>

            <button
              onClick={() => setActiveTab('skill-gaps')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'skill-gaps'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skill Gaps</span>
            </button>

            <button
              onClick={() => setActiveTab('what-if')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'what-if'
                  ? 'text-indigo-700 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>What-If</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasProfile ? (
              <div className="flex items-center space-x-2">
                {/* Profile Completion Badge */}
                <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                  <span className="text-slate-500 font-medium">Profile:</span>
                  <span className="font-bold text-indigo-700 font-mono">{profileCompletion}%</span>
                </div>

                <button
                  onClick={onOpenOnboarding}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left text-xs shadow-2xs cursor-pointer group"
                  title="Click to review or edit your profile"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {student!.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight hidden sm:block">
                    <span className="font-bold text-slate-800 block truncate max-w-[100px] group-hover:text-indigo-600">
                      {student!.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                </button>

                <button
                  onClick={onSignOut}
                  title="Sign out / Switch account"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenOnboarding}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create My Profile</span>
                </button>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-indigo-600 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onOpenOnboarding}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create My Profile</span>
                </button>
              </div>
            )}

            {/* AI Copilot Trigger */}
            {onToggleCopilot && (
              <button
                onClick={onToggleCopilot}
                className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                  isCopilotOpen
                    ? 'bg-indigo-700 text-white shadow-indigo-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="AI Opportunity Copilot"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline font-bold">Copilot</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2.5 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'landing', label: 'Home', icon: Compass },
            ...(hasProfile ? [{ id: 'dashboard', label: 'Dashboard', icon: GitBranch }] : []),
            { id: 'career-map', label: 'Career Map', icon: GitBranch },
            { id: 'skill-map', label: 'Skill Map', icon: Layers },
            { id: 'skill-gaps', label: 'Skill Gaps', icon: Target },
            { id: 'opportunities', label: 'Opportunities', icon: Target },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'what-if', label: 'What-If', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
