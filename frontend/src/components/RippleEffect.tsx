/**
 * Ripple Effect Component
 * Subtle, overlapping ripples for light mode backgrounds
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface RippleEffectProps {
  isDarkMode: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  startedAt: number;
}

const RIPPLE_OVERLAP_MS = 500; // Start new ripple 0.5s before previous ends

const RippleEffect: React.FC<RippleEffectProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastTimeRef = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create new ripple at click position
    const newRipple = {
      x,
      y,
      radius: 20,
      maxRadius: Math.max(rect.width, rect.height) * 0.25,
      opacity: 0.6 + Math.random() * 0.4,
      speed: 1 + Math.random() * 0.5,
      startedAt: performance.now(),
    };
    
    ripplesRef.current.push(newRipple);
    console.log('Created ripple at click:', x, y);
  }, []);

  useEffect(() => {
    if (isDarkMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('RippleEffect starting, canvas size:', canvas.width, 'x', canvas.height);

    const getMaxRadius = () => Math.max(canvas.width, canvas.height) * 0.25;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createRandomRipple = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerXMin = width * 0.3;
      const centerXMax = width * 0.7;
      const centerYMin = height * 0.3;
      const centerYMax = height * 0.7;
      let x = 0, y = 0, tries = 0;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
        tries++;
      } while (
        x > centerXMin && x < centerXMax &&
        y > centerYMin && y < centerYMax &&
        tries < 10
      );
      return {
        x,
        y,
        radius: 20,
        maxRadius: getMaxRadius(),
        opacity: 0.6 + Math.random() * 0.4,
        speed: 1 + Math.random() * 0.5,
        startedAt: performance.now(),
      };
    };

    // Start with one ripple
    ripplesRef.current = [createRandomRipple()];
    console.log('Initial ripple created');

    let animationId: number;

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current < 16) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update ripples
      ripplesRef.current.forEach((ripple) => {
        ripple.radius += ripple.speed;
        const progress = ripple.radius / ripple.maxRadius;
        const alpha = ripple.opacity * (1 - progress * 0.5);
        const gradient = ctx.createRadialGradient(
          ripple.x, ripple.y, 0,
          ripple.x, ripple.y, ripple.radius
        );
        // All neutral grays/whites
        gradient.addColorStop(0, `rgba(220, 220, 220, ${alpha * 0.3})`); // light gray center
        gradient.addColorStop(0.5, `rgba(240, 240, 240, ${alpha * 0.7})`); // lighter gray
        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.5})`); // white edge
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
        ctx.fill(); // No border
      });

      // Remove finished ripples
      ripplesRef.current = ripplesRef.current.filter(
        (r) => r.radius < r.maxRadius
      );

      // Overlap logic: if only one ripple and it's about to finish, start new ones
      if (
        ripplesRef.current.length <= 1 &&
        ripplesRef.current[0].radius > ripplesRef.current[0].maxRadius - ripplesRef.current[0].speed * (RIPPLE_OVERLAP_MS / 16)
      ) {
        // Spawn 4-8 ripples at once
        const numRipples = 4 + Math.floor(Math.random() * 5); // 4-8 ripples
        for (let i = 0; i < numRipples; i++) {
          ripplesRef.current.push(createRandomRipple());
        }
      }

      // No limit on ripples - let them accumulate
      animationId = requestAnimationFrame(animate);
    };

    animate(performance.now());

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]);

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