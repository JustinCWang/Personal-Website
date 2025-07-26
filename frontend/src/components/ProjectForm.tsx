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
import CustomMonthPicker from './CustomMonthPicker'
import CustomDropdown from './CustomDropdown'

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
    status: '' as '' | 'Planning' | 'In Progress' | 'Completed' | 'On Hold', // Project status
    featured: false,                             // Whether project is featured
    startDate: '',                               // Project start date
    endDate: '',                                 // Project end date (optional)
    // Generic content sections
    body1: '',                                  // First content section
    body2: '',                                  // Second content section
    body3: '',                                  // Third content section
    images: [] as string[],                      // Array of image URLs
    tags: [] as string[],                        // Additional tags for categorization
    teamSize: 1                                  // Team size (1 for solo projects)
  })
  
  // Additional state for form management
  const [techInput, setTechInput] = useState('')               // Temporary input for adding technologies
  const [tagInput, setTagInput] = useState('')                 // Temporary input for adding tags
  const [loading, setLoading] = useState(false)               // Loading state during submission
  const [error, setError] = useState<string | null>(null)     // Error message state
  const [success, setSuccess] = useState<string | null>(null) // Success message state
  const [imageInput, setImageInput] = useState('')               // Temporary input for adding image URLs
  const [imageError, setImageError] = useState<string | null>(null) // Error for invalid image URLs
  const [teamSizeInput, setTeamSizeInput] = useState('')         // Temporary input for team size

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
   * Add tag to the tags array
   * @desc Adds a new tag if it's valid and not already present
   */
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')  // Clear the input field
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
   * @desc Processes the form data and creates a new project
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()        // Prevent default form submission
    setError(null)           // Clear any previous errors
    setSuccess(null)         // Clear any previous success messages
    setLoading(true)         // Show loading state

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
      
      console.log('Submitting project data:', projectData)
      const newProject = await projectsAPI.create(projectData)  // Create project via API
      console.log('Project created successfully:', newProject)
      
      onProjectCreated(newProject)  // Notify parent component of successful creation
      
      // Reset form to initial state
      setFormData({ 
        title: '', 
        description: '', 
        technologies: [], 
        githubUrl: '', 
        demoUrl: '', 
        status: '',
        featured: false,
        startDate: '',
        endDate: '',
        body1: '',
        body2: '',
        body3: '',
        images: [],
        tags: [],
        teamSize: 1
      })
      setTechInput('')
      setTagInput('')
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

  /**
   * Add image URL to the images array
   * @desc Adds a new image URL if it's valid and not already present
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

  return (
    <div className={`rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border border-green-500' 
        : 'bg-white'
    }`}>
      {/* Form Header */}
      <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 font-mono ${
        isDarkMode ? 'text-green-400' : 'text-slate-800'
      }`}>
        Add New Project
      </h3>
      
      {/* Error Message Display */}
      {error && (
        <div className={`border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-red-900 border-red-600' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-xs sm:text-sm font-medium font-mono ${
            isDarkMode ? 'text-red-300' : 'text-red-600'
          }`}>
            {error}
          </p>
        </div>
      )}

      {/* Success Message Display */}
      {success && (
        <div className={`border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-green-900 border-green-600' 
            : 'bg-green-50 border-green-200'
        }`}>
          <p className={`text-xs sm:text-sm font-medium font-mono ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            {success}
          </p>
        </div>
      )}

      {/* Project Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        
        {/* Project Title Field */}
        <div>
          <label htmlFor="title" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
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
            autoComplete="off"
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="Enter your project title"
          />
        </div>

        {/* Project Description Field */}
        <div>
          <label htmlFor="description" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
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
            rows={3}
            autoComplete="off"
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 resize-none font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="Describe your project in detail"
          />
        </div>

        {/* Project Time Frame Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Start Date Field */}
          <div>
            <label htmlFor="startDate" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Start Date
            </label>
            <CustomMonthPicker
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              isDarkMode={isDarkMode}
              id="startDate"
              name="startDate"
            />
          </div>

          {/* End Date Field */}
          <div>
            <label htmlFor="endDate" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              End Date (optional)
            </label>
            <CustomMonthPicker
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              isDarkMode={isDarkMode}
              id="endDate"
              name="endDate"
            />
          </div>
        </div>

        {/* Body 1 */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Body 1
          </label>
          <textarea
            id="body1"
            name="body1"
            value={formData.body1}
            onChange={handleChange}
            rows={3}
            autoComplete="off"
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 resize-none font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="First content section"
          />
        </div>

        {/* Body 2 */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Body 2
          </label>
          <textarea
            id="body2"
            name="body2"
            value={formData.body2}
            onChange={handleChange}
            rows={3}
            autoComplete="off"
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 resize-none font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="Second content section (optional)"
          />
        </div>

        {/* Body 3 */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Body 3
          </label>
          <textarea
            id="body3"
            name="body3"
            value={formData.body3}
            onChange={handleChange}
            rows={3}
            autoComplete="off"
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 resize-none font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="Third content section (optional)"
          />
        </div>

        {/* Technologies Section */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Technologies
          </label>
          
          {/* Technology Input and Add Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}  // Add on Enter key
              autoComplete="off"
              className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                  : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
              }`}
              placeholder="Add a technology (e.g., React, Node.js)"
            />
            <button
              type="button"
              onClick={addTechnology}
              className={`py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-300 border-2 flex items-center justify-center leading-none ${
                isDarkMode
                  ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Add Technology"
            >
              {/* Plus Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Technology Tags Display */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold ${
                  isDarkMode
                    ? 'bg-green-400 text-black'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className={`ml-1.5 sm:ml-2 hover:opacity-70 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* GitHub URL Field */}
          <div>
            <label htmlFor="githubUrl" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
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
              autoComplete="off"
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                  : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
              }`}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Demo URL Field */}
          <div>
            <label htmlFor="demoUrl" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
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
              autoComplete="off"
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                  : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
              }`}
              placeholder="https://your-demo-url.com"
            />
          </div>
        </div>

        {/* Status and Featured Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Project Status Field */}
          <div>
            <label htmlFor="status" className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              Status
            </label>
            <CustomDropdown
              options={[
                { value: 'Planning', label: 'Planning' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
                { value: 'On Hold', label: 'On Hold' }
              ]}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as 'Planning' | 'In Progress' | 'Completed' | 'On Hold' })}
              placeholder="Select status..."
              isDarkMode={isDarkMode}
              className="w-full"
              backgroundColor={isDarkMode ? 'bg-gray-900' : 'bg-white'}
              borderColor={isDarkMode ? 'border-green-500' : 'border-blue-400'}
              borderFocusColor={isDarkMode ? 'focus:ring-2 focus:ring-green-400 focus:border-green-400' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
              textColor={isDarkMode ? 'text-green-100' : 'text-slate-900'}
              placeholderColor={isDarkMode ? 'placeholder-green-400' : 'placeholder-slate-400'}
              padding="px-3 sm:px-4 py-1.5 sm:py-2"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-end">
            <label className={`flex items-center space-x-2 sm:space-x-3 font-mono ${
              isDarkMode ? 'text-green-300' : 'text-slate-700'
            }`}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded transition-colors border-2 ${
                  isDarkMode
                    ? 'bg-gray-900 text-green-400 focus:ring-green-400 focus:ring-2 checkbox-green-border'
                    : 'bg-white text-blue-600 focus:ring-blue-500 focus:ring-2 checkbox-blue-border'
                }`}
              />
              <span className="text-xs sm:text-sm font-medium">Featured Project</span>
            </label>
          </div>
        </div>

        {/* Images Management */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Project Images
          </label>
          {/* Image Input and Add Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              autoComplete="off"
              className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                  : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
              }`}
              placeholder="Add an image URL (e.g. https://...)"
            />
            <button
              type="button"
              onClick={addImage}
              className={`py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-300 border-2 flex items-center justify-center leading-none ${
                isDarkMode
                  ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Add Image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {imageError && (
            <div className={`text-xs sm:text-sm font-mono mb-1.5 sm:mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>{imageError}</div>
          )}
          {/* Image URLs Display */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 relative z-0">
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
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className={`absolute top-0.5 right-0.5 sm:top-1 sm:right-1 p-0.5 sm:p-1 rounded-full text-xs font-bold transition-all duration-300 z-20 ${
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
        </div>

        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Tags
          </label>
          
          {/* Tag Input and Add Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              autoComplete="off"
              className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                  : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
              }`}
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className={`py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-300 border-2 flex items-center justify-center leading-none ${
                isDarkMode
                  ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Add Tag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Tags Display */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className={`ml-1.5 sm:ml-2 hover:opacity-70 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Team Size
          </label>
          <input
            type="text"
            id="teamSize"
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
            className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 border-1 rounded-lg transition-all duration-300 font-mono text-xs sm:text-sm ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-white placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none'
                : 'bg-white border-blue-400 text-slate-900 placeholder-slate-400 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none'
            }`}
            placeholder="Enter team size (e.g., 1, 3, 5)"
          />
        </div>

        {/* Form Submit Button */}
        <div className="pt-3 sm:pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 font-mono font-bold text-xs sm:text-sm uppercase tracking-wide border-2 ${
              loading
                ? isDarkMode
                  ? 'border-gray-600 text-gray-400 cursor-not-allowed bg-gray-800'
                  : 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-100'
                : isDarkMode
                  ? 'border-green-500 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-gray-800'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-100'
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