import { Opportunity, StudentProfile, MatchResult, MatchBreakdown, MatchCategory } from '@/types';

// Canonical Skill Normalization Taxonomy
const CANONICAL_SKILL_MAP: Record<string, string> = {
  'python 3': 'Python',
  'python programming': 'Python',
  'py': 'Python',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud',
  'google cloud platform': 'Google Cloud',
  'azure': 'Microsoft Azure',
  'k8s': 'Kubernetes',
  'docker': 'Docker',
  'containerization': 'Docker',
  'containers': 'Docker',
  'ci/cd': 'CI/CD',
  'continuous integration': 'CI/CD',
  'sql': 'SQL',
  'mysql': 'SQL',
  'postgresql': 'SQL',
  'postgres': 'SQL',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'golang': 'Go',
  'go': 'Go',
  'c++': 'C++',
  'cpp': 'C++',
  'dsa': 'Data Structures & Algorithms',
  'data structures': 'Data Structures & Algorithms',
  'algorithms': 'Data Structures & Algorithms',
  'data structures & algorithms': 'Data Structures & Algorithms',
  'rest': 'REST APIs',
  'restful apis': 'REST APIs',
  'rest apis': 'REST APIs',
  'cyber security': 'Cybersecurity',
  'infosec': 'Cybersecurity',
};

function canonicalizeSkill(skill: string): string {
  const norm = skill.trim().toLowerCase();
  return CANONICAL_SKILL_MAP[norm] || skill.trim();
}

function findStudentSkill(reqSkill: string, studentSkills: StudentProfile['skills']): StudentProfile['skills'][0] | undefined {
  const canonReq = canonicalizeSkill(reqSkill).toLowerCase();
  const rawReq = reqSkill.trim().toLowerCase();

  // 1. Exact or canonical match
  const exact = studentSkills.find((s) => {
    const sCanon = canonicalizeSkill(s.name).toLowerCase();
    const sRaw = s.name.trim().toLowerCase();
    return sCanon === canonReq || sRaw === rawReq || sCanon === rawReq || sRaw === canonReq;
  });
  if (exact) return exact;

  // 2. Semantic aliases
  const aliases: Record<string, string[]> = {
    'docker': ['containerization', 'containers', 'docker compose', 'devops', 'kubernetes'],
    'aws': ['cloud', 'amazon web services', 'cloud architecture', 'devops'],
    'kubernetes': ['k8s', 'cluster ops', 'container orchestration', 'docker'],
    'pytorch': ['deep learning', 'machine learning', 'neural networks', 'ai'],
    'deep learning': ['pytorch', 'neural networks', 'machine learning', 'tensorflow'],
    'machine learning': ['ai', 'deep learning', 'pytorch', 'data science', 'ml'],
    'rest apis': ['apis', 'microservices', 'backend', 'rest', 'endpoints'],
    'ci/cd': ['devops', 'pipelines', 'github actions', 'docker'],
    'data structures & algorithms': ['dsa', 'algorithms', 'problem solving', 'competitive programming'],
  };

  const matched = studentSkills.find((s) => {
    const sNorm = s.name.trim().toLowerCase();
    const reqAliases = aliases[rawReq] || aliases[canonReq] || [];
    if (reqAliases.some((a) => sNorm.includes(a) || a.includes(sNorm))) return true;

    const sAliases = aliases[sNorm] || [];
    if (sAliases.some((a) => rawReq.includes(a) || a.includes(rawReq))) return true;

    return false;
  });

  return matched;
}

