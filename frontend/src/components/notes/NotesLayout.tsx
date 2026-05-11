import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

const TOPICS = [
  {
    title: 'Mathematics',
    items: [
      { 
        name: 'Calculus', 
        path: '/notes/calculus',
        subtopics: [
          { name: '1. Limits', hash: 'limits' },
          { name: '2. Derivatives', hash: 'derivatives' },
          { name: '3. Integrals', hash: 'integrals' }
        ]
      }
    ]
  },
  {
    title: 'Computer Science',
    items: [
      { 
        name: 'Computer Science Notes', 
        path: '/notes/cs',
        subtopics: [
          { name: 'Data Structures', hash: 'data-structures' },
          { name: 'Sorting Algorithms', hash: 'sorting' }
        ]
      }
    ]
  }
];

interface NotesLayoutProps {
  children: React.ReactNode;
}

export const NotesLayout: React.FC<NotesLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderThemeIcon = () => {
    return isDarkMode ? (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen transition-all duration-300 ${
      isDarkMode ? 'page-bg-dark text-green-100' : 'page-bg-light text-slate-800'
    }`} style={{ scrollBehavior: 'smooth' }}>
      
      {/* Top Bar for Mobile - Fixed */}
      <div className={`md:hidden sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b ${
        isDarkMode ? 'bg-black/90 border-green-500/30' : 'bg-white/90 border-slate-200'
      } backdrop-blur-md`}>
        <Link to="/notes" className={`text-lg font-bold font-mono ${
          isDarkMode ? 'text-green-400 hacker-text-gradient' : 'text-blue-600'
        }`}>
          Digital Notes
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-green-400 text-black hover:bg-green-300'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {renderThemeIcon()}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-md ${
              isDarkMode ? 'text-green-400' : 'text-slate-600'
            }`}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 flex-shrink-0 border-r md:sticky md:top-0 md:h-screen md:overflow-y-auto custom-scrollbar transition-all ${
        mobileMenuOpen ? 'block' : 'hidden md:block'
      } ${
        isDarkMode ? 'border-green-500/30 bg-black/50 md:bg-transparent' : 'border-slate-200 bg-white md:bg-transparent'
      }`}>
        <div className="p-6">
          <div className="hidden md:flex items-center justify-between mb-8">
            <Link to="/notes" className={`text-xl font-bold block hover:opacity-80 transition-opacity font-mono ${
              isDarkMode ? 'text-green-400 hacker-text-gradient' : 'text-slate-800'
            }`}>
              Digital Notes
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-green-400 text-black hover:bg-green-300'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {renderThemeIcon()}
            </button>
          </div>
          
          <Link to="/" className={`block mb-8 text-sm font-mono hover:underline ${
             isDarkMode ? 'text-green-500' : 'text-slate-500'
          }`}>
            &larr; Back to Portfolio
          </Link>
          
          <div className="space-y-8">
            {TOPICS.map((topic, index) => (
              <div key={index}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 font-mono ${
                  isDarkMode ? 'text-green-500/70' : 'text-slate-500'
                }`}>
                  {topic.title}
                </h3>
                <ul className="space-y-2">
                  {topic.items.map((item, itemIndex) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={itemIndex}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md transition-colors text-sm font-medium font-mono ${
                            isActive 
                              ? (isDarkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-50 text-blue-600')
                              : (isDarkMode ? 'text-green-300 hover:bg-green-500/10 hover:text-green-200' : 'text-slate-600 hover:bg-slate-100')
                          }`}
                        >
                          {item.name}
                        </Link>
                        {isActive && item.subtopics && (
                          <ul className="mt-1 ml-4 border-l-2 border-slate-200 dark:border-green-500/30 pl-2 space-y-1">
                            {item.subtopics.map((sub, subIndex) => (
                              <li key={subIndex}>
                                <a 
                                  href={`#${sub.hash}`}
                                  className={`block px-2 py-1 text-xs font-mono transition-colors ${
                                    isDarkMode 
                                      ? 'text-green-300 hover:text-green-400 hover:bg-green-500/10' 
                                      : 'text-slate-500 hover:text-blue-500 hover:bg-slate-50'
                                  }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {sub.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 max-w-4xl mx-auto px-6 py-10 pb-24 md:px-12 w-full transition-all duration-300 ${mobileMenuOpen ? 'hidden md:block' : ''}`}>
        <div className="font-mono w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
