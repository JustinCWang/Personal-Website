import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations
 * Uses Intersection Observer API to detect when elements enter the viewport
 * and applies animation classes based on scroll position
 */
export const useScrollAnimation = (options: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
} = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasAnimated(true)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return {
    elementRef,
    isVisible,
    hasAnimated
  }
}

/**
 * Animation variants for different types of elements
 */
export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },
  stagger: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: 'easeOut'
      }
    })
  }
}

/**
 * Utility function to get animation classes based on visibility state
 */
export const getAnimationClasses = (
  isVisible: boolean,
  variant: keyof typeof animationVariants = 'fadeIn',
  delay: number = 0
) => {
  const baseClasses = 'transition-all duration-700 ease-out'
  
  if (!isVisible) {
    switch (variant) {
      case 'slideUp':
        return `${baseClasses} opacity-0 translate-y-8`
      case 'slideDown':
        return `${baseClasses} opacity-0 -translate-y-8`
      case 'slideLeft':
        return `${baseClasses} opacity-0 translate-x-8`
      case 'slideRight':
        return `${baseClasses} opacity-0 -translate-x-8`
      case 'scaleIn':
        return `${baseClasses} opacity-0 scale-95`
      default:
        return `${baseClasses} opacity-0`
    }
  }
  
  return `${baseClasses} opacity-100 ${delay ? `delay-${delay}` : ''}`
} 