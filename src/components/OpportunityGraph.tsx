'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Info 
} from 'lucide-react';
import { StudentProfile, Opportunity } from '@/types';

interface OpportunityGraphProps {
  student: StudentProfile;
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'student' | 'skill' | 'role' | 'reqSkill' | 'opp';
  details: string;
  count?: number;
  oppId?: string;
  highlight?: boolean;
}

interface ColumnDef {
  title: string;
  desc: string;
  nodes: GraphNode[];
}

export const OpportunityGraph: React.FC<OpportunityGraphProps> = ({
  student,
  opportunities,
  onSelectOpportunity,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>({
    id: 'node-skill-python',
    label: 'Python',
    type: 'skill',
    details: 'Verified core strength (87% confidence). Directly unlocks 18+ roles.',
    count: 18,
  });

  const columns: ColumnDef[] = [
    {
      title: 'STUDENT',
      desc: 'Verified Profile',
      nodes: [
        {
          id: 'node-student',
          label: student.name,
          type: 'student',
          details: `${student.branch} · NIT Warangal (${student.graduationYear})`,
          highlight: true,
        },
      ],
    },
    {
      title: 'CURRENT SKILLS',
      desc: 'Evidence-backed',
      nodes: [
        {
          id: 'node-skill-python',
          label: 'Python',
          type: 'skill',
          details: '87% confidence. Bridges backend, data, and ML engineering tracks.',
          count: 18,
        },
        {
          id: 'node-skill-sql',
          label: 'SQL & DB',
          type: 'skill',
          details: '82% confidence. Relational database query architecture.',
          count: 12,
        },
        {
          id: 'node-skill-rest',
          label: 'REST APIs',
          type: 'skill',
          details: '89% confidence. High-throughput microservice interfaces.',
          count: 15,
        },
        {
          id: 'node-skill-react',
          label: 'React',
          type: 'skill',
          details: '78% confidence. Modern component UI development.',
          count: 9,
        },
      ],
    },
    {
      title: 'CAREER ROLES',
      desc: 'Target Trajectories',
      nodes: [
        {
          id: 'node-role-backend',
          label: 'Backend Systems',
          type: 'role',
          details: 'Distributed architecture, caching, microservices, and databases.',
          count: 22,
        },
        {
          id: 'node-role-ai',
          label: 'Applied AI & ML',
          type: 'role',
          details: 'Foundation model evaluation, vision, embeddings, research.',
          count: 14,
        },
        {
          id: 'node-role-devops',
          label: 'Cloud & DevOps',
          type: 'role',
          details: 'Infrastructure automation, Linux, container orchestration.',
          count: 11,
        },
      ],
    },
    {
      title: 'REQUIRED SKILLS',
      desc: 'To Reach 100%',
      nodes: [
        {
          id: 'node-req-docker',
          label: 'Docker & CI/CD',
          type: 'reqSkill',
          details: 'Critical bridge skill to unlock production backend environments.',
          count: 14,
        },
        {
          id: 'node-req-aws',
          label: 'AWS Cloud',
          type: 'reqSkill',
          details: 'Competitive cloud deployment credentials for infra squads.',
          count: 12,
        },
        {
          id: 'node-req-pytorch',
          label: 'PyTorch / CUDA',
          type: 'reqSkill',
          details: 'Research engineering bridge for Google Research and IISc CPS.',
          count: 7,
        },
      ],
    },
    {
      title: 'OPPORTUNITIES',
      desc: 'Live Matches',
      nodes: opportunities.slice(0, 4).map((opp) => ({
        id: `node-opp-${opp.id}`,
        label: opp.organization,
        type: 'opp' as const,
        details: `${opp.title} (${opp.location})`,
        oppId: opp.id,
      })),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#172033]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
          <GitBranch className="w-4 h-4" />
          <span>Interactive Career Map</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          YOUR CAREER OPPORTUNITY GRAPH
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
          Explore how your current skills branch into career roles, which bridge skills are required, and the exact organizations looking for you right now. Click any node to inspect.
        </p>
      </div>

      {/* Graph Visual Canvas in Light Theme */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6EAF2] shadow-xs overflow-x-auto">
        <div className="min-w-[850px] grid grid-cols-5 gap-6 relative">
          {columns.map((col, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <div className="border-b border-[#E6EAF2] pb-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
                  {col.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">{col.desc}</p>
              </div>

              <div className="space-y-3 pt-2">
                {col.nodes.map((node) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer shadow-2xs ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-1 ring-indigo-400'
                          : 'bg-white border-[#E6EAF2] hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                          {node.label}
                        </span>
                        {node.count && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                            {node.count}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 font-medium uppercase">
                        {node.type}
                      </span>

                      {isSelected && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Intelligence Inspector */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-indigo-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Selected Node: {selectedNode.type.toUpperCase()}
            </span>
            <span className="text-xs font-bold text-slate-900">{selectedNode.label}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {selectedNode.details}
          </p>
        </div>

        {selectedNode.oppId ? (
          <button
            onClick={() => {
              const matchedOpp = opportunities.find((o) => o.id === selectedNode.oppId);
              if (matchedOpp) onSelectOpportunity(matchedOpp);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs flex-shrink-0 cursor-pointer"
          >
            <span>View Opportunity Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive graph connected</span>
          </div>
        )}
      </div>
    </div>
  );
};
