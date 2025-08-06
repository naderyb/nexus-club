"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  element: HTMLDivElement;
}

interface Props {
  className?: string;
  children?: ReactNode;
  backgroundColor?: string;
  particleColor?: string;
  particleSize?: number;
  spawnInterval?: number;
  enableGooEffect?: boolean;
  blurStrength?: number;
  height?: string;
  width?: string;
}

let bubbleId = 0;

const AnimatedBubbleParticles: React.FC<Props> = ({
  className,
  children,
  backgroundColor = "black",
  particleColor = "#14b8a6",
  particleSize = 20,
  spawnInterval = 600,
  enableGooEffect = false,
  blurStrength = 0,
  height = "100%",
  width = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const createBubble = useCallback(
    (nearMouse = false) => {
      if (!containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const size = isMobile
        ? Math.random() * (particleSize * 0.4) + particleSize * 0.8
        : Math.random() * (particleSize * 0.5) + particleSize;

      const x = nearMouse
        ? mouse.current.x - container.left + (Math.random() * 40 - 20)
        : Math.random() * container.width;
      const y = nearMouse
        ? mouse.current.y - container.top + (Math.random() * 40 - 20)
        : Math.random() * container.height;

      const bubble: Bubble = {
        id: ++bubbleId,
        x,
        y,
        size,
        opacity: 0.4 + Math.random() * 0.3,
        element: document.createElement("div"),
      };

      bubble.element.className = "absolute rounded-full pointer-events-none";
      bubble.element.style.width = bubble.size + "px";
      bubble.element.style.height = bubble.size + "px";
      bubble.element.style.left = bubble.x + "px";
      bubble.element.style.top = bubble.y + "px";
      bubble.element.style.background = `radial-gradient(circle, ${particleColor}44, ${particleColor}22)`;
      bubble.element.style.opacity = String(bubble.opacity);
      bubble.element.style.transition =
        "opacity 4s ease-out, transform 6s ease-out";

      if (enableGooEffect) {
        bubble.element.style.filter = `blur(${blurStrength}px)`;
      }

      containerRef.current.appendChild(bubble.element);

      requestAnimationFrame(() => {
        bubble.element.style.opacity = "0";
        bubble.element.style.transform = "translateY(-30px)";
      });

      setTimeout(() => {
        bubble.element.remove();
      }, 5000);
    },
    [isMobile, particleSize, particleColor, enableGooEffect, blurStrength]
  );

  const handleClick = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();

    const pulse = document.createElement("div");
    pulse.className = "absolute rounded-full pointer-events-none border border-cyan-400";
    pulse.style.left = e.clientX - container.left - 30 + "px";
    pulse.style.top = e.clientY - container.top - 30 + "px";
    pulse.style.width = "60px";
    pulse.style.height = "60px";
    pulse.style.opacity = "0.6";
    pulse.style.transform = "scale(0)";
    pulse.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";

    containerRef.current.appendChild(pulse);

    requestAnimationFrame(() => {
      pulse.style.transform = "scale(1.5)";
      pulse.style.opacity = "0";
    });

    setTimeout(() => pulse.remove(), 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => createBubble(false), spawnInterval);
    return () => clearInterval(interval);
  }, [createBubble, spawnInterval]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (Math.random() > 0.7) createBubble(true);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, [createBubble, handleClick]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        background: backgroundColor,
        height,
        width,
        zIndex: 1,
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBubbleParticles;
