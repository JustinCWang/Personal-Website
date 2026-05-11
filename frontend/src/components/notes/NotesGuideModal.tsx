/**
 * Notes Guide Modal
 * A popup overlay that displays the digital notes component guide
 */

import React, { useEffect } from 'react';
import { MathBlock, InlineMath, CodeBlock, DiagramBlock, InteractiveBlock, NoteHeader, NoteSectionTitle, NoteParagraph } from './index';
import { useDarkMode } from '../../hooks/useDarkMode';

interface NotesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotesGuideModal: React.FC<NotesGuideModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useDarkMode();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all p-6 md:p-12 custom-scrollbar ${isDarkMode ? 'bg-gray-900 border border-green-500/30 text-green-100' : 'bg-white border border-slate-200 text-slate-800'
        }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-black'
            }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <NoteHeader
          title="Notes Guide"
          subtitle="Welcome! Here's a guide on all the components used to build these notes."
        />

        <NoteSectionTitle>1. Using Math Blocks</NoteSectionTitle>
        <NoteParagraph>
          You can use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<InlineMath math="..." />'}</code> for inline equations like <InlineMath math="F" />, and <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<MathBlock math="..." />'}</code> for block equations:
        </NoteParagraph>

        {/* Render Math Block */}
        <MathBlock math="\int_a^b f(x) \, dx = F(b) - F(a)" />

        <NoteSectionTitle>2. Using Code Blocks</NoteSectionTitle>
        <NoteParagraph>
          Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<CodeBlock language="..." code={`...`} />'}</code> to highlight code snippets properly:
        </NoteParagraph>

        {/* Render Code Block */}
        <CodeBlock
          language="python"
          code={`def estimate_derivative(f, x, h=1e-5):
    """
    Numerically estimate the derivative of function f at point x.
    """
    return (f(x + h) - f(x)) / h`}
        />

        <NoteSectionTitle>3. Using Diagram Blocks</NoteSectionTitle>
        <NoteParagraph>
          Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<DiagramBlock chart={`...`} />'}</code> with Mermaid syntax to draw flowchart diagrams:
        </NoteParagraph>

        {/* Render Diagram Block */}
        <DiagramBlock
          chart={`graph LR
    A[Position s] -->|Derivative| B(Velocity v)
    B -->|Derivative| C(Acceleration a)`}
        />

        <NoteSectionTitle>4. Using Interactive Blocks</NoteSectionTitle>
        <NoteParagraph>
          Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<InteractiveBlock title="...">...</InteractiveBlock>'}</code> to wrap your custom interactive React components!
        </NoteParagraph>

        {/* Interactive Wrapper Block */}
        <InteractiveBlock title="Custom Component Wrapper">
          <div className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center font-mono ${isDarkMode ? 'border-green-500/50 text-green-500/80' : 'border-slate-600 text-slate-500'}`}>
            <p>Put interactive tools here!</p>
          </div>
        </InteractiveBlock>

      </div>
    </div>
  );
};
