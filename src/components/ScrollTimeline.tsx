"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { Calendar, Sparkles, Zap,  } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  date: string; // ISO date string or formatted date
  location?: string;
  video?: string;
  icon?: React.ReactNode;
}

interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
  revealAnimation?: "fade" | "slide" | "scale" | "flip" | "glitch";
  cardAlignment?: "alternating" | "left" | "right";
  connectorStyle?: "line" | "dots" | "dashed" | "circuit";
  cardEffect?: "glow" | "shadow" | "bounce" | "none" | "cyber";
  darkMode?: boolean;
  perspective?: boolean;
  className?: string;
  onCardClick?: (event: TimelineEvent) => void;
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
  events,
  title,
  subtitle,
  revealAnimation = "glitch",
  cardAlignment = "alternating",
  className = "",
  onCardClick,
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<string | number>>(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for dynamic effects (matching hero)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Enhanced animation variants (matching hero)
  const fadeInUp = (delay = 0, y = 40, duration = 1) => ({
    initial: { opacity: 0, y, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration,
      delay,
      ease: cubicBezier(0.23, 1, 0.32, 1),
    },
  });

  // Dynamic title style (matching hero)
  const titleStyle = {
    background:
      "linear-gradient(135deg, #22d3ee 0%, #3b82f6 25%, #8b5cf6 50%, #c026d3 75%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    filter: `drop-shadow(${mousePosition.x / 300}px ${
      mousePosition.y / 300
    }px 20px rgba(34, 211, 238, 0.4)) drop-shadow(${
      mousePosition.x / 150
    }px ${mousePosition.y / 150}px 40px rgba(192, 38, 211, 0.2))`,
  };

  // Show first few items immediately
  useEffect(() => {
    if (events.length > 0) {
      const firstTwoIds = events.slice(0, 2).map(event => event.id);
      setVisibleItems(new Set(firstTwoIds));
    }
  }, [events]);

  // Intersection observer for animations
  useEffect(() => {
    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("data-id");
            if (id && entry.isIntersecting) {
              setVisibleItems((prev) => new Set([...prev, id]));
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: "50px 0px"
        }
      );

      setTimeout(() => {
        const items = document.querySelectorAll("[data-timeline-item]");
        items.forEach((item) => {
          observerRef.current?.observe(item);
        });
      }, 100);
    };

    if (events.length > 0) {
      setupObserver();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [events]);

  // Parse date to get month and year
  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    if (isNaN(date.getTime())) {
      return { day: "", month: "", year: "" };
    }
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return { day, month, year };
  };

  // Animation classes
  const getRevealClass = (eventId: string | number) => {
    const isVisible = visibleItems.has(eventId);
    const base = "transform transition-all duration-700 ease-out";

    if (!isVisible) {
      switch (revealAnimation) {
        case "fade":
          return `${base} opacity-0`;
        case "slide":
          return `${base} opacity-0 translate-y-8`;
        case "scale":
          return `${base} opacity-0 scale-95`;
        case "flip":
          return `${base} opacity-0 rotateX-90`;
        case "glitch":
          return `${base} opacity-0 translate-x-4 blur-sm`;
        default:
          return `${base} opacity-0`;
      }
    }

    return `${base} opacity-100 translate-y-0 scale-100 rotateX-0 translate-x-0 blur-0`;
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">No events to display</p>
      </div>
    );
  }

  return (
    <div
      ref={timelineRef}
      className={cn(
        "w-full px-4 sm:px-6 max-w-6xl mx-auto relative",
        className
      )}
    >
      {/* Background Effects (matching hero) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(0,255,255,0.1)_25px,rgba(0,255,255,0.1)_26px,transparent_27px),linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:25px_25px]" />
      </div>

      {/* Floating particles (matching hero) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full border border-cyan-400/40"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + i * 12}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Header */}
      {title && (
        <motion.div 
          {...fadeInUp(0)}
          className="relative mb-12 text-center"
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4 relative"
            style={titleStyle}
          >
            {title}
            {/* Glitch Effect (matching hero) */}
            <motion.span
              className="absolute inset-0 opacity-15"
              animate={{
                x: [0, 2, -2, 0],
                y: [0, -1, 1, 0],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              style={{
                background: "linear-gradient(135deg, #ec4899, #22d3ee)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </motion.span>
            
            {/* Floating Icons (matching hero) */}
            <motion.div
              className="absolute -top-3 -left-4 text-cyan-400"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Zap className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-3 text-fuchsia-400"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          </motion.h2>
          
          <div className="w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto mb-4 opacity-60" />
        </motion.div>
      )}

      {subtitle && (
        <motion.p 
          {...fadeInUp(0.2)}
          className="text-center text-lg md:text-xl text-gray-200 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Main timeline line with enhanced effects */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-fuchsia-400"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="flex flex-col gap-16 sm:gap-20">
          {events.map((event, index) => {
            const { month, year } = parseDate(event.date);
            const alignment = cardAlignment === "alternating" 
              ? index % 2 === 0 ? "left" : "right" 
              : cardAlignment;

            return (
              <motion.div
                key={`timeline-${event.id}-${index}`}
                data-timeline-item="true"
                data-id={event.id}
                className="group relative w-full flex items-center justify-center"
                {...fadeInUp(index * 0.1)}
              >
                {/* Timeline Node with Date */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                  {/* Date Display */}
                  <motion.div
                    className="bg-gray-900/90 backdrop-blur-sm border border-cyan-400/50 rounded-lg px-3 py-2 mb-4 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="text-center">
                      {/* Day, Month, Year */}
                      <div className="text-cyan-400 text-sm font-bold uppercase tracking-wide">
                        {event.date ? parseDate(event.date).day : ""}
                      </div>
                      <div className="text-cyan-400 text-sm font-bold uppercase tracking-wide">
                        {month}
                      </div>
                      <div className="text-white text-lg font-black">
                        {year}
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Node */}
                  <motion.div
                    className="relative w-6 h-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full border-4 border-gray-900 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                    whileHover={{ scale: 1.2 }}
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(34,211,238,0.6)",
                        "0 0 30px rgba(192,38,211,0.8)",
                        "0 0 20px rgba(34,211,238,0.6)"
                      ] 
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity },
                      scale: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <div className="absolute inset-1 bg-gradient-to-r from-cyan-300 to-fuchsia-300 rounded-full animate-pulse" />
                  </motion.div>
                </div>

                {/* Event Card */}
                <motion.div
                  className={cn(
                    "relative w-full max-w-md mx-4",
                    alignment === "left" ? "sm:ml-0 sm:mr-auto sm:translate-x-16" : "sm:mr-0 sm:ml-auto sm:-translate-x-16"
                  )}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    onClick={() => onCardClick?.(event)}
                    className={cn(
                      "group relative bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/50 cursor-pointer overflow-hidden",
                      "hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-500",
                      "hover:bg-gray-900/90",
                      getRevealClass(event.id)
                    )}
                  >
                    {/* Card Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Corner Decorations (matching hero button) */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-fuchsia-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {event.icon ? (
                            <div className="text-cyan-400 text-xl">
                              {event.icon}
                            </div>
                          ) : (
                            <Calendar className="w-5 h-5 text-cyan-400" />
                          )}
                          {event.location && (
                            <span className="text-xs font-mono text-gray-400 bg-gray-800/80 px-2 py-1 rounded-md border border-gray-700">
                              {event.location}
                            </span>
                          )}
                        </div>
                        <motion.div 
                          className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>

                      {/* Title */}
                      <motion.h3 
                        className="text-xl sm:text-2xl font-bold mb-2 text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300"
                      >
                        {event.title}
                      </motion.h3>

                      {/* Subtitle */}
                      {event.subtitle && (
                        <p className="text-sm text-cyan-300 mb-3 font-medium">
                          {event.subtitle}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        {event.description}
                      </p>

                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-fuchsia-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Connection Line */}
                <div
                  className={cn(
                    "hidden sm:block absolute top-1/2 -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r opacity-60 z-10",
                    alignment === "left" 
                      ? "left-1/2 ml-3 from-cyan-400/80 to-transparent"
                      : "right-1/2 mr-3 from-transparent to-cyan-400/80"
                  )}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Custom CSS for conic gradient */}
      <style jsx>{`
        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default ScrollTimeline;