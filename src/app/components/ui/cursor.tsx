"use client";
import { useEffect, useRef, useCallback } from "react";

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

interface CircuitNode {
  x: number;
  y: number;
  alpha: number;
  size: number;
  vx: number;
  vy: number;
}

interface HoverParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  hue: number;
}

// Configuration constants
const CONFIG = {
  TRAIL_LENGTH: 25,
  NODE_SPAWN_CHANCE: 0.25,
  NODE_SPREAD: 50,
  NODE_FADE_SPEED: 0.015,
  CONNECTION_DISTANCE: 100,
  GLITCH_INTENSITY: 1.5,
  SCAN_LINE_CHANCE: 0.03,
  HOVER_BURST_SIZE: 8,
  HOVER_PARTICLE_COUNT: 12,
};

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const trailRef = useRef<TrailPoint[]>([]);
  const nodesRef = useRef<CircuitNode[]>([]);
  const hoverParticlesRef = useRef<HoverParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeRef = useRef(0);
  const lastTrailUpdateRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isMobileRef = useRef(false);

  const drawTrail = useCallback((ctx: CanvasRenderingContext2D) => {
    const trail = trailRef.current;
    const { x, y, active } = mouseRef.current;
    
    if (trail.length < 2 || !active) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Create smooth trail that follows cursor
    for (let i = 0; i < trail.length - 1; i++) {
      const current = trail[i];
      const next = trail[i + 1];
      const progress = (i + 1) / trail.length; // Reverse for cursor-following effect
      const alpha = progress * 0.9;
      
      // Interpolate toward current cursor position for smooth following
      const followFactor = Math.pow(progress, 2);
      const trailX = current.x + (x - current.x) * followFactor * 0.1;
      const trailY = current.y + (y - current.y) * followFactor * 0.1;
      const nextX = next.x + (x - next.x) * followFactor * 0.1;
      const nextY = next.y + (y - next.y) * followFactor * 0.1;
      
      // Main cyan line with glow
      ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.lineWidth = 3 * progress;
      
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();
      
      // Accent magenta line
      ctx.shadowColor = "rgba(255, 0, 255, 0.4)";
      ctx.shadowBlur = 6;
      ctx.strokeStyle = `rgba(255, 0, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 1.5 * progress;
      
      ctx.beginPath();
      ctx.moveTo(trailX, trailY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();
    }
  }, []);

  const drawCursor = useCallback((ctx: CanvasRenderingContext2D) => {
    const { x, y, active } = mouseRef.current;
    if (!active || isMobileRef.current) return;

    const time = timeRef.current;
    const isHovering = isHoveringRef.current;
    const hoverScale = isHovering ? 1.5 + Math.sin(time * 0.1) * 0.3 : 1;
    const glitchIntensity = isHovering ? CONFIG.GLITCH_INTENSITY * 2 : CONFIG.GLITCH_INTENSITY;
    
    const glitchX = Math.sin(time * 0.08) * glitchIntensity;
    const glitchY = Math.cos(time * 0.12) * glitchIntensity * 0.5;

    // Outer glow with pulsing effect
    const pulse = (0.8 + Math.sin(time * 0.05) * 0.2) * hoverScale;
    const glowRadius = isHovering ? 40 : 25;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * pulse);
    
    if (isHovering) {
      gradient.addColorStop(0, "rgba(255, 100, 255, 0.8)");
      gradient.addColorStop(0.3, "rgba(0, 255, 255, 0.6)");
      gradient.addColorStop(0.7, "rgba(255, 0, 255, 0.3)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    } else {
      gradient.addColorStop(0, "rgba(0, 255, 255, 0.7)");
      gradient.addColorStop(0.6, "rgba(0, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
    }
    
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Core dot with glitch offset
    const coreSize = isHovering ? 3.5 : 2.5;
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.arc(x + glitchX, y + glitchY, coreSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Enhanced glitch effects when hovering
    if (isHovering) {
      // Multiple glitch rings
      for (let i = 0; i < 3; i++) {
        const ringOffset = (i + 1) * 8;
        const ringAlpha = 0.4 - i * 0.1;
        const ringGlitchX = Math.sin(time * 0.08 + i) * glitchIntensity;
        const ringGlitchY = Math.cos(time * 0.12 + i) * glitchIntensity;
        
        ctx.strokeStyle = `rgba(255, 0, 255, ${ringAlpha})`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.beginPath();
        ctx.arc(x + ringGlitchX, y + ringGlitchY, ringOffset, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Glitch accent dots
    ctx.fillStyle = `rgba(255, 0, 255, ${isHovering ? 0.8 : 0.6})`;
    ctx.beginPath();
    ctx.arc(x - glitchX * 0.7, y - glitchY * 0.7, isHovering ? 2 : 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = `rgba(0, 255, 255, ${isHovering ? 0.6 : 0.4})`;
    ctx.beginPath();
    ctx.arc(x + glitchY, y - glitchX, isHovering ? 1.5 : 1, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const updateNodes = useCallback(() => {
    const nodes = nodesRef.current;
    
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      
      // Subtle drift
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.98;
      node.vy *= 0.98;
      
      // Fade out
      node.alpha -= CONFIG.NODE_FADE_SPEED;
      
      if (node.alpha <= 0) {
        nodes.splice(i, 1);
      }
    }
  }, []);

  const updateHoverParticles = useCallback(() => {
    const particles = hoverParticlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      particle.alpha -= 0.02;
      
      if (particle.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }, []);

  const drawHoverParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = hoverParticlesRef.current;
    
    particles.forEach(particle => {
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      
      const hue = particle.hue;
      gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${particle.alpha})`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = `hsla(${hue}, 100%, 90%, ${particle.alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const createHoverBurst = useCallback((x: number, y: number) => {
    const particles = hoverParticlesRef.current;
    
    for (let i = 0; i < CONFIG.HOVER_PARTICLE_COUNT; i++) {
      const angle = (i / CONFIG.HOVER_PARTICLE_COUNT) * Math.PI * 2;
      const velocity = 2 + Math.random() * 4;
      const hue = Math.random() < 0.5 ? 180 : 300; // Cyan or Magenta
      
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 0.8,
        size: Math.random() * 2 + 1,
        hue: hue + (Math.random() - 0.5) * 60,
      });
    }
  }, []);

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D) => {
    const nodes = nodesRef.current;
    
    // Draw connections first
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONFIG.CONNECTION_DISTANCE) * 
                          Math.min(n1.alpha, n2.alpha) * 0.4;
          
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw nodes
    nodes.forEach(node => {
      // Node glow
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.size * 4
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${node.alpha * 0.8})`);
      gradient.addColorStop(0.7, `rgba(0, 255, 255, ${node.alpha * 0.3})`);
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = `rgba(255, 255, 255, ${node.alpha})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const drawScanLines = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (Math.random() < CONFIG.SCAN_LINE_CHANCE) {
      const scanY = Math.random() * height;
      const intensity = Math.random() * 0.15 + 0.05;
      
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(0, 255, 255, ${intensity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    
    timeRef.current++;
    
    // Clear canvas with slight trail effect for smoother motion
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw components
    updateNodes();
    updateHoverParticles();
    
    if (!isMobileRef.current) {
      drawTrail(ctx);
      drawNodes(ctx);
      drawCursor(ctx);
      drawHoverParticles(ctx);
    }
    
    drawScanLines(ctx, width, height);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawTrail, drawCursor, updateNodes, drawNodes, drawScanLines, updateHoverParticles, drawHoverParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobileRef.current) return;
    
    const mouse = mouseRef.current;
    const now = Date.now();
    
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    
    const trail = trailRef.current;
    const nodes = nodesRef.current;
    
    // Add to trail with throttling for smoother following effect
    if (now - lastTrailUpdateRef.current > 16) { // ~60fps
      trail.push({ x: mouse.x, y: mouse.y, time: now });
      if (trail.length > CONFIG.TRAIL_LENGTH) {
        trail.shift();
      }
      lastTrailUpdateRef.current = now;
    }
    
    // Spawn circuit nodes
    if (Math.random() < CONFIG.NODE_SPAWN_CHANCE && nodes.length < 15) {
      nodes.push({
        x: mouse.x + (Math.random() - 0.5) * CONFIG.NODE_SPREAD,
        y: mouse.y + (Math.random() - 0.5) * CONFIG.NODE_SPREAD,
        alpha: 0.9,
        size: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || 
        target.closest('button') || target.closest('a') || 
        target.classList.contains('hover-trigger'))) {
      isHoveringRef.current = true;
      createHoverBurst(e.clientX, e.clientY);
    }
  }, [createHoverBurst]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    isHoveringRef.current = false;
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (isMobileRef.current) return;
    const target = e.target as Element;
    if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || 
        target.closest('button') || target.closest('a'))) {
      createHoverBurst(e.clientX, e.clientY);
      // Create extra burst for click
      setTimeout(() => createHoverBurst(e.clientX, e.clientY), 100);
    }
  }, [createHoverBurst]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if mobile/touch device
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 768 || 
                           'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0;
    };
    
    checkMobile();

    // Initialize canvas
    handleResize();
    
    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", checkMobile);
    
    // Hover detection for interactive elements
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", (e) => {
      const target = e.target as Element;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || 
          target.closest('button') || target.closest('a') || 
          target.classList.contains('hover-trigger'))) {
        isHoveringRef.current = false;
      }
    });
    
    // Click effects
    document.addEventListener("click", handleClick);
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", (e) => {
        const target = e.target as Element;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || 
            target.closest('button') || target.closest('a') || 
            target.classList.contains('hover-trigger'))) {
          isHoveringRef.current = false;
        }
      });
      document.removeEventListener("click", handleClick);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, handleResize, animate, handleMouseEnter, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{
        mixBlendMode: "screen",
        background: "transparent",
      }}
    />
  );
}