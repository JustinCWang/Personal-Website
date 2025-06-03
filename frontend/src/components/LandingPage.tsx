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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">{PERSONAL_INFO.name}</h1>
            {isAuthenticated ? (
              <button
                onClick={onGoToDashboard}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg border border-green-700"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg border border-blue-700"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-slate-800 mb-4">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {PERSONAL_INFO.name}
                </span>
              </h2>
              <h3 className="text-2xl text-slate-600 mb-6">{PERSONAL_INFO.title}</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {PERSONAL_INFO.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                  </svg>
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.social.email}`}
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
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
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 p-2">
                  <img
                    src={PERSONAL_INFO.image}
                    alt={PERSONAL_INFO.name}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Skills & Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {PERSONAL_INFO.skills.map((skill, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 rounded-full font-medium border border-primary-200 hover:scale-105 transition-transform"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Featured Projects</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Loading featured projects...</p>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{project.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                    
                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                          Code
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg">No featured projects yet!</p>
              <p className="text-slate-500 mt-2">Check back soon for some amazing projects.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hobbies Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">When I'm Not Coding</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAL_INFO.hobbies.map((hobby, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <span className="text-2xl font-medium text-slate-700">{hobby}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-300">
            © 2025 {PERSONAL_INFO.name}. Built with React, TypeScript, and lots of ☕
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage