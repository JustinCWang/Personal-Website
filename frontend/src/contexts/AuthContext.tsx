import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../services/api'
import { usersAPI, authUtils } from '../services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authUtils.isAuthenticated()) {
          const userData = await usersAPI.getMe()
          setUser(userData)
        }
      } catch {
        // Token might be invalid, clear it
        authUtils.removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    const response: AuthResponse = await usersAPI.login({ email, password })
    authUtils.setToken(response.token)
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response: AuthResponse = await usersAPI.register({ name, email, password })
    authUtils.setToken(response.token)
    setUser({
      _id: response._id,
      name: response.name,
      email: response.email
    })
  }

  const logout = (): void => {
    authUtils.removeToken()
    setUser(null)
  }

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