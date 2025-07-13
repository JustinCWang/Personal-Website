/**
 * Landing Page Component
 * Main landing page of the personal website
 * Displays personal information, skills, projects, and contact details
 * Features dark mode support and responsive design
 */

import React, { useState, useEffect } from 'react'
import { projectsAPI, skillsAPI, type Project } from '../services/api.ts'
import { useDarkMode, useAnimationFreeze } from '../hooks/useDarkMode.ts'
import { useScrollAnimation } from '../hooks/useScrollAnimation.ts'
import SkillCategoryDropdown from './SkillCategoryDropdown.tsx'
import ProjectDetailModal from './ProjectDetailModal.tsx'
import MatrixRain from './MatrixRain.tsx'
import RippleEffect from './RippleEffect.tsx'
import TypewriterText from './TypewriterText.tsx'

/**
 * Personal information configuration object
 * Contains static data about the user including:
 * - Basic info (name, title, bio)
 * - Profile image
 * - Hobbies and interests
 * - Social media links
 */
const PERSONAL_INFO = {
  name: "Justin Wang",
  title: "CS Student at Boston University", 
  bio: "Passionate about learning and creating fun and impactful software!",
  image: "/professionalpic.jpg", 
  hobbies: [
    "🎵 Classical Pianist",
    "📚 Anime & Manga", 
    "🎴 Pokémon TCG",
    "🎾 Tennis & Ping Pong",
    "⛸️ Rollerskating & Ice Skating",
    "🎮 Video Games"
  ],
  social: {
    github: "https://github.com/JustinCWang",
    linkedin: "https://linkedin.com/in/jcwang27",
    email: "jcwang27@bu.edu"
  }
}

/**
 * Props interface for the LandingPage component
 */
interface LandingPageProps {
  onLogin: () => void
  isAuthenticated?: boolean
  onGoToDashboard?: () => void
}

/**
 * LandingPage Component
 * @param {LandingPageProps} props - Component props
 * @param {Function} props.onLogin - Function to handle login
 * @param {boolean} [props.isAuthenticated] - Authentication state
 * @param {Function} [props.onGoToDashboard] - Function to navigate to dashboard
 */
