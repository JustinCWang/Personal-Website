/**
 * Dark Mode Hook
 * Manages dark mode state and persistence
 * Provides dark mode toggle functionality
 */

import { useState, useEffect } from 'react'

/**
 * Custom hook for managing dark mode state with localStorage persistence
 * @returns {Object} Object containing isDarkMode state and toggleDarkMode function
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage for saved preference, default to false if not found
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Update localStorage whenever dark mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return { isDarkMode, toggleDarkMode }
}

/**
 * Animation Freeze Hook
 * Manages animation freeze state and persistence
 * Provides freeze toggle functionality
 */

/**
 * Custom hook for managing animation freeze state with localStorage persistence
 * @returns {Object} Object containing isFrozen state and toggleFreeze function
 */
export const useAnimationFreeze = () => {
  const [isFrozen, setIsFrozen] = useState<boolean>(() => {
    // Check localStorage for saved preference, default to false if not found
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('animationFreeze')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Update localStorage whenever freeze state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('animationFreeze', JSON.stringify(isFrozen))
    }
  }, [isFrozen])

  const toggleFreeze = () => {
    setIsFrozen(!isFrozen)
  }

  return { isFrozen, toggleFreeze }
} 