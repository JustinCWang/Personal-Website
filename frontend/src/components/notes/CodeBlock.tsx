/**
 * CodeBlock Component
 * Renders syntax-highlighted code snippets
 * Uses react-syntax-highlighter with VSCode Dark Plus theme
 */

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
  className?: string;
}

/**
 * Component for rendering syntax-highlighted code snippets
 * @param {CodeBlockProps} props - Component props containing language and code
 * @returns {JSX.Element} Styled code block with syntax highlighting
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, className = '' }) => {
  return (
    <div className={`my-4 rounded-lg overflow-hidden shadow-lg border border-slate-700 ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.9rem',
          backgroundColor: '#1e1e1e', // VSCode dark background
        }}
        showLineNumbers={true}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};
