import React, { useState, useEffect } from 'react'
import { projectsAPI, type Project } from '../services/api.ts'

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
    "⛸️ Rollerskating & Ice Skating"
  ],
  skills: [
    "React", "TypeScript", "Node.js", "Express", "MongoDB", 
    "Python", "JavaScript", "HTML/CSS", "Git", "Docker"
  ],
  social: {
    github: "https://github.com/JustinCWang",
    linkedin: "https://linkedin.com/in/jcwang27",
    email: "jcwang27@bu.edu"
  }
}

interface LandingPageProps {
  onLogin: () => void
  isAuthenticated?: boolean
  onGoToDashboard?: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isAuthenticated = false, onGoToDashboard }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      setLoading(true)
      try {
        const projects = await projectsAPI.getFeatured()
        setFeaturedProjects(projects)
      } catch (error) {
        console.error('Error fetching featured projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Navigation */}
      <nav className={`backdrop-blur-sm shadow-lg sticky top-0 z-40 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black/90 border-b border-green-500' 
          : 'bg-white/90 border-b border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold tracking-wide ${
              isDarkMode 
                ? 'text-green-400 font-mono' 
                : 'text-slate-800'
            }`}>
              {PERSONAL_INFO.name}
            </h1>
            
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

              {isAuthenticated ? (
                <button
                  onClick={onGoToDashboard}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium uppercase tracking-wide ${
                    isDarkMode
                      ? 'bg-black text-green-400 hover:bg-green-400 hover:text-black font-mono font-bold border-2 border-green-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-lg'
                  }`}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium uppercase tracking-wide ${
                    isDarkMode
                      ? 'bg-black text-green-400 hover:bg-green-400 hover:text-black font-mono font-bold border-2 border-green-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-lg'
                  }`}
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-5xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Hi, I'm{' '}
                <span className={isDarkMode ? 'hacker-text-gradient' : 'text-slate-800'}>
                  {PERSONAL_INFO.name}
                </span>
              </h2>
              <h3 className={`text-2xl mb-6 ${
                isDarkMode 
                  ? 'text-green-300 font-mono' 
                  : 'text-slate-600'
              }`}>
                {PERSONAL_INFO.title}
              </h3>
              <p className={`text-lg mb-8 leading-relaxed ${
                isDarkMode 
                  ? 'text-green-100 font-mono' 
                  : 'text-slate-600'
              }`}>
                {PERSONAL_INFO.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-black text-green-400 hover:bg-green-400 hover:text-black border-2 border-green-400'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-black text-green-400 hover:bg-green-400 hover:text-black border-2 border-green-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                  </svg>
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.social.email}`}
                  className={`p-3 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-black text-green-400 hover:bg-green-400 hover:text-black border-2 border-green-400'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-80 h-80 p-2 rounded-full ${
                  isDarkMode 
                    ? 'hacker-border-gradient' 
                    : 'bg-gradient-to-br from-slate-200 to-slate-300'
                }`}>
                  <img
                    src={PERSONAL_INFO.image}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <div className={`absolute -bottom-4 -right-4 rounded-full p-4 ${
                  isDarkMode
                    ? 'bg-black hacker-glow border-2 border-green-500'
                    : 'bg-white shadow-lg'
                }`}>
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-t border-green-500' 
          : 'bg-white border-t border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center tracking-wide ${
            isDarkMode 
              ? 'text-green-400 font-mono' 
              : 'text-slate-800'
          }`}>
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PERSONAL_INFO.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-gray-900 to-black text-green-400 border-2 border-green-400 font-mono uppercase tracking-wide hover:bg-green-400 hover:text-white hover:scale-105'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 hover:scale-105 hover:shadow-md'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 border-t border-green-500' 
          : 'bg-slate-50 border-t border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center tracking-wide ${
            isDarkMode 
              ? 'text-green-400 font-mono' 
              : 'text-slate-800'
          }`}>
            Featured Projects
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                isDarkMode ? 'border-green-400' : 'border-blue-600'
              }`}></div>
              <p className={`mt-4 ${
                isDarkMode ? 'text-green-300 font-mono' : 'text-slate-600'
              }`}>
                Loading featured projects...
              </p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project._id} className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  isDarkMode 
                    ? 'bg-black border border-green-500 hover:border-green-400' 
                    : 'bg-white hover:shadow-xl'
                }`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      isDarkMode ? 'text-green-400 font-mono' : 'text-slate-800'
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`mb-4 line-clamp-3 ${
                      isDarkMode ? 'text-green-100 font-mono text-sm' : 'text-slate-600'
                    }`}>
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className={`inline-block px-3 py-1 rounded-full text-sm ${
                                isDarkMode
                                  ? 'bg-green-400 text-black font-mono font-bold'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
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
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? 'bg-black text-green-400 border border-green-400 font-mono'
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isDarkMode
                                ? 'bg-green-400 text-black hover:bg-green-300 font-mono'
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isDarkMode
                                ? 'bg-black text-green-400 border border-green-400 hover:bg-green-400 hover:text-black font-mono'
                                : 'bg-gray-800 text-white hover:bg-gray-900'
                            }`}
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg ${
                isDarkMode ? 'text-green-300 font-mono' : 'text-slate-600'
              }`}>
                No featured projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Hobbies Section */}
      <section className={`py-16 px-6 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border-t border-green-500' 
          : 'bg-white border-t border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl font-bold mb-12 text-center tracking-wide ${
            isDarkMode 
              ? 'text-green-400 font-mono' 
              : 'text-slate-800'
          }`}>
            When I'm Not Coding
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAL_INFO.hobbies.map((hobby, index) => (
              <div key={index} className={`p-6 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-900 border border-green-500 hover:border-green-400'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
              }`}>
                <p className={`text-lg font-medium ${
                  isDarkMode ? 'text-green-400 font-mono' : 'text-slate-700'
                }`}>
                  {hobby}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  // Helper function for project status colors (only used in light mode)
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