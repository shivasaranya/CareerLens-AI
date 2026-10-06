'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2
} from 'lucide-react';
import { Opportunity, VerificationStatus, OpportunityType, WorkMode } from '@/types';

interface AdminPanelProps {
  opportunities: Opportunity[];
  onUpdateOpportunityVerification: (id: string, status: VerificationStatus, trustScore: number) => void;
  onAddOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  opportunities,
  onUpdateOpportunityVerification,
  onAddOpportunity,
  onDeleteOpportunity,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newType, setNewType] = useState<OpportunityType>('Internship');
  const [newMode, setNewMode] = useState<WorkMode>('Remote');
  const [newLocation, setNewLocation] = useState('Bengaluru, India');
  const [newSkills, setNewSkills] = useState('Python, SQL, Docker');
  const [newDeadlineDays, setNewDeadlineDays] = useState(14);
  const [newUrl, setNewUrl] = useState('https://careers.example.com');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-custom-${Date.now()}`,
      title: newTitle.trim(),
      organization: newOrg.trim(),
      type: newType,
      location: newLocation.trim(),
      workMode: newMode,
      deadline: '2026-10-20',
      daysRemaining: newDeadlineDays,
      description: `Newly submitted verified position at ${newOrg.trim()}. Real-time matching active.`,
      requiredSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: ['Git', 'Communication'],
      eligibleBranches: ['Computer Science', 'Information Technology', 'All'],
      eligibleGradYears: [2026, 2027],
      applicationUrl: newUrl.trim(),
      officialUrl: newUrl.trim(),
      source: `${newOrg.trim()} Official Portal`,
      sourceUrl: newUrl.trim(),
      lastChecked: '2026-10-06',
      verification: {
        status: 'Verified',
        trustScore: 92,
        factors: {
          sourceCredibility: 'High',
          activeDeadline: true,
          organizationVerified: true,
          validApplicationUrl: true,
          postingFreshnessDays: 1,
          suspiciousRequirementsFlag: false,
          duplicateDetected: false,
        },
        notes: 'Admin verified via corporate domain & registrar registry check.',
      },
    };

    onAddOpportunity(newOpp);
    setShowAddForm(false);
    setNewTitle('');
    setNewOrg('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Opportunity Safety & Trust Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            DATA INTEGRITY & VERIFICATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor real-world source reliability, inspect fraud indicators, and manage active opportunities.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel Creation' : 'Add New Verified Opportunity'}</span>
        </button>
      </div>

      {/* Add Opportunity Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Create & Verify Opportunity
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-700 font-semibold">Position Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Associate"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold">Organization</label>
              <input
                type="text"
                required
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                placeholder="e.g. Postman India"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Research">Research</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>
            <div>
              <label className="text-slate-700 font-semibold">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold">Required Skills (Comma-separated)</label>
              <input
                type="text"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold">Official Portal Link</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              Publish Verified Opportunity
            </button>
          </div>
        </form>
      )}

      {/* Opportunities Verification Table */}
      <div className="bg-white rounded-2xl border border-[#E6EAF2] shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-[#E6EAF2] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Opportunity Registry ({opportunities.length} Total)
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Safety Shield Active: Auto-flagging suspicious deposits
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {opportunities.map((opp) => (
            <div key={opp.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    opp.verification.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : opp.verification.status === 'Needs Verification'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {opp.verification.status} ({opp.verification.trustScore}/100)
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">{opp.type}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{opp.title}</h4>
                <p className="text-xs text-slate-500">
                  {opp.organization} · {opp.location} · Deadline in {opp.daysRemaining} days
                </p>
                <p className="text-[11px] text-slate-600 italic pt-1">{opp.verification.notes}</p>
              </div>

              {/* Status Toggles & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onUpdateOpportunityVerification(opp.id, 'Verified', 95)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    opp.verification.status === 'Verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Verify
                </button>

                <button
                  onClick={() => onUpdateOpportunityVerification(opp.id, 'Needs Verification', 70)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    opp.verification.status === 'Needs Verification'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Review
                </button>

                <button
                  onClick={() => onUpdateOpportunityVerification(opp.id, 'High Risk', 18)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    opp.verification.status === 'High Risk'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Flag Risk
                </button>

                <button
                  onClick={() => onDeleteOpportunity(opp.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Delete opportunity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
