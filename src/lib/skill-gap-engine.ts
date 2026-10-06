import { Opportunity, StudentProfile, SkillGapItem } from '@/types';

export function analyzeSkillGaps(student: StudentProfile, opportunities: Opportunity[]): SkillGapItem[] {
  const studentSkillNames = new Set(student.skills.map((s) => s.name.toLowerCase()));

  const reqFrequency = new Map<string, number>();
  const prefFrequency = new Map<string, number>();

  opportunities.forEach((opp) => {
    opp.requiredSkills.forEach((skill) => {
      const norm = skill.toLowerCase();
      if (!studentSkillNames.has(norm)) {
        reqFrequency.set(skill, (reqFrequency.get(skill) || 0) + 1);
      }
    });

    opp.preferredSkills.forEach((skill) => {
      const norm = skill.toLowerCase();
      if (!studentSkillNames.has(norm)) {
        prefFrequency.set(skill, (prefFrequency.get(skill) || 0) + 1);
      }
    });
  });

  const gapItems: SkillGapItem[] = [];

  // Critical Gaps (Directly required)
  reqFrequency.forEach((count, skill) => {
    let days = 14;
    if (['docker', 'git', 'sql'].includes(skill.toLowerCase())) days = 7;
    else if (['kubernetes', 'deep learning', 'pytorch'].includes(skill.toLowerCase())) days = 21;

    gapItems.push({
      skill,
      category: 'Critical Gap',
      description: `Directly required across ${count} relevant opportunities. Mastering this may improve your baseline qualification.`,
      relevanceCount: count,
      unlockPotentialCount: Math.round(count * 2.5 + 4),
      estimatedLearningDays: days,
    });
  });

  // Competitive Gaps (Preferred)
  prefFrequency.forEach((count, skill) => {
    if (!reqFrequency.has(skill)) {
      gapItems.push({
        skill,
        category: 'Competitive Gap',
        description: `Preferred by ${count} organizations. Adding evidence can strengthen your profile differentiation against peer applicants.`,
        relevanceCount: count,
        unlockPotentialCount: Math.round(count * 2.0 + 3),
        estimatedLearningDays: 10,
      });
    }
  });

  // Future Gaps
  const futureCandidates = ['Distributed Tracing', 'eBPF Kernel Telemetry', 'MLOps Pipeline Deployment'];
  futureCandidates.forEach((skill) => {
    if (!reqFrequency.has(skill) && !prefFrequency.has(skill)) {
      gapItems.push({
        skill,
        category: 'Future Gap',
        description: 'Emerging high-demand capability. Useful for long-term senior growth and differentiated research positions.',
        relevanceCount: 2,
        unlockPotentialCount: 8,
        estimatedLearningDays: 18,
      });
    }
  });

  // Sort: Critical Gaps first, then by highest unlock potential
  return gapItems.sort((a, b) => {
    const rankA = a.category === 'Critical Gap' ? 1 : a.category === 'Competitive Gap' ? 2 : 3;
    const rankB = b.category === 'Critical Gap' ? 1 : b.category === 'Competitive Gap' ? 2 : 3;
    if (rankA !== rankB) return rankA - rankB;
    return b.unlockPotentialCount - a.unlockPotentialCount;
  });
}
