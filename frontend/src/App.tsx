/**
 * Main Application Component for the Personal Website frontend
 * Handles routing, authentication, and the main dashboard functionality
 * Manages project CRUD operations and user interface
 */

// Import React dependencies and hooks
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

// Import authentication context and components
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import ProjectForm from './components/ProjectForm'
import ProjectEditModal from './components/ProjectEditModal'
import LandingPage from './components/LandingPage'

// Import API services and types
import { projectsAPI, handleAPIError, type Project } from './services/api'

/**
 * Dashboard Component
 * @desc Main dashboard for authenticated users to manage their projects
 * @returns {JSX.Element} Dashboard interface with project management features
 */
const Dashboard = () => {
  // State management for projects and UI
  const [projects, setProjects] = useState<Project[]>([])          // Array of user's projects
  const [loading, setLoading] = useState(false)                    // Loading state for API calls
  const [error, setError] = useState<string | null>(null)          // Error state for displaying errors
  const [editingProject, setEditingProject] = useState<Project | null>(null)  // Project being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)    // Modal visibility state
  
  // Authentication context and navigation
  const { user, logout } = useAuth()  // Get current user and logout function
  const navigate = useNavigate()      // Navigation function for routing

  /**
   * Fetch projects from backend API
   * @desc Retrieves all projects belonging to the authenticated user
   */
  const fetchProjects = async () => {
    setLoading(true)     // Show loading state
    setError(null)       // Clear any previous errors
    
    try {
      const data = await projectsAPI.getAll()  // Fetch projects from API
      setProjects(data)    // Update projects state
    } catch (error) {
      setError(handleAPIError(error))           // Handle and display error
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)    // Hide loading state
    }
  }

  /**
   * Fetch projects when component mounts
   */
  useEffect(() => {
    fetchProjects()
  }, [])

  /**
   * Handle new project creation
   * @desc Adds a newly created project to the projects list
   * @param {Project} newProject - The newly created project
   */
  const handleProjectCreated = (newProject: Project) => {
    setProjects(prevProjects => [newProject, ...prevProjects])  // Add to beginning of list
  }

  /**
   * Handle project updates
   * @desc Updates a project in the projects list
   * @param {Project} updatedProject - The updated project data
   */
  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project._id === updatedProject._id ? updatedProject : project
      )
    )
  }

  /**
   * Open edit modal for a project
   * @desc Sets the project to edit and opens the edit modal
   * @param {Project} project - Project to edit
   */
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  /**
   * Close edit modal
   * @desc Closes the edit modal and clears editing state
   */
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProject(null)
  }

  /**
   * Delete a project
   * @desc Removes a project from the backend and updates the local state
   * @param {string} projectId - ID of the project to delete
   */
  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsAPI.delete(projectId)  // Delete from backend
      // Remove from local state
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId))
    } catch (error) {
      setError(handleAPIError(error))      // Handle deletion error
    }
  }

  /**
   * Get CSS classes for project status badges
   * @desc Returns appropriate CSS classes based on project status
   * @param {string} status - Project status
   * @returns {string} CSS classes for status styling
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  /**
   * Navigate to landing page
   * @desc Redirects user to the public landing page
   */
  const handleViewLandingPage = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white shadow-lg">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-primary-600">My Projects Portfolio</h2>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              {/* View Landing Page Button */}
              <button
                onClick={handleViewLandingPage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg border border-blue-700"
              >
                View Landing Page
              </button>
              
              {/* User Welcome Message */}
              <span className="text-slate-600">Welcome, {user?.name}</span>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Creation Form */}
        <ProjectForm onProjectCreated={handleProjectCreated} />

        {/* Projects Display Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Your Projects</h3>
            
            {/* Refresh Button */}
            <button
              onClick={fetchProjects}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Loading projects...</p>
            </div>
          ) : 
          
          /* Error State */
          error ? (
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
              <button 
                onClick={fetchProjects}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            
            /* Projects List */
            <div className="space-y-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project._id} className="bg-slate-50 border-l-4 border-primary-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                    
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          
                          {/* Project Title */}
                          <h4 className="text-xl font-semibold text-slate-800">{project.title}</h4>
                          
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          
                          {/* Featured Badge */}
                          {project.featured && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        
                        {/* Project Description */}
                        <p className="text-slate-600 mb-4">{project.description}</p>
                        
                        {/* Technologies Section */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-700 mb-2">Technologies:</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Project Links */}
                        <div className="flex gap-4">
                          {/* GitHub Link */}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                            >
                              {/* GitHub Icon SVG */}
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                              </svg>
                              GitHub
                            </a>
                          )}
                          {/* Demo Link */}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                            >
                              {/* External Link Icon SVG */}
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Project Action Buttons */}
                      <div className="flex items-center space-x-4">
                        {/* Edit Project Button */}
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Edit project"
                        >
                          {/* Edit Icon SVG */}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Delete Project Button */}
                        <button
                          onClick={() => project._id && handleDeleteProject(project._id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete project"
                        >
                          {/* Delete Icon SVG */}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                
                /* Empty State - No Projects */
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    {/* Empty Projects Icon SVG */}
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-lg">No projects yet!</p>
                  <p className="text-slate-500 mt-2">Create your first project using the form above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Project Edit Modal */}
      {isEditModalOpen && editingProject && (
        <ProjectEditModal
          project={editingProject}
          isOpen={isEditModalOpen}
          onProjectUpdated={handleProjectUpdated}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  )
}

/**
 * App Content Component
 * @desc Manages routing and authentication state for the entire application
 * @returns {JSX.Element} Router-based content with authentication handling
 */
const AppContent = () => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  /**
   * Handle successful login
   * @desc Redirects user to dashboard after successful authentication
   */
  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Landing Page Route - Public access */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            onLogin={() => navigate('/login')}  // Navigate to login when login button clicked
          />
        } 
      />
      
      {/* Login Route - Redirect to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Navigate to="/dashboard" replace />  // Redirect authenticated users to dashboard
          )
        } 
      />
      
      {/* Dashboard Route - Requires authentication */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" replace />  // Redirect unauthenticated users to login
          )
        } 
      />
    </Routes>
  )
}

/**
 * Main App Component
 * @desc Root component that provides authentication context and routing
 * @returns {JSX.Element} Complete application with routing and authentication
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
