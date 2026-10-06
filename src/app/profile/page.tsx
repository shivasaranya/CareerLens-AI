'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { EmptyDashboard } from '@/components/EmptyDashboard';
import { OnboardingModal } from '@/components/OnboardingModal';
import { CareerGoalModal } from '@/components/CareerGoalModal';
import { InterestsModal } from '@/components/InterestsModal';
import { ExperienceModal } from '@/components/ExperienceModal';
import { CertificationModal } from '@/components/CertificationModal';
import { SkillEditModal } from '@/components/SkillEditModal';
import { ProjectEditModal } from '@/components/ProjectEditModal';
import { AuthModal } from '@/components/AuthModal';
import { 
  StudentProfile, 
  AuthUser, 
  StudentSkill, 
  ProjectRecord, 
  ExperienceRecord, 
  CertificationRecord 
} from '@/types';
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
  Edit3,
  Target,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [currentUser, setCurrentUserState] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<ExperienceRecord | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationRecord | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<StudentSkill | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
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
  const hasCareerGoal = Boolean(student?.careerGoal && student.careerGoal.trim().length > 0);
  const hasInterests = Boolean(student?.careerInterests && student.careerInterests.length > 0);
  const hasExperience = Boolean(student?.experience && student.experience.length > 0);
  const hasCertifications = Boolean(student?.certifications && student.certifications.length > 0);

  // Profile completion based strictly on actual data
  const profileCompletion = useMemo(() => {
    if (!student) return 0;
    let score = 0;
    if (student.name && student.email) score += 15;
    if (student.institution && student.branch) score += 20;
    if (student.skills && student.skills.length >= 3) score += 25;
    else if (student.skills && student.skills.length > 0) score += 15;
    if (student.projects && student.projects.length >= 1) score += 20;
    if (student.careerGoal && student.careerGoal.trim().length > 0) score += 10;
    if (student.careerInterests && student.careerInterests.length > 0) score += 5;
    if (student.experience && student.experience.length > 0) score += 5;
    return Math.min(100, score);
  }, [student]);

  const persistProfile = (updated: StudentProfile) => {
    const activeUserId = currentUser?.id || 'user-shiva-saranya';
    setStudent(updated);
    saveUserProfile(activeUserId, updated);
  };

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
    persistProfile(newProfile);
    showToast(`Profile updated for ${newProfile.name}!`);
  };

  const handleUpdateGoal = (newGoal: string) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      careerGoal: newGoal,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Career Goal updated to ${newGoal}!`);
  };

  const handleSaveInterests = (interests: string[]) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      careerInterests: interests,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Interests updated!`);
  };

  // Skill Management
  const handleSaveSkill = (savedSkill: StudentSkill) => {
    if (!student) return;
    const existingIndex = student.skills.findIndex(
      (s) => s.name.toLowerCase() === savedSkill.name.toLowerCase()
    );
    let updatedSkills = [...student.skills];
    if (existingIndex >= 0) {
      updatedSkills[existingIndex] = savedSkill;
    } else {
      updatedSkills.push(savedSkill);
    }
    const updated: StudentProfile = {
      ...student,
      skills: updatedSkills,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Skill ${savedSkill.name} saved!`);
  };

  const handleDeleteSkill = (skillName: string) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      skills: student.skills.filter((s) => s.name !== skillName),
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Skill removed.`);
  };

  // Project Management
  const handleSaveProject = (savedProject: ProjectRecord) => {
    if (!student) return;
    const existingIndex = student.projects.findIndex((p) => p.id === savedProject.id);
    let updatedProjects = [...student.projects];
    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = savedProject;
    } else {
      updatedProjects.push(savedProject);
    }
    const updated: StudentProfile = {
      ...student,
      projects: updatedProjects,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Project "${savedProject.title}" saved!`);
  };

  const handleDeleteProject = (projectId: string) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      projects: student.projects.filter((p) => p.id !== projectId),
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Project deleted.`);
  };

  // Experience Management
  const handleSaveExperience = (savedExp: ExperienceRecord) => {
    if (!student) return;
    const existingIndex = student.experience.findIndex((e) => e.id === savedExp.id);
    let updatedExp = [...student.experience];
    if (existingIndex >= 0) {
      updatedExp[existingIndex] = savedExp;
    } else {
      updatedExp.push(savedExp);
    }
    const updated: StudentProfile = {
      ...student,
      experience: updatedExp,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Experience at ${savedExp.organization} saved!`);
  };

  const handleDeleteExperience = (expId: string) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      experience: student.experience.filter((e) => e.id !== expId),
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Experience removed.`);
  };

  // Certification Management
  const handleSaveCertification = (savedCert: CertificationRecord) => {
    if (!student) return;
    const existingIndex = student.certifications.findIndex((c) => c.id === savedCert.id);
    let updatedCerts = [...student.certifications];
    if (existingIndex >= 0) {
      updatedCerts[existingIndex] = savedCert;
    } else {
      updatedCerts.push(savedCert);
    }
    const updated: StudentProfile = {
      ...student,
      certifications: updatedCerts,
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Certification "${savedCert.name}" saved!`);
  };

  const handleDeleteCertification = (certId: string) => {
    if (!student) return;
    const updated: StudentProfile = {
      ...student,
      certifications: student.certifications.filter((c) => c.id !== certId),
      updatedAt: new Date().toISOString(),
    };
    persistProfile(updated);
    showToast(`Certification removed.`);
  };

  const handleSignOut = () => {
    signOut();
    setCurrentUserState(null);
    setStudent(null);
    router.push('/');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center text-slate-500 font-mono text-xs">
        Loading Profile...
      </div>
    );
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
            {/* 1. Header Profile Card */}
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
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      2nd Year Student
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-3 gap-y-1 mt-1 font-medium">
                    <span className="font-semibold text-slate-700">{student!.institution}</span>
                    <span>·</span>
                    <span>{student!.branch}</span>
                    <span>·</span>
                    <span>Graduating {student!.graduationYear}</span>
                    {student!.email && (
                      <>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{student!.email}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Basic Info</span>
                </button>
              </div>
            </div>

            {/* 2. Profile Status & Readiness Breakdown (Section 7) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>Profile Status & Readiness Indicator</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transparent indicator based strictly on actual student information.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold">
                  {profileCompletion}% Complete
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Profile Created */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Profile created</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">✓ Basic information</p>
                </div>

                {/* Skills */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Skills</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    ✓ Initial skills added ({student!.skills.length})
                  </p>
                </div>

                {/* Projects */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Projects</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    ✓ Academic projects added ({student!.projects.length})
                  </p>
                </div>

                {/* Experience */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 font-bold">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    <span>Experience</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {hasExperience ? `✓ ${student!.experience.length} added` : '○ No professional experience yet'}
                  </p>
                </div>

                {/* Certifications */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 font-bold">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    <span>Certifications</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {hasCertifications ? `✓ ${student!.certifications.length} added` : '○ None added'}
                  </p>
                </div>

                {/* Career Goal */}
                <div className={`p-3.5 rounded-2xl border ${hasCareerGoal ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'}`}>
                  <div className={`flex items-center space-x-2 font-bold ${hasCareerGoal ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {hasCareerGoal ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-amber-500 inline-block flex-shrink-0" />
                    )}
                    <span>Career Goal</span>
                  </div>
                  <p className={`text-[11px] mt-1 font-medium ${hasCareerGoal ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {hasCareerGoal ? `✓ ${student!.careerGoal}` : '○ Not set'}
                  </p>
                </div>

                {/* Interests */}
                <div className={`p-3.5 rounded-2xl border ${hasInterests ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`flex items-center space-x-2 font-bold ${hasInterests ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {hasInterests ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block flex-shrink-0" />
                    )}
                    <span>Interests</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${hasInterests ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                    {hasInterests ? `✓ ${student!.careerInterests.length} selected` : '○ Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Education & Trajectory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Education */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-sm text-[#172033]">{student!.institution}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    B.Tech · {student!.branch} · 2nd Year
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Batch of {student!.graduationYear}
                  </div>
                </div>
              </div>

              {/* Career Goal (Section 5) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Career Goal</span>
                  </div>
                  {hasCareerGoal && (
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>

                {hasCareerGoal ? (
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Active Destination</span>
                      <p className="text-sm font-black text-indigo-950">{student!.careerGoal}</p>
                    </div>
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-2">
                    <p className="text-xs font-bold text-amber-900">Not set yet</p>
                    <p className="text-[11px] text-amber-700">
                      Choose your own career goal to calibrate personalized opportunities.
                    </p>
                    <button
                      onClick={() => setIsGoalModalOpen(true)}
                      className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                    >
                      Set My Career Goal
                    </button>
                  </div>
                )}
              </div>

              {/* Interests (Section 6) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Interests</span>
                  </div>
                  {hasInterests && (
                    <button
                      onClick={() => setIsInterestsModalOpen(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {hasInterests ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {student!.careerInterests.map((interest) => (
                        <span key={interest} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsInterestsModalOpen(true)}
                      className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Manage Interests
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">No interests added yet</p>
                    <p className="text-[11px] text-slate-500">
                      Add domains you want to explore like AI, Web, Systems, or CP.
                    </p>
                    <button
                      onClick={() => setIsInterestsModalOpen(true)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Add Interests
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Foundational Skills Section (Section 1) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Foundational Skills ({student!.skills.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Realistic academic learning & personal practice skills. All editable by you.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setIsSkillModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {student!.skills.map((s) => (
                  <div
                    key={s.name}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#172033]">{s.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                          s.level === 'Intermediate' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-slate-200/80 text-slate-700'
                        }`}>
                          {s.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1.5">
                        <span className="text-slate-400">Evidence: </span>
                        <strong className="text-slate-700">
                          {s.evidence?.[0]?.title || 'Academic Learning'}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-mono text-slate-500">
                        Confidence: <strong className="text-slate-800">{s.confidenceScore}%</strong>
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedSkill(s);
                            setIsSkillModalOpen(true);
                          }}
                          className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                          title="Edit Skill"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(s.name)}
                          className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                          title="Remove Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Academic / Personal Projects Section (Section 2) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                    <span>Academic / Personal Projects ({student!.projects.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hands-on coursework, personal practice, and beginner development projects.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student!.projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-block mb-1">
                            {p.projectType || 'Academic / Personal Project'}
                          </span>
                          <h3 className="font-bold text-sm text-[#172033]">{p.title}</h3>
                          <span className="text-[11px] text-slate-500 font-medium">Role: {p.role || 'Student Developer'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                      {p.keyLearnings && p.keyLearnings.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Key Learnings:
                          </span>
                          <ul className="text-[11px] text-slate-600 space-y-0.5 pl-3 list-disc">
                            {p.keyLearnings.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.outcome && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          Outcome: {p.outcome}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-medium text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        {p.githubUrl ? (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>GitHub: Empty</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Professional Experience Section (Section 3) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Experience</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track future internships, research, freelance, or open-source work.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedExp(null);
                    setIsExpModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Experience</span>
                </button>
              </div>

              {student!.experience && student!.experience.length > 0 ? (
                <div className="space-y-3">
                  {student!.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-[#172033]">{exp.role}</h4>
                          <span className="text-slate-400">at</span>
                          <strong className="text-indigo-700 text-sm">{exp.organization}</strong>
                          {exp.type && (
                            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-semibold text-slate-700">
                              {exp.type}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {exp.startDate} – {exp.endDate}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {exp.skillsUsed.map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded bg-white text-[10px] font-mono text-slate-700 border border-slate-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setSelectedExp(exp);
                            setIsExpModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>Status: No professional experience yet</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    &ldquo;Currently a 2nd-year CSIT student building foundational technical skills through academic learning and personal projects.&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Add future internships, part-time work, research, freelance roles, volunteering, or open-source contributions as you complete them.
                  </p>
                </div>
              )}
            </div>

            {/* 7. Certifications Section (Section 4) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-[#172033] tracking-tight flex items-center space-x-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>Certifications</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verified course completion, industry certs, and formal credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCert(null);
                    setIsCertModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Certification</span>
                </button>
              </div>

              {student!.certifications && student!.certifications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {student!.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-[#172033]">{cert.name}</h4>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setSelectedCert(cert);
                                setIsCertModalOpen(true);
                              }}
                              className="p-1 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-indigo-700 font-semibold mt-0.5">
                          {cert.organization} · {cert.category || 'Technical'}
                        </div>
                        {cert.issueDate && (
                          <div className="text-[11px] text-slate-500 mt-1">
                            Issued: {cert.issueDate} {cert.credentialId && `· ID: ${cert.credentialId}`}
                          </div>
                        )}
                      </div>

                      {cert.credentialUrl && (
                        <div className="pt-2 mt-2 border-t border-slate-200">
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                          >
                            <span>Verify Credential</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-700">No certifications added yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Upload official certifications as you earn them to link verified evidence to your skills.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyDashboard
            onBuildProfile={() => setIsOnboardingOpen(true)}
            onSignIn={() => setIsAuthModalOpen(true)}
            userName={currentUser?.name}
          />
        )}
      </main>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={student}
        currentUser={currentUser}
      />

      <CareerGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={student?.careerGoal || ''}
        onUpdateGoal={handleUpdateGoal}
      />

      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={() => setIsInterestsModalOpen(false)}
        currentInterests={student?.careerInterests || []}
        onSaveInterests={handleSaveInterests}
      />

      <SkillEditModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        skill={selectedSkill}
        onSaveSkill={handleSaveSkill}
        onDeleteSkill={handleDeleteSkill}
      />

      <ProjectEditModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
      />

      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        experience={selectedExp}
        onSaveExperience={handleSaveExperience}
      />

      <CertificationModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certification={selectedCert}
        onSaveCertification={handleSaveCertification}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user: AuthUser) => {
          setCurrentUserState(user);
          const prof = getUserProfile(user.id);
          setStudent(prof);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
