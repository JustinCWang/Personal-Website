/**
 * ProjectsList Component
 * @desc Displays and manages the user's projects with advanced filtering and CRUD functionality
 * @returns {JSX.Element} Projects list interface with management features
 */

// Import React dependencies and hooks
import { useState, useEffect, useCallback } from 'react'

// Import API services and types
import { projectsAPI, handleAPIError, type Project } from '../services/api'

// Import components
import ProjectEditModal from './ProjectEditModal.tsx'
import CustomDropdown from './CustomDropdown.tsx'

interface ProjectsListProps {
  isDarkMode: boolean
}

// Filter interface for type safety
interface ProjectFilters {
  search: string
  status: string
  technologies: string
  startDate: string
  endDate: string
  sortBy: string
  sortOrder: string
}

const ProjectsList = ({ isDarkMode }: ProjectsListProps) => {
  // State management for projects and UI
  const [projects, setProjects] = useState<Project[]>([])          // Array of user's projects
  const [loading, setLoading] = useState(false)                    // Loading state for API calls
  const [filterLoading, setFilterLoading] = useState(false)        // Loading state for filter changes
  const [error, setError] = useState<string | null>(null)          // Error state for displaying errors
  const [editingProject, setEditingProject] = useState<Project | null>(null)  // Project being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)    // Modal visibility state
  const [hasLoaded, setHasLoaded] = useState(false)                // Track if we've loaded projects initially
  
  // Filter state
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    status: '',
    technologies: '',
    startDate: '',
    endDate: '',
    sortBy: 'startDate',
    sortOrder: 'desc'
  })

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    
    // Extract year and month directly from ISO string to avoid timezone issues
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[month]} ${year}`;
  };

  /**
   * Fetch projects with current filters
   * @desc Retrieves projects from backend with applied filters
   */
  const fetchProjects = useCallback(async (isFilterChange = false) => {
    if (isFilterChange) {
      setFilterLoading(true)  // Use filter loading for smoother UX
    } else {
      setLoading(true)        // Use full loading for initial load
    }
    setError(null)            // Clear any previous errors
    
    try {
      // Only include non-empty filters
      const activeFilters: Partial<ProjectFilters> = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim()) {
          activeFilters[key as keyof ProjectFilters] = value.trim()
        }
      })
      
      const data = await projectsAPI.getFiltered(activeFilters)  // Fetch filtered projects from API
      setProjects(data)    // Update projects state
      setHasLoaded(true)   // Mark that projects have been loaded
    } catch (error) {
      setError(handleAPIError(error))           // Handle and display error
      console.error('Error fetching projects:', error)
    } finally {
      if (isFilterChange) {
        setFilterLoading(false)  // Clear filter loading
      } else {
        setLoading(false)        // Clear full loading
      }
    }
  }, [filters])

  /**
   * Fetch projects when component mounts or filters change
   */
  useEffect(() => {
    // Add a small delay to avoid too many API calls when typing
    const timeoutId = setTimeout(() => {
      fetchProjects(true) // Use filter loading for smoother UX
    }, 200) // 200ms delay for more responsive filtering

    return () => clearTimeout(timeoutId)
  }, [fetchProjects])

  /**
   * Refresh projects (for refresh button)
   * @desc Manually refresh projects with current filters
   */
  const handleRefresh = () => {
    fetchProjects(false) // Use full loading for manual refresh
  }

  /**
   * Handle filter changes
   * @desc Updates filter state and triggers new API call
   * @param {keyof ProjectFilters} field - Filter field to update
   * @param {string} value - New filter value
   */
  const handleFilterChange = (field: keyof ProjectFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Clear all filters
   * @desc Resets all filters to default values
   */
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      technologies: '',
      startDate: '',
      endDate: '',
      sortBy: 'startDate',
      sortOrder: 'desc'
    })
  }

  /**
   * Handle sort field change
   * @desc Updates the sort field and maintains sort direction
   * @param {string} field - New field to sort by
   */
  const handleSortChange = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  /**
   * Get sort indicator for a column header
   * @desc Returns the appropriate sort indicator icon and styling
   * @param {string} field - Field to check sort status for
   * @returns {JSX.Element} Sort indicator component
   */
  const getSortIndicator = (field: string) => {
    if (filters.sortBy !== field) {
      return (
        <svg className="w-4 h-4 ml-1 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return filters.sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  /**
   * Check if any filters are active
   * @desc Returns true if any filter has a value
   * @returns {boolean} True if any filter is active
   */
  const hasActiveFilters = () => {
    return filters.search || filters.status || filters.technologies || filters.startDate || filters.endDate
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
    if (isDarkMode) {
      // Dark mode status colors
      switch (status) {
        case 'Planning': return 'bg-yellow-900 text-yellow-300 border-yellow-600'
        case 'In Progress': return 'bg-blue-900 text-blue-300 border-blue-600'
        case 'Completed': return 'bg-green-900 text-green-300 border-green-600'
        case 'On Hold': return 'bg-gray-700 text-gray-300 border-gray-600'
        default: return 'bg-gray-700 text-gray-300 border-gray-600'
      }
    } else {
      // Light mode status colors
      switch (status) {
        case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
        case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
  }

  return (
    <div className={`rounded-xl shadow-lg p-6 transition-all duration-300 ${
      isDarkMode ? 'card-dark' : 'card-light'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-5xl font-bold font-mono ${
          isDarkMode ? 'text-primary-dark' : 'text-primary-light'
        }`}>
          Your Projects
        </h3>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-lg transition-all duration-300 border-2 ${
            isDarkMode ? 'btn-primary-dark' : 'btn-primary-light'
          }`}
          title="Refresh Projects"
        >
          {/* Refresh Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Advanced Filtering Controls */}
      {!loading && !error && (
        <div className={`mb-6 p-4 rounded-lg border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900 border-green-500' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-4">
            
            {/* Search Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                Search Projects:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by title, description, or technologies..."
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 font-mono text-sm ${
                    isDarkMode ? 'input-dark' : 'input-light'
                  }`}
                />
                {filterLoading && filters.search && (
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-primary-dark' : 'text-blue-600'
                  }`}>
                    <div className={`inline-block animate-spin rounded-full h-4 w-4 border-b-2 ${
                      isDarkMode ? 'spinner-dark' : 'border-blue-600'
                    }`}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Status Filter */}
              <div>
                <CustomDropdown
                  value={filters.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'Planning', label: 'Planning' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'On Hold', label: 'On Hold' }
                  ]}
                  placeholder="Select status..."
                  isDarkMode={isDarkMode}
                  label="Status:"
                  backgroundColor={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                  borderColor={isDarkMode ? 'border-green-500' : 'border-slate-300'}
                  borderFocusColor={isDarkMode ? 'focus:border-green-400' : 'focus:border-blue-500'}
                  textColor={isDarkMode ? 'text-green-100' : 'text-slate-800'}
                  placeholderColor={isDarkMode ? 'placeholder-green-300' : 'placeholder-slate-500'}
                  padding="px-3 py-2"
                />
              </div>

              {/* Technologies Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Technologies:
                </label>
                <input
                  type="text"
                  value={filters.technologies}
                  onChange={(e) => handleFilterChange('technologies', e.target.value)}
                  placeholder="e.g., React, Node.js, Java"
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 font-mono text-sm ${
                    isDarkMode ? 'input-dark' : 'input-light'
                  }`}
                />
              </div>

              {/* Start Date Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Start Year:
                </label>
                <input
                  type="number"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  placeholder="e.g., 2023"
                  min="2000"
                  max="2030"
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 font-mono text-sm ${
                    isDarkMode ? 'input-dark' : 'input-light'
                  }`}
                />
              </div>

              {/* End Date Filter */}
              <div>
                <label className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  End Year:
                </label>
                <input
                  type="number"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  placeholder="e.g., 2024"
                  min="2000"
                  max="2030"
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 font-mono text-sm ${
                    isDarkMode ? 'input-dark' : 'input-light'
                  }`}
                />
              </div>
            </div>

            {/* Sort Controls and Clear Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              
              {/* Sort Controls */}
              <div className="flex flex-wrap gap-2">
                <label className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  Sort by:
                </label>
                
                {/* Sort Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* Date Sort */}
                  <button
                    onClick={() => handleSortChange('startDate')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border ${
                      filters.sortBy === 'startDate'
                        ? isDarkMode
                          ? 'bg-green-500 text-black border-green-500'
                          : 'bg-blue-500 text-white border-blue-500'
                        : isDarkMode
                          ? 'bg-gray-800 text-green-300 border-green-500 hover:bg-gray-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center">
                      Time Frame
                      {getSortIndicator('startDate')}
                    </div>
                  </button>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border ${
                    isDarkMode
                      ? 'bg-red-900 text-red-300 border-red-600 hover:bg-red-800 hover:text-red-200'
                      : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className={`text-sm font-mono ${
              isDarkMode ? 'text-green-200' : 'text-slate-600'
            }`}>
              Showing {projects.length} projects
              {hasActiveFilters() && ' with active filters'}
              {filterLoading && (
                <span className={`ml-2 inline-flex items-center ${
                  isDarkMode ? 'text-green-300' : 'text-blue-600'
                }`}>
                  <div className={`inline-block animate-spin rounded-full h-3 w-3 border-b-2 mr-1 ${
                    isDarkMode ? 'border-green-400' : 'border-blue-600'
                  }`}></div>
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
            isDarkMode ? 'border-green-400' : 'border-blue-600'
          }`}></div>
          <p className={`mt-4 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-600'
          }`}>
            Loading projects...
          </p>
        </div>
      ) : 
      
      /* Error State */
      error ? (
        <div className={`text-center rounded-lg p-6 border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-red-900 border-red-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`font-semibold mb-4 font-mono ${
            isDarkMode ? 'text-red-300' : 'text-red-600'
          }`}>
            Error: {error}
          </p>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-all duration-300 border-2 ${
              isDarkMode
                ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Try Again"
          >
            {/* Refresh Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      ) : (
        
        /* Projects List */
        <div className={`space-y-6 transition-opacity duration-200 ${
          filterLoading ? 'opacity-75' : 'opacity-100'
        }`}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className={`border-l-4 rounded-lg p-6 hover:shadow-md transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-900 border-green-400 hover:bg-gray-800' 
                  : 'bg-slate-50 border-blue-600'
              }`}>
                
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      
                      {/* Project Title */}
                      <h4 className={`text-xl font-semibold font-mono ${
                        isDarkMode ? 'text-green-400' : 'text-slate-800'
                      }`}>
                        {project.title}
                      </h4>
                      
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border font-mono ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border font-mono ${
                          isDarkMode 
                            ? 'bg-purple-900 text-purple-300 border-purple-600' 
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}>
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    
                    {/* Project Description */}
                    <p className={`mb-4 font-mono text-sm ${
                      isDarkMode ? 'text-green-100' : 'text-slate-600'
                    }`}>
                      {project.description}
                    </p>
                    
                    {/* Project Time Frame */}
                    <div className="mb-4">
                      <h5 className={`text-sm font-medium mb-2 font-mono ${
                        isDarkMode ? 'text-green-300' : 'text-slate-700'
                      }`}>
                        Time Frame:
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono ${
                          isDarkMode ? 'text-green-200' : 'text-slate-600'
                        }`}>
                          {formatDate(project.startDate)}
                        </span>
                        {project.endDate && (
                          <>
                            <span className={`text-sm font-mono ${
                              isDarkMode ? 'text-green-300' : 'text-slate-500'
                            }`}>
                              →
                            </span>
                            <span className={`text-sm font-mono ${
                              isDarkMode ? 'text-green-200' : 'text-slate-600'
                            }`}>
                              {formatDate(project.endDate)}
                            </span>
                          </>
                        )}
                        {!project.endDate && (
                          <span className={`text-sm font-mono px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-green-900 text-green-300 border border-green-500' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            Ongoing
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Technologies Section */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <h5 className={`text-sm font-medium mb-2 font-mono ${
                          isDarkMode ? 'text-green-300' : 'text-slate-700'
                        }`}>
                          Technologies:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
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
                          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium font-mono ${
                            isDarkMode
                              ? 'bg-black text-green-400 border border-green-400 hover:bg-green-400 hover:text-black'
                              : 'bg-gray-800 text-white hover:bg-gray-900'
                          }`}
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
                          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium font-mono ${
                            isDarkMode
                              ? 'bg-green-400 text-black hover:bg-green-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
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
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-green-400 hover:text-green-300 hover:bg-gray-800'
                          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
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
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-900'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
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
              <div className={`mb-4 ${
                isDarkMode ? 'text-green-400' : 'text-slate-400'
              }`}>
                {/* Empty Projects Icon SVG */}
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className={`text-lg font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-600'
              }`}>
                {!hasLoaded 
                  ? 'No projects yet!' 
                  : hasActiveFilters()
                    ? 'No projects match your filters'
                    : 'No projects found'
                }
              </p>
              <p className={`mt-2 font-mono ${
                isDarkMode ? 'text-green-200' : 'text-slate-500'
              }`}>
                {!hasLoaded 
                  ? 'Create your first project using the form above.'
                  : hasActiveFilters()
                    ? 'Try adjusting your search terms or filters.'
                    : 'Something went wrong while loading projects.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Project Edit Modal */}
      {isEditModalOpen && editingProject && (
        <ProjectEditModal
          project={editingProject}
          isOpen={isEditModalOpen}
          onProjectUpdated={handleProjectUpdated}
          onClose={handleCloseEditModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}

export default ProjectsList 