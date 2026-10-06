import { Opportunity, StudentProfile, MatchResult, MatchBreakdown, MatchCategory } from '@/types';

// Helper to normalize skill strings
function normalizeSkill(s: string): string {
  return s.trim().toLowerCase();
}

function findStudentSkill(reqSkill: string, studentSkills: StudentProfile['skills']): StudentProfile['skills'][0] | undefined {
  const normReq = reqSkill.trim().toLowerCase();
  
  // 1. Exact match
  const exact = studentSkills.find(s => s.name.trim().toLowerCase() === normReq);
  if (exact) return exact;

  // 2. Keyword / Alias mapping
  const aliases: Record<string, string[]> = {
    'docker': ['containerization', 'containers', 'docker compose', 'devops', 'kubernetes'],
    'containerization': ['docker', 'containers', 'docker compose'],
    'aws': ['cloud', 'amazon web services', 'cloud architecture', 'devops'],
    'kubernetes': ['k8s', 'cluster ops', 'container orchestration', 'docker'],
    'pytorch': ['deep learning', 'machine learning', 'neural networks', 'ai'],
    'deep learning': ['pytorch', 'neural networks', 'machine learning', 'tensorflow'],
    'machine learning': ['ai', 'deep learning', 'pytorch', 'data science', 'ml'],
    'rest apis': ['apis', 'microservices', 'backend', 'rest'],
    'ci/cd': ['devops', 'pipelines', 'github actions', 'docker'],
  };

  const matched = studentSkills.find(s => {
    const sNorm = s.name.trim().toLowerCase();
    if (sNorm === normReq) return true;
    if (sNorm.includes(normReq) || normReq.includes(sNorm)) return true;
    
    // Check aliases
    const reqAliases = aliases[normReq] || [];
    if (reqAliases.some(a => sNorm.includes(a) || a.includes(sNorm))) return true;

    const sAliases = aliases[sNorm] || [];
    if (sAliases.some(a => normReq.includes(a) || a.includes(normReq))) return true;

    return false;
  });

  return matched;
}

export function evaluateMatch(opportunity: Opportunity, student: StudentProfile): MatchResult {
  // Layer 1: Structured Eligibility Checking
  let eligibilityScore = 100;
  const matchesGradYear = opportunity.eligibleGradYears.length === 0 || opportunity.eligibleGradYears.includes(student.graduationYear);
  const matchesBranch = opportunity.eligibleBranches.some(
    (b) => b.toLowerCase().includes('all') || student.branch.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(student.branch.toLowerCase())
  );

  if (!matchesGradYear) eligibilityScore -= 40;
  if (!matchesBranch) eligibilityScore -= 30;
  eligibilityScore = Math.max(20, eligibilityScore);

  // Layer 2 & 3: Skills Scoring
  const matchedSkills: string[] = [];
  const partialSkills: { skill: string; reason: string }[] = [];
  const missingSkills: string[] = [];

  let requiredSkillPoints = 0;
  let totalRequiredSkills = opportunity.requiredSkills.length || 1;

  opportunity.requiredSkills.forEach((reqSkill) => {
    const found = findStudentSkill(reqSkill, student.skills);

    if (found) {
      if (found.level === 'Advanced' || found.confidenceScore >= 80) {
        matchedSkills.push(reqSkill);
        requiredSkillPoints += 1.0;
      } else if (found.level === 'Intermediate' || found.confidenceScore >= 60) {
        matchedSkills.push(reqSkill);
        requiredSkillPoints += 0.85;
      } else {
        partialSkills.push({ skill: reqSkill, reason: `Basic knowledge (${found.confidenceScore}% confidence)` });
        requiredSkillPoints += 0.5;
      }
    } else {
      // Check partial match in project tech stack
      const norm = normalizeSkill(reqSkill);
      const inProject = student.projects.some((p) =>
        p.techStack.some((ts) => normalizeSkill(ts) === norm || norm.includes(normalizeSkill(ts)) || normalizeSkill(ts).includes(norm))
      );
      if (inProject) {
        partialSkills.push({ skill: reqSkill, reason: 'Used in project but not formally declared as verified core skill' });
        requiredSkillPoints += 0.6;
      } else {
        missingSkills.push(reqSkill);
      }
    }
  });

  // Check preferred skills bonus
  let preferredBonus = 0;
  opportunity.preferredSkills.forEach((prefSkill) => {
    const found = findStudentSkill(prefSkill, student.skills);
    if (found) {
      matchedSkills.push(`${prefSkill} (Bonus)`);
      preferredBonus += 4;
    } else {
      // If not present, note in missing preferred skills
      if (!missingSkills.includes(prefSkill)) {
        missingSkills.push(prefSkill);
      }
    }
  });

  const baseSkillScore = Math.min(100, Math.round((requiredSkillPoints / totalRequiredSkills) * 90 + preferredBonus));

  // Projects relevance calculation
  let projectsScore = 50;
  const projectTechCombined = student.projects.flatMap((p) => p.techStack.map(normalizeSkill));
  const relevantProjectCount = student.projects.filter((p) =>
    p.techStack.some((ts) =>
      opportunity.requiredSkills.some((rs) => normalizeSkill(rs) === normalizeSkill(ts)) ||
      opportunity.preferredSkills.some((ps) => normalizeSkill(ps) === normalizeSkill(ts))
    )
  ).length;

  if (relevantProjectCount >= 2) projectsScore = 94;
  else if (relevantProjectCount === 1) projectsScore = 78;
  else projectsScore = 40;

  // Experience relevance
  let experienceScore = 70;
  if (student.experience.length > 0) {
    const relevantExp = student.experience.some((exp) =>
      opportunity.requiredSkills.some((rs) => (exp.description || '').toLowerCase().includes(rs.toLowerCase()))
    );
    experienceScore = relevantExp ? 85 : 72;
  } else {
    experienceScore = 50;
  }

  // Career Interest & Goal Alignment
  let careerInterestScore = 60;
  const goalLower = student.careerGoal.toLowerCase();
  const titleLower = opportunity.title.toLowerCase();
  const descLower = opportunity.description.toLowerCase();

  const matchesDirectGoal =
    goalLower.includes('software') && titleLower.includes('software') ||
    goalLower.includes('backend') && (titleLower.includes('backend') || descLower.includes('backend')) ||
    goalLower.includes('ai') && (titleLower.includes('ai') || titleLower.includes('machine learning')) ||
    goalLower.includes('data') && (titleLower.includes('data') || titleLower.includes('analytics'));

  const interestMatchCount = student.careerInterests.filter((interest) =>
    titleLower.includes(interest.toLowerCase()) || descLower.includes(interest.toLowerCase())
  ).length;

  if (matchesDirectGoal && interestMatchCount >= 2) careerInterestScore = 96;
  else if (matchesDirectGoal || interestMatchCount >= 1) careerInterestScore = 84;
  else careerInterestScore = 65;

  const educationScore = matchesGradYear && matchesBranch ? 100 : 75;

  // Layer 3: Weighted overall match score
  // Weights: Skills 40%, Projects 20%, Career Interest 15%, Education/Eligibility 15%, Experience 10%
  const weightedScore = Math.round(
    baseSkillScore * 0.40 +
    projectsScore * 0.20 +
    careerInterestScore * 0.15 +
    educationScore * 0.15 +
    experienceScore * 0.10
  );

  const overallMatchScore = Math.min(97, Math.max(25, weightedScore));

  // Potential Match: If missing skills are learned (targeted prep)
  const potentialBoost = Math.min(22, missingSkills.length * 7 + (100 - baseSkillScore) * 0.35);
  const potentialMatchScore = Math.min(98, Math.round(overallMatchScore + potentialBoost));

  // Category determination
  let category: MatchCategory = 'Future';
  if (overallMatchScore >= 85 && opportunity.daysRemaining <= 6) {
    category = 'Apply Now';
  } else if (overallMatchScore >= 78) {
    category = 'Strong Match';
  } else if (overallMatchScore >= 58 || potentialMatchScore >= 80) {
    category = 'Near-Fit';
  } else {
    category = 'Future';
  }

  const breakdown: MatchBreakdown = {
    skillsScore: baseSkillScore,
    educationScore,
    projectsScore,
    experienceScore,
    careerInterestScore,
    eligibilityScore,
  };

  // Layer 4: Explainability Generation
  const strongHighlights = matchedSkills.slice(0, 3).join(', ');
  const primaryGaps = missingSkills.slice(0, 2).join(' and ');

  let aiExplanation = '';
  if (overallMatchScore >= 80) {
    aiExplanation = `You are a strong candidate because your technical background in ${strongHighlights} and your verified project portfolio align closely with the role requirements. ${
      primaryGaps ? `Your primary gap to become an exceptional candidate is ${primaryGaps}.` : 'Your background covers virtually all prerequisites.'
    }`;
  } else if (overallMatchScore >= 60) {
    aiExplanation = `You possess solid foundational competencies in ${strongHighlights}. However, the position prioritizes hands-on evidence in ${primaryGaps || 'specialized domain tools'}. With targeted preparation, you can bridge this gap.`;
  } else {
    aiExplanation = `This opportunity requires specialized proficiencies in ${missingSkills.slice(0, 3).join(', ')} which are not yet established on your profile. We recommend focusing on prerequisite competencies first.`;
  }

  // Why not 100% calculation
  const gapReasons: string[] = [];
  if (missingSkills.length > 0) {
    gapReasons.push(`Missing declared or verified proficiency in ${missingSkills.slice(0, 3).join(', ')}.`);
  }
  if (projectsScore < 90) {
    gapReasons.push('Your portfolio does not yet demonstrate a dedicated production project specifically tailored to this company’s stack.');
  }
  if (experienceScore < 85) {
    gapReasons.push('Limited prior formal industry work history in this exact domain.');
  }
  if (gapReasons.length === 0) {
    gapReasons.push('No profile achieves 100% because candidate competitiveness also depends on applicant pool dynamics and domain interviews.');
  }

  const whyNot100Explanation = `You are ${overallMatchScore}% matched. The remaining gap of ${100 - overallMatchScore}% comes primarily from: ${gapReasons.join(' ')}`;

  const fastestImprovementTip = missingSkills.length > 0
    ? `Learning ${missingSkills[0]} and completing one public GitHub implementation could raise your match by +${Math.min(18, Math.round(potentialBoost))}%.`
    : 'Deploying one of your existing backend projects with live monitoring will solidify your readiness.';

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
  };
}

export function rankOpportunities(opportunities: Opportunity[], student: StudentProfile): MatchResult[] {
  return opportunities
    .map((opp) => evaluateMatch(opp, student))
    .sort((a, b) => b.overallMatchScore - a.overallMatchScore);
}
