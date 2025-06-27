import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  isDarkMode: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  gridOffset: number; // Random offset for grid alignment
}

const MatrixRain: React.FC<MatrixRainProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isDarkMode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Grid settings
    const gridSize = 18; // Size of each grid cell
    const gridSpacing = 20; // Spacing between grid columns
    
    // Rain drops array
    let rainDrops: RainDrop[] = [];
    
    // Initialize rain drops
    const initRainDrops = () => {
      rainDrops = [];
      const columns = Math.floor(canvas.width / gridSpacing);
      
      for (let i = 0; i < columns; i++) {
        rainDrops.push({
          x: i * gridSpacing + gridSpacing / 2,
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 0.8, // Slower speed
          length: 12 + Math.floor(Math.random() * 8), // Shorter length
          chars: [],
          opacity: 0.3 + Math.random() * 0.7,
          gridOffset: Math.floor(Math.random() * 2) // Random start: 0 or 1
        });
        
        // Generate alternating pattern for this drop
        const drop = rainDrops[rainDrops.length - 1];
        for (let j = 0; j < drop.length; j++) {
          // Alternate starting from gridOffset
          drop.chars.push((drop.gridOffset + j) % 2 === 0 ? '1' : '0');
        }
      }
    };

    initRainDrops();

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas completely - no trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw rain drops
      rainDrops.forEach((drop) => {
        // Update position
        drop.y += drop.speed;
        
        // Reset if off screen
        if (drop.y > canvas.height + drop.length * gridSize) {
          drop.y = -drop.length * gridSize;
          drop.x = Math.random() * canvas.width;
          drop.gridOffset = Math.floor(Math.random() * 2); // New random pattern
          drop.opacity = 0.3 + Math.random() * 0.7;
          
          // Generate new alternating pattern
          drop.chars = [];
          for (let j = 0; j < drop.length; j++) {
            drop.chars.push((drop.gridOffset + j) % 2 === 0 ? '1' : '0');
          }
        }

        // Draw the rain drop
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < drop.length; i++) {
          const charY = drop.y - i * gridSize;
          if (charY >= -gridSize && charY < canvas.height + gridSize) {
            // Gradient effect - brighter at the top
            const brightness = 1 - (i / drop.length);
            const greenValue = Math.floor(255 * brightness);
            
            // Draw only the character - no background, no trail
            ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${drop.opacity * brightness * 1.2})`;
            ctx.fillText(drop.chars[i], drop.x, charY);
          }
        }
      });

      // Add some random sparkles
      if (Math.random() < 0.015) {
        const sparkleX = Math.random() * canvas.width;
        const sparkleY = Math.random() * canvas.height;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        ctx.fillRect(sparkleX, sparkleY, 2, 2);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode]);

  if (!isDarkMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.25 }}
    />
  );
};

export default MatrixRain; 