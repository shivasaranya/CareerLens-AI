import { StudentProfile } from '@/types';

// Empty unpopulated template - No hardcoded student personal info or fake data
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
  graduationYear: new Date().getFullYear() + 1,
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

// Backwards-compatible export for any file still referencing DEFAULT_STUDENT_PROFILE
export const DEFAULT_STUDENT_PROFILE = EMPTY_STUDENT_PROFILE;
