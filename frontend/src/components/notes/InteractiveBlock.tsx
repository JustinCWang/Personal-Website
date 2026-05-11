/**
 * InteractiveBlock Component
 * A wrapper component for interactive React elements
 * Provides a terminal-like window frame with a title bar
 */

import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface InteractiveBlockProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/**
 * Wrapper component for rendering interactive notes elements
 * @param {InteractiveBlockProps} props - Component props containing children and optional title
 * @returns {JSX.Element} Styled container with optional title bar
 */
export const InteractiveBlock: React.FC<InteractiveBlockProps> = ({ 
  children, 
  title, 
  className = '' 
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`my-8 rounded-xl overflow-hidden border shadow-2xl font-mono ${
      isDarkMode ? 'border-green-500/30 bg-black/50 shadow-green-500/10' : 'border-slate-300 bg-white shadow-slate-200'
    } ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-black/80 border-green-500/30' : 'bg-slate-100 border-slate-300'
        }`}>
          <span className={`text-sm font-semibold uppercase tracking-wider ${
            isDarkMode ? 'text-green-400' : 'text-slate-700'
          }`}>{title}</span>
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
