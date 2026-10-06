'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Trash2 } from 'lucide-react';
import { StudentSkill } from '@/types';

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: StudentSkill | null;
  onSaveSkill: (saved: StudentSkill) => void;
  onDeleteSkill?: (skillName: string) => void;
}

const EVIDENCE_TYPES = [
  'Academic Learning',
  'Academic Learning / Personal Practice',
  'Personal Practice',
  'Project',
  'Coursework',
  'Certification',
  'GitHub Repository',
];

export const SkillEditModal: React.FC<SkillEditModalProps> = ({
  isOpen,
  onClose,
  skill,
  onSaveSkill,
  onDeleteSkill,
}) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [evidenceText, setEvidenceText] = useState('Academic Learning');
  const [confidenceScore, setConfidenceScore] = useState<number>(45);

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setLevel(skill.level);
      setConfidenceScore(skill.confidenceScore || (skill.level === 'Intermediate' ? 65 : 45));
      const ev = skill.evidence?.[0]?.title || 'Academic Learning';
      setEvidenceText(ev);
    } else {
      setName('');
      setLevel('Beginner');
      setConfidenceScore(45);
      setEvidenceText('Academic Learning');
    }
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isEvBacked = evidenceText.toLowerCase().includes('certification') || evidenceText.toLowerCase().includes('github');
    const updated: StudentSkill = {
      name: name.trim(),
      level,
      confidenceScore: Math.min(100, Math.max(10, confidenceScore)),
      evidence: [
        {
          type: isEvBacked ? 'Project' : 'Self-Declared',
          title: evidenceText,
          verified: isEvBacked,
        },
      ],
      isEvidenceBacked: isEvBacked,
    };

    onSaveSkill(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {skill ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <p className="text-xs text-slate-500">
              Update skill level, evidence sources, and confidence.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Skill Name *</label>
            <input
              type="text"
              required
              disabled={Boolean(skill)} // Keep name fixed if editing, or editable if new
              placeholder="e.g. Python, SQL, React..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Skill Level</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setLevel(lvl);
                    if (lvl === 'Beginner') setConfidenceScore(45);
                    else if (lvl === 'Intermediate') setConfidenceScore(65);
                    else setConfidenceScore(85);
                  }}
                  className={`py-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                    level === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Evidence Source</label>
            <select
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {EVIDENCE_TYPES.map((ev) => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">Estimated Confidence Score</label>
              <span className="font-mono font-bold text-indigo-700">{confidenceScore}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={confidenceScore}
              onChange={(e) => setConfidenceScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            {skill && onDeleteSkill ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteSkill(skill.name);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Skill</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Save Skill
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
