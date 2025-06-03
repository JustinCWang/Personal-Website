/**
 * Authentication Context Definition
 * Contains only context and types - no components for Fast Refresh compatibility
 */

import { createContext } from 'react'
import type { User } from '../services/api.ts'

/**
 * Authentication Context Type Definition
 */
export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

/**
 * Authentication Context
 * @desc React context for authentication state management
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined) 