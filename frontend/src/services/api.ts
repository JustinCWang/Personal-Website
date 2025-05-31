// API service for backend integration
const API_BASE_URL = 'http://localhost:5000/api'

export interface Goal {
  _id?: string
  title: string
  description: string
}

export interface User {
  _id?: string
  name: string
  email: string
}

export interface AuthResponse {
  _id: string
  name: string
  email: string
  token: string
}

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('token')
}

const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

const removeToken = (): void => {
  localStorage.removeItem('token')
}

// Headers with authentication
const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Goals API
export const goalsAPI = {
  getAll: async (): Promise<Goal[]> => {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error('Failed to fetch goals')
    }
    return response.json()
  },

  create: async (goal: Omit<Goal, '_id'>): Promise<Goal> => {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goal),
    })
    if (!response.ok) {
      throw new Error('Failed to create goal')
    }
    return response.json()
  },

  update: async (id: string, goal: Partial<Goal>): Promise<Goal> => {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(goal),
    })
    if (!response.ok) {
      throw new Error('Failed to update goal')
    }
    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to delete goal')
    }
  },
}

// Users API
export const usersAPI = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to register user')
    }
    return response.json()
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to login')
    }
    return response.json()
  },

  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to get user data')
    }
    return response.json()
  },
}

// Auth utilities
export const authUtils = {
  setToken,
  getToken,
  removeToken,
  isAuthenticated: (): boolean => !!getToken()
}

// Helper function to handle API errors
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
} 