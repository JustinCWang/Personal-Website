/**
 * Project Detail Modal Component
 * A blog-like modal dialog for displaying detailed project information
 * Provides a comprehensive view of project details including:
 * - Project title and description
 * - Technologies used
 * - Project URLs (GitHub, demo)
 * - Project status and time frame
 * - Featured status
 * - Detailed blog-like content sections
 * - Project images gallery
 * - Challenges and solutions
 * - Key learnings
 * - Future plans
 * Supports dark mode and responsive design with smooth animations
 */

import React, { useEffect, useState } from 'react'
import type { Project } from '../services/api.ts'

/**
 * Props interface for the ProjectDetailModal component
 * @property {Project} project - The project to display
 * @property {boolean} isOpen - Controls modal visibility
 * @property {Function} onClose - Callback when modal is closed
 * @property {boolean} [isDarkMode] - Optional dark mode state
 */
interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  isDarkMode?: boolean
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  isOpen, 
  onClose, 
  isDarkMode = false
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      // Start closing animation
      setIsAnimating(false)
      // Wait for animation to complete before removing from DOM
      setTimeout(() => setShouldRender(false), 350) // Increased from 300ms to 350ms
    }
  }, [isOpen])

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @param {boolean} short - Whether to use short month format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString: string | undefined, short: boolean = false) => {
    if (!dateString) return 'Not specified';
    
    // Extract year and month directly from ISO string to avoid timezone issues
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    
    const months = short ? [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ] : [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[month]} ${year}`;
  };

  /**
   * Handle escape key press to close modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Reset image index when modal opens
      setActiveImageIndex(0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if no project or not ready to render
  if (!project || !shouldRender) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 p-2">
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[95vw] max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl transition-all duration-300 ease-out ${
          isDarkMode ? 'card-dark' : 'card-light'
        } ${
          isAnimating 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-90'
        }`}>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10 ${
              isDarkMode ? 'modal-dark' : 'modal-light'
            }`}
            title="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-8">
            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className={`text-4xl font-bold font-mono ${
                    isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                  }`}>
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-sm font-mono ${
                      isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                    }`}>
                      Started: {formatDate(project.startDate)}
                    </span>
                    {project.endDate && (
                      <span className={`text-sm font-mono ${
                        isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                      }`}>
                        Completed: {formatDate(project.endDate)}
                      </span>
                    )}
                    {!project.endDate && (
                      <span className={`px-3 py-1 rounded-full text-sm font-mono ${
                        isDarkMode 
                          ? 'bg-green-900 text-green-300 border border-green-500' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        Ongoing Project
                      </span>
                    )}
                  </div>
                  
                  {/* Team Size Display */}
                  {project.teamSize && (
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono ${
                        isDarkMode
                          ? 'bg-purple-900 text-purple-300 border border-purple-500'
                          : 'bg-purple-100 text-purple-800 border border-purple-300'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Team Size: {project.teamSize} {project.teamSize === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags Section - Moved above Overview */}
            {project.tags && project.tags.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-mono ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300 border border-gray-600'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="mb-8">
              <h2 className={`text-2xl font-semibold mb-4 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                Overview
              </h2>
              <p className={`text-lg leading-relaxed font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                {project.description}
              </p>
            </div>

            {/* Project Images Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Project Gallery
                </h2>
                <div className="relative">
                  {/* Horizontal Image Slider */}
                  <div className="relative overflow-hidden rounded-lg">
                    <div 
                      className="flex"
                      style={{ 
                        transform: `translateX(-${activeImageIndex * 100}%)`
                      }}
                    >
                      {project.images?.map((image, index) => (
                        <div 
                          key={index}
                          className="w-full flex-shrink-0 flex justify-center items-center"
                          style={{ minWidth: '100%' }}
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Image ${index + 1}`}
                            className={`max-w-full max-h-96 object-contain rounded-lg shadow-lg ${
                              isDarkMode 
                                ? 'border-2 border-green-500/30 bg-gray-800' 
                                : 'border-2 border-slate-200 bg-white'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Navigation Arrows */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(prev => prev === 0 ? project.images!.length - 1 : prev - 1)}
                          className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-green-400 text-black hover:bg-green-300 shadow-lg'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-lg'
                          } z-10`}
                          title="Previous image"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setActiveImageIndex(prev => prev === project.images!.length - 1 ? 0 : prev + 1)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-green-400 text-black hover:bg-green-300 shadow-lg'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-lg'
                          } z-10`}
                          title="Next image"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Counter and Dots */}
                  {project.images.length > 1 && (
                    <div className="flex items-center justify-center mt-4 gap-4">
                      {/* Image Counter */}
                      <span className={`text-sm font-mono ${
                        isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                      }`}>
                        {activeImageIndex + 1} of {project.images.length}
                      </span>
                      
                      {/* Dot Indicators */}
                      <div className="flex gap-2">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index === activeImageIndex
                                ? isDarkMode 
                                  ? 'bg-green-400' 
                                  : 'bg-blue-100'
                                : isDarkMode 
                                  ? 'bg-gray-600 hover:bg-gray-500' 
                                  : 'bg-gray-200 hover:bg-blue-100'
                            }`}
                            title={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Body Content Sections */}
            {project.body1 && (
              <div className="mb-8">
                <div className={`prose prose-xl max-w-none ${
                  isDarkMode ? 'prose-invert' : ''
                }`}>
                                      <div 
                      className={`text-lg font-mono leading-relaxed ${
                        isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                      }`}
                      dangerouslySetInnerHTML={{ __html: project.body1 }}
                    />
                </div>
              </div>
            )}

            {project.body2 && (
              <div className="mb-8">
                <div className={`prose prose-xl max-w-none ${
                  isDarkMode ? 'prose-invert' : ''
                }`}>
                                      <div 
                      className={`text-lg font-mono leading-relaxed ${
                        isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                      }`}
                      dangerouslySetInnerHTML={{ __html: project.body2 }}
                    />
                </div>
              </div>
            )}

            {project.body3 && (
              <div className="mb-8">
                <div className={`prose prose-xl max-w-none ${
                  isDarkMode ? 'prose-invert' : ''
                }`}>
                                      <div 
                      className={`text-lg font-mono leading-relaxed ${
                        isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                      }`}
                      dangerouslySetInnerHTML={{ __html: project.body3 }}
                    />
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-mono font-bold ${
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
            {(project.demoUrl || project.githubUrl) && (
              <div className="mb-8">
                <h2 className={`text-2xl font-semibold mb-4 font-mono ${
                  isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
                }`}>
                  Project Links
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 font-mono ${
                        isDarkMode ? 'btn-secondary-dark' : 'btn-secondary-light'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 font-mono ${
                        isDarkMode
                          ? 'bg-black text-green-400 border border-green-400 hover:bg-green-400 hover:text-black'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Close Button at Bottom */}
            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 font-mono ${
                  isDarkMode ? 'modal-dark' : 'modal-light'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailModal; 