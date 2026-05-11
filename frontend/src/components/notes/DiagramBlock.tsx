import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useDarkMode } from '../../hooks/useDarkMode';

interface DiagramBlockProps {
  chart: string;
  className?: string;
}

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
    <div className={`my-8 flex justify-center p-6 rounded-xl border ${
      isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'
    } ${className}`}>
      <div ref={containerRef} className="mermaid flex justify-center w-full font-mono">
        {chart}
      </div>
    </div>
  );
};
