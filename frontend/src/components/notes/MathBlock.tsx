/**
 * Math Components
 * Renders mathematical expressions using KaTeX
 * Provides both block-level and inline rendering
 */

import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath as ReactInlineMath } from 'react-katex';
import { useDarkMode } from '../../hooks/useDarkMode';

interface MathProps {
  math: string;
  className?: string;
}

/**
 * Component for rendering block-level mathematical expressions
 * @param {MathProps} props - Component props containing the math string
 * @returns {JSX.Element} Centered block-level math expression
 */
export const MathBlock: React.FC<MathProps> = ({ math, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`my-1 overflow-x-auto text-center ${isDarkMode ? 'text-green-300' : 'text-slate-800'} ${className}`}>
      <BlockMath math={math} />
    </div>
  );
};

/**
 * Component for rendering inline mathematical expressions
 * @param {MathProps} props - Component props containing the math string
 * @returns {JSX.Element} Inline math expression
 */
export const InlineMath: React.FC<MathProps> = ({ math, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <span className={`${isDarkMode ? 'text-green-300' : 'text-slate-800'} ${className}`}>
      <ReactInlineMath math={math} />
    </span>
  );
};
