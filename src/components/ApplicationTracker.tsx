'use client';

import React from 'react';
import { 
  BookmarkCheck, 
  Building2, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import { ApplicationTrackerItem } from '@/types';

interface ApplicationTrackerProps {
  applications: ApplicationTrackerItem[];
  onUpdateStatus: (id: string, newStatus: ApplicationTrackerItem['status']) => void;
  onRemoveApplication: (id: string) => void;
  onExploreMore: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateStatus,
  onRemoveApplication,
  onExploreMore,
}) => {
  const columns: { status: ApplicationTrackerItem['status']; label: string; color: string }[] = [
    { status: 'Drafting', label: 'Preparing / Tailoring', color: 'border-slate-300 text-slate-700' },
    { status: 'Applied', label: 'Submitted', color: 'border-indigo-300 text-indigo-700' },
    { status: 'Interviewing', label: 'In Rounds', color: 'border-blue-300 text-blue-700' },
    { status: 'Offer', label: 'Offer Received', color: 'border-emerald-300 text-emerald-700' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Application Pipeline & Growth</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            MY OPPORTUNITY PIPELINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track active applications, interview milestones, and application preparation notes in one place.
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <span>Find More Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Analytics Growth Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E6EAF2] rounded-xl text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-500">Total Tracked</span>
          <div className="text-2xl font-mono font-extrabold text-[#172033] mt-1">{applications.length}</div>
        </div>
        <div className="p-4 bg-white border border-[#E6EAF2] rounded-xl text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-blue-600">In Active Rounds</span>
          <div className="text-2xl font-mono font-extrabold text-blue-700 mt-1">
            {applications.filter((a) => a.status === 'Interviewing').length}
          </div>
        </div>
        <div className="p-4 bg-white border border-[#E6EAF2] rounded-xl text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Verified Skills</span>
          <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-1">8 Core</div>
        </div>
        <div className="p-4 bg-white border border-[#E6EAF2] rounded-xl text-center shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-600">Readiness Score</span>
          <div className="text-2xl font-mono font-extrabold text-amber-700 mt-1">84%</div>
        </div>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = applications.filter((a) => a.status === col.status);
          return (
            <div key={col.status} className="bg-slate-100/70 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 shadow-2xs border border-slate-200">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[160px]">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-slate-400 italic">
                    No opportunities in this stage
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{item.organization}</span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          {item.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <select
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-[10px] shadow-2xs cursor-pointer"
                        >
                          <option value="Drafting">Drafting</option>
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offer">Offer</option>
                        </select>

                        <button
                          onClick={() => onRemoveApplication(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Remove from pipeline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
