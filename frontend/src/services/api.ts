/**
 * API Service for the Personal Website frontend
 * Handles all communication with the backend REST API
 * Includes authentication, project management, and user operations
 * Manages JWT tokens and request headers automatically
 */

/**
 * Project Interface
 */
export interface Project {
  _id?: string
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  demoUrl: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  featured: boolean
  startDate: string  // ISO date string
  endDate?: string   // Optional ISO date string for ongoing projects
  // Generic content sections
  body1?: string
  body2?: string
  body3?: string
  images?: string[]
  tags?: string[]
  teamSize?: number
}

/**
 * User Interface
 */
export interface User {
  _id?: string
  name: string
  email: string
}

/**
 * Authentication Response Interface
 */
export interface AuthResponse {
  _id: string
  name: string
  email: string
  token: string
}

// Base URL for all API requests - dynamically set based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production (Vercel), use relative path
  : 'http://localhost:5000/api'  // In development, use local server

/**
 * JWT Token Management Functions
 * Handle storing, retrieving, and removing authentication tokens from localStorage
 */

/**
 * Get JWT token from localStorage
 * @returns {string | null} JWT token or null if not found
 */
const getToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

/**
 * Remove JWT token from localStorage
 */
const removeToken = (): void => {
  localStorage.removeItem('token')
}

/**
 * Generate HTTP headers with authentication
 * @returns {object} Headers object with Content-Type and Authorization (if token exists)
 */
const getAuthHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })  // Add Bearer token if available
  }
}

/**
 * Projects API Functions
 * Handle all project-related HTTP requests to the backend
 */
