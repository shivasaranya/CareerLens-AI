export type OpportunityType = 
  | 'Internship'
  | 'Full-time'
  | 'Research'
  | 'Fellowship'
  | 'Scholarship'
  | 'Hackathon'
  | 'Competition'
  | 'Apprenticeship'
  | 'Startup Program';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Any';

export type VerificationStatus = 'Verified' | 'Needs Verification' | 'High Risk';

export type MatchCategory = 'Apply Now' | 'Strong Match' | 'Near-Fit' | 'Future';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SkillEvidence {
  type: 'Project' | 'Certification' | 'GitHub' | 'Portfolio' | 'Assessment' | 'Work Experience' | 'Self-Declared';
  title: string;
  url?: string;
  verified: boolean;
}

export interface StudentSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  confidenceScore: number; // 0 - 100
  evidence: SkillEvidence[];
  isEvidenceBacked?: boolean;
}

export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  branch: string;
  currentYear?: string;
  graduationYear: number;
  cgpa?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  role?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  outcome?: string;
}

export interface ExperienceRecord {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CertificationRecord {
  id: string;
  name: string;
  organization: string;
  issueDate?: string;
  credentialUrl?: string;
  achievements?: string;
}

export interface OpportunityPreferences {
  types: OpportunityType[];
  workPreference: WorkMode;
  locationPreference: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  profilePhotoUrl?: string;
  
  educationList: EducationRecord[];
  education: string; // Primary degree summary
  institution: string;
  branch: string;
  graduationYear: number;
  cgpa?: string;

  location: string;
  careerInterests: string[];
  careerGoal: string;

  skills: StudentSkill[];
  projects: ProjectRecord[];
  experience: ExperienceRecord[];
  certifications: CertificationRecord[];
  preferences?: OpportunityPreferences;

  resumeText?: string;
  resumeFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityVerification {
  status: VerificationStatus;
  trustScore: number; // 0 - 100
  factors: {
    sourceCredibility: 'High' | 'Medium' | 'Low';
    activeDeadline: boolean;
    organizationVerified: boolean;
    validApplicationUrl: boolean;
    postingFreshnessDays: number;
    suspiciousRequirementsFlag: boolean;
    duplicateDetected: boolean;
  };
  notes: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  logoUrl?: string;
  type: OpportunityType;
  location: string;
  workMode: WorkMode;
  stipendOrSalary?: string;
  deadline: string; // ISO date
  daysRemaining: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  eligibleBranches: string[];
  eligibleGradYears: number[];
  minGpaOrCriteria?: string;
  verification: OpportunityVerification;
  applicationUrl: string;
  featured?: boolean;
}

export interface MatchBreakdown {
  skillsScore: number; // 0 - 100
  educationScore: number;
  projectsScore: number;
  experienceScore: number;
  careerInterestScore: number;
  eligibilityScore: number;
}

export interface MatchResult {
  opportunity: Opportunity;
  overallMatchScore: number; // 0 - 100
  potentialMatchScore: number; // 0 - 100
  category: MatchCategory;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  partialSkills: { skill: string; reason: string }[];
  missingSkills: string[];
  aiExplanation: string;
  whyNot100Explanation: string;
  fastestImprovementTip: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'Critical Gap' | 'Competitive Gap' | 'Future Gap';
  description: string;
  relevanceCount: number;
  unlockPotentialCount: number;
  estimatedLearningDays: number;
}

export interface RoadmapStep {
  dayRange: string;
  title: string;
  learningGoal: string;
  practicalTask: string;
  estimatedEffortHours: number;
  evidenceToProduce: string;
  resources: string[];
}

export interface OpportunityRoadmap {
  opportunityId: string;
  opportunityTitle: string;
  currentMatch: number;
  targetMatch: number;
  totalDays: number;
  steps: RoadmapStep[];
}

export interface SkillGrowthMetric {
  factor: string;
  before: number;
  after: number;
  growth: number;
  unit?: string;
  description: string;
}

export interface WhatIfSimulationResult {
  simulatedSkillOrGoal: string;
  currentRelevantCount: number;
  simulatedRelevantCount: number;
  unlockedCount: number;
  newRolesUnlocked: string[];
  improvedOpportunities: {
    opportunityId: string;
    title: string;
    organization: string;
    oldScore: number;
    newScore: number;
    newCategory: MatchCategory;
    reason?: string;
  }[];
  remainingGaps: string[];
  skillGrowthMetrics: SkillGrowthMetric[];
  simulatedSkillsAdded: string[];
}

export interface ApplicationTrackerItem {
  id: string;
  userId: string;
  opportunityId: string;
  title: string;
  organization: string;
  appliedDate: string;
  status: 'Drafting' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  notes: string;
}
