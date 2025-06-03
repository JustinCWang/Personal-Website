/**
 * Login Component for the Personal Website frontend
 * Handles user authentication (login and registration) with form validation
 * Provides a dual-mode interface for both signing in and creating new accounts
 * Includes error handling, loading states, and responsive design
 */

// Import React dependencies and custom hooks/utilities
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'           // Authentication context hook
import { handleAPIError } from '../services/api'    // Error handling utility

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
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center p-4">
      {/* Main form container with centered layout */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Form header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome {isLogin ? 'Back' : ''}
          </h1>
          <p className="text-slate-600">
            {isLogin ? 'Sign in to access your projects' : 'Create your account to get started'}
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Authentication form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name field - only shown in register mode */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}  // Required only in register mode
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          )}

          {/* Email field - always visible */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          {/* Password field - always visible */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm password field - only shown in register mode */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}  // Required only in register mode
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              // Loading state with spinner
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
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