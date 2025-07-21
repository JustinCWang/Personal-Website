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
import { useDarkMode, useAnimationFreeze } from '../hooks/useDarkMode.ts'
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
  const { isFrozen, toggleFreeze } = useAnimationFreeze()          // Animation freeze state

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
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h2 className={`text-2xl font-bold tracking-wide font-mono ${
                isDarkMode ? 'text-primary-dark' : 'text-primary-light'
              }`}>
                Dashboard
              </h2>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-green-400 text-black hover:bg-green-300'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Hacker Mode'}
              >
                {isDarkMode ? (
                  // Sun icon for light mode
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  // Hacker/terminal icon for dark mode
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Animation Freeze Toggle */}
              <button
                onClick={toggleFreeze}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isFrozen
                    ? 'bg-red-400 text-white hover:bg-red-300'
                    : isDarkMode
                      ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                      : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
                }`}
                title={isFrozen ? 'Resume Animations' : 'Freeze Animations'}
              >
                {isFrozen ? (
                  // Play icon when frozen
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  // Pause icon when not frozen
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* View Landing Page Button */}
              <button
                onClick={handleViewLandingPage}
                className={`px-6 py-2 rounded-lg transition-colors uppercase tracking-wide font-mono font-bold ${
                  isDarkMode ? 'btn-secondary-dark' : 'btn-secondary-light'
                }`}
              >
                View Landing Page
              </button>
              
              {/* User Welcome Message */}
              <span className={`font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                Welcome, {user?.name}
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-6">
            <div className={`flex rounded-lg p-1 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-green-500' 
                : 'bg-slate-200 border border-slate-300'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md transition-all duration-300 font-mono font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'bg-green-500 text-black shadow-lg'
                        : 'bg-white text-slate-800 shadow-lg'
                      : isDarkMode
                        ? 'text-green-300 hover:text-green-400 hover:bg-gray-700'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
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