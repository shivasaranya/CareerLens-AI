'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderGit2, Plus, Trash2 } from 'lucide-react';
import { ProjectRecord } from '@/types';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectRecord | null;
  onSaveProject: (saved: ProjectRecord) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveProject,
  onDeleteProject,
}) => {
  const [formData, setFormData] = useState<Partial<ProjectRecord>>({
    title: '',
    projectType: 'Academic / Personal Project',
    role: 'Student Developer',
    description: '',
    techStack: [],
    keyLearnings: [],
    outcome: '',
    githubUrl: '',
    liveDemoUrl: '',
  });

  const [techInput, setTechInput] = useState('');
  const [learningInput, setLearningInput] = useState('');

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        title: '',
        projectType: 'Academic / Personal Project',
        role: 'Student Developer',
        description: '',
        techStack: [],
        keyLearnings: [],
        outcome: '',
        githubUrl: '',
        liveDemoUrl: '',
      });
    }
    setTechInput('');
    setLearningInput('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !(formData.techStack || []).includes(trimmed)) {
      setFormData({
        ...formData,
        techStack: [...(formData.techStack || []), trimmed],
      });
      setTechInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setFormData({
      ...formData,
      techStack: (formData.techStack || []).filter((t) => t !== item),
    });
  };

  const handleAddLearning = () => {
    const trimmed = learningInput.trim();
    if (trimmed && !(formData.keyLearnings || []).includes(trimmed)) {
      setFormData({
        ...formData,
        keyLearnings: [...(formData.keyLearnings || []), trimmed],
      });
      setLearningInput('');
    }
  };

  const handleRemoveLearning = (item: string) => {
    setFormData({
      ...formData,
      keyLearnings: (formData.keyLearnings || []).filter((l) => l !== item),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) return;

    const record: ProjectRecord = {
      id: project?.id || `proj-${Date.now()}`,
      title: formData.title.trim(),
      projectType: formData.projectType || 'Academic / Personal Project',
      role: formData.role?.trim() || 'Student Developer',
      description: formData.description.trim(),
      techStack: formData.techStack || [],
      keyLearnings: formData.keyLearnings || [],
      outcome: formData.outcome?.trim() || '',
      githubUrl: formData.githubUrl?.trim() || '',
      liveDemoUrl: formData.liveDemoUrl?.trim() || '',
    };

    onSaveProject(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {project ? 'Edit Academic / Personal Project' : 'Add Academic / Personal Project'}
            </h2>
            <p className="text-xs text-slate-500">
              Demonstrate hands-on coursework, personal practice, and foundational technical projects.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Student Task Manager"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Project Category</label>
              <input
                type="text"
                readOnly
                value="Academic / Personal Project"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Role</label>
              <input
                type="text"
                value={formData.role || 'Student Developer'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the application, what problem it solves, and how it works..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Technologies Used</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add technology (e.g. HTML, Python)..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                onClick={handleAddTech}
                disabled={!techInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.techStack || []).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[11px] font-medium flex items-center gap-1 border border-indigo-200"
                >
                  <span>{t}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => handleRemoveTech(t)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Key Learnings</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add key learning (e.g. DOM manipulation, Forms)..."
                value={learningInput}
                onChange={(e) => setLearningInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLearning();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="button"
                onClick={handleAddLearning}
                disabled={!learningInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1">
              {(formData.keyLearnings || []).map((l) => (
                <div
                  key={l}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium flex items-center justify-between text-[11px] border border-slate-200"
                >
                  <span>• {l}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => handleRemoveLearning(l)} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Outcome / Learning Goal</label>
            <input
              type="text"
              placeholder="e.g. Built as a learning project to understand web development fundamentals"
              value={formData.outcome || ''}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">GitHub URL (Optional)</label>
              <input
                type="url"
                placeholder="Leave empty if not hosted"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Live Demo URL (Optional)</label>
              <input
                type="url"
                placeholder="Leave empty if not hosted"
                value={formData.liveDemoUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            {project && onDeleteProject ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(project.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
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
                Save Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
