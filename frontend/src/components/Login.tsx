/**
 * Login Component for the Personal Website frontend
 * Handles user authentication (login and registration) with form validation
 * Provides a dual-mode interface for both signing in and creating new accounts
 * Includes error handling, loading states, and responsive design
 */

// Import React dependencies and custom hooks/utilities
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.ts'           // Authentication context hook
import { useDarkMode, useAnimationFreeze } from '../hooks/useDarkMode.ts'   // Dark mode and animation freeze hooks
import { handleAPIError } from '../services/api.ts'    // Error handling utility

/**
 * Props interface for Login component
 */
interface LoginProps {
  onLoginSuccess?: () => void  // Optional callback function called after successful authentication
}

/**
 * Login Component
 * @desc Provides authentication interface with login/register modes
 * @param {LoginProps} props - Component props
 * @returns {JSX.Element} Login/Register form with validation and error handling
 */
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // Component state management
  const [isLogin, setIsLogin] = useState(true)      // Toggle between login and register modes
  const [formData, setFormData] = useState({        // Form input values
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)    // Error message state
  const [loading, setLoading] = useState(false)             // Loading state for API calls
  
  // Authentication functions from context
  const { login, register } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()       // Persistent dark mode state
  const { isFrozen, toggleFreeze } = useAnimationFreeze()    // Animation freeze state

  /**
   * Handle form input changes
   * @desc Updates form data state when user types in input fields
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handle form submission
   * @desc Processes login or registration based on current mode
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()        // Prevent default form submission
    setError(null)           // Clear any previous errors
    setLoading(true)         // Show loading state

    try {
      if (isLogin) {
        // Login mode - authenticate existing user
        await login(formData.email, formData.password)
      } else {
        // Register mode - create new user account
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await register(formData.name, formData.email, formData.password)
      }
      // Call success callback if provided
      onLoginSuccess?.()
    } catch (error) {
      // Handle authentication errors
      setError(handleAPIError(error))
    } finally {
      // Hide loading state regardless of success/failure
      setLoading(false)
    }
  }

  /**
   * Toggle between login and register modes
   * @desc Switches form between login and registration modes and resets form
   */
  const toggleMode = () => {
    setIsLogin(!isLogin)     // Toggle the mode
    setError(null)           // Clear any errors
    // Reset form data
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className={`min-h-screen transition-all duration-300 flex items-center justify-center p-4 ${
      isDarkMode ? 'page-bg-dark' : 'page-bg-light'
    }`}>
      {/* Dark Mode Toggle - Fixed positioned */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isDarkMode
              ? 'bg-green-400 text-black hover:bg-green-300'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Hacker Mode'}
        >
          {isDarkMode ? (
            // Sun icon for light mode
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            // Hacker/terminal icon for dark mode
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Animation Freeze Toggle */}
        <button
          onClick={toggleFreeze}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isFrozen
              ? 'bg-red-400 text-white hover:bg-red-300'
              : isDarkMode
                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
          }`}
          title={isFrozen ? 'Resume Animations' : 'Freeze Animations'}
        >
          {isFrozen ? (
            // Play icon when frozen
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            // Pause icon when not frozen
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Main form container with centered layout */}
      <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 ${
        isDarkMode ? 'card-dark' : 'card-light'
      }`}>
        
        {/* Form header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 font-mono ${
            isDarkMode ? 'text-primary-dark' : 'text-primary-light'
          }`}>
            Welcome {isLogin ? 'Back' : ''}
          </h1>
          <p className={`font-mono ${
            isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
          }`}>
            {isLogin ? 'Sign in to access your projects' : 'Create your account to get started'}
          </p>
        </div>

        {/* Error message display */}
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

        {/* Authentication form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name field - only shown in register mode */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}  // Required only in register mode
                className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                  isDarkMode ? 'input-dark' : 'input-light'
                }`}
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email field - always visible */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 font-mono ${
              isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
            }`}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode ? 'input-dark' : 'input-light'
              }`}
              placeholder="Enter your email"
            />
          </div>

          {/* Password field - always visible */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 font-mono ${
              isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
            }`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                isDarkMode ? 'input-dark' : 'input-light'
              }`}
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm password field - only shown in register mode */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 font-mono ${
                isDarkMode ? 'text-secondary-dark' : 'text-secondary-light'
              }`}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}  // Required only in register mode
                className={`w-full px-4 py-3 border rounded-lg transition-colors font-mono ${
                  isDarkMode ? 'input-dark' : 'input-light'
                }`}
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Submit button with loading state */}
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
            {loading ? (
              // Loading state with spinner
              <div className="flex items-center justify-center">
                <div className={`animate-spin rounded-full h-5 w-5 border-b-2 mr-2 ${
                  isDarkMode ? 'border-green-400' : 'border-slate-600'
                }`}></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              // Normal state button text
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Mode toggle button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className={`font-medium transition-colors font-mono ${
              isDarkMode
                ? 'text-green-400 hover:text-green-300'
                : 'text-slate-600 hover:text-slate-700'
            }`}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login 