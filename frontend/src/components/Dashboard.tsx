/**
 * Dashboard Component
 * @desc Main dashboard for authenticated users to manage their projects
 * @returns {JSX.Element} Dashboard interface with project management features
 */

// Import React dependencies and hooks
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import authentication context and components
import { useAuth } from '../hooks/useAuth.ts'
import { useDarkMode } from '../hooks/useDarkMode.ts'
import ProjectForm from './ProjectForm.tsx'
import ProjectsList from './ProjectsList.tsx'

// Import SkillsManager component
import SkillsManager from './SkillsManager'

// Define tab types
type TabType = 'projects' | 'skills' | 'add-project'

const Dashboard = () => {
  // State management for UI
  const [activeTab, setActiveTab] = useState<TabType>('projects')  // Currently active tab
  
  // Authentication context and navigation
  const { user, logout } = useAuth()  // Get current user and logout function
  const navigate = useNavigate()      // Navigation function for routing
  const { isDarkMode, toggleDarkMode } = useDarkMode()             // Persistent dark mode state

  // Tab configuration
  const tabs = [
    { id: 'projects' as TabType, label: 'Your Projects', icon: '📁' },
    { id: 'skills' as TabType, label: 'Skills Management', icon: '⚡' },
    { id: 'add-project' as TabType, label: 'Add New Project', icon: '➕' }
  ]

  /**
   * Handle new project creation
   * @desc Switches to projects tab after creation
   */
  const handleProjectCreated = () => {
    setActiveTab('projects')  // Switch to projects tab after creation
  }

  /**
   * Navigate to landing page
   * @desc Redirects user to the public landing page
   */
  const handleViewLandingPage = () => {
    navigate('/')
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'page-bg-dark' : 'page-bg-light'
    }`}>
      {/* Header Section */}
      <header className={`transition-all duration-300 ${isDarkMode ? 'shadow-[0_4px_24px_0_rgba(34,197,94,0.15)]' : 'shadow-lg'}`}>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h2 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide font-mono ${
                isDarkMode ? 'text-primary-dark' : 'text-primary-light'
              }`}>
                Dashboard
              </h2>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-green-400 text-black hover:bg-green-300'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  // Sun icon for light mode
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  // Moon icon for dark mode
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* View Landing Page Button */}
              <button
                onClick={handleViewLandingPage}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 text-green-300 hover:bg-gray-700'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title="View Landing Page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3v-7a1 1 0 011-1h2a1 1 0 011 1v7h3a1 1 0 001-1V10l-7-7-7 7z"></path></svg>
              </button>
              
              {/* User Welcome Message */}
              <span className={`hidden sm:inline font-mono text-xs sm:text-sm ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                <span className="hidden md:inline">Welcome, {user?.name}</span>
                <span className="hidden sm:inline md:hidden">Hi, {user?.name}</span>
              </span>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-all duration-300 border-2 ${
                  isDarkMode ? 'btn-primary-dark' : 'btn-primary-light'
                }`}
                title="Logout"
              >
                {/* Logout/Exit Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
            <div className={`flex rounded-lg p-0.5 sm:p-1 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-green-500' 
                : 'bg-slate-200 border border-slate-300'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-md transition-all duration-300 font-mono font-medium flex items-center gap-1 sm:gap-2 ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'bg-green-500 text-black shadow-lg'
                        : 'bg-white text-slate-800 shadow-lg'
                      : isDarkMode
                        ? 'text-green-300 hover:text-green-400 hover:bg-gray-700'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm sm:text-base md:text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-green-400 scale-125'
                      : 'bg-slate-800 scale-125'
                    : isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title={tab.label}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'projects' && (
            <div className="animate-fadeIn">
              <ProjectsList isDarkMode={isDarkMode} />
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div className="animate-fadeIn">
              <SkillsManager isDarkMode={isDarkMode} />
            </div>
          )}
          
          {activeTab === 'add-project' && (
            <div className="animate-fadeIn">
              <ProjectForm onProjectCreated={handleProjectCreated} isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard 