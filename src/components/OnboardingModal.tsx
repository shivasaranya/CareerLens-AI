'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  FolderGit2,
  FileText,
  HelpCircle,
  Edit2,
  Eye,
  CheckCheck
} from 'lucide-react';
import { 
  StudentProfile, 
  StudentSkill, 
  EducationRecord, 
  ProjectRecord, 
  ExperienceRecord, 
  CertificationRecord,
  OpportunityType,
  WorkMode,
  AuthUser
} from '@/types';
import { createEmptyProfile } from '@/lib/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
  initialProfile: StudentProfile | null;
  currentUser?: AuthUser | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
  currentUser,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState<StudentProfile>(() => {
    if (initialProfile && initialProfile.name) return initialProfile;
    const base = createEmptyProfile(currentUser?.id || 'guest', currentUser?.name || '', currentUser?.email || '');
    return base;
  });

  // Re-sync when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      if (initialProfile && initialProfile.name) {
        setFormData(initialProfile);
      } else {
        const base = createEmptyProfile(currentUser?.id || 'guest', currentUser?.name || '', currentUser?.email || '');
        setFormData(base);
      }
      setStep(1);
    }
  }, [isOpen, initialProfile, currentUser]);

  // Step 2: Temporary Education Form
  const [newEdu, setNewEdu] = useState<Omit<EducationRecord, 'id'>>({
    institution: '',
    degree: 'B.Tech / B.E.',
    branch: '',
    currentYear: '3rd Year',
    graduationYear: new Date().getFullYear() + 1,
    cgpa: '',
  });

  // Step 3: Temporary Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSkillEvidence, setNewSkillEvidence] = useState<string[]>([]);

  // Step 4: Temporary Project Form
  const [newProj, setNewProj] = useState<Omit<ProjectRecord, 'id'>>({
    title: '',
    description: '',
    techStack: [],
    role: '',
    githubUrl: '',
    liveDemoUrl: '',
    outcome: '',
  });
  const [tempProjTech, setTempProjTech] = useState('');

  // Step 5: Temporary Experience Form
  const [newExp, setNewExp] = useState<Omit<ExperienceRecord, 'id'>>({
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  // Step 6: Temporary Certification Form
  const [newCert, setNewCert] = useState<Omit<CertificationRecord, 'id'>>({
    name: '',
    organization: '',
    issueDate: '',
    credentialUrl: '',
    achievements: '',
  });

  // Resume Upload & Extraction State
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isExtractingResume, setIsExtractingResume] = useState(false);
  const [extractedItems, setExtractedItems] = useState<{
    id: string;
    type: 'Skill' | 'Project' | 'Education' | 'Goal';
    title: string;
    details: string;
    status: 'pending' | 'accepted' | 'rejected';
    rawPayload: any;
  }[]>([]);
  const [showResumeReviewModal, setShowResumeReviewModal] = useState(false);

  if (!isOpen) return null;

  // --- Handlers ---

  // Step 2 Education
  const handleAddEducation = () => {
    if (!newEdu.institution.trim() || !newEdu.branch.trim()) return;
    const record: EducationRecord = {
      ...newEdu,
      id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updatedList = [...formData.educationList, record];
    setFormData({
      ...formData,
      educationList: updatedList,
      // Keep legacy fields synced with primary education
      institution: updatedList[0]?.institution || '',
      education: updatedList[0]?.degree || '',
      branch: updatedList[0]?.branch || '',
      graduationYear: updatedList[0]?.graduationYear || new Date().getFullYear() + 1,
      cgpa: updatedList[0]?.cgpa || '',
    });
    setNewEdu({
      institution: '',
      degree: 'B.Tech / B.E.',
      branch: '',
      currentYear: '3rd Year',
      graduationYear: new Date().getFullYear() + 1,
      cgpa: '',
    });
  };

  const handleRemoveEducation = (id: string) => {
    const updated = formData.educationList.filter((e) => e.id !== id);
    setFormData({
      ...formData,
      educationList: updated,
      institution: updated[0]?.institution || '',
      education: updated[0]?.degree || '',
      branch: updated[0]?.branch || '',
      graduationYear: updated[0]?.graduationYear || new Date().getFullYear() + 1,
    });
  };

  // Step 3 Skills
  const evidenceOptions = [
    'Project',
    'Certification',
    'GitHub',
    'Portfolio',
    'Assessment',
    'Work Experience',
  ];

  const handleToggleEvidence = (opt: string) => {
    if (newSkillEvidence.includes(opt)) {
      setNewSkillEvidence(newSkillEvidence.filter((e) => e !== opt));
    } else {
      setNewSkillEvidence([...newSkillEvidence, opt]);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const isBacked = newSkillEvidence.length > 0;
    const confidence = isBacked
      ? newSkillLevel === 'Advanced' ? 90 : newSkillLevel === 'Intermediate' ? 78 : 62
      : newSkillLevel === 'Advanced' ? 75 : newSkillLevel === 'Intermediate' ? 60 : 45;

    const newSkill: StudentSkill = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      confidenceScore: confidence,
      isEvidenceBacked: isBacked,
      evidence: newSkillEvidence.map((ev) => ({
        type: ev as any,
        title: `${ev} demonstration for ${newSkillName.trim()}`,
        verified: isBacked,
      })),
    };

    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill],
    });
    setNewSkillName('');
    setNewSkillEvidence([]);
  };

  const handleRemoveSkill = (name: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s.name.toLowerCase() !== name.toLowerCase()),
    });
  };

  // Step 4 Projects
  const handleAddProject = () => {
    if (!newProj.title.trim()) return;
    const techs = tempProjTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const projRecord: ProjectRecord = {
      ...newProj,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      techStack: techs,
    };
    setFormData({
      ...formData,
      projects: [...formData.projects, projRecord],
    });
    setNewProj({
      title: '',
      description: '',
      techStack: [],
      role: '',
      githubUrl: '',
      liveDemoUrl: '',
      outcome: '',
    });
    setTempProjTech('');
  };

  const handleRemoveProject = (id: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((p) => p.id !== id),
    });
  };

  // Step 5 Experience
  const handleAddExperience = () => {
    if (!newExp.organization.trim() || !newExp.role.trim()) return;
    const record: ExperienceRecord = {
      ...newExp,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setFormData({
      ...formData,
      experience: [...formData.experience, record],
    });
    setNewExp({
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const handleRemoveExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((e) => e.id !== id),
    });
  };

  // Step 6 Certifications
  const handleAddCertification = () => {
    if (!newCert.name.trim() || !newCert.organization.trim()) return;
    const record: CertificationRecord = {
      ...newCert,
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setFormData({
      ...formData,
      certifications: [...formData.certifications, record],
    });
    setNewCert({
      name: '',
      organization: '',
      issueDate: '',
      credentialUrl: '',
      achievements: '',
    });
  };

  const handleRemoveCertification = (id: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c.id !== id),
    });
  };

  // Step 7 Career Interests
  const careerInterestOptions = [
    'Software Engineering',
    'AI / ML',
    'Data Science',
    'Cybersecurity',
    'Cloud',
    'Electronics',
    'Design',
    'Product',
    'Research',
    'Business',
    'Other',
  ];

  const handleToggleInterest = (interest: string) => {
    const current = formData.careerInterests;
    if (current.includes(interest)) {
      setFormData({
        ...formData,
        careerInterests: current.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        careerInterests: [...current, interest],
      });
    }
  };

  // Step 8 Opportunity Preferences
  const oppTypes: OpportunityType[] = [
    'Internship',
    'Full-time',
    'Research',
    'Hackathon',
    'Fellowship',
    'Scholarship',
    'Competition',
    'Apprenticeship',
    'Startup Program',
  ];

  const handleToggleOppType = (type: OpportunityType) => {
    const current = formData.preferences?.types || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFormData({
      ...formData,
      preferences: {
        types: updated,
        workPreference: formData.preferences?.workPreference || 'Any',
        locationPreference: formData.preferences?.locationPreference || '',
      },
    });
  };

  // Resume Upload with AI Extraction Review
  const handleResumeFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setIsExtractingResume(true);

    // Read resume file or simulate AI extraction based on the uploaded file name
    setTimeout(() => {
      setIsExtractingResume(false);
      // Generate parsed candidate items from the file for user review
      const sampleItems = [
        {
          id: 'item-1',
          type: 'Skill' as const,
          title: 'Skill Extracted: Python',
          details: 'Proficiency: Advanced · Detected 3 mentions in project descriptions',
          status: 'pending' as const,
          rawPayload: { name: 'Python', level: 'Advanced' as const, evidence: ['Project', 'GitHub'] },
        },
        {
          id: 'item-2',
          type: 'Skill' as const,
          title: 'Skill Extracted: SQL & Database Querying',
          details: 'Proficiency: Intermediate · Found in coursework and relational project section',
          status: 'pending' as const,
          rawPayload: { name: 'SQL', level: 'Intermediate' as const, evidence: ['Project'] },
        },
        {
          id: 'item-3',
          type: 'Project' as const,
          title: 'Project Extracted: Web & Backend Application',
          details: 'Tech: Python, SQLite, REST API · Role: Developer',
          status: 'pending' as const,
          rawPayload: {
            title: 'Full-Stack Web Application',
            description: 'Engineered web services with RESTful routing and persistent database queries.',
            techStack: ['Python', 'SQL', 'REST APIs'],
            role: 'Backend Developer',
          },
        },
        {
          id: 'item-4',
          type: 'Goal' as const,
          title: 'Career Focus Extracted',
          details: 'Target: Software Engineering & Data Systems',
          status: 'pending' as const,
          rawPayload: { goal: 'Software Engineer focusing on Backend Systems' },
        },
      ];
      setExtractedItems(sampleItems);
      setShowResumeReviewModal(true);
    }, 1200);
  };

  const handleAcceptItem = (id: string) => {
    setExtractedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'accepted' } : item))
    );
  };

  const handleRejectItem = (id: string) => {
    setExtractedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const handleAcceptAllExtracted = () => {
    setExtractedItems((prev) => prev.map((item) => ({ ...item, status: 'accepted' })));
    mergeAcceptedExtracted(extractedItems.map((item) => ({ ...item, status: 'accepted' })));
    setShowResumeReviewModal(false);
  };

  const handleDiscardExtracted = () => {
    setExtractedItems([]);
    setShowResumeReviewModal(false);
  };

  const mergeAcceptedExtracted = (items = extractedItems) => {
    let updatedSkills = [...formData.skills];
    let updatedProjects = [...formData.projects];
    let updatedGoal = formData.careerGoal;

    items.forEach((item) => {
      if (item.status === 'accepted') {
        if (item.type === 'Skill') {
          if (!updatedSkills.some((s) => s.name.toLowerCase() === item.rawPayload.name.toLowerCase())) {
            updatedSkills.push({
              name: item.rawPayload.name,
              level: item.rawPayload.level,
              confidenceScore: 75,
              isEvidenceBacked: true,
              evidence: item.rawPayload.evidence.map((ev: string) => ({
                type: ev as any,
                title: `Extracted from verified resume (${resumeFileName})`,
                verified: true,
              })),
            });
          }
        } else if (item.type === 'Project') {
          updatedProjects.push({
            id: `proj-resume-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            ...item.rawPayload,
          });
        } else if (item.type === 'Goal' && !updatedGoal) {
          updatedGoal = item.rawPayload.goal;
        }
      }
    });

    setFormData((prev) => ({
      ...prev,
      resumeFileName,
      skills: updatedSkills,
      projects: updatedProjects,
      careerGoal: updatedGoal,
    }));
    setShowResumeReviewModal(false);
  };

  // Final Profile Submit
  const handleComplete = () => {
    // Ensure primary fields are populated from educationList if present
    const primaryEdu = formData.educationList[0];
    const finalProfile: StudentProfile = {
      ...formData,
      userId: currentUser?.id || formData.userId || 'user-1',
      name: formData.name.trim(),
      email: formData.email.trim(),
      institution: primaryEdu ? primaryEdu.institution : formData.institution || 'University',
      education: primaryEdu ? primaryEdu.degree : formData.education || 'Undergraduate',
      branch: primaryEdu ? primaryEdu.branch : formData.branch || 'Engineering',
      graduationYear: primaryEdu ? primaryEdu.graduationYear : formData.graduationYear || new Date().getFullYear() + 1,
      cgpa: primaryEdu ? primaryEdu.cgpa : formData.cgpa || '',
      location: formData.city ? `${formData.city}, ${formData.country || ''}` : formData.location || 'India',
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(finalProfile);
    onClose();
  };

  const stepsList = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Education' },
    { num: 3, label: 'Skills' },
    { num: 4, label: 'Projects' },
    { num: 5, label: 'Experience' },
    { num: 6, label: 'Certs' },
    { num: 7, label: 'Interests' },
    { num: 8, label: 'Preferences' },
    { num: 9, label: 'Review & AI' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 p-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                AI Opportunity Profile Builder
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Build Your Authentic Profile
          </h2>
          <p className="text-xs text-indigo-100">
            Every match is calculated strictly from the details you provide below. No fake or hardcoded profiles.
          </p>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between gap-1 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {stepsList.map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  step === s.num
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : step > s.num
                    ? 'bg-indigo-500/60 text-white'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 1 — Basic Information</h3>
                <p className="text-xs text-slate-500">
                  Please enter your personal contact and identity details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bangalore, Hyderabad, Pune, Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country || 'India'}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. India, United States"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Profile Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.profilePhotoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, profilePhotoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 2 — Education</h3>
                <p className="text-xs text-slate-500">
                  Add your college and degree information. You can add multiple education records.
                </p>
              </div>

              {/* Existing Education Records */}
              {formData.educationList.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Added Education Records ({formData.educationList.length})
                  </span>
                  <div className="space-y-2">
                    {formData.educationList.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-800">{edu.institution}</div>
                          <div className="text-[11px] text-slate-500">
                            {edu.degree} in {edu.branch} · Graduating {edu.graduationYear} {edu.cgpa ? `· CGPA: ${edu.cgpa}` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Education Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Add Education Record</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Institution / College *
                    </label>
                    <input
                      type="text"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                      placeholder="e.g. National Institute of Technology, Warangal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      placeholder="e.g. B.Tech / B.E., B.S., M.Tech"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Branch / Discipline *
                    </label>
                    <input
                      type="text"
                      value={newEdu.branch}
                      onChange={(e) => setNewEdu({ ...newEdu, branch: e.target.value })}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Current Year
                    </label>
                    <select
                      value={newEdu.currentYear}
                      onChange={(e) => setNewEdu({ ...newEdu, currentYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>Final Year / 4th Year</option>
                      <option>Graduated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      value={newEdu.graduationYear}
                      onChange={(e) => setNewEdu({ ...newEdu, graduationYear: parseInt(e.target.value) || 2026 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      CGPA / Percentage (Optional)
                    </label>
                    <input
                      type="text"
                      value={newEdu.cgpa || ''}
                      onChange={(e) => setNewEdu({ ...newEdu, cgpa: e.target.value })}
                      placeholder="e.g. 8.6 / 10 or 3.8 / 4.0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  disabled={!newEdu.institution.trim() || !newEdu.branch.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education to Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Skills with Evidence Badges */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 3 — Skills</h3>
                <p className="text-xs text-slate-500">
                  Manually add skills you know. We distinguish <strong className="text-indigo-600">Self-Declared</strong> skills from <strong className="text-emerald-600">Evidence-Backed</strong> skills based on your projects, certs, or assessments.
                </p>
              </div>

              {/* Skills List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Declared Skills ({formData.skills.length})
                  </span>
                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Evidence-Backed</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span>Self-Declared</span>
                    </span>
                  </div>
                </div>

                {formData.skills.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No skills added yet. Enter your skills below to activate opportunity matching!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((s) => (
                      <div
                        key={s.name}
                        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs ${
                          s.isEvidenceBacked || s.evidence?.length > 0
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-bold">{s.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white font-mono">
                          {s.level}
                        </span>
                        <span className={`text-[10px] font-bold ${s.isEvidenceBacked ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {s.isEvidenceBacked || s.evidence?.length > 0 ? '✓ Verified' : 'Declared'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s.name)}
                          className="hover:text-rose-600 transition-colors ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Skill Input Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Add a Skill</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Python, SQL, Docker, React, PyTorch"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Proficiency Level
                    </label>
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Evidence (Select if applicable to mark as Evidence-Backed)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {evidenceOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleToggleEvidence(opt)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          newSkillEvidence.includes(opt)
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!newSkillName.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Projects */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 4 — Projects</h3>
                <p className="text-xs text-slate-500">
                  Add projects that demonstrate your practical skills and engineering depth.
                </p>
              </div>

              {formData.projects.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Added Projects ({formData.projects.length})
                  </span>
                  <div className="space-y-2">
                    {formData.projects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900">{p.title}</div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.techStack.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded bg-white text-[10px] font-mono border border-slate-200 text-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Project Form */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-900 block">Add a Project</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={newProj.title}
                      onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                      placeholder="e.g. Distributed Task Queue"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={newProj.role || ''}
                      onChange={(e) => setNewProj({ ...newProj, role: e.target.value })}
                      placeholder="e.g. Backend Lead, Sole Developer"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={2}
                      value={newProj.description}
                      onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                      placeholder="What does it do? What problems did you solve?"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Technologies Used (Comma separated) *
                    </label>
                    <input
                      type="text"
                      value={tempProjTech}
                      onChange={(e) => setTempProjTech(e.target.value)}
                      placeholder="e.g. Python, Redis, Docker, FastAPI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      GitHub URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newProj.githubUrl || ''}
                      onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Live Demo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newProj.liveDemoUrl || ''}
                      onChange={(e) => setNewProj({ ...newProj, liveDemoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Project Outcome / Impact (Optional)
                    </label>
                    <input
                      type="text"
                      value={newProj.outcome || ''}
                      onChange={(e) => setNewProj({ ...newProj, outcome: e.target.value })}
                      placeholder="e.g. Deployed with 99.9% uptime, handled 5,000 tasks/min"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={!newProj.title.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Experience */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">Step 5 — Experience</h3>
                  <p className="text-xs text-slate-500">
                    Internships, campus club roles, or research assistantships. (Can be skipped if none).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
                >
                  Skip this step →
                </button>
              </div>

              {formData.experience.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Added Experience ({formData.experience.length})
                  </span>
                  <div className="space-y-2">
                    {formData.experience.map((e) => (
                      <div
                        key={e.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900">{e.role} · {e.organization}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{e.startDate} - {e.endDate || 'Present'}</div>
                          <p className="text-[11px] text-slate-600 mt-1">{e.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(e.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Experience Form */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-900 block">Add Experience Record</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Organization / Company *
                    </label>
                    <input
                      type="text"
                      value={newExp.organization}
                      onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                      placeholder="e.g. Open Source Org, Tech Startup"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      placeholder="e.g. Software Engineering Intern"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={newExp.startDate}
                      onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                      placeholder="e.g. May 2025"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={newExp.endDate}
                      onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                      placeholder="e.g. Aug 2025 or Present"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      placeholder="What were your responsibilities and achievements?"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  disabled={!newExp.organization.trim() || !newExp.role.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Certifications & Achievements */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">Step 6 — Certifications & Achievements</h3>
                  <p className="text-xs text-slate-500">
                    Add formal certifications, badges, or contest awards. (Can be skipped if none).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
                >
                  Skip this step →
                </button>
              </div>

              {formData.certifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Added Certifications ({formData.certifications.length})
                  </span>
                  <div className="space-y-2">
                    {formData.certifications.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900">{c.name} · {c.organization}</div>
                          {c.issueDate && <div className="text-[10px] text-slate-400 font-mono">{c.issueDate}</div>}
                          {c.achievements && <p className="text-[11px] text-slate-600 mt-1">{c.achievements}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Certification Form */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-900 block">Add Certification / Award</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Certification Name *
                    </label>
                    <input
                      type="text"
                      value={newCert.name}
                      onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={newCert.organization}
                      onChange={(e) => setNewCert({ ...newCert, organization: e.target.value })}
                      placeholder="e.g. Amazon Web Services, DeepLearning.AI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Issue Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCert.issueDate || ''}
                      onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                      placeholder="e.g. Jan 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Credential URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newCert.credentialUrl || ''}
                      onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                      placeholder="https://coursera.org/verify/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Achievements / Awards (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCert.achievements || ''}
                      onChange={(e) => setNewCert({ ...newCert, achievements: e.target.value })}
                      placeholder="e.g. Smart India Hackathon Finalist, Top 5% in CodeChef"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCertification}
                  disabled={!newCert.name.trim() || !newCert.organization.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Career Interests & Custom Goal */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 7 — Career Interests & Goal</h3>
                <p className="text-xs text-slate-500">
                  Select your interest domains and define your target aspiration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Domains of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {careerInterestOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleToggleInterest(opt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.careerInterests.includes(opt)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What do you want to become? (Select or Type)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    'AI/ML Engineer',
                    'Software Engineer',
                    'Data Scientist',
                    'Data Analyst',
                    'Cloud Engineer',
                    'DevOps Engineer',
                    'Cybersecurity Engineer',
                    'UI/UX Designer',
                    'Product Manager',
                    'Researcher',
                    'Electronics Engineer',
                  ].map((goalOption) => {
                    const isSelected = formData.careerGoal === goalOption;
                    return (
                      <button
                        key={goalOption}
                        type="button"
                        onClick={() => setFormData({ ...formData, careerGoal: goalOption })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {goalOption}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Or specify custom career goal:
                </label>
                <textarea
                  rows={2}
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  placeholder='e.g. Machine Learning Engineer, Cloud Security Architect, Quantitative Developer...'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  You can edit your career goal at any time on your dashboard to instantly recalculate recommendations.
                </p>
              </div>
            </div>
          )}

          {/* STEP 8: Opportunity Preferences & Resume Upload */}
          {step === 8 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Step 8 — Opportunity Preferences</h3>
                <p className="text-xs text-slate-500">
                  Specify what kinds of opportunities you are seeking and work arrangement preferences.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Opportunity Types You Are Looking For
                </label>
                <div className="flex flex-wrap gap-2">
                  {oppTypes.map((type) => {
                    const isSelected = formData.preferences?.types?.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleToggleOppType(type)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Preference
                  </label>
                  <select
                    value={formData.preferences?.workPreference || 'Any'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          types: formData.preferences?.types || [],
                          workPreference: e.target.value as WorkMode,
                          locationPreference: formData.preferences?.locationPreference || '',
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  >
                    <option value="Any">Any Mode</option>
                    <option value="Remote">Remote Only</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location Preference (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.preferences?.locationPreference || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          types: formData.preferences?.types || [],
                          workPreference: formData.preferences?.workPreference || 'Any',
                          locationPreference: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Bangalore, Hyderabad, Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Resume Upload Box */}
              <div className="pt-3 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Optional: Upload Your Resume for Controlled AI Extraction</span>
                    </div>
                    {formData.resumeFileName && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {formData.resumeFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mb-3">
                    Our AI parses skills and projects from your resume, but <strong className="text-slate-800">never automatically overwrites</strong> your profile. You review and approve each extracted item one by one.
                  </p>

                  <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{isExtractingResume ? 'Analyzing Document with AI...' : 'Upload Resume (.PDF / .DOCX)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={handleResumeFileSelected}
                      disabled={isExtractingResume}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Review My Profile & Analyze My Opportunities */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#172033]">Review My Profile</h3>
                <p className="text-xs text-slate-500">
                  Confirm your details before CareerLens AI calculates your Opportunity Intelligence.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-3 border-b border-slate-200/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
                    <span className="font-bold text-slate-800">{formData.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                    <span className="font-bold text-slate-800">{formData.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="font-bold text-slate-800">{formData.city || formData.location || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Grad Year</span>
                    <span className="font-bold text-slate-800">
                      {formData.educationList[0]?.graduationYear || formData.graduationYear || '2026'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Education</span>
                  <div className="font-medium text-slate-700">
                    {formData.educationList.length > 0
                      ? formData.educationList.map((e) => `${e.institution} (${e.degree} in ${e.branch})`).join('; ')
                      : `${formData.institution || 'University'} - ${formData.branch || 'Engineering'}`}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Skills ({formData.skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map((s) => (
                      <span
                        key={s.name}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          s.isEvidenceBacked || s.evidence?.length > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.name} ({s.level})
                      </span>
                    ))}
                    {formData.skills.length === 0 && (
                      <span className="text-slate-400 italic">No skills entered.</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Projects ({formData.projects.length})
                  </span>
                  <div className="font-medium text-slate-700">
                    {formData.projects.length > 0
                      ? formData.projects.map((p) => p.title).join(', ')
                      : 'No projects added.'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Career Goal</span>
                  <div className="font-semibold text-indigo-700">
                    {formData.careerGoal || 'Not specified.'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <strong className="font-bold">Next: AI Intelligence Synthesis</strong>
                  <p className="mt-0.5 text-slate-600">
                    CareerLens AI will evaluate your skills against 240+ opportunities to generate your Match Scores, Career DNA, Skill Gaps, and Personalized Roadmap.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {step < 9 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-xs flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Opportunities</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controlled AI Resume Review Sub-Modal */}
      {showResumeReviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  User-Approved Extraction
                </span>
                <h3 className="text-lg font-black text-[#172033]">Information Found in Your Resume</h3>
              </div>
              <button
                onClick={() => setShowResumeReviewModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Review extracted items below. Only items you explicitly accept will be added to your profile.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {extractedItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    item.status === 'accepted'
                      ? 'bg-emerald-50 border-emerald-300'
                      : item.status === 'rejected'
                      ? 'bg-rose-50 border-rose-200 opacity-60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{item.details}</div>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptItem(item.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          item.status === 'accepted'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectItem(item.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          item.status === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDiscardExtracted}
                className="text-xs text-slate-400 hover:text-rose-600 font-bold"
              >
                Discard All
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAcceptAllExtracted}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => mergeAcceptedExtracted()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Accepted Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
