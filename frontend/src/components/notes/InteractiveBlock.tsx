import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface InteractiveBlockProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const InteractiveBlock: React.FC<InteractiveBlockProps> = ({ 
  children, 
  title, 
  className = '' 
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`my-8 overflow-hidden rounded-lg border font-mono ${
      isDarkMode ? 'border-green-500/25 bg-black/35' : 'border-slate-200 bg-white'
    } ${className}`}>
      {title && (
        <div className={`border-b px-4 py-3 ${
          isDarkMode ? 'border-green-500/25 bg-green-500/5' : 'border-slate-200 bg-slate-50'
        }`}>
          <h4 className={`text-sm font-bold ${
            isDarkMode ? 'text-green-300' : 'text-slate-800'
          }`}>{title}
          </h4>
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};
