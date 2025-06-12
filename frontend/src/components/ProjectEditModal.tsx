import React, { useState, useEffect } from 'react'
import type { Project } from '../services/api.ts'
import { projectsAPI, handleAPIError } from '../services/api.ts'

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

  // Populate form with project data when modal opens
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

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

  const handleClose = () => {
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black border border-green-500' 
          : 'bg-white'
      }`}>
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

        <div className="p-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-green-300' : 'text-slate-700'
              }`}>
                Technologies
              </label>
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
                  className={`px-4 py-2 rounded-lg transition-colors font-mono font-bold ${
                    isDarkMode
                      ? 'bg-green-400 text-black hover:bg-green-300'
                      : 'bg-slate-600 text-white hover:bg-slate-700'
                  }`}
                >
                  Add
                </button>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors font-mono font-bold text-sm uppercase tracking-wide ${
                  isDarkMode
                    ? 'bg-gray-700 text-green-300 hover:bg-gray-600 border border-green-500'
                    : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors font-mono font-bold text-sm uppercase tracking-wide ${
                  loading
                    ? isDarkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-green-400 text-black hover:bg-green-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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