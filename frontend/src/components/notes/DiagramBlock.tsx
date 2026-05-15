/**
 * DiagramBlock Component
 * Renders flowcharts and diagrams using Mermaid.js
 * Automatically adapts to light/dark mode themes
 */

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useDarkMode } from '../../hooks/useDarkMode';

interface DiagramBlockProps {
  chart: string;
  className?: string;
}

/**
 * Component for rendering Mermaid.js diagrams
 * @param {DiagramBlockProps} props - Component props containing the Mermaid chart string
 * @returns {JSX.Element} Mermaid diagram container
 */
export const DiagramBlock: React.FC<DiagramBlockProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: isDarkMode ? {
        darkMode: true,
        background: 'transparent',
        primaryColor: '#000000',
        primaryTextColor: '#4ade80', // green-400
        primaryBorderColor: '#22c55e', // green-500
        lineColor: '#86efac', // green-300
        secondaryColor: '#000000',
        tertiaryColor: '#111827' // gray-900
      } : {
        darkMode: false,
        background: 'transparent',
        primaryColor: '#ffffff',
        primaryTextColor: '#1e293b', // slate-800
        primaryBorderColor: '#cbd5e1', // slate-300
        lineColor: '#64748b', // slate-500
        secondaryColor: '#f8fafc',
        tertiaryColor: '#f1f5f9'
      }
    });

    if (containerRef.current) {
      // Clear previous
      containerRef.current.removeAttribute('data-processed');
      containerRef.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart, isDarkMode]);

  return (
    <div className={`my-1 flex justify-center py-1 px-6 ${className}`}>
      <div ref={containerRef} className="mermaid flex justify-center w-full font-mono">
        {chart}
      </div>
    </div>
  );
};
