'use client';

import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Trash2 } from 'lucide-react';
import { ExperienceRecord } from '@/types';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: ExperienceRecord | null;
  onSaveExperience: (exp: ExperienceRecord) => void;
}

const EXP_TYPES = [
  'Internship',
  'Part-time work',
  'Research',
  'Freelance work',
  'Volunteering',
  'Open-source contribution',
];

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  experience,
  onSaveExperience,
}) => {
  const [formData, setFormData] = useState<Partial<ExperienceRecord>>({
    organization: '',
    role: '',
    type: 'Internship',
    startDate: '',
    endDate: '',
    description: '',
    skillsUsed: [],
    proofUrl: '',
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData(experience);
    } else {
      setFormData({
        organization: '',
        role: '',
        type: 'Internship',
        startDate: '',
        endDate: '',
        description: '',
        skillsUsed: [],
        proofUrl: '',
      });
    }
    setSkillInput('');
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !(formData.skillsUsed || []).includes(trimmed)) {
      setFormData({
        ...formData,
        skillsUsed: [...(formData.skillsUsed || []), trimmed],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsUsed: (formData.skillsUsed || []).filter((s) => s !== skill),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization?.trim() || !formData.role?.trim()) return;

    const record: ExperienceRecord = {
      id: experience?.id || `exp-${Date.now()}`,
      organization: formData.organization.trim(),
      role: formData.role.trim(),
      type: formData.type || 'Internship',
      startDate: formData.startDate || '',
      endDate: formData.endDate || 'Present',
      description: formData.description?.trim() || '',
      skillsUsed: formData.skillsUsed || [],
      proofUrl: formData.proofUrl?.trim() || '',
    };

    onSaveExperience(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {experience ? 'Edit Experience' : 'Add Professional Experience'}
            </h2>
            <p className="text-xs text-slate-500">
              Record verified internships, research, open-source work, or part-time roles.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Experience Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {EXP_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Organization / Employer *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Research Lab, Tech Startup"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Role / Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Research Intern, Contributor"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Start Date</label>
              <input
                type="text"
                placeholder="e.g. June 2024"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">End Date</label>
              <input
                type="text"
                placeholder="e.g. August 2024 or Present"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description & Key Contributions</label>
            <textarea
              rows={3}
              placeholder="Describe your responsibilities, initiatives, and technical milestones..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Skills Used</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Python, Docker)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={!skillInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.skillsUsed || []).map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1 border border-indigo-200"
                >
                  <span>{sk}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => handleRemoveSkill(sk)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Proof / Reference Link (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.proofUrl || ''}
              onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
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
              Save Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
