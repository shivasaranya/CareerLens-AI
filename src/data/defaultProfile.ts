import { StudentProfile } from '@/types';

// Starter Profile for Shiva Saranya (2nd-Year CSIT Student at SRKR Engineering College)
// Clean academic & personal starter data only. Zero fake internships, zero fake certs, zero fake employers.
export const SHIVA_SARANYA_STARTER_PROFILE: StudentProfile = {
  id: 'profile-shiva-saranya',
  userId: 'user-shiva-saranya',
  name: 'Shiva Saranya',
  email: 'shivasaranya@example.com',
  phone: '',
  city: 'Bhimavaram',
  country: 'India',
  profilePhotoUrl: '',
  educationList: [
    {
      id: 'edu-srkr-1',
      institution: 'SRKR Engineering College',
      degree: 'B.Tech',
      branch: 'CSIT',
      currentYear: '2nd Year',
      graduationYear: 2028,
    },
  ],
  education: 'B.Tech',
  institution: 'SRKR Engineering College',
  branch: 'CSIT',
  graduationYear: 2028,
  cgpa: '',
  location: 'Bhimavaram, Andhra Pradesh',
  careerInterests: [], // UNSET - User must choose or enter
  careerGoal: '', // UNSET - User must choose or enter
  skills: [
    {
      name: 'Python',
      level: 'Beginner',
      confidenceScore: 45,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'Java',
      level: 'Beginner',
      confidenceScore: 40,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'C Programming',
      level: 'Intermediate',
      confidenceScore: 65,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'HTML',
      level: 'Beginner',
      confidenceScore: 50,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning / Personal Practice', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'CSS',
      level: 'Beginner',
      confidenceScore: 45,
      evidence: [
        { type: 'Self-Declared', title: 'Personal Practice', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'JavaScript',
      level: 'Beginner',
      confidenceScore: 40,
      evidence: [
        { type: 'Self-Declared', title: 'Personal Practice', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'SQL',
      level: 'Beginner',
      confidenceScore: 45,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'Git & GitHub',
      level: 'Beginner',
      confidenceScore: 40,
      evidence: [
        { type: 'Self-Declared', title: 'Personal Practice', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'Problem Solving',
      level: 'Beginner',
      confidenceScore: 50,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
    {
      name: 'Data Structures',
      level: 'Beginner',
      confidenceScore: 45,
      evidence: [
        { type: 'Self-Declared', title: 'Academic Learning', verified: false },
      ],
      isEvidenceBacked: false,
    },
  ],
  projects: [
    {
      id: 'proj-task-mgr',
      title: 'Student Task Manager',
      projectType: 'Academic / Personal Project',
      description: 'A simple web-based task management application that allows students to create, update, complete, and organize their daily academic tasks.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      role: 'Student Developer',
      keyLearnings: [
        'Basic frontend development',
        'JavaScript programming',
        'DOM manipulation',
        'User interface design',
        'CRUD-style task management',
      ],
      outcome: 'Built as a learning project to understand the fundamentals of web development and interactive user interfaces.',
      githubUrl: '',
      liveDemoUrl: '',
    },
    {
      id: 'proj-result-analyzer',
      title: 'Student Result Analyzer',
      projectType: 'Academic / Personal Project',
      description: 'A small application that accepts subject marks and calculates total marks, average, percentage, and basic performance categories.',
      techStack: ['Python'],
      role: 'Student Developer',
      keyLearnings: [
        'Python fundamentals',
        'Conditional statements',
        'Functions',
        'Lists/data handling',
        'Basic problem solving',
      ],
      outcome: 'Created as a beginner programming project for practicing Python and basic data processing.',
      githubUrl: '',
      liveDemoUrl: '',
    },
    {
      id: 'proj-event-reg',
      title: 'College Event Registration Page',
      projectType: 'Academic / Personal Project',
      description: 'A responsive web page concept for displaying college events and collecting basic student registration information.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      role: 'Student Developer',
      keyLearnings: [
        'Forms',
        'Responsive UI',
        'Frontend validation',
        'Basic JavaScript',
        'Web page structure',
      ],
      outcome: 'Created as a personal learning project to practice frontend development and form handling.',
      githubUrl: '',
      liveDemoUrl: '',
    },
  ],
  experience: [], // ZERO fake employment/internships.
  certifications: [], // ZERO fake certificates.
  preferences: {
    types: ['Internship', 'Full-time', 'Hackathon'],
    workPreference: 'Any',
    locationPreference: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Empty template
export const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: '',
  userId: '',
  name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  profilePhotoUrl: '',
  educationList: [],
  education: '',
  institution: '',
  branch: '',
  graduationYear: 2028,
  cgpa: '',
  location: '',
  careerInterests: [],
  careerGoal: '',
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  preferences: {
    types: ['Internship', 'Full-time'],
    workPreference: 'Any',
    locationPreference: '',
  },
  createdAt: '',
  updatedAt: '',
};

export const DEFAULT_STUDENT_PROFILE = SHIVA_SARANYA_STARTER_PROFILE;
