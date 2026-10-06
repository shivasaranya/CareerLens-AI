'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { OnboardingModal } from '@/components/OnboardingModal';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { AuthModal } from '@/components/AuthModal';
import { StudentProfile, AuthUser } from '@/types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getUserProfile, 
  saveUserProfile, 
  signOut 
} from '@/lib/storage';
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  FolderGit2, 
  Award, 
  Sparkles, 
  Briefcase,
  Edit2,
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user) {
      const prof = getUserProfile(user.id);
      setStudent(prof);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    let activeUser = currentUser;
    if (!activeUser) {
      activeUser = {
        id: `user-${Date.now()}`,
        name: newProfile.name,
        email: newProfile.email || 'user@example.com',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(activeUser);
      setCurrentUserState(activeUser);
    }
    setStudent(newProfile);
    saveUserProfile(activeUser.id, newProfile);
    showToast(`Profile updated for ${newProfile.name}!`);
  };

  const handleUpdateGoal = (newGoal: string) => {
    if (!student || !currentUser) return;
    const updated: StudentProfile = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    setStudent(updated);
    saveUserProfile(currentUser.id, updated);
    showToast(`Career Goal updated to ${newGoal}!`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    router.push('/');
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-indigo-200 text-slate-900 shadow-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar
        activeTab="profile"
        setActiveTab={(tab) => {
          if (tab === 'landing') router.push('/');
          else if (tab === 'opportunities') router.push('/opportunities');
          else if (tab === 'jobs') router.push('/jobs');
          else if (tab === 'skill-map') router.push('/skill-map');
          else if (tab === 'dashboard') router.push('/dashboard');
          else if (tab === 'what-if') router.push('/what-if');
        }}
        student={student}
        currentUser={currentUser}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {hasProfile ? (
          <div className="space-y-8">
            {/* Header Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-600/30">
                  {student!.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">
                      {student!.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-3 gap-y-1 mt-1 font-medium">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{student!.email}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{student!.city || student!.location || 'India'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Education & Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="space-y-3">
                  {student!.educationList && student!.educationList.length > 0 ? (
                    student!.educationList.map((edu) => (
                      <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="font-bold text-sm text-[#172033]">{edu.institution}</div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {edu.degree} in {edu.branch} · Batch of {edu.graduationYear}
                        </div>
                        {edu.cgpa && <div className="text-[11px] text-slate-500 font-mono mt-1">CGPA: {edu.cgpa}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-sm text-[#172033]">{student!.institution}</div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {student!.education} in {student!.branch} · Batch of {student!.graduationYear}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Career Goal */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Career Goal & Trajectory</span>
                  </div>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change Goal</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Career Destination</div>
                    <p className="text-sm font-black text-indigo-950">
                      {student!.careerGoal || 'Not specified'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Domains of Interest</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student!.careerInterests.map((interest) => (
                      <span key={interest} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Declared Skills ({student!.skills.length})</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-semibold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Evidence-Backed
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span> Self-Declared
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {student!.skills.map((s) => (
                  <div
                    key={s.name}
                    className={`p-3 rounded-2xl border ${
                      s.isEvidenceBacked || s.evidence?.length > 0
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172033]">{s.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white font-bold text-slate-700">
                        {s.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Confidence: <strong className="text-slate-800">{s.confidenceScore}%</strong> · {s.isEvidenceBacked || s.evidence?.length > 0 ? 'Verified' : 'Declared'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            {student!.projects.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <FolderGit2 className="w-4 h-4" />
                  <span>Projects & Artifacts ({student!.projects.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student!.projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-sm text-[#172033]">{p.title}</div>
                      <p className="text-xs text-slate-600">{p.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.techStack.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-700 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyDashboard
            onBuildProfile={() => setIsOnboardingOpen(true)}
            onSignIn={() => setIsAuthModalOpen(true)}
            userName={currentUser?.name}
          />
        )}
      </main>

      {/* Onboarding & Auth Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      {/* Career Goal Modal */}
      <CareerGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={student?.careerGoal || 'Machine Learning Engineer'}
        onUpdateGoal={handleUpdateGoal}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUserState(user);
          const prof = getUserProfile(user.id);
          if (prof && prof.name) {
            setStudent(prof);
          } else {
            setIsOnboardingOpen(true);
          }
        }}
      />
    </div>
  );
}
