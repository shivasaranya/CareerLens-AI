'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      {/* Precision Lens + Career Path + AI Nodes Custom Vector Emblem */}
      <div className={`relative flex items-center justify-center ${iconDimensions} rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 p-0.5 shadow-md shadow-indigo-600/20 group-hover:shadow-indigo-600/35 transition-all duration-300`}>
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/70 to-violet-50/70" />
          
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 relative z-10"
          >
            {/* Outer Optical Lens Ring */}
            <circle
              cx="16"
              cy="16"
              r="11.5"
              stroke="url(#lensGradient)"
              strokeWidth="2.2"
              strokeDasharray="28 8"
              className="transition-transform duration-700 group-hover:rotate-45"
            />
            {/* Ascending Career Path Arc */}
            <path
              d="M7 21C9.5 17.5 13 14 16 14C19 14 22 10.5 25 7"
              stroke="url(#careerPathGradient)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* AI Constellation Nodes */}
            <circle cx="7" cy="21" r="2" fill="#4F46E5" />
            <circle cx="16" cy="14" r="2.2" fill="#7C3AED" />
            <circle cx="25" cy="7" r="2.5" fill="#06B6D4" />
            
            {/* Center Focus Iris Node */}
            <circle cx="16" cy="16" r="1.5" fill="#4F46E5" opacity="0.6" />

            <defs>
              <linearGradient id="lensGradient" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="0.5" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="careerPathGradient" x1="7" y1="21" x2="25" y2="7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="0.6" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={`font-black tracking-tight text-[#172033] ${titleSizes}`}>
            CareerLens
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs">
            AI
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-tight">
            See the opportunity. Understand the gap. Build your future.
          </p>
        )}
      </div>
    </div>
  );
};
