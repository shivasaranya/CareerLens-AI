'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  ArrowRight
} from 'lucide-react';
import { StudentProfile, MatchResult } from '@/types';

interface OpportunityCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  matchResults: MatchResult[];
  onNavigateToTab: (tab: string) => void;
  onOpenMatchDetails: (match: MatchResult) => void;
}

interface Message {
  sender: 'user' | 'copilot';
  text: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const OpportunityCopilot: React.FC<OpportunityCopilotProps> = ({
  isOpen,
  onClose,
  student,
  matchResults,
  onNavigateToTab,
  onOpenMatchDetails,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'copilot',
      text: student?.name
        ? `Hello ${student.name}! I am your Opportunity Copilot. I analyze your profile (${student.branch ? student.branch + ', ' : ''}${student.institution || 'Your Institution'}) against live opportunities to guide your next move. What would you like to explore?`
        : `Hello! I am your Opportunity Copilot. I analyze your verified profile against live opportunities to guide your next move. What would you like to explore?`,
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const quickPromptChips = [
    'Why am I matched with ABC Tech?',
    'What skills am I missing the most?',
    'Which opportunities are closing soon?',
    'What should I learn next?',
    'What if I switch to AI?',
  ];

  const handleSendPrompt = (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: Message = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const p = prompt.toLowerCase();
      let reply: Message;

      if (p.includes('abc tech') || p.includes('why am i matched')) {
        const abcMatch = matchResults.find((m) => m.opportunity.organization.toLowerCase().includes('abc'));
        reply = {
          sender: 'copilot',
          text: `You have a 94% match with ABC Technologies! You meet 100% of eligibility, and your verified Python (87% conf), SQL, and Distributed Stream Analyzer project directly mirror their backend requirements. The only missing skill is Docker.`,
          action: abcMatch
            ? {
                label: 'View ABC Tech Match Details',
                onClick: () => onOpenMatchDetails(abcMatch),
              }
            : undefined,
        };
      } else if (p.includes('missing') || p.includes('gap')) {
        reply = {
          sender: 'copilot',
          text: `Your highest-impact gap across 14 target backend roles is Docker & Containerization, followed by AWS Cloud Deployment. Learning Docker could raise your qualification baseline for 17+ roles.`,
          action: {
            label: 'Open Skill Gap Map',
            onClick: () => onNavigateToTab('skill-gap'),
          },
        };
      } else if (p.includes('closing') || p.includes('deadline')) {
        const urgent = matchResults.filter((m) => m.opportunity.daysRemaining <= 5);
        reply = {
          sender: 'copilot',
          text: `You have ${urgent.length} high-relevance opportunities closing in under 5 days, including ABC Technologies (4 days left) and Zepto (6 days left). We recommend submitting these first!`,
          action: {
            label: 'Filter by "Apply Now"',
            onClick: () => onNavigateToTab('dashboard'),
          },
        };
      } else if (p.includes('learn next')) {
        reply = {
          sender: 'copilot',
          text: `We recommend containerizing your existing "Distributed Stream Analyzer" project with a Dockerfile and docker-compose. It requires ~4 days and directly resolves your most common employer requirement gap.`,
          action: {
            label: 'View 14-Day Roadmap',
            onClick: () => onNavigateToTab('roadmap'),
          },
        };
      } else if (p.includes('switch to ai') || p.includes('ai')) {
        reply = {
          sender: 'copilot',
          text: `If you pivot to Applied AI/ML, you currently match 68% for Google Research India and IISc CPS fellowships. Adding PyTorch and fine-tuning projects will elevate your match to 89%+ (+12 new research roles unlocked).`,
          action: {
            label: 'Launch What-If Simulator',
            onClick: () => onNavigateToTab('what-if'),
          },
        };
      } else {
        reply = {
          sender: 'copilot',
          text: `I’ve evaluated your query against your profile. You currently have 4 "Apply Now" matches and 6 "Strong Matches". Would you like to inspect your radar or simulate a skill upgrade?`,
          action: {
            label: 'View Opportunity Radar',
            onClick: () => onNavigateToTab('dashboard'),
          },
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white border border-[#E6EAF2] rounded-2xl shadow-2xl flex flex-col h-[560px] overflow-hidden text-[#172033]">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-[#E6EAF2] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Opportunity Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">Contextual Profile & Match Intelligence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>

            {m.action && (
              <button
                onClick={m.action.onClick}
                className="mt-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <span>{m.action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-[#E6EAF2] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        {quickPromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(chip)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-[11px] text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-[#E6EAF2] flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(inputText)}
          placeholder="Ask Copilot about any match or skill..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
        />
        <button
          onClick={() => handleSendPrompt(inputText)}
          disabled={!inputText.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
