/**
 * RippleEffect Component
 * 
 * Creates a subtle, animated ripple effect for light mode backgrounds.
 * Features:
 * - Time-based spawning (every 7 seconds)
 * - Three-phase animation: expand → contract → fade
 * - Ring-like appearance with transparent center
 * - Click-to-spawn functionality
 * - Responsive canvas sizing
 * - Performance optimized with frame rate limiting
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface RippleEffectProps {
  /** Whether the app is in dark mode - ripples are hidden in dark mode */
  isDarkMode: boolean;
}

interface Ripple {
  /** X coordinate of ripple center */
  x: number;
  /** Y coordinate of ripple center */
  y: number;
  /** Current radius of the ripple */
  radius: number;
  /** Maximum radius the ripple will expand to */
  maxRadius: number;
  /** Base opacity of the ripple (0-1) */
  opacity: number;
  /** Speed of radius change per frame */
  speed: number;
  /** Timestamp when ripple was created */
  startedAt: number;
  /** Current animation phase */
  phase: 'expand' | 'contract' | 'fade';
  /** Radius when contraction phase started */
  contractStartRadius: number;
  /** Radius when fade phase started */
  fadeStartRadius: number;
}

// Animation configuration constants
const SPAWN_INTERVAL_MS = 7000; // Time between ripple spawns
const INITIAL_DELAY_MS = 2000; // Delay before first spawn
const FRAME_RATE_LIMIT_MS = 16; // ~60 FPS
const MIN_RIPPLE_RADIUS = 5; // Minimum radius to keep ripple
const MIN_FADE_RADIUS = 2; // Minimum radius for fade phase
const INITIAL_RIPPLE_RADIUS = 20;
const MAX_RADIUS_MULTIPLIER = 0.25; // Max radius as fraction of screen size
const CONTRACTION_SPEED_MULTIPLIER = 0.8; // Slower contraction
const FADE_SPEED_MULTIPLIER = 0.5; // Even slower fade
const RIPPLE_COUNT_MIN = 4; // Minimum ripples per spawn
const RIPPLE_COUNT_MAX = 6; // Maximum ripples per spawn
const CONTRACTION_THRESHOLD = 0.3; // When to start fade phase
const AVOID_CENTER_MARGIN = 0.3; // Avoid spawning in center area