export function evaluateMatch(opportunity: Opportunity, student: StudentProfile): MatchResult {
  // If student profile has no skills or career goal, return unanalyzed state
  const hasBasicProfile = Boolean(student && student.name && student.name.trim().length > 0);
  if (!hasBasicProfile) {
    return {
      opportunity,
      overallMatchScore: 0,
      potentialMatchScore: 0,
      category: 'Future',
      breakdown: {
        skillsScore: 0,
        eligibilityScore: 0,
        careerGoalScore: 0,
        projectsScore: 0,
        preferencesScore: 0,
        educationScore: 0,
        experienceScore: 0,
        careerInterestScore: 0,
      },
      matchedSkills: [],
      partialSkills: [],
      missingSkills: opportunity.requiredSkills,
      aiExplanation: 'Create your profile to see your personalized AI-estimated match.',
      whyNot100Explanation: 'Profile not yet created.',
      fastestImprovementTip: 'Complete your profile with education, career goal, and verified skills.',
      eligibilityIssue: null,
      readinessChecklist: [],
    };
  }

  // ==========================================
  // 1. HARD & SOFT ELIGIBILITY CHECKING (25%)
  // ==========================================
  let eligibilityScore = 100;
  let eligibilityIssue: string | null = null;

  // A. Graduation Year check
  const matchesGradYear =
    opportunity.eligibleGradYears.length === 0 ||
    opportunity.eligibleGradYears.includes(student.graduationYear);

  if (!matchesGradYear) {
    eligibilityScore -= 35;
    eligibilityIssue = `Graduation Year: Target cohorts are ${opportunity.eligibleGradYears.join(', ')} (Profile specifies ${student.graduationYear})`;
  }

  // B. Branch check
  const matchesBranch = opportunity.eligibleBranches.some(
    (b) =>
      b.toLowerCase().includes('all') ||
      student.branch.toLowerCase().includes(b.toLowerCase()) ||
      b.toLowerCase().includes(student.branch.toLowerCase())
  );

  if (!matchesBranch) {
    eligibilityScore -= 25;
    if (!eligibilityIssue) {
      eligibilityIssue = `Branch criteria: Requires degrees in ${opportunity.eligibleBranches.slice(0, 2).join(', ')}`;
    }
  }

  // C. Experience level check (Hard criteria)
  const expLevel = opportunity.experienceLevel || 'Fresher';
  const studentExpYears = student.experience.length; // rough estimate based on entry count
  if ((expLevel === '2–5 years' || expLevel === '5+ years') && studentExpYears === 0) {
    eligibilityScore -= 45;
    eligibilityIssue = `Experience Requirement: Role requires ${expLevel} professional experience; profile is currently entry-level/fresher.`;
  }

  eligibilityScore = Math.max(15, Math.min(100, eligibilityScore));

  // ==========================================
  // 2. SKILL MATCHING (35%)
  // ==========================================
  const matchedSkills: string[] = [];
  const partialSkills: { skill: string; reason: string }[] = [];
  const missingSkills: string[] = [];

  let requiredSkillPoints = 0;
  const totalRequiredSkills = opportunity.requiredSkills.length || 1;

  opportunity.requiredSkills.forEach((reqSkill) => {
    const found = findStudentSkill(reqSkill, student.skills);

    if (found) {
      const hasEvidence = Boolean(found.evidence && found.evidence.length > 0);
      if (found.level === 'Advanced' || found.confidenceScore >= 80) {
        matchedSkills.push(reqSkill);
        requiredSkillPoints += hasEvidence ? 1.0 : 0.95;
      } else if (found.level === 'Intermediate' || found.confidenceScore >= 60) {
        matchedSkills.push(reqSkill);
        requiredSkillPoints += hasEvidence ? 0.85 : 0.75;
      } else {
        partialSkills.push({
          skill: reqSkill,
          reason: `Beginner proficiency (${found.confidenceScore}% confidence)${hasEvidence ? ' with evidence' : ''}`,
        });
        requiredSkillPoints += 0.5;
      }
    } else {
      // Check partial match in project tech stack
      const norm = reqSkill.toLowerCase();
      const inProject = student.projects.some((p) =>
        p.techStack.some((ts) => ts.toLowerCase() === norm || norm.includes(ts.toLowerCase()) || ts.toLowerCase().includes(norm))
      );
      if (inProject) {
        partialSkills.push({ skill: reqSkill, reason: 'Applied in project portfolio, but not formally added to verified skill inventory' });
        requiredSkillPoints += 0.55;
      } else {
        missingSkills.push(reqSkill);
      }
    }
  });

  // Preferred skills bonus (up to 10 extra points)
  let preferredBonus = 0;
  opportunity.preferredSkills.forEach((prefSkill) => {
    const found = findStudentSkill(prefSkill, student.skills);
    if (found) {
      matchedSkills.push(`${prefSkill} (Bonus)`);
      preferredBonus += 3.5;
    } else if (!missingSkills.includes(prefSkill)) {
      missingSkills.push(prefSkill);
    }
  });

  const skillsScore = Math.min(100, Math.round((requiredSkillPoints / totalRequiredSkills) * 92 + preferredBonus));

  // ==========================================
  // 3. CAREER GOAL ALIGNMENT (20%)
  // ==========================================
  let careerGoalScore = 55;
  const goalLower = (student.careerGoal || '').toLowerCase().trim();
  const titleLower = opportunity.title.toLowerCase();
  const descLower = opportunity.description.toLowerCase();
  const orgLower = opportunity.organization.toLowerCase();

  if (goalLower) {
    // Goal dictionary & keywords
    const goalKeywords: Record<string, string[]> = {
      'machine learning engineer': ['machine learning', 'ml', 'ai', 'deep learning', 'pytorch', 'model', 'neural', 'vision', 'nlp'],
      'ai/ml engineer': ['machine learning', 'ml', 'ai', 'deep learning', 'pytorch', 'model', 'copilot', 'llm'],
      'ai engineer': ['ai', 'artificial intelligence', 'machine learning', 'llm', 'deep learning', 'copilot', 'openai'],
      'cloud engineer': ['cloud', 'aws', 'azure', 'devops', 'kubernetes', 'docker', 'infrastructure', 'sre', 'linux'],
      'devops engineer': ['devops', 'ci/cd', 'kubernetes', 'docker', 'infrastructure', 'cloud', 'sre', 'terraform', 'linux'],
      'software engineer': ['software engineer', 'software development', 'swe', 'backend', 'full stack', 'algorithms', 'developer', 'distributed'],
      'backend engineer': ['backend', 'distributed systems', 'api', 'go', 'java', 'sql', 'microservices', 'database', 'server'],
      'frontend developer': ['frontend', 'react', 'ui', 'ux', 'web', 'javascript', 'typescript', 'nextjs', 'css'],
      'data scientist': ['data science', 'data scientist', 'statistics', 'analytics', 'python', 'machine learning', 'data analysis'],
      'data analyst': ['data analyst', 'analytics', 'sql', 'bi', 'tableau', 'data analysis', 'visualization'],
      'cybersecurity engineer': ['cybersecurity', 'security', 'network', 'firewall', 'threat', 'infosec', 'wireshark', 'defense'],
      'researcher': ['research', 'laboratory', 'paper', 'academic', 'cern', 'fellowship', 'investigation', 'residency'],
    };

    let matchedKeywords = 0;
    const targetKeywords = goalKeywords[goalLower] || [goalLower];

    targetKeywords.forEach((kw) => {
      if (titleLower.includes(kw) || descLower.includes(kw) || orgLower.includes(kw)) {
        matchedKeywords++;
      }
    });

    if (titleLower.includes(goalLower) || (goalLower.includes('cloud') && (titleLower.includes('cloud') || titleLower.includes('devops')))) {
      careerGoalScore = 98;
    } else if (matchedKeywords >= 3) {
      careerGoalScore = 92;
    } else if (matchedKeywords >= 2) {
      careerGoalScore = 80;
    } else if (matchedKeywords === 1) {
      careerGoalScore = 65;
    } else {
      careerGoalScore = 40; // Divergent goal
    }
  }

  // ==========================================
  // 4. PROJECT & EVIDENCE RELEVANCE (10%)
  // ==========================================
  let projectsScore = 45;
  const relevantProjects = student.projects.filter((p) =>
    p.techStack.some((ts) =>
      opportunity.requiredSkills.some((rs) => rs.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(rs.toLowerCase())) ||
      opportunity.preferredSkills.some((ps) => ps.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(ps.toLowerCase()))
    )
  );

  const certificatesCount = student.certifications.length;
  const hasGitHubEvidence = student.skills.some((s) => s.evidence.some((e) => e.type === 'GitHub' || e.type === 'Project'));

  if (relevantProjects.length >= 2 || (relevantProjects.length >= 1 && certificatesCount >= 1)) {
    projectsScore = 95;
  } else if (relevantProjects.length === 1 || hasGitHubEvidence) {
    projectsScore = 80;
  } else if (student.projects.length > 0) {
    projectsScore = 60;
  } else {
    projectsScore = 30;
  }

  // ==========================================
  // 5. PREFERENCES ALIGNMENT (10%)
  // ==========================================
  let preferencesScore = 75;
  const pref = student.preferences;
  if (pref) {
    let modeMatch = true;
    if (pref.workPreference && pref.workPreference !== 'Any') {
      modeMatch = opportunity.workMode === pref.workPreference || opportunity.workMode === 'Any';
    }

    let typeMatch = true;
    if (pref.types && pref.types.length > 0) {
      typeMatch = pref.types.some(
        (t) =>
          t.toLowerCase() === opportunity.type.toLowerCase() ||
          (t === 'Full-time' && opportunity.type === 'Job') ||
          (t === 'Job' && opportunity.type === 'Full-time')
      );
    }

    if (modeMatch && typeMatch) preferencesScore = 98;
    else if (modeMatch || typeMatch) preferencesScore = 75;
    else preferencesScore = 50;
  }

  // ==========================================
  // TRANSPARENT WEIGHTED SCORING
  // Skill: 35% | Eligibility: 25% | Goal: 20% | Project/Evidence: 10% | Prefs: 10%
  // ==========================================
  const rawWeightedScore =
    skillsScore * 0.35 +
    eligibilityScore * 0.25 +
    careerGoalScore * 0.20 +
    projectsScore * 0.10 +
    preferencesScore * 0.10;

  let overallMatchScore = Math.min(97, Math.max(20, Math.round(rawWeightedScore)));

  // If there is an explicit hard eligibility issue, cap the score so it never claims "Strong Match"
  if (eligibilityIssue && overallMatchScore > 72) {
    overallMatchScore = 70;
  }

  // Potential Match: If missing skills are mastered
  const potentialBoost = Math.min(22, missingSkills.length * 6 + (100 - skillsScore) * 0.3);
  const potentialMatchScore = Math.min(98, Math.round(overallMatchScore + potentialBoost));

  // Category determination
  let category: MatchCategory = 'Future';
  if (overallMatchScore >= 84 && !eligibilityIssue && opportunity.daysRemaining <= 7) {
    category = 'Apply Now';
  } else if (overallMatchScore >= 78 && !eligibilityIssue) {
    category = 'Strong Match';
  } else if (overallMatchScore >= 56 || potentialMatchScore >= 78) {
    category = 'Near-Fit';
  } else {
    category = 'Future';
  }

  const breakdown: MatchBreakdown = {
    skillsScore,
    eligibilityScore,
    careerGoalScore,
    projectsScore,
    preferencesScore,
    educationScore: eligibilityScore,
    experienceScore: projectsScore,
    careerInterestScore: careerGoalScore,
  };

  // Readiness Checklist
  const readinessChecklist = [
    {
      label: 'Eligibility & Graduation Criteria',
      passed: !eligibilityIssue,
      note: eligibilityIssue || `Matches ${opportunity.eligibleGradYears.join(', ')} graduation cohorts and degree requirements.`,
    },
    {
      label: 'Core Skills Qualification',
      passed: skillsScore >= 65,
      note: `${matchedSkills.length} of ${opportunity.requiredSkills.length} core prerequisites demonstrated.`,
    },
    {
      label: 'Career Goal Alignment',
      passed: careerGoalScore >= 70,
      note: student.careerGoal
        ? `Targeting ${student.careerGoal}; aligns with role focus.`
        : 'Set a specific career goal to sharpen recommendation priority.',
    },
    {
      label: 'Verified Project Evidence',
      passed: relevantProjects.length > 0,
      note: relevantProjects.length > 0
        ? `${relevantProjects.length} relevant technical project(s) demonstrated.`
        : 'Adding a project in this tech stack will strengthen candidate readiness.',
    },
    {
      label: 'Active Application Deadline',
      passed: opportunity.daysRemaining > 0,
      note: `${opportunity.daysRemaining} days remaining until ${opportunity.deadline}.`,
    },
  ];

  // Explainability
  const strongHighlights = matchedSkills.slice(0, 3).join(', ');
  const primaryGaps = missingSkills.slice(0, 2).join(' and ');

  let aiExplanation = '';
  if (overallMatchScore >= 80 && !eligibilityIssue) {
    aiExplanation = `You have strong candidate alignment because your demonstrated skills in ${strongHighlights || 'core areas'} directly match role specifications, and your career goal (${student.careerGoal || 'Software'}) is closely aligned. ${
      primaryGaps ? `Your recommended area of focus is ${primaryGaps}.` : 'Your profile satisfies primary prerequisites.'
    }`;
  } else if (eligibilityIssue) {
    aiExplanation = `While your technical foundations in ${strongHighlights || 'key technologies'} are relevant, there is a formal criteria consideration: ${eligibilityIssue}`;
  } else if (overallMatchScore >= 60) {
    aiExplanation = `You possess solid foundational competencies in ${strongHighlights || 'core programming'}. However, this role prioritizes demonstrated depth in ${primaryGaps || 'specialized tools'}.`;
  } else {
    aiExplanation = `This opportunity requires specialized proficiencies in ${missingSkills.slice(0, 3).join(', ')} which are not yet established on your profile.`;
  }

  // Why not 100% calculation
  const gapReasons: string[] = [];
  if (eligibilityIssue) {
    gapReasons.push(eligibilityIssue);
  }
  if (missingSkills.length > 0) {
    gapReasons.push(`Prerequisite or preferred skills not yet demonstrated: ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  if (projectsScore < 85) {
    gapReasons.push('Your portfolio does not yet include a verified project specifically built with this enterprise tech stack.');
  }
  if (gapReasons.length === 0) {
    gapReasons.push('No candidate profile achieves 100% because selection also depends on live technical rounds and applicant pool dynamics.');
  }

  const whyNot100Explanation = `You are ${overallMatchScore}% matched (AI-estimated match). The gap comes from: ${gapReasons.join(' ')}`;

  const fastestImprovementTip = missingSkills.length > 0
    ? `Building one hands-on project demonstrating ${missingSkills[0]} could raise your estimated match by +${Math.min(18, Math.round(potentialBoost))}%.`
    : 'Documenting code architecture and adding a live deployed URL will strengthen candidate readiness.';

  return {
    opportunity,
    overallMatchScore,
    potentialMatchScore,
    category,
    breakdown,
    matchedSkills,
    partialSkills,
    missingSkills,
    aiExplanation,
    whyNot100Explanation,
    fastestImprovementTip,
    eligibilityIssue,
    readinessChecklist,
  };
}

export function rankOpportunities(opportunities: Opportunity[], student: StudentProfile): MatchResult[] {
  return opportunities
    .map((opp) => evaluateMatch(opp, student))
    .sort((a, b) => b.overallMatchScore - a.overallMatchScore);
}