const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isAuthenticated = false, onGoToDashboard }) => {
  // State management for projects, skills, and loading state
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<{ name: string; category: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { isFrozen, toggleFreeze } = useAnimationFreeze()

  // Scroll animation hooks for different sections
  const heroAnimation = useScrollAnimation({ threshold: 0.3 })
  const aboutAnimation = useScrollAnimation({ threshold: 0.2 })
  const projectsAnimation = useScrollAnimation({ threshold: 0.2 })
  const skillsAnimation = useScrollAnimation({ threshold: 0.2 })
  const hobbiesAnimation = useScrollAnimation({ threshold: 0.2 })
  const contactAnimation = useScrollAnimation({ threshold: 0.2 })

  // Modal state management
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Pagination configuration
  const projectsPerPage = 3 // Show 3 projects per row
  const totalPages = Math.ceil(featuredProjects.length / projectsPerPage)
  const startIndex = currentPage * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = featuredProjects.slice(startIndex, endIndex)

  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
  }

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0))
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @param {boolean} short - Whether to use short month format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString: string | undefined, short: boolean = false) => {
    if (!dateString) return 'Not specified';
    
    // Extract year and month directly from ISO string to avoid timezone issues
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    
    const months = short ? [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[month]} ${year}`;
  };

  /**
   * Fetch featured projects and skills data on component mount
   * Uses Promise.all for concurrent API calls
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [projects, skillsData] = await Promise.all([
          projectsAPI.getFeatured(),
          skillsAPI.getAll()
        ])
        setFeaturedProjects(projects)
        setSkills(skillsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * Handle project card click to open detail modal
   * @param {Project} project - The project to display
   */
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setIsDetailModalOpen(true)
  }

  /**
   * Close the detail modal
   */
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    // Delay clearing selectedProject to allow closing animation to complete
    setTimeout(() => {
      setSelectedProject(null)
    }, 350) // Match the animation duration in ProjectDetailModal
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode ? 'page-bg-dark' : 'page-bg-light'
    }`} style={{ scrollBehavior: 'smooth' }}>
      {/* Background Animations */}
      <MatrixRain isDarkMode={isDarkMode} isFrozen={isFrozen} />
      <RippleEffect isDarkMode={isDarkMode} isFrozen={isFrozen} />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
        {/* Navigation Header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Name/Logo */}
              <h1 className={`text-2xl font-bold tracking-wide font-mono ${
                isDarkMode 
                  ? 'text-primary-dark hacker-text-gradient' 
                  : 'text-primary-light'
              }`}>
                {isDarkMode ? '' : ''}{PERSONAL_INFO.name}
              </h1>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-12">
                <a
                  href="#about"
                  className={`text-lg font-bold transition-colors hover:scale-105 font-mono ${
                    isDarkMode
                      ? 'text-secondary-dark hover:text-primary-dark hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : 'text-secondary-light hover:text-primary-light'
                  }`}
                >
                  About
                </a>
                <a
                  href="#projects"
                  className={`text-lg font-bold transition-colors hover:scale-105 font-mono ${
                    isDarkMode
                      ? 'text-green-300 hover:text-green-400 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className={`text-lg font-bold transition-colors hover:scale-105 font-mono ${
                    isDarkMode
                      ? 'text-green-300 hover:text-green-400 hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Contact
                </a>
              </nav>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-4">
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
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div 
          ref={heroAnimation.elementRef}
          className="max-w-4xl mx-auto relative z-5"
        >
          {/* Hero text with typewriter effect - separate from scroll animation */}
          <div className="relative z-10">
            <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
              isDarkMode 
                ? 'text-white' 
                : 'text-slate-900'
            }`}>
              <TypewriterText
                text="Hi, I'm Justin"
                isVisible={true}
                speed={50}
              />
            </h1>
          </div>
          
          {/* Hero subtitle with scroll animation */}
          <div className={`transition-all duration-1200 ease-out ${
            heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <p className={`text-xl md:text-2xl font-mono ${
              isDarkMode 
                ? 'text-green-300' 
                : 'text-slate-600'
            }`}>
              A BA/MS student studying CS @ Boston University
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className={`block p-2 ${
            isDarkMode ? 'text-green-400' : 'text-slate-600'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-t border-green-500' 
          : 'bg-white border-t border-slate-200'
      }`}>
        <div 
          ref={aboutAnimation.elementRef}
          className="max-w-6xl mx-auto relative z-20"
        >
          {/* Header with typewriter effect - separate from scroll animation */}
          <div className="relative z-30">
            <h2 className={`text-6xl font-bold mb-12 text-center tracking-wide font-mono ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-slate-800'
            }`}>
              <TypewriterText
                text="About Me"
                isVisible={aboutAnimation.isVisible}
                speed={40}
              />
            </h2>
          </div>
          
          {/* Content with scroll animation */}
          <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1200 ease-out ${
            aboutAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            {/* Profile Image with Admin Access Button */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-96 h-96 p-3 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-black border-2 border-green-400' 
                    : 'bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-slate-400'
                } shadow-xl`}>
                  <img
                    src={PERSONAL_INFO.image}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full rounded-xl object-cover bg-white"
                  />
                </div>
                <div className={`absolute -bottom-4 -right-4 rounded-xl p-4 ${
                  isDarkMode
                    ? 'bg-black hacker-glow border-2 border-green-500'
                    : 'bg-white shadow-lg border-2 border-slate-300'
                }`}>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <button
                      onClick={isAuthenticated ? onGoToDashboard : onLogin}
                      className="w-full h-full bg-green-500 rounded-lg animate-pulse hover:animate-none hover:bg-green-400 transition-colors cursor-pointer"
                      title={isAuthenticated ? 'Go to Dashboard' : 'Admin Access'}
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* About Text Content */}
            <div className="space-y-6">
              <div className={`text-lg leading-relaxed font-mono ${
                isDarkMode 
                  ? 'text-green-100' 
                  : 'text-slate-600'
              }`}>
                <div className="space-y-4">
                  <p>
                    Hi, I'm Justin, a BA/MS student pursuing computer science at Boston University!
                  </p>
                  
                  <p>
                    I'm interested in <span className={isDarkMode ? 'text-green-400 font-semibold' : 'text-blue-600 font-semibold'}>software development</span>, <span className={isDarkMode ? 'text-green-400 font-semibold' : 'text-blue-600 font-semibold'}>AI/ML</span>, and <span className={isDarkMode ? 'text-green-400 font-semibold' : 'text-blue-600 font-semibold'}>cybersecurity</span>! 
                    I love learning about new technologies, acquiring new skills, and challenging myself through fun and impactful projects.
                  </p>
                  
                  <p>
                    Outside of coding, I compete in both <span className={isDarkMode ? 'text-green-400 font-semibold' : 'text-purple-600 font-semibold'}>Beyblade</span> and <span className={isDarkMode ? 'text-green-400 font-semibold' : 'text-purple-600 font-semibold'}>Pokémon tournaments</span>. 
                    You'll also find me at the gym with friends, playing racket sports, or playing the piano!
                  </p>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-t border-green-500' 
          : 'bg-slate-50 border-t border-slate-200'
      }`}>
        <div 
          ref={projectsAnimation.elementRef}
          className="max-w-6xl mx-auto relative z-20"
        >
          {/* Header with typewriter effect - separate from scroll animation */}
          <div className="relative z-30">
            <h2 className={`text-6xl font-bold mb-12 text-center tracking-wide font-mono ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-slate-800'
            }`}>
              <TypewriterText
                text="Featured Projects"
                isVisible={projectsAnimation.isVisible}
                speed={40}
              />
            </h2>
          </div>
          
          {/* Content with scroll animation */}
          <div className={`transition-all duration-1200 ease-out ${
            projectsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                  isDarkMode ? 'border-green-400' : 'border-blue-600'
                }`}></div>
                <p className={`mt-4 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-600'
                }`}>
                  Loading featured projects...
                </p>
              </div>
            ) : featuredProjects.length > 0 ? (
              // Projects with Pagination
              <div className="relative">
              {/* Navigation Arrows */}
              {totalPages > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 0}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
                      currentPage === 0
                        ? isDarkMode
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDarkMode
                          ? 'bg-green-400 text-black hover:bg-green-300 shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    }`}
                    title="Previous projects"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
                      currentPage === totalPages - 1
                        ? isDarkMode
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isDarkMode
                          ? 'bg-green-400 text-black hover:bg-green-300 shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                    }`}
                    title="Next projects"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Projects Grid */}
              <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${
                totalPages > 1 ? 'mx-16' : ''
              }`}>
                {currentProjects.map((project) => (
                  <div 
                    key={project._id} 
                    onClick={() => handleProjectClick(project)}
                    className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                      isDarkMode 
                        ? 'bg-black border border-green-500 hover:border-green-400 hover:scale-105' 
                        : 'bg-white hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    <div className="p-6">
                      {/* Project Title */}
                      <h3 className={`text-xl font-semibold mb-3 font-mono ${
                        isDarkMode ? 'text-green-400' : 'text-slate-800'
                      }`}>
                        {project.title}
                      </h3>
                      {/* Project Description */}
                      <p className={`mb-4 line-clamp-3 font-mono text-sm ${
                        isDarkMode ? 'text-green-100' : 'text-slate-600'
                      }`}>
                        {project.description}
                      </p>
                      
                      {/* Project Time Frame */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`font-mono ${
                            isDarkMode ? 'text-green-200' : 'text-slate-600'
                          }`}>
                            {formatDate(project.startDate)}
                          </span>
                          {project.endDate && (
                            <>
                              <span className={`font-mono ${
                                isDarkMode ? 'text-green-300' : 'text-slate-500'
                              }`}>
                                →
                              </span>
                              <span className={`font-mono ${
                                isDarkMode ? 'text-green-200' : 'text-slate-600'
                              }`}>
                                {formatDate(project.endDate)}
                              </span>
                            </>
                          )}
                          {!project.endDate && (
                            <span className={`font-mono px-2 py-1 rounded-full text-xs ${
                              isDarkMode 
                                ? 'bg-green-900 text-green-300 border border-green-500' 
                                : 'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              Ongoing
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Project Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                              <span
                                key={index}
                                className={`inline-block px-3 py-1 rounded-full text-sm font-mono font-bold ${
                                  isDarkMode
                                    ? 'bg-green-400 text-black'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-mono ${
                                isDarkMode
                                  ? 'bg-gray-700 text-green-300 border border-green-500'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                +{project.technologies.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Project Status */}
                      {project.status && (
                        <div className="mb-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium font-mono ${
                            isDarkMode
                              ? 'bg-black text-green-400 border border-green-400'
                              : getStatusColor(project.status)
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      )}

                      {/* Project Links */}
                      {(project.demoUrl || project.githubUrl) && (
                        <div className="flex gap-3">
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-mono ${
                                isDarkMode
                                  ? 'bg-green-400 text-black hover:bg-green-300'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-mono ${
                                isDarkMode
                                  ? 'bg-black text-green-400 border border-green-400 hover:bg-green-400 hover:text-black'
                                  : 'bg-gray-800 text-white hover:bg-gray-900'
                              }`}
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      )}

                      {/* Click indicator */}
                      <div className={`mt-4 text-center ${
                        isDarkMode ? 'text-green-300' : 'text-slate-500'
                      }`}>
                        <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to view details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Indicators */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentPage
                          ? isDarkMode
                            ? 'bg-green-400'
                            : 'bg-blue-600'
                          : isDarkMode
                            ? 'bg-gray-600 hover:bg-gray-500'
                            : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // No Projects State
            <div className="text-center py-12">
              <p className={`text-lg font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-600'
              }`}>
                No featured projects available yet.
              </p>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-t border-green-500' 
          : 'bg-white border-t border-slate-200'
      }`}>
        <div 
          ref={skillsAnimation.elementRef}
          className="max-w-6xl mx-auto relative z-20"
        >
          {/* Header with typewriter effect - separate from scroll animation */}
          <div className="relative z-30">
            <h2 className={`text-6xl font-bold mb-12 text-center tracking-wide font-mono ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-slate-800'
            }`}>
              <TypewriterText
                text="Skills & Technologies"
                isVisible={skillsAnimation.isVisible}
                speed={40}
              />
            </h2>
          </div>
          
          {/* Content with scroll animation */}
          <div className={`space-y-4 transition-all duration-1200 ease-out ${
            skillsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            {(() => {
              // Group skills by category
              const skillsByCategory = skills.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                  acc[skill.category] = [];
                }
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof skills>);

              // Define category order and display names
              const categoryOrder = [
                'Programming Languages',
                'Frontend',
                'Backend', 
                'AI/ML',
                'DevOps & Tools',
                'Additional Tools'
              ];

              const categoryDisplayNames: Record<string, string> = {
                'Programming Languages': 'Programming Languages',
                'Frontend': 'Frontend Development',
                'Backend': 'Backend Development',
                'AI/ML': 'AI & Machine Learning',
                'DevOps & Tools': 'DevOps & Tools',
                'Additional Tools': 'Additional Tools'
              };

              return categoryOrder.map(category => {
                const categorySkills = skillsByCategory[category];
                if (!categorySkills || categorySkills.length === 0) return null;

                return (
                  <SkillCategoryDropdown
                    key={category}
                    category={categoryDisplayNames[category]}
                    skills={categorySkills}
                    isDarkMode={isDarkMode}
                  />
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-t border-green-500' 
          : 'bg-slate-50 border-t border-slate-200'
      }`}>
        <div 
          ref={hobbiesAnimation.elementRef}
          className="max-w-6xl mx-auto relative z-20"
        >
          {/* Header with typewriter effect - separate from scroll animation */}
          <div className="relative z-30">
            <h2 className={`text-6xl font-bold mb-12 text-center tracking-wide font-mono ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-slate-800'
            }`}>
              <TypewriterText
                text="When I'm Not Coding"
                isVisible={hobbiesAnimation.isVisible}
                speed={40}
              />
            </h2>
          </div>
          {/* Content with scroll animation */}
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1200 ease-out ${
            hobbiesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {PERSONAL_INFO.hobbies.map((hobby, index) => (
              <div key={index} className={`p-6 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-black border border-green-500 hover:border-green-400'
                  : 'bg-white hover:bg-slate-100 border border-slate-200'
              }`}>
                <p className={`text-lg font-medium font-mono ${
                  isDarkMode ? 'text-green-400' : 'text-slate-700'
                }`}>
                  {hobby}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-t border-green-500' 
          : 'bg-white border-t border-slate-200'
      }`}>
        <div 
          ref={contactAnimation.elementRef}
          className="max-w-4xl mx-auto text-center relative z-20"
        >
          {/* Header with typewriter effect - separate from scroll animation */}
          <div className="relative z-30">
            <h2 className={`text-6xl font-bold mb-12 tracking-wide font-mono ${
              isDarkMode 
                ? 'text-green-400' 
                : 'text-slate-800'
            }`}>
              <TypewriterText
                text="Contact Me"
                isVisible={contactAnimation.isVisible}
                speed={40}
              />
            </h2>
          </div>
          
          {/* Content with scroll animation */}
          <div className={`transition-all duration-1200 ease-out ${
            contactAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <p className={`text-lg mb-8 max-w-2xl mx-auto font-mono ${
              isDarkMode 
                ? 'text-green-100' 
                : 'text-slate-600'
            }`}>
              I'm always interested in new opportunities and meeting new people. 
              Whether you want to connect or just want to chat, feel free to reach out!
            </p>

            {/* Contact Methods Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Email Contact */}
            <a
              href={`mailto:${PERSONAL_INFO.social.email}`}
              className={`block p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-900 border border-green-500 hover:border-green-400 hover:bg-gray-800'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-green-400' : 'bg-red-500'
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`font-semibold mb-2 font-mono ${
                isDarkMode ? 'text-green-400' : 'text-slate-800'
              }`}>
                Email
              </h3>
              <p className={`font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-600'
              }`}>
                {PERSONAL_INFO.social.email}
              </p>
            </a>

            {/* LinkedIn Contact */}
            <a
              href={PERSONAL_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-900 border border-green-500 hover:border-green-400 hover:bg-gray-800'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-green-400' : 'bg-blue-600'
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className={`font-semibold mb-2 font-mono ${
                isDarkMode ? 'text-green-400' : 'text-slate-800'
              }`}>
                LinkedIn
              </h3>
              <p className={`font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-600'
              }`}>
                Connect with me
              </p>
            </a>

            {/* GitHub Contact */}
            <a
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                isDarkMode
                  ? 'bg-gray-900 border border-green-500 hover:border-green-400 hover:bg-gray-800'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-green-400' : 'bg-gray-800'
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-black' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`font-semibold mb-2 font-mono ${
                isDarkMode ? 'text-green-400' : 'text-slate-800'
              }`}>
                GitHub
              </h3>
              <p className={`font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-600'
              }`}>
                View my code
              </p>
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 px-6 border-t transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-green-500' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Copyright */}
          <p className={`text-sm font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-600'
          }`}>
            © 2025 Justin Wang
          </p>
          
          {/* Back to Top Link */}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-sm font-mono transition-colors hover:scale-105 ${
              isDarkMode 
                ? 'text-green-300 hover:text-green-400' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Back To The Top ↑
          </a>
        </div>
      </footer>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )

  /**
   * Helper function to get status color classes based on project status
   * @param {string} status - Project status
   * @returns {string} Tailwind CSS classes for the status badge
   */
  function getStatusColor(status: string) {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
}

export default LandingPage