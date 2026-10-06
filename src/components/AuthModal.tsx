'use client';

import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Sparkles, CheckCircle2, User, Mail, ArrowRight } from 'lucide-react';
import { AuthUser } from '@/types';
import { getUsers, registerUser, loginUser } from '@/lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, isNewUser: boolean) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedUsers, setSavedUsers] = useState<AuthUser[]>([]);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    if (typeof window !== 'undefined') {
      setSavedUsers(getUsers());
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const user = loginUser(email);
    if (user) {
      onAuthSuccess(user, false);
      onClose();
    } else {
      setError('No account found with this email. Please create an account below.');
    }
  };

  const handleQuickSwitch = (u: AuthUser) => {
    const user = loginUser(u.email);
    if (user) {
      onAuthSuccess(user, false);
      onClose();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    const user = registerUser(name, email);
    onAuthSuccess(user, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CareerLens AI Identity</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'signin'
              ? 'Access your saved profile, matched opportunities, and personalized roadmaps.'
              : 'Start your personal opportunity intelligence profile from scratch.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signin'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email you registered with"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Sign In to My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Saved accounts on this device */}
              {savedUsers.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Accounts on this device
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {savedUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSwitch(u)}
                        className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-between transition-all text-left group"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-indigo-700">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-indigo-600 group-hover:underline flex-shrink-0">
                          Select →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Don't have an account? Create one now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your actual full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.edu or your personal email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your Data, Strictly Yours</span>
                </div>
                <p>
                  CareerLens AI creates a blank, dedicated profile container for you. No fake skills, no hardcoded sample resumes, and no shared data with other users.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Create Account & Build My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
