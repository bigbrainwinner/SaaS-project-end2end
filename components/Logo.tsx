import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightText?: boolean;
  vertical?: boolean;
  className?: string;
}

export default function Logo({
  size = 'md',
  showText = true,
  lightText = false,
  vertical = false,
  className = ''
}: LogoProps) {
  // Sizing styles
  const iconSizes = {
    xs: 'h-6.5 w-6.5 rounded',
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-10 w-10 rounded-xl'
  };

  const svgSizes = {
    xs: 'h-4 w-4',
    sm: 'h-4.5 w-4.5',
    md: 'h-5 w-5',
    lg: 'h-5.5 w-5.5'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <div className={`flex ${vertical ? 'flex-col items-center' : 'items-center gap-2.5'} ${className}`}>
      {/* Icon Container */}
      <div className={`flex items-center justify-center bg-violet-600 shadow-md shadow-violet-600/30 shrink-0 ${iconSizes[size]}`}>
        <svg
          className={`${svgSizes[size]} text-white`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-9-9" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <path d="M16 8l4-4" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`tracking-tight font-sans ${lightText ? 'text-white' : 'text-neutral-900'} ${textSizes[size]} ${vertical ? 'mt-3 text-xl' : ''}`}>
          hi <span className={`font-extrabold ${lightText ? 'text-violet-400' : 'text-violet-600'}`}>client</span>.
        </span>
      )}
    </div>
  );
}
