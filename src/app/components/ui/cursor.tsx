"use client";
import { useEffect, useRef, useCallback } from "react";

// Enhanced config for better performance and visual effects
const CONFIG = {
  TRAIL_LENGTH: 15,
  NODE_SPAWN_CHANCE: 0.1,
  NODE_SPREAD: 30,
  NODE_FADE_SPEED: 0.03,
  CONNECTION_DISTANCE: 60,
  GLITCH_INTENSITY: 1,
  SCAN_LINE_CHANCE: 0.01,
  HOVER_PARTICLE_COUNT: 6,
  GLOW_RADIUS: 20,
  CORE_RADIUS: 2,
  TRAIL_OPACITY: 0.8,
  CORE_OPACITY: 0.9,
} as const;

interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const isMobileRef = useRef(false);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, active: false });
  const trailRef = useRef<TrailPoint[]>([]);

  // 🚀 Use useCallback for mouse move handler to prevent recreation
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Add point to trail using CONFIG
      const now = Date.now();
      trailRef.current.push({
        x: mouse.x,
        y: mouse.y,
        opacity: CONFIG.TRAIL_OPACITY,
        timestamp: now,
      });

      // Limit trail length using CONFIG
      if (trailRef.current.length > CONFIG.TRAIL_LENGTH) {
        trailRef.current.shift();
      }
    },
    [] // Empty deps since we use refs
  );

  // 🚀 Use useCallback for resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  // 🚀 Use useCallback for animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;
    const trail = trailRef.current;
    const now = Date.now();

    if (mouse.active) {
      // Update trail opacity based on age using CONFIG
      trail.forEach((point) => {
        const age = now - point.timestamp;
        const maxAge = CONFIG.TRAIL_LENGTH * 16; // ~60fps
        point.opacity = Math.max(0, CONFIG.TRAIL_OPACITY * (1 - age / maxAge));
      });

      // Remove old trail points
      trailRef.current = trail.filter((point) => point.opacity > 0.01);

      // Draw trail using CONFIG values
      trail.forEach((point, index) => {
        if (point.opacity <= 0) return;

        const radius =
          CONFIG.CORE_RADIUS +
          (index / trail.length) * CONFIG.GLOW_RADIUS * 0.3;
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius
        );

        gradient.addColorStop(0, `rgba(0, 255, 255, ${point.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Main glow cursor using CONFIG
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        CONFIG.GLOW_RADIUS
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${CONFIG.TRAIL_OPACITY})`);
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, CONFIG.GLOW_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Core dot using CONFIG
      ctx.fillStyle = `rgba(255, 255, 255, ${CONFIG.CORE_OPACITY})`;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, CONFIG.CORE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Add glitch effect occasionally using CONFIG
      if (Math.random() < CONFIG.SCAN_LINE_CHANCE) {
        const glitchY =
          mouse.y + (Math.random() - 0.5) * CONFIG.GLITCH_INTENSITY * 20;
        ctx.strokeStyle = `rgba(255, 0, 255, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mouse.x - CONFIG.GLOW_RADIUS, glitchY);
        ctx.lineTo(mouse.x + CONFIG.GLOW_RADIUS, glitchY);
        ctx.stroke();
      }

      // Add hover particles using CONFIG
      if (Math.random() < CONFIG.NODE_SPAWN_CHANCE) {
        for (let i = 0; i < CONFIG.HOVER_PARTICLE_COUNT; i++) {
          const angle = (Math.PI * 2 * i) / CONFIG.HOVER_PARTICLE_COUNT;
          const distance = CONFIG.NODE_SPREAD;
          const particleX = mouse.x + Math.cos(angle) * distance;
          const particleY = mouse.y + Math.sin(angle) * distance;

          ctx.fillStyle = `rgba(0, 255, 255, 0.1)`;
          ctx.beginPath();
          ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []); // Empty deps since we use refs

  // 🚀 Use useCallback for mobile check
  const checkMobile = useCallback(() => {
    isMobileRef.current = window.innerWidth <= 768 || "ontouchstart" in window;
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Skip cursor on mobile entirely
    if (isMobileRef.current) {
      return () => window.removeEventListener("resize", checkMobile);
    }

    // Setup canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize
    handleResize();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", checkMobile);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleResize, animate, checkMobile]); // Now properly using memoized functions

  // Hide cursor on mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    trailRef.current = [];
  }, []);

  useEffect(() => {
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => window.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  // Don't render on mobile
  if (
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 || "ontouchstart" in window)
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
