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
    featured: false,                             // Whether project is featured
    startDate: '',                               // Project start date
    endDate: '',                                 // Project end date (optional)
    // Blog-like fields
    detailedContent: '',                         // Detailed project content
    images: [] as string[],                      // Array of image URLs
    challenges: '',                              // Project challenges and solutions
    learnings: '',                               // Key learnings from the project
    futurePlans: '',                             // Future development plans
    tags: [] as string[],                        // Additional tags for categorization
    complexity: 'Intermediate' as const,         // Project complexity level
    estimatedHours: '',                          // Estimated time to complete
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
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined
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
        status: 'Planning',
        featured: false,
        startDate: '',
        endDate: '',
        detailedContent: '',
        images: [],
        challenges: '',
        learnings: '',
        futurePlans: '',
        tags: [],
        complexity: 'Intermediate',
        estimatedHours: '',
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
    <div className={`rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border border-green-500' 
        : 'bg-white'
    }`}>
      {/* Form Header */}
      <h3 className={`text-5xl font-semibold mb-4 font-mono ${
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
            autoComplete="off"
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
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Describe your project in detail"
          />
        </div>

        {/* Project Time Frame Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Start Date Field */}
          <div>
            <label htmlFor="startDate" className={`block text-sm font-medium mb-2 font-mono ${
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
            <label htmlFor="endDate" className={`block text-sm font-medium mb-2 font-mono ${
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
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}  // Add on Enter key
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="https://your-demo-url.com"
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
                  ? 'bg-gray-900 border-green-500 text-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
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

        {/* Blog-like Fields */}
        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Detailed Content
          </label>
          <textarea
            id="detailedContent"
            name="detailedContent"
            value={formData.detailedContent}
            onChange={handleChange}
            required
            rows={4}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Write detailed content about your project"
          />
        </div>

        {/* Images Management */}
        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Project Images
          </label>
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
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Challenges
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            required
            rows={4}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Describe the challenges and solutions"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Learnings
          </label>
          <textarea
            id="learnings"
            name="learnings"
            value={formData.learnings}
            onChange={handleChange}
            required
            rows={4}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Write down key learnings from the project"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Future Plans
          </label>
          <textarea
            id="futurePlans"
            name="futurePlans"
            value={formData.futurePlans}
            onChange={handleChange}
            required
            rows={4}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors resize-none font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Describe future development plans"
          />
        </div>

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
                  ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Complexity
          </label>
          <select
            id="complexity"
            name="complexity"
            value={formData.complexity}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Estimated Hours
          </label>
          <input
            type="text"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Estimated time to complete"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 font-mono ${
            isDarkMode ? 'text-green-300' : 'text-slate-700'
          }`}>
            Team Size
          </label>
          <input
            type="text"
            id="teamSize"
            name="teamSize"
            value={formData.teamSize.toString()}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) })}
            autoComplete="off"
            className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
              isDarkMode
                ? 'bg-gray-900 border-green-500 text-green-100 placeholder-green-400 focus:ring-2 focus:ring-green-400 focus:border-green-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder="Team size"
          />
        </div>

        {/* Form Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg transition-all duration-300 font-mono font-bold text-sm uppercase tracking-wide border-2 ${
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