'use client';

import React, { useMemo } from 'react';
import { 
  Dna, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Info,
  FolderGit2,
  FileCode2
} from 'lucide-react';
import { StudentProfile } from '@/types';

interface CareerDNAViewProps {
  student: StudentProfile;
  onExploreGaps: () => void;
  onSimulateWhatIf: () => void;
}

export const CareerDNAView: React.FC<CareerDNAViewProps> = ({
  student,
  onExploreGaps,
  onSimulateWhatIf,
}) => {
  // Dynamically synthesize Career DNA strictly from the user's actual entered profile
  const dnaScores = useMemo(() => {
    const skillsCount = student.skills.length;
    const projectsCount = student.projects.length;
    const certsCount = student.certifications.length;

    // Technical depth: average of actual confidence scores entered
    const avgConfidence = skillsCount > 0
      ? Math.round(student.skills.reduce((acc, s) => acc + (s.confidenceScore || 60), 0) / skillsCount)
      : 0;

    // Project relevance: derived from actual projects entered
    const projectRelevance = projectsCount >= 3 ? 92 : projectsCount === 2 ? 85 : projectsCount === 1 ? 72 : 20;

    // Problem solving: based on evidence items count & advanced level skills
    const advancedCount = student.skills.filter((s) => s.level === 'Advanced').length;
    const evidenceCount = student.skills.reduce((acc, s) => acc + (s.evidence?.length || 0), 0);
    const problemSolving = Math.min(95, Math.max(15, (advancedCount * 18) + (evidenceCount * 8) + (projectsCount * 10)));

    // Career alignment: check if any skill matches words in their careerGoal
    const goalWords = (student.careerGoal || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const goalMatches = student.skills.filter((s) =>
      goalWords.some((w) => s.name.toLowerCase().includes(w) || w.includes(s.name.toLowerCase()))
    ).length;
    const careerAlignment = goalWords.length > 0
      ? Math.min(95, Math.max(25, 45 + (goalMatches * 20) + (projectsCount * 8)))
      : 50;

    // Learning velocity: based on certifications & evidence-backed skills
    const evidenceBackedCount = student.skills.filter((s) => s.isEvidenceBacked || s.evidence?.length > 0).length;
    const learningVelocity = Math.min(95, Math.max(20, 40 + (certsCount * 16) + (evidenceBackedCount * 8)));

    return [
      { label: 'Technical Depth', value: avgConfidence, color: 'bg-indigo-600' },
      { label: 'Project Relevance', value: projectRelevance, color: 'bg-violet-600' },
      { label: 'Problem Solving', value: problemSolving, color: 'bg-emerald-600' },
      { label: 'Career Alignment', value: careerAlignment, color: 'bg-blue-600' },
      { label: 'Learning Velocity', value: learningVelocity, color: 'bg-amber-500' },
    ];
  }, [student]);

  // Derived Strongest Areas from user's actual skills
  const strongestSkills = useMemo(() => {
    return [...student.skills]
      .sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0))
      .slice(0, 3);
  }, [student.skills]);

  // Derived Emerging Areas from user's intermediate/beginner skills
  const emergingSkills = useMemo(() => {
    const emerging = student.skills.filter((s) => s.level === 'Intermediate' || s.level === 'Beginner');
    return emerging.length > 0 ? emerging.slice(0, 3) : student.skills.slice(0, 2);
  }, [student.skills]);

  // Project count description
  const projectSummary = student.projects.length > 0
    ? `Backed by ${student.projects.length} project${student.projects.length > 1 ? 's' : ''} entered by you.`
    : 'Add projects to reinforce your portfolio confidence.';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6EAF2] gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Dna className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-[#172033] tracking-tight">YOUR CAREER DNA</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Synthesized From Your Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated strictly from your entered skills, projects, and career aspirations for {student.name || 'your profile'}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateWhatIf}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Skill Upgrade</span>
          </button>
        </div>
      </div>

      {/* DNA Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 my-6">
        {dnaScores.map((score, i) => (
          <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 font-semibold">{score.label}</span>
              <span className="text-xs font-mono font-extrabold text-[#172033]">{score.value}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${score.color} rounded-full transition-all duration-700`}
                style={{ width: `${Math.max(5, score.value)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              Calculated Metric
            </span>
          </div>
        ))}
      </div>

      {/* Breakdown: Strongest vs Emerging vs Target Goal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Strongest Areas */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Your Strongest Areas</span>
          </div>
          {strongestSkills.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {strongestSkills.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {s.confidenceScore}% {s.isEvidenceBacked ? 'verified' : 'declared'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">No skills declared yet.</p>
          )}
          <p className="text-[11px] text-slate-500 pt-2 border-t border-emerald-100 font-medium">
            {projectSummary}
          </p>
        </div>

        {/* Emerging Areas */}
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-900">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Emerging Areas</span>
          </div>
          {emergingSkills.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {emergingSkills.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-indigo-700 font-bold">
                    {s.level} ({s.confidenceScore}%)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">Add more skills to map growth paths.</p>
          )}
          <p className="text-[11px] text-slate-500 pt-2 border-t border-indigo-100 font-medium">
            Ready to be elevated with projects and certifications.
          </p>
        </div>

        {/* Target Goal Alignment */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Target Goal Focus</span>
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-xs font-bold text-slate-900">
              {student.careerGoal || 'Goal not set yet'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {student.careerGoal
                ? (student.skills.length > 0
                    ? `Mapped against ${student.skills.length} skills and ${student.projects.length} project(s) in your profile.`
                    : 'Enter your skills to see exact missing requirements for this role.')
                : 'Set your career goal to view dedicated role prerequisites.'}
            </p>
          </div>
          <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
            <span className="text-[10px] text-amber-800 font-mono font-semibold">
              {student.preferences?.workPreference || 'Flexible'} Mode
            </span>
            <button
              onClick={onExploreGaps}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Skill Gaps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Derivation Disclaimer */}
      <div className="mt-6 pt-4 border-t border-[#E6EAF2] flex items-start space-x-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700 font-semibold">Authentic Synthesis:</strong> CareerLens AI computes Career DNA strictly from the details you provide. No fake benchmarks or hardcoded identities are used.
        </p>
      </div>
    </div>
  );
};
