"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
  events,
  title,
  subtitle,
  revealAnimation = "glitch",
  cardAlignment = "alternating",
  connectorStyle = "circuit",
  cardEffect = "cyber",
  className = "",
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<string | number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (id && entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    const items = document.querySelectorAll("[data-timeline-item]");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => observerRef.current?.disconnect();
  }, [events]);

  const getRevealClass = (eventId: string | number) => {
    const isVisible = visibleItems.has(eventId);
    const base = "transform transition-all duration-700 ease-out";

    if (!isVisible) {
      switch (revealAnimation) {
        case "fade": return `${base} opacity-0`;
        case "slide": return `${base} opacity-0 translate-y-8`;
        case "scale": return `${base} opacity-0 scale-95`;
        case "flip": return `${base} opacity-0 rotateX-90`;
        case "glitch": return `${base} opacity-0 translate-x-4 blur-sm`;
        default: return base;
      }
    }

    return `${base} opacity-100 translate-y-0 scale-100 rotateX-0 translate-x-0 blur-0`;
  };

  return (
    <div
      ref={timelineRef}
      className={cn(
        "w-full px-4 sm:px-6 max-w-6xl mx-auto relative",
        className
      )}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(0,255,255,0.1)_25px,rgba(0,255,255,0.1)_26px,transparent_27px),linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:25px_25px]" />
      </div>

      {title && (
        <div className="relative mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="mx-auto w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600" />
        </div>
      )}

      {subtitle && (
        <p className="text-center text-sm sm:text-base text-gray-400 mb-12 max-w-2xl mx-auto px-2">
          {subtitle}
        </p>
      )}

      <div className="relative">
        {/* Main timeline line */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-400/30 via-purple-500/30 to-cyan-400/30" />
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse opacity-50" />

        {/* Circuit dots */}
        {connectorStyle === "circuit" && (
          <div className="absolute left-1/2 -translate-x-1/2 h-full">
            {events.map((_, index) => (
              <div
                key={`node-${index}`}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 border-2 border-gray-900 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                style={{ top: `${(index * 100) / (events.length - 1)}%` }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-10 sm:gap-12">
          {events.map((event, index) => {
            const alignment = cardAlignment === "alternating"
              ? index % 2 === 0 ? "left" : "right"
              : cardAlignment;

            return (
              <div
                key={event.id}
                data-timeline-item
                data-id={event.id}
                className={cn(
                  "group relative w-full flex flex-col sm:flex-row",
                  alignment === "left" && "sm:justify-start sm:pl-8",
                  alignment === "right" && "sm:justify-end sm:pr-8"
                )}
              >
                <div
                  onClick={event.onClick}
                  className={cn(
                    "relative w-full sm:w-[320px] bg-gray-900/50 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 cursor-pointer overflow-hidden",
                    "hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all",
                    cardEffect === "cyber" && "hover:scale-[1.03] active:scale-100",
                    cardEffect === "glow" && "hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]",
                    cardEffect === "shadow" && "hover:shadow-xl",
                    cardEffect === "bounce" && "hover:animate-bounce",
                    getRevealClass(event.id)
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {event.icon && <div className="text-cyan-400 text-lg">{event.icon}</div>}
                        <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {event.year}
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-100 group-hover:text-cyan-400">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="text-sm text-cyan-300 mb-2 font-medium">
                        {event.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/50 opacity-0 group-hover:opacity-100" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/50 opacity-0 group-hover:opacity-100" />
                </div>

                <div
                  className={cn(
                    "hidden sm:block absolute top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent",
                    alignment === "left"
                      ? "right-0 translate-x-full"
                      : "left-0 -translate-x-full rotate-180"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export interface TimelineEvent {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  year?: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default ScrollTimeline;
