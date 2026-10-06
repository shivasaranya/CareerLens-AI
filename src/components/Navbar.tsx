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
  UserPlus
} from 'lucide-react';
import { StudentProfile, AuthUser } from '@/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile | null;
  currentUser: AuthUser | null;
  onOpenOnboarding: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
  onResetDemo: () => void;
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
  isCopilotOpen,
  onResetDemo,
}) => {
  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6EAF2] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-sm shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-600 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#172033]">CareerLens</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">AI Opportunity Intelligence</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Target className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Opportunities</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'graph'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <GitBranch className={`w-4 h-4 ${activeTab === 'graph' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Opportunity Map</span>
            </button>

            <button
              onClick={() => setActiveTab('what-if')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'what-if'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'what-if' ? 'text-indigo-600' : 'text-amber-500'}`} />
              <span>What-If</span>
            </button>

            <button
              onClick={() => setActiveTab('skill-gap')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'skill-gap'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeTab === 'skill-gap' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Skill Gaps</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === 'roadmap' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'tracker'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/90 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <BookmarkCheck className={`w-4 h-4 ${activeTab === 'tracker' ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>Applications</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
                activeTab === 'admin'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trust Center</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasProfile ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenOnboarding}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left text-xs shadow-2xs cursor-pointer"
                  title="Click to review or edit profile"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                    {student!.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight hidden sm:block">
                    <span className="font-semibold text-slate-800 block truncate max-w-[105px]">
                      {student!.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" /> My Profile
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
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Build My Profile</span>
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
                  className="px-3 py-1.5 rounded-xl text-slate-700 hover:text-indigo-600 font-bold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onOpenOnboarding}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create My Profile</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </div>
            )}

            {/* AI Copilot Trigger */}
            <button
              onClick={onToggleCopilot}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                isCopilotOpen
                  ? 'bg-indigo-700 text-white shadow-indigo-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-100" />
              <span className="hidden sm:inline">Copilot</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-200"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Opportunities', icon: Target },
            { id: 'graph', label: 'Map', icon: GitBranch },
            { id: 'what-if', label: 'What-If', icon: Sparkles },
            { id: 'skill-gap', label: 'Gaps', icon: Layers },
            { id: 'roadmap', label: 'Roadmap', icon: MapPin },
            { id: 'tracker', label: 'Tracker', icon: BookmarkCheck },
            { id: 'admin', label: 'Trust', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
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
