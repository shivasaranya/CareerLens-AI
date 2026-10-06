'use client';

import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  Compass, 
  Cpu, 
  Cloud, 
  Code2, 
  Database, 
  ShieldCheck, 
  Layout, 
  Server
} from 'lucide-react';
import { StudentProfile } from '@/types';

interface CareerGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: string;
  onUpdateGoal: (newGoal: string) => void;
}

const POPULAR_GOALS = [
  { id: 'Machine Learning Engineer', label: 'Machine Learning Engineer', icon: Cpu, badge: 'High Demand', desc: 'PyTorch, Deep Learning, MLOps, Models' },
  { id: 'Cloud Engineer', label: 'Cloud Engineer', icon: Cloud, badge: 'Infrastructure', desc: 'AWS, Linux, Docker, Kubernetes, CI/CD' },
  { id: 'Software Engineer', label: 'Software Engineer', icon: Code2, badge: 'Core Tech', desc: 'Algorithms, Data Structures, Distributed Systems' },
  { id: 'Data Scientist', label: 'Data Scientist', icon: Database, badge: 'Analytics', desc: 'Python, SQL, Statistics, Machine Learning' },
  { id: 'Backend Engineer', label: 'Backend Engineer', icon: Server, badge: 'Systems', desc: 'Go, Java, Microservices, Databases, APIs' },
  { id: 'Cybersecurity Engineer', label: 'Cybersecurity Engineer', icon: ShieldCheck, badge: 'Security', desc: 'Networks, Threat Analysis, Linux, Defense' },
  { id: 'Frontend Developer', label: 'Frontend Developer', icon: Layout, badge: 'Product UI', desc: 'React, Next.js, TypeScript, Design Systems' },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', icon: RefreshCw, badge: 'Automation', desc: 'Kubernetes, Terraform, Pipelines, Cloud' },
];

export const CareerGoalModal: React.FC<CareerGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onUpdateGoal,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>(currentGoal || 'Machine Learning Engineer');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
    setCustomGoal('');
  };

  const handleSubmit = () => {
    const finalGoal = customGoal.trim() ? customGoal.trim() : selectedGoal;
    if (!finalGoal) return;

    setIsReanalyzing(true);
    setTimeout(() => {
      onUpdateGoal(finalGoal);
      setIsReanalyzing(false);
      onClose();
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isReanalyzing}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Change Career Goal</h2>
            <p className="text-xs text-slate-500">
              CareerLens will instantly re-calibrate your match rankings, skill map, and missing skill analysis.
            </p>
          </div>
        </div>

        {/* Active vs New Indicator */}
        <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Current Active Goal:</span>
            <strong className="text-slate-900 font-bold">{currentGoal || 'Not specified'}</strong>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            Editable Anytime
          </span>
        </div>

        {/* Preset Roles Grid */}
        <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Select a Target Trajectory
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_GOALS.map((item) => {
              const isSelected = selectedGoal === item.id && !customGoal.trim();
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectGoal(item.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block line-clamp-1">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Goal Input */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Or Enter a Custom Career Role:
          </label>
          <input
            type="text"
            placeholder="e.g. Quantitative Developer, Blockchain Architect, AR/VR Specialist..."
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isReanalyzing}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isReanalyzing}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
          >
            {isReanalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-analyzing My Opportunities...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Re-analyze My Opportunities</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