export const projectsAPI = {
  /**
   * Get featured projects for public display
   * @desc Fetches projects marked as featured for the landing page
   * @returns {Promise<Project[]>} Array of featured projects
   * @access Public - no authentication required
   */
  getFeatured: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/featured`)
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch featured projects:', response.status, errorText)
      throw new Error(`Failed to fetch featured projects: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Get all projects for authenticated user
   * @desc Fetches all projects belonging to the current user
   * @returns {Promise<Project[]>} Array of user's projects
   * @access Private - requires authentication
   */
  getAll: async (): Promise<Project[]> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch projects:', response.status, errorText)
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Get filtered projects for authenticated user
   * @desc Fetches projects with advanced filtering and sorting options
   * @param {object} filters - Filter criteria
   * @param {string} filters.search - Search term for title, description, or technologies
   * @param {string} filters.status - Filter by project status
   * @param {string} filters.technologies - Comma-separated list of technologies to filter by
   * @param {string} filters.startDate - Filter by start year (e.g., "2024")
   * @param {string} filters.endDate - Filter by end year (e.g., "2025")
   * @param {string} filters.sortBy - Field to sort by (title, startDate, endDate, status, createdAt, updatedAt)
   * @param {string} filters.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Project[]>} Array of filtered and sorted projects
   * @access Private - requires authentication
   */
  getFiltered: async (filters: {
    search?: string
    status?: string
    technologies?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: string
  } = {}): Promise<Project[]> => {
    // Build query string from filters
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.technologies) params.append('technologies', filters.technologies)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const queryString = params.toString()
    const url = queryString ? `${API_BASE_URL}/projects?${queryString}` : `${API_BASE_URL}/projects`
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch filtered projects:', response.status, errorText)
      throw new Error(`Failed to fetch filtered projects: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Create a new project
   * @desc Creates a new project for the authenticated user
   * @param {Omit<Project, '_id'>} project - Project data without ID
   * @returns {Promise<Project>} Created project with ID
   * @access Private - requires authentication
   */
  create: async (project: Omit<Project, '_id'>): Promise<Project> => {
    console.log('Creating project with data:', project)
    console.log('Using headers:', getAuthHeaders())
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create project:', response.status, errorText)
      throw new Error(`Failed to create project: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Update an existing project
   * @desc Updates a project if the user owns it
   * @param {string} id - Project ID to update
   * @param {Partial<Project>} project - Partial project data to update
   * @returns {Promise<Project>} Updated project
   * @access Private - requires authentication and ownership
   */
  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to update project:', response.status, errorText)
      throw new Error(`Failed to update project: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Delete a project
   * @desc Deletes a project if the user owns it
   * @param {string} id - Project ID to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   * @access Private - requires authentication and ownership
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to delete project:', response.status, errorText)
      throw new Error(`Failed to delete project: ${response.status} ${response.statusText}`)
    }
  },
}

/**
 * Users API Functions
 * Handle all user-related HTTP requests to the backend
 */
export const usersAPI = {
  /**
   * Register a new user account
   * @desc Creates a new user account and returns authentication data
   * @param {object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<AuthResponse>} User data with JWT token
   * @access Public
   */
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

  /**
   * Login user with email and password
   * @desc Authenticates user and returns JWT token
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<AuthResponse>} User data with JWT token
   * @access Public
   */
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

  /**
   * Get current authenticated user data
   * @desc Fetches current user's profile information
   * @returns {Promise<User>} Current user data
   * @access Private - requires authentication
   */
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

/**
 * Authentication Utility Functions
 * Helper functions for managing authentication state
 */
export const authUtils = {
  setToken,      // Store JWT token
  getToken,      // Retrieve JWT token
  removeToken,   // Remove JWT token
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated: (): boolean => !!getToken()
}

/**
 * Error handling utility
 * @desc Converts unknown errors to user-friendly strings
 * @param {unknown} error - Error object of unknown type
 * @returns {string} User-friendly error message
 */
export const handleAPIError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

/**
 * Skills API Functions
 * Handle all skill-related HTTP requests to the backend
 */
export const skillsAPI = {
  /**
   * Get all skills
   * @desc Fetches all skills for display
   * @returns {Promise<Array<{name: string, category: string}>>} Array of skills
   * @access Public - no authentication required
   */
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/skills`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch skills:', response.status, errorText);
      throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get skills by category
   * @desc Fetches all skills in a specific category
   * @param {string} category - Category to filter skills by
   * @returns {Promise<Array<{name: string, category: string}>>} Array of skills in category
   * @access Public - no authentication required
   */
  getByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/skills/category/${category}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch skills by category:', response.status, errorText);
      throw new Error(`Failed to fetch skills by category: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Add a new skill
   * @desc Creates a new skill for the authenticated user
   * @param {object} skill - Skill data
   * @param {string} skill.name - Name of the skill
   * @param {string} skill.category - Category of the skill
   * @returns {Promise<{name: string, category: string}>} Created skill
   * @access Private - requires authentication
   */
  add: async (skill: { name: string; category: string }) => {
    const response = await fetch(`${API_BASE_URL}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add skill:', response.status, errorText);
      throw new Error(`Failed to add skill: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Update an existing skill
   * @desc Updates a skill if the user owns it
   * @param {string} id - Skill ID to update
   * @param {object} skill - Skill data to update
   * @param {string} skill.name - New name of the skill
   * @param {string} skill.category - New category of the skill
   * @returns {Promise<{name: string, category: string}>} Updated skill
   * @access Private - requires authentication and ownership
   */
  update: async (id: string, skill: { name: string; category: string }) => {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update skill:', response.status, errorText);
      throw new Error(`Failed to update skill: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Delete a skill
   * @desc Deletes a skill if the user owns it
   * @param {string} id - Skill ID to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   * @access Private - requires authentication and ownership
   */
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete skill:', response.status, errorText);
      throw new Error(`Failed to delete skill: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get skills for the authenticated user
   * @desc Fetches all skills belonging to the current user
   * @returns {Promise<Array<{name: string, category: string, user?: {name: string, email: string}}>>} Array of user's skills
   * @access Private - requires authentication
   */
  getMine: async () => {
    const response = await fetch(`${API_BASE_URL}/skills/me`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch user skills:', response.status, errorText);
      throw new Error(`Failed to fetch user skills: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}; 