/**
 * Authentication Context for the Personal Website frontend
 * Manages user authentication state, login/logout functionality, and JWT token handling
 * Provides authentication status and user data throughout the application
 */

// Import React dependencies and types
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../services/api'  // Type definitions for user and auth data
import { usersAPI, authUtils } from '../services/api'      // API functions and auth utilities

/**
 * Authentication Context Type Definition
 * @interface AuthContextType
 * @property {User | null} user - Current authenticated user data or null
 * @property {boolean} loading - Loading state during authentication checks
 * @property {Function} login - Function to authenticate user with email/password
 * @property {Function} register - Function to register new user account
 * @property {Function} logout - Function to sign out user and clear session
 * @property {boolean} isAuthenticated - Boolean indicating if user is logged in
 */
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Custom hook to access authentication context
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} Throws error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Props interface for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication Provider Component
 * @desc Provides authentication context to child components
 * @param {AuthProviderProps} props - Component props containing children
 * @returns {JSX.Element} Provider component with authentication context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for current user data
  const [user, setUser] = useState<User | null>(null)
  
  // State for loading during authentication checks
  const [loading, setLoading] = useState(true)

  /**
   * Check authentication status on app initialization
   * Verifies if user has valid token and fetches user data
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a stored authentication token
        if (authUtils.isAuthenticated()) {
          // Fetch current user data from backend
          const userData = await usersAPI.getMe()
          setUser(userData)
        }
      } catch {
        // Token might be invalid or expired, clear it from storage
        authUtils.removeToken()
      } finally {
        // Set loading to false regardless of success/failure
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Login function
   * @desc Authenticates user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>} Promise that resolves when login is complete
   */
  const login = async (email: string, password: string): Promise<void> => {
    // Send login request to backend
    const response: AuthResponse = await usersAPI.login({ email, password })
    
    // Store authentication token in local storage
    authUtils.setToken(response.token)
    
    // Update user state with authenticated user data
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  /**
   * Register function
   * @desc Creates new user account and logs them in
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>} Promise that resolves when registration is complete
   */
  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Send registration request to backend
    const response: AuthResponse = await usersAPI.register({ name, email, password })
    
    // Store authentication token in local storage
    authUtils.setToken(response.token)
    
    // Update user state with new user data
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  /**
   * Logout function
   * @desc Signs out user and clears authentication data
   */
  const logout = (): void => {
    // Remove authentication token from local storage
    authUtils.removeToken()
    
    // Clear user state
    setUser(null)
  }

  // Create context value object with all authentication functionality
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user  // Convert user object to boolean for authentication status
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 