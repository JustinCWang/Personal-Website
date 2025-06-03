/**
 * Authentication Context and Provider for the Personal Website frontend
 * Contains context definition and AuthProvider component
 * Hook is kept in separate file for Fast Refresh compatibility
 */

import React, { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../services/api'
import { usersAPI, authUtils } from '../services/api'
import { AuthContext, type AuthContextType } from './authContext'

/**
 * Authentication Provider Component
 * Contains only the AuthProvider component for Fast Refresh compatibility
 */

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
 * @returns {JSX.Element} Context provider wrapping children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Check authentication status on mount
   * @desc Verifies if user has valid token and fetches user data
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authUtils.isAuthenticated()) {
          const userData = await usersAPI.getMe()
          setUser(userData)
        }
      } catch {
        authUtils.removeToken()
      } finally {
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
   */
  const login = async (email: string, password: string): Promise<void> => {
    const response: AuthResponse = await usersAPI.login({ email, password })
    authUtils.setToken(response.token)
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  /**
   * Register function
   * @desc Creates new user account
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   */
  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response: AuthResponse = await usersAPI.register({ name, email, password })
    authUtils.setToken(response.token)
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  /**
   * Logout function
   * @desc Clears authentication state and token
   */
  const logout = (): void => {
    authUtils.removeToken()
    setUser(null)
  }

  // Context value object
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 