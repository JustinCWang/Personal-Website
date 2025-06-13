/**
 * Project Edit Modal Component
 * A modal dialog for editing project details
 * Provides a form interface for updating project information including:
 * - Basic details (title, description)
 * - Technologies used
 * - Project URLs (GitHub, demo)
 * - Project status and featured status
 * Supports dark mode and responsive design
 */

import React, { useState, useEffect } from 'react'
import type { Project } from '../services/api.ts'
import { projectsAPI, handleAPIError } from '../services/api.ts'

/**
 * Props interface for the ProjectEditModal component
 * @property {Project} project - The project to be edited
 * @property {boolean} isOpen - Controls modal visibility
 * @property {Function} onClose - Callback when modal is closed
 * @property {Function} onProjectUpdated - Callback when project is updated
 * @property {boolean} [isDarkMode] - Optional dark mode state
 */
interface ProjectEditModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onProjectUpdated: (project: Project) => void
  isDarkMode?: boolean
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ 
  project, 
  isOpen, 
  onClose, 
  onProjectUpdated,
  isDarkMode = false
}) => {
  // Form state management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    githubUrl: '',
    demoUrl: '',
    status: 'Planning' as 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
    featured: false
  })
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initialize form data when modal opens
   * Populates form fields with existing project data
   */
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        status: project.status || 'Planning',
        featured: project.featured || false
      })
    }
  }, [isOpen, project])

  /**
   * Handle input changes for form fields
   * Updates form state with new values
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Add a new technology to the project
   * Prevents duplicate technologies and trims whitespace
   */
  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  /**
   * Remove a technology from the project
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
   * Updates project data through API and closes modal on success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project._id) return
    
    setError(null)
    setLoading(true)

    try {
      const updatedProject = await projectsAPI.update(project._id, formData)
      onProjectUpdated(updatedProject)
      onClose()
    } catch (error) {
      setError(handleAPIError(error))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle modal close
   * Clears error state and calls onClose callback
   */
  const handleClose = () => {
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border border-green-500' 
          : 'bg-white'
      }`}>
        {/* Modal Header */}
        <div className={`sticky top-0 border-b p-6 rounded-t-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-black border-green-500' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold font-mono ${
              isDarkMode ? 'text-green-400' : 'text-slate-800'
            }`}>
              Edit Project
            </h2>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode
                  ? 'text-green-400 hover:text-green-300 hover:bg-gray-800'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Error Message Display */}
          {error && (
            <div className={`border rounded-lg p-4 mb-6 transition-all duration-300 ${
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

          {/* Edit Project Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title Input */}
            <div>
              <label htmlFor="edit-title" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Project Title
              </label>
              <input
                type="text"
                id="edit-title"
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

            {/* Project Description Input */}
            <div>
              <label htmlFor="edit-description" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Description
              </label>
              <textarea
                id="edit-description"
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

            {/* Technologies Management */}
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
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
                  className={`p-2 rounded-lg transition-all duration-300 border-2 ${
                    isDarkMode
                      ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Add Technology"
                >
                  {/* Plus Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              {/* Technology Tags */}
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

            {/* Project URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub URL Input */}
              <div>
                <label htmlFor="edit-githubUrl" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  GitHub URL (optional)
                </label>
                <input
                  type="url"
                  id="edit-githubUrl"
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

              {/* Demo URL Input */}
              <div>
                <label htmlFor="edit-demoUrl" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  Demo URL (optional)
                </label>
                <input
                  type="url"
                  id="edit-demoUrl"
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

            {/* Project Status and Featured Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Select */}
              <div>
                <label htmlFor="edit-status" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  Status
                </label>
                <select
                  id="edit-status"
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

              {/* Featured Toggle */}
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

            {/* Form Action Buttons */}
            <div className="flex gap-4 pt-4">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 font-mono font-bold text-sm uppercase tracking-wide border-2 ${
                  isDarkMode
                    ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 font-mono font-bold text-sm uppercase tracking-wide border-2 ${
                  loading
                    ? isDarkMode
                      ? 'border-gray-600 text-gray-400 cursor-not-allowed bg-gray-800'
                      : 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-100'
                    : isDarkMode
                      ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {loading ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectEditModal 