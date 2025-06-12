/**
 * ProjectForm Component for the Personal Website frontend
 * Provides a comprehensive form for creating new projects
 * Handles form validation, technology tags, and project submission
 * Includes success/error messaging and loading states
 */

// Import React dependencies and API services
import React, { useState } from 'react'
import type { Project } from '../services/api.ts'                    // Project type definition
import { projectsAPI, handleAPIError } from '../services/api.ts'     // API functions and error handling

/**
 * Props interface for ProjectForm component
 */
interface ProjectFormProps {
  onProjectCreated: (project: Project) => void  // Callback function called when project is successfully created
  isDarkMode?: boolean                          // Dark mode flag
}

/**
 * ProjectForm Component
 * @desc Form component for creating new projects with comprehensive field validation
 * @param {ProjectFormProps} props - Component props
 * @returns {JSX.Element} Project creation form with validation and submission handling
 */
const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectCreated, isDarkMode = false }) => {
  // Form data state - stores all project information
  const [formData, setFormData] = useState({
    title: '',                                    // Project title
    description: '',                              // Project description
    technologies: [] as string[],                 // Array of technology strings
    githubUrl: '',                               // GitHub repository URL
    demoUrl: '',                                 // Live demo URL
    status: 'Planning' as const,                 // Project status
    featured: false                              // Whether project is featured
  })
  
  // Additional state for form management
  const [techInput, setTechInput] = useState('')               // Temporary input for adding technologies
  const [loading, setLoading] = useState(false)               // Loading state during submission
  const [error, setError] = useState<string | null>(null)     // Error message state
  const [success, setSuccess] = useState<string | null>(null) // Success message state

  /**
   * Handle form input changes
   * @desc Updates form data when user types in input fields
   * @param {React.ChangeEvent} e - Input change event from form fields
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Add technology to the technologies array
   * @desc Adds a new technology tag if it's valid and not already present
   */
  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')  // Clear the input field
    }
  }

  /**
   * Remove technology from the technologies array
   * @desc Removes a specific technology tag from the list
   * @param {string} tech - Technology to remove
   */
  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  /**
   * Handle form submission
   * @desc Processes the form data and creates a new project
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()        // Prevent default form submission
    setError(null)           // Clear any previous errors
    setSuccess(null)         // Clear any previous success messages
    setLoading(true)         // Show loading state

    try {
      console.log('Submitting project data:', formData)
      const newProject = await projectsAPI.create(formData)  // Create project via API
      console.log('Project created successfully:', newProject)
      
      onProjectCreated(newProject)  // Notify parent component of successful creation
      
      // Reset form to initial state
      setFormData({ 
        title: '', 
        description: '', 
        technologies: [], 
        githubUrl: '', 
        demoUrl: '', 
        status: 'Planning',
        featured: false
      })
      setTechInput('')
      setSuccess('Project created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error creating project:', error)
      setError(handleAPIError(error))  // Display error message
    } finally {
      setLoading(false)  // Hide loading state
    }
  }

  return (
    <div className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border border-green-500' 
        : 'bg-white'
    }`}>
      {/* Form Header */}
      <h3 className={`text-xl font-semibold mb-4 font-mono ${
        isDarkMode ? 'text-green-400' : 'text-slate-800'
      }`}>
        Add New Project
      </h3>
      
      {/* Error Message Display */}
      {error && (
        <div className={`border rounded-lg p-4 mb-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-red-900 border-red-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm font-medium font-mono ${
            isDarkMode ? 'text-red-300' : 'text-red-600'
          }`}>
            {error}
          </p>
        </div>
      )}

      {/* Success Message Display */}
      {success && (
        <div className={`border rounded-lg p-4 mb-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-green-900 border-green-600' 
            : 'bg-green-50 border-green-200'
        }`}>
          <p className={`text-sm font-medium font-mono ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            {success}
          </p>
        </div>
      )}

      {/* Project Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Project Title Field */}
        <div>
          <label htmlFor="title" className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Project Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Enter your project title"
          />
        </div>

        {/* Project Description Field */}
        <div>
          <label htmlFor="description" className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Describe your project in detail"
          />
        </div>

        {/* Technologies Section */}
        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Technologies
          </label>
          
          {/* Technology Input and Add Button */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}  // Add on Enter key
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-mono ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Add a technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={addTechnology}
              className={`px-4 py-2 rounded-lg transition-colors font-mono font-bold ${
                isDarkMode
                  ? 'bg-green-400 text-black hover:bg-green-300'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              Add
            </button>
          </div>
          
          {/* Technology Tags Display */}
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-mono font-bold ${
                  isDarkMode
                    ? 'bg-green-400 text-black'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className={`ml-2 hover:opacity-70 ${
                    isDarkMode ? 'text-black' : 'text-blue-600'
                  }`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* URL Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* GitHub URL Field */}
          <div>
            <label htmlFor="githubUrl" className={`block text-sm font-medium mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              GitHub URL (optional)
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Demo URL Field */}
          <div>
            <label htmlFor="demoUrl" className={`block text-sm font-medium mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Demo URL (optional)
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="https://yourproject.com"
            />
          </div>
        </div>

        {/* Status and Featured Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Project Status Field */}
          <div>
            <label htmlFor="status" className={`block text-sm font-medium mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center">
            <label className={`flex items-center space-x-3 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className={`w-4 h-4 rounded transition-colors ${
                  isDarkMode
                    ? 'bg-gray-900 border-green-500 text-green-400 focus:ring-green-400'
                    : 'bg-white border-slate-300 text-blue-600 focus:ring-blue-500'
                }`}
              />
              <span className="text-sm font-medium">Featured Project</span>
            </label>
          </div>
        </div>

        {/* Form Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors font-mono font-bold text-sm uppercase tracking-wide ${
              loading
                ? isDarkMode
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-green-400 text-black hover:bg-green-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm 