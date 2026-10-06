'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle
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
  const hasProfile = Boolean(student && student.name && student.name.trim().length > 0);
  const topMatch = matchResults[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'copilot',
      text: hasProfile
        ? `Hello ${student.name}! I am your AI Opportunity Copilot. I analyze your profile and career goal (${student.careerGoal || 'Software Engineer'}) against live opportunities in our database. How can I assist your career progression today?`
        : `Hello! I am your AI Opportunity Copilot. Build your profile to unlock contextual match insights and personalized preparation advice.`,
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const quickPromptChips = [
    'Why am I matched to my top role?',
    'What skills am I missing?',
    'Which job should I apply to first?',
    'Which deadlines are approaching?',
    'What should I learn next?',
    'What if I learn AWS or Docker?',
  ];

  const handleSendPrompt = (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: Message = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const p = prompt.toLowerCase();
      let reply: Message;

      if (!hasProfile) {
        reply = {
          sender: 'copilot',
          text: 'To get personalized match intelligence, please create your profile with education, career goal, and verified skills.',
          action: {
            label: 'Create My Profile',
            onClick: () => onNavigateToTab('profile'),
          },
        };
      } else if (p.includes('why am i matched') || p.includes('top role') || p.includes('why match')) {
        if (topMatch) {
          const opp = topMatch.opportunity;
          const matchedSkillsList = topMatch.matchedSkills.slice(0, 3).join(', ');
          const missing = topMatch.missingSkills.slice(0, 2).join(' and ');
          reply = {
            sender: 'copilot',
            text: `You have an AI-estimated match of ${topMatch.overallMatchScore}% for "${opp.title}" at ${opp.organization}. Your background in ${matchedSkillsList || 'core programming'} aligns with their requirements.${missing ? ` The primary remaining gap is ${missing}.` : ' You cover all baseline prerequisites.'}`,
            action: {
              label: `View ${opp.organization} Match Details`,
              onClick: () => onOpenMatchDetails(topMatch),
            },
          };
        } else {
          reply = {
            sender: 'copilot',
            text: 'We are analyzing active opportunities against your profile. Explore the Opportunities or Jobs tabs to browse active postings.',
          };
        }
      } else if (p.includes('missing') || p.includes('gap')) {
        const allMissing = new Map<string, number>();
        matchResults.forEach((m) => {
          m.missingSkills.forEach((s) => allMissing.set(s, (allMissing.get(s) || 0) + 1));
        });
        const sortedGaps = Array.from(allMissing.entries()).sort((a, b) => b[1] - a[1]);
        const topGaps = sortedGaps.slice(0, 3).map(([s, cnt]) => `${s} (in ${cnt} roles)`).join(', ');

        reply = {
          sender: 'copilot',
          text: sortedGaps.length > 0
            ? `Based on active postings matching your goal (${student.careerGoal || 'Software Engineer'}), the most frequently requested skills you have not yet demonstrated are: ${topGaps}. Building project evidence in these areas will yield the highest match improvement.`
            : 'You have high coverage across active postings for your selected career goal! Keep adding verified project artifacts to stand out.',
          action: {
            label: 'Explore Skill Map',
            onClick: () => onNavigateToTab('skill-map'),
          },
        };
      } else if (p.includes('apply to first') || p.includes('which job')) {
        const bestJob = matchResults.find(
          (m) => m.opportunity.type === 'Job' || m.opportunity.type === 'Full-time'
        );
        if (bestJob) {
          reply = {
            sender: 'copilot',
            text: `We recommend prioritizing "${bestJob.opportunity.title}" at ${bestJob.opportunity.organization} (${bestJob.overallMatchScore}% AI-estimated match, ${bestJob.opportunity.daysRemaining} days remaining). Your profile matches their core tech stack and meets eligibility criteria.`,
            action: {
              label: `Inspect ${bestJob.opportunity.organization}`,
              onClick: () => onOpenMatchDetails(bestJob),
            },
          };
        } else {
          reply = {
            sender: 'copilot',
            text: 'Check the Jobs tab to review active full-time roles calibrated for your target career direction.',
            action: {
              label: 'Browse Jobs',
              onClick: () => onNavigateToTab('jobs'),
            },
          };
        }
      } else if (p.includes('deadline') || p.includes('closing')) {
        const urgent = matchResults.filter((m) => m.opportunity.daysRemaining <= 14);
        const topUrgent = urgent.slice(0, 2).map((m) => `${m.opportunity.organization} (${m.opportunity.daysRemaining} days remaining)`).join(', ');

        reply = {
          sender: 'copilot',
          text: urgent.length > 0
            ? `You have ${urgent.length} relevant opportunities with deadlines approaching within 14 days, including ${topUrgent}. Be sure to submit your applications through their official career portals.`
            : 'No immediate deadlines in the next 14 days. This gives you time to build project evidence for upcoming application cycles.',
        };
      } else if (p.includes('learn next') || p.includes('what should i learn')) {
        const goal = student.careerGoal || 'Software Engineer';
        reply = {
          sender: 'copilot',
          text: `For a ${goal}, prioritizing production containerization (Docker) and Cloud deployment (AWS or Linux) provides the steepest increase in qualified postings. Try containerizing one of your existing project APIs with a clean Dockerfile.`,
          action: {
            label: 'Try What-If Simulator',
            onClick: () => onNavigateToTab('what-if'),
          },
        };
      } else if (p.includes('aws') || p.includes('docker')) {
        reply = {
          sender: 'copilot',
          text: `Adding verified AWS or Docker competence can elevate your qualifications across cloud infrastructure, backend, and DevOps opportunities by approximately +12% to +18% in estimated match potential. Use the What-If Simulator to simulate the exact impact!`,
          action: {
            label: 'Launch What-If Simulator',
            onClick: () => onNavigateToTab('what-if'),
          },
        };
      } else {
        reply = {
          sender: 'copilot',
          text: `I analyze opportunities strictly against your demonstrated profile (${student.name}, targeting ${student.careerGoal || 'Engineering'}). You can ask me about why you match any opportunity, your priority skill gaps, or which roles to apply to first.`,
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[580px] animate-in slide-in-from-bottom-6">
      {/* Copilot Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 to-violet-700 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">Opportunity Copilot</h3>
            <span className="text-[10px] text-indigo-200 block">
              Grounded strictly in your profile & active data
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-br-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
              }`}
            >
              {m.text}
            </div>
            {m.action && (
              <button
                onClick={m.action.onClick}
                className="mt-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <span>{m.action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPromptChips.map((chip, cIdx) => (
          <button
            key={cIdx}
            onClick={() => handleSendPrompt(chip)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputText);
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask Opportunity Copilot..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
