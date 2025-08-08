// components/EventsTimeline.tsx
"use client";

import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion, cubicBezier, useScroll, useTransform } from "framer-motion";
// Change this import to use the correct EventCard component
import EventCard from "@/components/ScrollTimeline"; // or wherever your EventCard is actually located

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
  video_url?: string;
}

interface GroupedEvents {
  year: string;
  events: Event[];
}

// Simplified animation variants matching AboutSection
const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-30px" },
  transition: {
    duration,
    delay,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
});

// Enhanced loading skeleton component
const LoadingSkeleton = memo(() => (
  <div className="space-y-12">
    {[1, 2, 3].map((index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex items-center ${
          index % 2 === 0 ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400/30 to-fuchsia-400/30 rounded-full mx-8 flex-shrink-0 animate-pulse" />
        <div className="flex-1 max-w-lg">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gradient-to-r from-cyan-400/20 to-fuchsia-400/20 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
              <div className="h-4 bg-white/10 rounded w-1/4" />
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// Enhanced empty state component
const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center py-16"
  >

    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent"
    >
      No Events Yet
    </motion.h3>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-gray-400 text-lg mb-6 max-w-md mx-auto"
    >
      Our journey is just beginning. Check back soon for exciting events and
      milestones!
    </motion.p>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 rounded-full border border-cyan-400/20"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2 h-2 bg-cyan-400 rounded-full"
      />
      <span className="text-cyan-400 font-medium">Stay tuned</span>
    </motion.div>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

const groupEventsByYear = (events: Event[]): GroupedEvents[] => {
  const grouped = events.reduce((acc: Record<string, Event[]>, event) => {
    const year = new Date(event.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([year, events]) => ({ year, events }));
};

const EventsTimeline: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Optimized mouse tracking with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Dynamic title style matching AboutSection
  const titleStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, #22d3ee 0%, #3b82f6 30%, #8b5cf6 70%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      filter: `drop-shadow(${mousePosition.x / 400}px ${
        mousePosition.y / 400
      }px 15px rgba(34, 211, 238, 0.3))`,
    }),
    [mousePosition]
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/events");

        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }

        const data = await res.json();
        const sortedEvents = data.sort(
          (a: Event, b: Event) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setEvents(sortedEvents);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Failed to fetch events:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupedEvents = groupEventsByYear(events);

  return (
    <section className="relative min-h-screen px-6 py-24 text-white overflow-hidden">
      {/* Background Effects matching AboutSection */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Animated Gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" />
          <div className="absolute top-1/3 right-0 w-96 h-96" />
          <div className="absolute bottom-1/3 left-0 w-96 h-96" />
        </div>

        {/* Dynamic Orb */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 360],
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-gradient-conic from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-full blur-3xl"
          />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header - Always visible */}
        <motion.div {...fadeInUp(0)} className="text-center mb-16">
          <motion.h2
            {...fadeInUp(0.1)}
            className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none relative"
            style={titleStyle}
          >
            Our Journey
          </motion.h2>

          <motion.div {...fadeInUp(0.2)} className="mb-6">
            <p className="text-lg md:text-xl font-light tracking-wide mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                Every moment
              </span>{" "}
              tells a story of{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-medium">
                growth
              </span>
              .
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto opacity-50" />
          </motion.div>

          <motion.p
            {...fadeInUp(0.3)}
            className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed font-light"
          >
            From our humble beginnings to major milestones, discover the{" "}
            <span className="text-cyan-400">moments</span> that shaped{" "}
            <span className="text-white font-medium">Nexus Club</span> into what
            we are today.
          </motion.p>
        </motion.div>

        {/* Content based on state */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500/20 via-fuchsia-500/20 to-purple-500/20 rounded-full h-full" />
            <LoadingSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-center">
              <p className="text-lg font-semibold text-red-400 mb-2">
                Error loading events
              </p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </motion.div>
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          /* Timeline Container with Events */
          <div className="relative">
            {/* Animated Center vertical line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500/30 via-fuchsia-500/30 to-purple-500/30 rounded-full"
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: "100%", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ top: "2rem", bottom: "2rem" }}
            />

            {groupedEvents.map(({ year, events }) => (
              <motion.div key={year} {...fadeInUp(0.1)} className="mb-16">
                {/* Year Separator */}
                <motion.div
                  {...fadeInUp(0.2)}
                  className="relative flex items-center justify-center mb-12"
                >
                  <div className="relative z-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-lg backdrop-blur-sm border border-white/10">
                    <span className="relative z-10">{year}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-fuchsia-600/20 rounded-full blur-xl" />
                  </div>
                </motion.div>

                {events.map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    {...fadeInUp(eventIndex * 0.1 + 0.3)}
                    className={`flex items-center mb-12 ${
                      eventIndex % 2 === 0 ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Connector dot */}
                    <motion.div
                      className="relative z-20 w-6 h-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full mx-8 flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full blur-md opacity-50" />
                    </motion.div>

                    {/* Event card */}
                    <motion.div
                      className="flex-1 max-w-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS matching AboutSection */}
      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes gradient-conic {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
};

export default memo(EventsTimeline);
