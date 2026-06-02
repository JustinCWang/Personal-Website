/**
 * Note Typography Components
 * Reusable layout components for notes
 * Handles dark mode state and typography styling internally
 */

import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionTitleProps extends BaseProps {
  id?: string;
}

interface TopicBlockProps extends BaseProps {
  title: React.ReactNode;
}

/**
 * Main title component for note pages
 * @param {BaseProps} props - Component props containing children and className
 * @returns {JSX.Element} H1 heading
 */
export const NoteTitle: React.FC<BaseProps> = ({ children, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'} ${className}`}>
      {children}
    </h1>
  );
};

/**
 * Section title component with support for anchor links
 * @param {SectionTitleProps} props - Component props containing id, children, and className
 * @returns {JSX.Element} H2 heading with scroll-margin for smooth anchor linking
 */
export const NoteSectionTitle: React.FC<SectionTitleProps> = ({ children, id, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <h2 id={id} className={`text-2xl font-bold mt-12 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'} ${className}`}>
      {children}
    </h2>
  );
};

/**
 * Sub-section title component with support for anchor links
 * @param {SectionTitleProps} props - Component props containing id, children, and className
 * @returns {JSX.Element} H3 heading with scroll-margin for smooth anchor linking
 */
export const NoteSubSectionTitle: React.FC<SectionTitleProps> = ({ children, id, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <h3 id={id} className={`text-xl font-bold mt-8 mb-3 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-300' : 'text-slate-800'} ${className}`}>
      {children}
    </h3>
  );
};

/**
 * Paragraph component for note content
 * @param {BaseProps} props - Component props containing children and className
 * @returns {JSX.Element} Stylized paragraph
 */
export const NoteParagraph: React.FC<BaseProps> = ({ children, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <p className={`font-mono mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'} ${className}`}>
      {children}
    </p>
  );
};

/**
 * Container for grouped mini-topics within a note section.
 * @param {BaseProps} props - Component props containing children and className
 * @returns {JSX.Element} Spaced mini-topic group
 */
export const NoteTopicGroup: React.FC<BaseProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-5 mb-8 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Mini-topic block with a themed left border and heading.
 * @param {TopicBlockProps} props - Component props containing title, children, and className
 * @returns {JSX.Element} Stylized note topic block
 */
export const NoteTopicBlock: React.FC<TopicBlockProps> = ({ title, children, className = '' }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'} ${className}`}>
      <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>{title}</h4>
      {children}
    </div>
  );
};

/**
 * Header component for the top of note pages
 * @param {Object} props - Component props containing title and subtitle
 * @returns {JSX.Element} Header container with title and subtitle
 */
export const NoteHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`mb-12 border-b pb-8 ${isDarkMode ? 'border-green-500/30' : 'border-slate-200'}`}>
      <NoteTitle>{title}</NoteTitle>
      <p className={`text-xl font-mono ${isDarkMode ? 'text-green-300' : 'text-slate-500'}`}>
        {subtitle}
      </p>
    </div>
  );
};
