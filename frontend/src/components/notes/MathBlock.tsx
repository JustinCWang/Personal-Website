import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath as ReactInlineMath } from 'react-katex';
import { useDarkMode } from '../../hooks/useDarkMode';

interface MathProps {
  math: string;
  className?: string;
}

export const MathBlock: React.FC<MathProps> = ({ math, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`my-6 overflow-x-auto text-center ${isDarkMode ? 'text-green-300' : 'text-slate-800'} ${className}`}>
      <BlockMath math={math} />
    </div>
  );
};

export const InlineMath: React.FC<MathProps> = ({ math, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <span className={`${isDarkMode ? 'text-green-300' : 'text-slate-800'} ${className}`}>
      <ReactInlineMath math={math} />
    </span>
  );
};
