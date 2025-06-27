/**
 * Matrix Rain Component
 * Creates an interactive Matrix-style digital rain animation with ripple effects
 * Features falling 1's and 0's with clickable ripple interactions
 * Optimized for performance with frame rate limiting and memory management
 */

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Props interface for the MatrixRain component
 */
interface MatrixRainProps {
  isDarkMode: boolean;
}

/**
 * Rain drop interface representing a single column of falling characters
 * Each drop contains multiple 1's and 0's that fall as a connected stream
 */
interface RainDrop {
  x: number;           // X position of the drop
  y: number;           // Y position of the drop head
  speed: number;       // Falling speed in pixels per frame
  length: number;      // Number of characters in this drop
  chars: string[];     // Array of 1's and 0's for this drop
  opacity: number;     // Opacity of the drop (0-1)
  gridOffset: number;  // Random offset for alternating pattern (0 or 1)
}

/**
 * Ripple interface representing an expanding circular wave effect
 * Created when user clicks on the canvas
 */
interface Ripple {
  x: number;           // X position of ripple center
  y: number;           // Y position of ripple center
  radius: number;      // Current radius of the ripple
  maxRadius: number;   // Maximum radius the ripple will reach
  life: number;        // Current age of the ripple (frames)
  maxLife: number;     // Maximum lifetime of the ripple (frames)
}

/**
 * MatrixRain Component
 * @desc Renders an interactive Matrix-style digital rain animation
 * @param {MatrixRainProps} props - Component props
 * @param {boolean} props.isDarkMode - Whether dark mode is active
 * @returns {JSX.Element | null} Canvas element with Matrix rain animation
 */
const MatrixRain: React.FC<MatrixRainProps> = ({ isDarkMode }) => {
  // Canvas reference for drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ripples array stored in ref to avoid React re-renders
  const ripplesRef = useRef<Ripple[]>([]);
  
  // Performance optimization refs
  const lastTimeRef = useRef(0);      // Last frame timestamp for FPS limiting
  const frameCountRef = useRef(0);    // Frame counter for sparkle timing

  /**
   * Handle canvas click to create ripple effects
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse click event
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Convert screen coordinates to canvas coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Limit number of ripples for performance (max 5 active ripples)
    if (ripplesRef.current.length < 5) {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 100,
        life: 0,
        maxLife: 40
      });
    }
  }, []);

  /**
   * Main animation setup and loop
   * Initializes canvas, creates rain drops, and runs the animation loop
   */
  useEffect(() => {
    if (!isDarkMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * Resize canvas to match window dimensions
     * Called on window resize and initial setup
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation configuration
    const gridSize = 18;      // Size of each grid cell in pixels
    const gridSpacing = 20;   // Spacing between rain drop columns
    
    // Rain drops array - stores all active rain drop streams
    let rainDrops: RainDrop[] = [];
    
    /**
     * Initialize rain drops with alternating 1's and 0's
     * Creates columns of falling characters across the screen width
     */
    const initRainDrops = () => {
      rainDrops = [];
      const columns = Math.floor(canvas.width / gridSpacing);
      
      for (let i = 0; i < columns; i++) {
        rainDrops.push({
          x: i * gridSpacing + gridSpacing / 2,
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 0.8, // Random speed between 0.5-1.3
          length: 12 + Math.floor(Math.random() * 8), // Random length 12-20
          chars: [],
          opacity: 0.3 + Math.random() * 0.7,
          gridOffset: Math.floor(Math.random() * 2) // Random start pattern (0 or 1)
        });
        
        // Generate alternating pattern for this drop (1-0-1-0... or 0-1-0-1...)
        const drop = rainDrops[rainDrops.length - 1];
        for (let j = 0; j < drop.length; j++) {
          drop.chars.push((drop.gridOffset + j) % 2 === 0 ? '1' : '0');
        }
      }
    };

    initRainDrops();

    /**
     * Pre-calculate sparkle positions for performance optimization
     * Reduces random calculations during animation loop
     */
    const sparklePositions: { x: number; y: number }[] = [];
    for (let i = 0; i < 20; i++) {
      sparklePositions.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      });
    }

    // Animation loop variables
    let animationId: number;
    
    /**
     * Main animation loop
     * Handles frame rate limiting, updates positions, and renders all elements
     * @param {number} currentTime - Current timestamp from requestAnimationFrame
     */
    const animate = (currentTime: number) => {
      // Frame rate limiting for performance (target ~60 FPS)
      if (currentTime - lastTimeRef.current < 16) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;
      frameCountRef.current++;

      // Clear canvas completely for fresh frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /**
       * Update ripples - expand radius and increment life
       * Remove ripples that have exceeded their lifetime
       */
      ripplesRef.current = ripplesRef.current.map(ripple => ({
        ...ripple,
        radius: ripple.radius + (ripple.maxRadius / ripple.maxLife),
        life: ripple.life + 1
      })).filter(ripple => ripple.life < ripple.maxLife);

      /**
       * Update and draw rain drops
       * Each drop represents a column of falling 1's and 0's
       */
      rainDrops.forEach((drop) => {
        // Update drop position (falling motion)
        drop.y += drop.speed;
        
        /**
         * Reset drop when it goes off screen
         * Creates infinite falling effect
         */
        if (drop.y > canvas.height + drop.length * gridSize) {
          drop.y = -drop.length * gridSize;
          drop.x = Math.random() * canvas.width;
          drop.gridOffset = Math.floor(Math.random() * 2); // New random pattern
          drop.opacity = 0.3 + Math.random() * 0.7;
          
          // Regenerate alternating pattern for the reset drop
          drop.chars = [];
          for (let j = 0; j < drop.length; j++) {
            drop.chars.push((drop.gridOffset + j) % 2 === 0 ? '1' : '0');
          }
        }

        // Set font properties for character rendering
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        /**
         * Draw each character in the rain drop
         * Creates the visual effect of connected falling characters
         */
        for (let i = 0; i < drop.length; i++) {
          const charY = drop.y - i * gridSize;
          
          // Only draw characters that are visible on screen
          if (charY >= -gridSize && charY < canvas.height + gridSize) {
            // Gradient effect - characters get brighter toward the top of the drop
            const brightness = 1 - (i / drop.length);
            const greenValue = Math.floor(255 * brightness);
            
            // Draw the character with calculated color and opacity
            ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${drop.opacity * brightness * 1.2})`;
            ctx.fillText(drop.chars[i], drop.x, charY);
          }
        }
      });

      /**
       * Draw ripples as expanding green circles
       * Ripples fade out as they expand and age
       */
      ripplesRef.current.forEach(ripple => {
        const alpha = 1 - (ripple.life / ripple.maxLife);
        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
        ctx.stroke();
      });

      /**
       * Add sparkle effects for visual enhancement
       * Optimized to show only every 30 frames using pre-calculated positions
       */
      if (frameCountRef.current % 30 === 0) {
        const sparkleIndex = Math.floor(Math.random() * sparklePositions.length);
        const sparkle = sparklePositions[sparkleIndex];
        ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        ctx.fillRect(sparkle.x, sparkle.y, 2, 2);
      }

      // Continue animation loop
      animationId = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animate(0);

    /**
     * Cleanup function
     * Removes event listeners and cancels animation frame
     */
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]); // Only re-run when dark mode changes

  // Don't render if not in dark mode
  if (!isDarkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-10 cursor-crosshair"
      style={{ opacity: 0.35 }}
      onClick={handleClick}
    />
  );
};

export default MatrixRain; 