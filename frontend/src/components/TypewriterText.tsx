import React, { useEffect, useState } from 'react'
import Typewriter from 'typewriter-effect'

/**
 * Props interface for the TypewriterText component
 * @property {string} text - The text to be displayed with typewriter effect
 * @property {boolean} isVisible - Controls whether the typewriter effect should be active
 * @property {string} [className] - Optional CSS classes to apply to the text container
 * @property {number} [speed] - Typing speed in milliseconds per character (default: 50ms)
 */
interface TypewriterTextProps {
  text: string
  isVisible: boolean
  className?: string
  speed?: number
}

/**
 * TypewriterText Component
 * 
 * A React component that displays text with a typewriter effect.
 * Features:
 * - Scroll-triggered animation (only types when section is visible)
 * - Permanent text display after animation completes
 * - No blinking cursor
 * - Configurable typing speed
 * 
 * @param {TypewriterTextProps} props - Component props
 * @returns {JSX.Element} The typewriter text component
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  isVisible, 
  className = '',
  speed = 50
}) => {
  // State to track whether the typewriter animation has completed
  const [hasTyped, setHasTyped] = useState(false)

  /**
   * Effect to handle typewriter animation timing
   * Calculates when the animation should complete based on text length and speed
   */
  useEffect(() => {
    if (isVisible && !hasTyped) {
      // Calculate total animation time: (text length × speed) + buffer time
      const animationDuration = text.length * speed + 1000
      
      // Set a timer to mark the animation as complete
      const timer = setTimeout(() => {
        setHasTyped(true)
      }, animationDuration)
      
      // Cleanup timer if component unmounts or dependencies change
      return () => clearTimeout(timer)
    }
  }, [isVisible, hasTyped, text.length, speed])

  // Render nothing when section is not visible
  if (!isVisible) {
    return <span className={className}></span>
  }

  // Render permanent text after animation completes
  if (hasTyped) {
    return (
      <span className={className}>
        {text}
      </span>
    )
  }

  // Render typewriter animation
  return (
    <span className={className}>
      <Typewriter
        options={{
          strings: [text],           // Text to type out
          autoStart: true,           // Start immediately when component mounts
          loop: false,               // Don't repeat the animation
          delay: speed,              // Delay between each character
          cursor: ''                 // Remove the blinking cursor
        }}
      />
    </span>
  )
}

export default TypewriterText 