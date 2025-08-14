/**
 * useAnimationToggle Hook
 * @desc Manages global animation on/off state with localStorage persistence
 * @returns {Object} Animation toggle state and control functions
 */

import { useState, useEffect } from 'react'

interface UseAnimationToggleReturn {
  animationsEnabled: boolean
  toggleAnimations: () => void
  enableAnimations: () => void
  disableAnimations: () => void
}

/**
 * Custom hook for managing animation toggle state
 * Persists state in localStorage and defaults to disabled (false)
 */
export const useAnimationToggle = (): UseAnimationToggleReturn => {
  // Initialize state from localStorage, defaulting to false (animations off)
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('animationsEnabled')
      return stored === 'true' // Only true if explicitly set to 'true'
    }
    return false // Default to animations disabled
  })

  // Persist state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('animationsEnabled', animationsEnabled.toString())
    }
  }, [animationsEnabled])

  // Toggle function
  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev)
  }

  // Explicit enable function
  const enableAnimations = () => {
    setAnimationsEnabled(true)
  }

  // Explicit disable function
  const disableAnimations = () => {
    setAnimationsEnabled(false)
  }

  return {
    animationsEnabled,
    toggleAnimations,
    enableAnimations,
    disableAnimations
  }
}

export default useAnimationToggle
