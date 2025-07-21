/**
 * Project Edit Modal Component
 * A modal dialog for editing project details with blog-like features
 * Provides a comprehensive form interface for updating project information including:
 * - Basic details (title, description)
 * - Technologies used
 * - Project URLs (GitHub, demo)
 * - Project status and featured status
 * - Blog-like content (detailed content, images, challenges, learnings, future plans)
 * - Project metadata (complexity, time estimates, team size)
 * - Tags for categorization
 * Supports dark mode and responsive design
 */

import React, { useState, useEffect } from 'react'
import type { Project } from '../services/api.ts'
import { projectsAPI, handleAPIError } from '../services/api.ts'
import CustomMonthPicker from './CustomMonthPicker'
import CustomDropdown from './CustomDropdown'

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
    status: '' as '' | 'Planning' | 'In Progress' | 'Completed' | 'On Hold',
    featured: false,
    startDate: '',
    endDate: '',
    // Generic content sections
    body1: '',
    body2: '',
    body3: '',
    images: [] as string[],
    tags: [] as string[],
    teamSize: 1
  })
  const [techInput, setTechInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageInput, setImageInput] = useState('')
  const [imageError, setImageError] = useState<string | null>(null)
  const [teamSizeInput, setTeamSizeInput] = useState('')

  /**
   * Initialize form data when modal opens
   * Populates form fields with existing project data
   */
  useEffect(() => {
    if (isOpen && project) {
      // Convert ISO date strings to YYYY-MM format for month inputs
      const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
      };

      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        status: project.status || 'Planning',
        featured: project.featured || false,
        startDate: formatDateForInput(project.startDate),
        endDate: formatDateForInput(project.endDate),
        body1: project.body1 || '',
        body2: project.body2 || '',
        body3: project.body3 || '',
        images: project.images || [],
        tags: project.tags || [],
        teamSize: project.teamSize || 1
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
   * Remove image URL from the images array
   * @desc Removes a specific image URL from the list
   * @param {string} image - Image URL to remove
   */
  const removeImage = (image: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter(i => i !== image)
    })
  }

  /**
   * Add tag to the tags array
   * @desc Adds a new tag if it's valid and not already present
   */
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  /**
   * Remove tag from the tags array
   * @desc Removes a specific tag from the list
   * @param {string} tag - Tag to remove
   */
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
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
      // Convert month inputs to proper date strings
      const projectData = {
        ...formData,
        status: formData.status || 'Planning', // Default to 'Planning' if empty
        startDate: formData.startDate ? (() => {
          const [year, month] = formData.startDate.split('-');
          // Create UTC date directly to avoid timezone issues
          return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1)).toISOString();
        })() : '',
        endDate: formData.endDate ? (() => {
          const [year, month] = formData.endDate.split('-');
          // Create UTC date directly to avoid timezone issues
          return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1)).toISOString();
        })() : '',
      }
      
      const updatedProject = await projectsAPI.update(project._id, projectData)
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

  /**
   * Add a new image to the images array
   * @desc Adds a new image URL to the list
   */
  const addImage = () => {
    setImageError(null)
    if (!imageInput.trim() || formData.images.includes(imageInput.trim())) return
    // Validate image URL by attempting to load it
    const img = new window.Image()
    img.onload = () => {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      })
      setImageInput('')
      setImageError(null)
    }
    img.onerror = () => {
      setImageError('Could not load image from this URL.')
    }
    img.src = imageInput.trim()
  }

  if (!isOpen) return null

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isDarkMode ? 'card-dark' : 'card-light'
      }`}>
        {/* Modal Header */}
        <div className={`sticky top-0 border-b p-6 rounded-t-xl transition-all duration-300 z-10 ${
          isDarkMode 
            ? 'bg-black border-green-500' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold font-mono ${
              isDarkMode ? 'text-primary-dark' : 'text-primary-light'
            }`}>
              Edit Project
            </h2>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'modal-dark' : 'modal-light'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 relative z-0">
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
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
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
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                  isDarkMode
                    ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                    : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                }`}
                placeholder="Enter your project title"
              />
            </div>

            {/* Project Description Input */}
            <div>
              <label htmlFor="edit-description" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
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
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
                  isDarkMode
                    ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                    : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                }`}
                placeholder="Describe your project in detail"
              />
            </div>

            {/* Project Time Frame Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Start Date Field */}
              <div>
                <label htmlFor="edit-startDate" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Start Date
                </label>
                <CustomMonthPicker
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                  isDarkMode={isDarkMode}
                  id="edit-startDate"
                  name="startDate"
                />
              </div>

              {/* End Date Field */}
              <div>
                <label htmlFor="edit-endDate" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  End Date (optional)
                </label>
                <CustomMonthPicker
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                  isDarkMode={isDarkMode}
                  id="edit-endDate"
                  name="endDate"
                />
              </div>
            </div>

            {/* Technologies Management */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
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
                  autoComplete="off"
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                  }`}
                  placeholder="Add a technology (e.g., React, Node.js)"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className={`p-2 rounded-lg transition-all duration-300 border-2 ${
                    isDarkMode ? 'btn-primary-dark' : 'btn-primary-light'
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
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
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
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                  }`}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Blog-like Fields */}
            <div>
              <label htmlFor="edit-body1" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Body 1
              </label>
              <textarea
                id="edit-body1"
                name="body1"
                value={formData.body1}
                onChange={handleChange}
                rows={4}
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
                  isDarkMode
                    ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                    : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                }`}
                placeholder="Write body 1 content about your project"
              />
            </div>

            <div>
              <label htmlFor="edit-body2" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Body 2
              </label>
              <textarea
                id="edit-body2"
                name="body2"
                value={formData.body2}
                onChange={handleChange}
                rows={4}
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
                  isDarkMode
                    ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                    : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                }`}
                placeholder="Write body 2 content about your project"
              />
            </div>

            <div>
              <label htmlFor="edit-body3" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Body 3
              </label>
              <textarea
                id="edit-body3"
                name="body3"
                value={formData.body3}
                onChange={handleChange}
                rows={4}
                autoComplete="off"
                className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
                  isDarkMode
                    ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                    : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                }`}
                placeholder="Write body 3 content about your project"
              />
            </div>

            {/* Images Management */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Project Images
              </label>
              
              {/* Image URLs Display */}
              <div className="flex flex-wrap gap-2 relative z-0">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative inline-block rounded-lg overflow-hidden border-2 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Project image ${index + 1}`}
                      className="w-20 h-20 object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className={`absolute top-1 right-1 p-1 rounded-full text-xs font-bold transition-all duration-300 z-20 ${
                        isDarkMode
                          ? 'bg-red-600 text-white hover:bg-red-500'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Image Input and Add Button */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  autoComplete="off"
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                  }`}
                  placeholder="Add an image URL (e.g. https://...)"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className={`p-2 rounded-lg transition-all duration-300 border-2 ${
                    isDarkMode
                      ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Add Image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              {imageError && (
                <div className={`text-sm font-mono mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>{imageError}</div>
              )}
            </div>

            {/* Tags Management */}
            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Tags
              </label>
              
              {/* Tag Input and Add Button */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  autoComplete="off"
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                  }`}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={`p-2 rounded-lg transition-all duration-300 border-2 ${
                    isDarkMode
                      ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Add Tag"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-mono font-bold ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className={`ml-2 hover:opacity-70 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Project Metadata */}
            <div>
              {/* Team Size */}
              <div>
                <label htmlFor="edit-teamSize" className={`block text-sm font-medium mb-2 font-mono ${
                  isDarkMode ? 'text-green-300' : 'text-slate-700'
                }`}>
                  Team Size
                </label>
                <input
                  type="number"
                  id="edit-teamSize"
                  name="teamSize"
                  value={teamSizeInput || (formData.teamSize === 1 ? '' : formData.teamSize)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTeamSizeInput(value);
                    if (value === '') {
                      setFormData({ ...formData, teamSize: 1 });
                    } else {
                      const parsed = parseInt(value);
                      setFormData({ ...formData, teamSize: isNaN(parsed) ? 1 : parsed });
                    }
                  }}
                  autoComplete="off"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                    isDarkMode
                      ? 'bg-gray-800 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                      : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
                  }`}
                  placeholder="Enter team size (e.g., 1, 3, 5)"
                />
              </div>
            </div>

            {/* Project Status and Featured Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Select */}
              <div>
                <CustomDropdown
                  value={formData.status}
                  onChange={(value) => setFormData({ ...formData, status: value as 'Planning' | 'In Progress' | 'Completed' | 'On Hold' })}
                  options={[
                    { value: 'Planning', label: 'Planning' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'On Hold', label: 'On Hold' }
                  ]}
                  placeholder="Select status..."
                  isDarkMode={isDarkMode}
                  label="Status"
                />
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
                    className={`w-4 h-4 rounded transition-colors border-2 ${
                      isDarkMode
                        ? 'bg-gray-900 text-green-400 focus:ring-green-400 focus:ring-2 checkbox-green-border'
                        : 'bg-white text-blue-600 focus:ring-blue-500 focus:ring-2 checkbox-blue-border'
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