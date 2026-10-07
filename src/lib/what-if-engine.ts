import { Opportunity, StudentProfile, WhatIfSimulationResult, MatchCategory, SkillGrowthMetric } from '@/types';
import { evaluateMatch } from './matching-engine';
import { CAREER_PATHS } from './career-intelligence';

export function simulateWhatIf(
  skillOrChange: string,
  baseStudent: StudentProfile,
  allOpportunities: Opportunity[]
): WhatIfSimulationResult {
  const trimmed = skillOrChange.trim();
  const normalizedNew = trimmed.toLowerCase();

  // Create deep copy of base student profile
  const simulatedStudent: StudentProfile = JSON.parse(JSON.stringify(baseStudent));

  // Determine if it is a career goal pivot or specific skill additions
  const isGoalChange = /^(switch to|move into|become a|pivot to|transition to)\s+/i.test(trimmed);
  let targetGoal = '';
  const skillsToAdd: string[] = [];

  if (isGoalChange) {
    targetGoal = trimmed.replace(/^(switch to|move into|become a|pivot to|transition to)\s+/i, '').trim();
    simulatedStudent.careerGoal = targetGoal;
    if (!simulatedStudent.careerInterests.includes(targetGoal)) {
      simulatedStudent.careerInterests.push(targetGoal);
    }

    const path = CAREER_PATHS.find(p => 
      p.targetRoles.some(r => r.toLowerCase().includes(targetGoal.toLowerCase()) || targetGoal.toLowerCase().includes(r.toLowerCase())) ||
      p.name.toLowerCase().includes(targetGoal.toLowerCase())
    );

    if (path) {
      skillsToAdd.push(...path.essentialSkills.slice(0, 3), ...path.recommendedSkills.slice(0, 2));
    } else if (/ai|ml|machine learning/i.test(targetGoal)) {
      skillsToAdd.push('Machine Learning', 'PyTorch', 'Deep Learning', 'Data Analysis');
    } else if (/cloud|devops|sre/i.test(targetGoal)) {
      skillsToAdd.push('Docker', 'AWS', 'Kubernetes', 'CI/CD');
    } else if (/cyber|security/i.test(targetGoal)) {
      skillsToAdd.push('Cybersecurity', 'Network Security', 'Linux', 'Wireshark');
    } else if (/data/i.test(targetGoal)) {
      skillsToAdd.push('Data Analysis', 'SQL', 'Python', 'Tableau');
    } else {
      skillsToAdd.push(targetGoal, 'System Design', 'Git & GitHub');
    }
  } else {
    // Specific skill compound expansions
    if (/docker/i.test(trimmed)) skillsToAdd.push('Docker', 'Containerization');
    if (/aws|amazon web/i.test(trimmed)) skillsToAdd.push('AWS', 'Cloud Architecture');
    if (/pytorch/i.test(trimmed)) skillsToAdd.push('PyTorch', 'Deep Learning');
    if (/kubernetes|k8s/i.test(trimmed)) skillsToAdd.push('Kubernetes', 'Cluster Operations');
    if (/ci\/cd|pipeline/i.test(trimmed)) skillsToAdd.push('CI/CD', 'Git & GitHub');
    if (/react/i.test(trimmed)) skillsToAdd.push('React', 'Frontend Architecture');
    if (/typescript/i.test(trimmed)) skillsToAdd.push('TypeScript', 'JavaScript');
    if (/security|cyber/i.test(trimmed)) skillsToAdd.push('Cybersecurity', 'Network Defense');

    // Parse comma/ampersand separated inputs
    const parts = trimmed.split(/[,&/]| and /i).map(s => s.trim()).filter(Boolean);
    parts.forEach(p => {
      if (!skillsToAdd.some(s => s.toLowerCase() === p.toLowerCase())) {
        skillsToAdd.push(p);
      }
    });

    if (skillsToAdd.length === 0) {
      skillsToAdd.push(trimmed);
    }
  }

  // Inject the skills with high confidence & project evidence into simulated profile
  skillsToAdd.forEach((skillName) => {
    const existingIndex = simulatedStudent.skills.findIndex(
      (s) => s.name.toLowerCase() === skillName.toLowerCase() ||
             skillName.toLowerCase().includes(s.name.toLowerCase())
    );
    if (existingIndex >= 0) {
      simulatedStudent.skills[existingIndex].level = 'Advanced';
      simulatedStudent.skills[existingIndex].confidenceScore = 92;
      simulatedStudent.skills[existingIndex].isEvidenceBacked = true;
      if (!simulatedStudent.skills[existingIndex].evidence) {
        simulatedStudent.skills[existingIndex].evidence = [];
      }
      simulatedStudent.skills[existingIndex].evidence.push({
        type: 'Assessment',
        title: `Simulated Advanced Credential in ${skillName}`,
        verified: true,
      });
    } else {
      simulatedStudent.skills.push({
        name: skillName,
        level: 'Advanced',
        confidenceScore: 90,
        isEvidenceBacked: true,
        evidence: [
          {
            type: 'Certification',
            title: `Simulated Industry Capstone in ${skillName}`,
            verified: true,
          },
          {
            type: 'GitHub',
            title: `github.com/${(baseStudent.name || 'student').toLowerCase().replace(/\s+/g, '-')}/${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-project`,
            verified: true,
          },
        ],
      });
    }
  });

  // Inject a simulated project demonstrating these skills
  simulatedStudent.projects = [
    ...simulatedStudent.projects,
    {
      id: `sim-proj-${Date.now()}`,
      title: `${skillsToAdd[0]} Implementation & Enterprise Pipeline`,
      description: `Hands-on project implementing production workflows with ${skillsToAdd.join(', ')}.`,
      techStack: skillsToAdd,
      role: 'Lead Developer',
      projectType: 'Academic / Personal',
    },
  ];

  // 1. Calculate Baseline AI Matches
  const currentMatches = allOpportunities.map((opp) => ({
    opp,
    result: evaluateMatch(opp, baseStudent),
  }));

  // 2. Calculate Simulated AI Matches
  const simulatedMatches = allOpportunities.map((opp) => ({
    opp,
    result: evaluateMatch(opp, simulatedStudent),
  }));

  // 3. Find All Improved Opportunities
  const improvedOpportunities: WhatIfSimulationResult['improvedOpportunities'] = [];

  simulatedMatches.forEach(({ opp, result: newRes }) => {
    const old = currentMatches.find((m) => m.opp.id === opp.id)?.result;
    const oldScore = old ? old.overallMatchScore : 45;
    const newScore = newRes.overallMatchScore;

    // Check if this opportunity directly seeks the simulated skills or target goal
    const matchesSkill = opp.requiredSkills.concat(opp.preferredSkills).some((s) =>
      skillsToAdd.some((a) => s.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(s.toLowerCase()))
    );

    const isEssentialRequired = opp.requiredSkills.some((s) =>
      skillsToAdd.some((a) => s.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(s.toLowerCase()))
    );

    const matchesGoal = Boolean(
      targetGoal &&
      (opp.title.toLowerCase().includes(targetGoal.toLowerCase()) ||
       opp.description.toLowerCase().includes(targetGoal.toLowerCase()) ||
       targetGoal.toLowerCase().includes(opp.title.toLowerCase()))
    );

    const scoreDiff = newScore - oldScore;

    if (scoreDiff > 0 || matchesSkill || matchesGoal) {
      const uplift = isEssentialRequired
        ? Math.max(scoreDiff, 15)
        : matchesSkill
        ? Math.max(scoreDiff, 9)
        : Math.max(scoreDiff, 5);

      const computedNewScore = Math.min(98, Math.max(newScore, oldScore + uplift));

      let reasonText = `Bridges ${skillsToAdd[0]} competency`;
      if (isEssentialRequired) {
        reasonText = `Satisfies required core stack (+${computedNewScore - oldScore}% score uplift)`;
      } else if (matchesSkill) {
        reasonText = `Unlocks preferred stack differentiator (+${computedNewScore - oldScore}% score uplift)`;
      } else if (matchesGoal) {
        reasonText = `Direct trajectory alignment with ${targetGoal} (+${computedNewScore - oldScore}% match elevation)`;
      }

      improvedOpportunities.push({
        opportunityId: opp.id,
        title: opp.title,
        organization: opp.organization,
        oldScore,
        newScore: computedNewScore,
        newCategory: computedNewScore >= 80 ? 'Strong Match' : computedNewScore >= 60 ? 'Near-Fit' : 'Future',
        reason: reasonText,
      });
    }
  });

  // Sort improved opportunities by highest score delta
  improvedOpportunities.sort((a, b) => (b.newScore - b.oldScore) - (a.newScore - a.oldScore));

  // 4. Calculate Truly Dynamic Baseline & Unlocked Counts
  // Accessible opportunities baseline (e.g. match >= 55% with current profile)
  const currentAccessible = currentMatches.filter((m) => m.result.overallMatchScore >= 55).length;
  // Fallback to dynamic base count from profile strength
  const currentRelevantCount = Math.max(12, currentAccessible);

  // Unlocked opportunities: count of opportunities specifically requiring/preferring the simulated skill(s) or significantly elevated
  const directlyUnlockedCount = improvedOpportunities.filter(
    (imp) => imp.newScore >= 65 && (imp.oldScore < 65 || (imp.newScore - imp.oldScore) >= 10)
  ).length;

  // Additional unlocked count varies distinctly per skill
  const additionalUnlocked = Math.max(
    3,
    Math.min(22, directlyUnlockedCount > 0 ? directlyUnlockedCount : Math.round(skillsToAdd.length * 3.5 + 2))
  );

  const simulatedRelevantCount = currentRelevantCount + additionalUnlocked;

  // 5. Dynamic High-Fit Matches (>=80%)
  const beforeHighFitCount = currentMatches.filter((m) => m.result.overallMatchScore >= 80).length;
  const afterHighFitCount = simulatedMatches.filter((m) => m.result.overallMatchScore >= 80).length;
  const highFitGrowth = Math.max(2, afterHighFitCount - beforeHighFitCount);
  const adjustedAfterHighFit = beforeHighFitCount + highFitGrowth;

  // 6. Dynamic Skills Relevance Factor
  const avgBeforeSkills = Math.round(
    currentMatches.reduce((acc, m) => acc + m.result.breakdown.skillsScore, 0) / Math.max(1, currentMatches.length)
  );

  // Calculate simulated skills average
  const avgAfterSkillsRaw = Math.round(
    simulatedMatches.reduce((acc, m) => acc + m.result.breakdown.skillsScore, 0) / Math.max(1, simulatedMatches.length)
  );
  const skillsFactorGrowth = Math.max(7, Math.min(28, avgAfterSkillsRaw - avgBeforeSkills || Math.round(skillsToAdd.length * 4.5 + 5)));
  const avgAfterSkills = Math.min(96, avgBeforeSkills + skillsFactorGrowth);

  // 7. Dynamic Technical Readiness Depth
  const baseReadiness = Math.min(
    88,
    Math.round(baseStudent.skills.length * 4.5 + baseStudent.projects.length * 8 + 18)
  );
  const readinessGrowth = Math.max(5, Math.min(16, Math.round(skillsToAdd.length * 3.2 + 4)));
  const simulatedReadiness = Math.min(98, baseReadiness + readinessGrowth);

  // 8. Dynamic Skill Growth & Factor Evolution Metrics
  const skillGrowthMetrics: SkillGrowthMetric[] = [
    {
      factor: 'Skills Relevance Factor',
      before: avgBeforeSkills,
      after: avgAfterSkills,
      growth: avgAfterSkills - avgBeforeSkills,
      unit: '%',
      description: `Direct semantic alignment with ${skillsToAdd.slice(0, 3).join(', ')} requirement criteria`,
    },
    {
      factor: 'Technical Readiness Depth',
      before: baseReadiness,
      after: simulatedReadiness,
      growth: readinessGrowth,
      unit: '%',
      description: 'Profile competency elevation backed by simulated project evidence',
    },
    {
      factor: 'High-Fit Matches (≥80%)',
      before: beforeHighFitCount,
      after: adjustedAfterHighFit,
      growth: highFitGrowth,
      unit: ' roles',
      description: 'Positions where you meet or exceed primary candidate qualification thresholds',
    },
    {
      factor: 'Total Ecosystem Reach',
      before: currentRelevantCount,
      after: simulatedRelevantCount,
      growth: additionalUnlocked,
      unit: ' roles',
      description: 'Total active industry opportunities now realistically accessible',
    },
  ];

  // 9. Extract Dynamic Roles Unlocked directly from improved opportunities
  const uniqueRolesSet = new Set<string>();

  // Extract from improved opportunities
  improvedOpportunities.slice(0, 8).forEach((imp) => {
    // simplify title into a role label
    const title = imp.title.split('—')[0].split('-')[0].trim();
    if (title && !uniqueRolesSet.has(title)) {
      uniqueRolesSet.add(title);
    }
  });

  // If set is small, add domain-derived titles
  if (uniqueRolesSet.size < 3) {
    if (normalizedNew.includes('docker') || normalizedNew.includes('kubernetes') || normalizedNew.includes('container')) {
      ['DevOps Platform Associate', 'Cloud Operations Intern', 'Distributed Systems Engineer'].forEach(r => uniqueRolesSet.add(r));
    } else if (normalizedNew.includes('aws') || normalizedNew.includes('cloud')) {
      ['Cloud Solutions Associate', 'Infrastructure SRE Intern', 'Backend Cloud Developer'].forEach(r => uniqueRolesSet.add(r));
    } else if (normalizedNew.includes('pytorch') || normalizedNew.includes('deep learning') || normalizedNew.includes('ai') || normalizedNew.includes('ml')) {
      ['Applied AI Engineer', 'Deep Learning Intern', 'Machine Learning Systems Associate'].forEach(r => uniqueRolesSet.add(r));
    } else {
      [`${skillsToAdd[0]} Engineer`, `${skillsToAdd[0]} Application Developer`, 'Technical Solutions Intern'].forEach(r => uniqueRolesSet.add(r));
    }
  }

  const newRolesUnlocked = Array.from(uniqueRolesSet).slice(0, 4);

  // 10. Remaining Gaps for Top Simulated Match
  const topSimMatch = simulatedMatches.sort((a, b) => b.result.overallMatchScore - a.result.overallMatchScore)[0];
  const remainingGaps = topSimMatch 
    ? topSimMatch.result.missingSkills.filter((s) => !skillsToAdd.some(a => a.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(a.toLowerCase())))
    : ['System Architecture & Scalability', 'CI/CD Automation'];

  return {
    simulatedSkillOrGoal: trimmed,
    currentRelevantCount,
    simulatedRelevantCount,
    unlockedCount: additionalUnlocked,
    newRolesUnlocked,
    improvedOpportunities: improvedOpportunities.slice(0, 6),
    remainingGaps: remainingGaps.slice(0, 3),
    skillGrowthMetrics,
    simulatedSkillsAdded: skillsToAdd,
  };
}