const RippleEffect: React.FC<RippleEffectProps> = ({ isDarkMode }) => {
  // Canvas and rendering refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Animation state refs
  const ripplesRef = useRef<Ripple[]>([]);
  const lastFrameTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  
  // Performance optimization: memoized functions
  const getMaxRadius = useCallback(() => {
    if (!canvasRef.current) return 100;
    return Math.max(canvasRef.current.width, canvasRef.current.height) * MAX_RADIUS_MULTIPLIER;
  }, []);

  /**
   * Creates a new ripple at the specified position
   * @param x - X coordinate for ripple center
   * @param y - Y coordinate for ripple center
   * @returns New ripple object
   */
  const createRipple = useCallback((x: number, y: number): Ripple => {
    const maxRadius = getMaxRadius();
    return {
      x,
      y,
      radius: INITIAL_RIPPLE_RADIUS,
      maxRadius,
      opacity: 0.6 + Math.random() * 0.4, // Random opacity between 0.6-1.0
      speed: 1 + Math.random() * 0.5, // Random speed between 1.0-1.5
      startedAt: performance.now(),
      phase: 'expand',
      contractStartRadius: 0,
      fadeStartRadius: 0,
    };
  }, [getMaxRadius]);

  /**
   * Creates a ripple at a random position, avoiding the center area
   * @returns New ripple object at random position
   */
  const createRandomRipple = useCallback((): Ripple => {
    if (!canvasRef.current) return createRipple(0, 0);
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Define center area to avoid
    const centerXMin = width * AVOID_CENTER_MARGIN;
    const centerXMax = width * (1 - AVOID_CENTER_MARGIN);
    const centerYMin = height * AVOID_CENTER_MARGIN;
    const centerYMax = height * (1 - AVOID_CENTER_MARGIN);
    
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Try to find a position outside the center area
    do {
      x = Math.random() * width;
      y = Math.random() * height;
      attempts++;
    } while (
      x > centerXMin && x < centerXMax &&
      y > centerYMin && y < centerYMax &&
      attempts < maxAttempts
    );
    
    return createRipple(x, y);
  }, [createRipple]);

  /**
   * Handles canvas click events to spawn ripples at click position
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripplesRef.current.push(createRipple(x, y));
  }, [createRipple]);

  /**
   * Resizes the canvas to match window dimensions
   */
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    // Update context reference
    ctxRef.current = canvas.getContext('2d');
  }, []);

  /**
   * Updates ripple phase transitions based on current radius
   * @param ripple - The ripple to update
   */
  const updateRipplePhase = useCallback((ripple: Ripple) => {
    if (ripple.phase === 'expand' && ripple.radius >= ripple.maxRadius) {
      ripple.phase = 'contract';
      ripple.contractStartRadius = ripple.radius;
    } else if (ripple.phase === 'contract' && ripple.radius <= ripple.contractStartRadius * CONTRACTION_THRESHOLD) {
      ripple.phase = 'fade';
      ripple.fadeStartRadius = ripple.radius;
    }
  }, []);

  /**
   * Updates ripple radius based on current phase
   * @param ripple - The ripple to update
   */
  const updateRippleRadius = useCallback((ripple: Ripple) => {
    switch (ripple.phase) {
      case 'expand':
        ripple.radius += ripple.speed;
        break;
      case 'contract':
        ripple.radius -= ripple.speed * CONTRACTION_SPEED_MULTIPLIER;
        break;
      case 'fade':
        ripple.radius -= ripple.speed * FADE_SPEED_MULTIPLIER;
        break;
    }
  }, []);

  /**
   * Calculates ripple opacity based on current phase and progress
   * @param ripple - The ripple to calculate opacity for
   * @returns Current alpha value (0-1)
   */
  const calculateRippleOpacity = useCallback((ripple: Ripple): number => {
    switch (ripple.phase) {
      case 'expand': {
        const progress = ripple.radius / ripple.maxRadius;
        return ripple.opacity * (1 - progress * 0.3); // Gradual fade during expansion
      }
        
      case 'contract': {
        const contractProgress = (ripple.contractStartRadius - ripple.radius) / (ripple.contractStartRadius * 0.7);
        return ripple.opacity * (0.7 + contractProgress * 0.3); // Slight opacity increase
      }
        
      case 'fade': {
        const fadeProgress = (ripple.fadeStartRadius - ripple.radius) / (ripple.fadeStartRadius * 0.5);
        return ripple.opacity * (1 - fadeProgress); // Complete fade out
      }
        
      default:
        return ripple.opacity;
    }
  }, []);

  /**
   * Draws a single ripple with ring-like gradient effect
   * @param ripple - The ripple to draw
   * @param alpha - Current alpha value
   */
  const drawRipple = useCallback((ripple: Ripple, alpha: number) => {
    if (!ctxRef.current) return;
    
    const ctx = ctxRef.current;
    const gradient = ctx.createRadialGradient(
      ripple.x, ripple.y, 0,
      ripple.x, ripple.y, ripple.radius
    );
    
    // Create ultra-smooth ring effect with transparent center
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); // Completely transparent center
    gradient.addColorStop(0.5, `rgba(255, 255, 255, 0)`); // Still transparent
    gradient.addColorStop(0.75, `rgba(255, 255, 255, ${alpha * 0.04})`); // Barely visible start
    gradient.addColorStop(0.85, `rgba(250, 250, 250, ${alpha * 0.12})`); // Very subtle
    gradient.addColorStop(0.92, `rgba(245, 245, 245, ${alpha * 0.28})`); // Subtle
    gradient.addColorStop(0.96, `rgba(240, 240, 240, ${alpha * 0.44})`); // More visible
    gradient.addColorStop(0.98, `rgba(235, 235, 235, ${alpha * 0.60})`); // Quite visible
    gradient.addColorStop(1, `rgba(230, 230, 230, ${alpha * 0.68})`); // Most visible at edge
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  /**
   * Spawns a new batch of ripples at random positions
   * @param currentTime - Current animation time
   */
  const spawnRipples = useCallback((currentTime: number) => {
    if (currentTime - lastSpawnTimeRef.current > SPAWN_INTERVAL_MS) {
      const numRipples = RIPPLE_COUNT_MIN + Math.floor(Math.random() * (RIPPLE_COUNT_MAX - RIPPLE_COUNT_MIN + 1));
      
      for (let i = 0; i < numRipples; i++) {
        ripplesRef.current.push(createRandomRipple());
      }
      
      lastSpawnTimeRef.current = currentTime;
    }
  }, [createRandomRipple]);

  /**
   * Main animation loop
   * @param currentTime - Current animation time
   */
  const animate = useCallback((currentTime: number) => {
    // Frame rate limiting for performance
    if (currentTime - lastFrameTimeRef.current < FRAME_RATE_LIMIT_MS) {
      requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTimeRef.current = currentTime;
    
    // Clear canvas
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    }

    // Update and draw all ripples
    ripplesRef.current.forEach((ripple) => {
      updateRipplePhase(ripple);
      updateRippleRadius(ripple);
      
      const alpha = calculateRippleOpacity(ripple);
      
      // Only draw if ripple is still visible and large enough
      if (alpha > 0.01 && ripple.radius > MIN_RIPPLE_RADIUS) {
        drawRipple(ripple, alpha);
      }
    });

    // Remove finished ripples
    ripplesRef.current = ripplesRef.current.filter(
      (r) => (r.radius > MIN_RIPPLE_RADIUS && r.phase !== 'fade') || 
              (r.phase === 'fade' && r.radius > MIN_FADE_RADIUS)
    );

    // Spawn new ripples if needed
    spawnRipples(currentTime);

    requestAnimationFrame(animate);
  }, [updateRipplePhase, updateRippleRadius, calculateRippleOpacity, drawRipple, spawnRipples]);

  // Main effect for setting up the ripple animation
  useEffect(() => {
    if (isDarkMode || !canvasRef.current) return;
    
    // Initialize canvas and context
    resizeCanvas();
    ctxRef.current = canvasRef.current.getContext('2d');
    
    if (!ctxRef.current) return;

    // Initialize spawn timer with initial delay
    lastSpawnTimeRef.current = performance.now() - SPAWN_INTERVAL_MS + INITIAL_DELAY_MS;
    
    // Set up resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation loop
    const animationId = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode, resizeCanvas, animate]);

  // Don't render in dark mode
  if (isDarkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="fixed inset-0 pointer-events-auto z-1"
      style={{
        background: 'transparent',
        opacity: 1.0,
        mixBlendMode: 'normal',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default RippleEffect; 