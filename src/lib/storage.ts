import { StudentProfile, Opportunity, ApplicationTrackerItem, AuthUser } from '@/types';
import { SEED_OPPORTUNITIES } from '@/data/opportunities';

const USERS_KEY = 'careerlens_users_v2';
const CURRENT_USER_KEY = 'careerlens_current_user_v2';
const OPPORTUNITIES_KEY = 'careerlens_opportunities_v2';

export function createEmptyProfile(userId: string, name: string = '', email: string = ''): StudentProfile {
  return {
    id: `profile-${userId}`,
    userId,
    name,
    email,
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// User accounts management
export function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users', e);
  }
  return [];
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load current user', e);
  }
  return null;
}

export function setCurrentUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

export function registerUser(name: string, email: string): AuthUser {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    setCurrentUser(existing);
    return existing;
  }
  const newUser: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setCurrentUser(newUser);
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }
  return newUser;
}

export function loginUser(email: string): AuthUser | null {
  const users = getUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (found) {
    setCurrentUser(found);
    return found;
  }
  return null;
}

export function signOut(): void {
  setCurrentUser(null);
}

// User profile management (isolated per userId)
export function getUserProfile(userId: string): StudentProfile | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(`careerlens_profile_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user profile', e);
  }
  return null;
}

export function saveUserProfile(userId: string, profile: StudentProfile): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.setItem(`careerlens_profile_${userId}`, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

// User applications management (isolated per userId)
export function getUserApplications(userId: string): ApplicationTrackerItem[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw = localStorage.getItem(`careerlens_apps_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user applications', e);
  }
  return [];
}

export function saveUserApplications(userId: string, apps: ApplicationTrackerItem[]): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.setItem(`careerlens_apps_${userId}`, JSON.stringify(apps));
  } catch (e) {
    console.error('Failed to save applications', e);
  }
}

// Opportunities catalogue management
export function getStoredOpportunities(): Opportunity[] {
  if (typeof window === 'undefined') return SEED_OPPORTUNITIES;
  try {
    const raw = localStorage.getItem(OPPORTUNITIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read opportunities from localStorage', e);
  }
  return SEED_OPPORTUNITIES;
}

export function saveStoredOpportunities(opps: Opportunity[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opps));
  } catch (e) {
    console.error('Failed to save opportunities', e);
  }
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  const current = getCurrentUser();
  if (current) {
    localStorage.removeItem(`careerlens_profile_${current.id}`);
    localStorage.removeItem(`careerlens_apps_${current.id}`);
  }
  localStorage.removeItem(CURRENT_USER_KEY);
}
