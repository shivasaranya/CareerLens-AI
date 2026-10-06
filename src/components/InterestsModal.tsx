'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface InterestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterests: string[];
  onSaveInterests: (interests: string[]) => void;
}

const INTEREST_OPTIONS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'App Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX',
  'Research',
  'Competitive Programming',
  'DevOps',
  'Blockchain',
  'Open Source',
];

export const InterestsModal: React.FC<InterestsModalProps> = ({
  isOpen,
  onClose,
  currentInterests,
  onSaveInterests,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState<string>('');

  useEffect(() => {
    setSelected(currentInterests || []);
    setCustomInterest('');
  }, [currentInterests, isOpen]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter((i) => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected([...selected, trimmed]);
      setCustomInterest('');
    }
  };

  const handleSave = () => {
    onSaveInterests(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Domains of Interest</h2>
            <p className="text-xs text-slate-500">
              Select technical fields and areas you want to explore or pursue.
            </p>
          </div>
        </div>

        {/* Currently Selected */}
        <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Selected ({selected.length})
          </span>
          {selected.length === 0 ? (
            <span className="text-slate-400 italic">No interests selected yet. Choose from below or add custom.</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((item) => (
                <span
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{item}</span>
                  <X className="w-3 h-3" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preset Interests */}
        <div className="space-y-2 mt-4 max-h-56 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Domains
          </span>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const isChecked = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isChecked
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Interest Input */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add custom interest (e.g. Embedded Systems)..."
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customInterest.trim()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Save Interests
          </button>
        </div>
      </div>
    </div>
  );
};
