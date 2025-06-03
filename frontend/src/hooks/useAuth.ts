/**
 * Authentication Hook for the Personal Website frontend
 * Custom hook to access authentication context
 * Kept separate from AuthContext component for Fast Refresh compatibility
 */

import { useContext } from 'react'
import { AuthContext, type AuthContextType } from '../contexts/authContext.ts'

/**
 * Custom hook to access authentication context
 * @desc Provides access to authentication state and functions
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 