"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { FileImage, Sparkles, Zap, Calendar, MapPin } from "lucide-react";
import { ScrollTimeline } from "../../../components/ScrollTimeline";
import { motion, cubicBezier, useScroll, useTransform } from "framer-motion";
import axios from "axios";

import type { TimelineEvent } from "../../../components/ScrollTimeline";

type Event = TimelineEvent & {
  date: string;
  location: string;
  video?: string;
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 5]);

  // Optimized mouse tracking with throttling (matching hero)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get<Event[]>(
          "https://nexus-admin-bay.vercel.app/api/events"
        );

        if (Array.isArray(res.data)) {
          // Sort events by date (newest first)
          const sortedEvents = res.data.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setEvents(sortedEvents);
        } else {
          console.error("Unexpected API response:", res.data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  // Memoized dynamic text shadow for performance (matching hero)
  const titleStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, #22d3ee 0%, #3b82f6 25%, #8b5cf6 50%, #c026d3 75%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      filter: `drop-shadow(${mousePosition.x / 300}px ${
        mousePosition.y / 300
      }px 20px rgba(34, 211, 238, 0.4)) drop-shadow(${
        mousePosition.x / 150
      }px ${mousePosition.y / 150}px 40px rgba(192, 38, 211, 0.2))`,
    }),
    [mousePosition]
  );

  const noEvents = !loading && events.length === 0;

  // Enhanced events with proper icons
  const enhancedEvents = events.map(event => ({
    ...event,
    icon: <Calendar className="w-5 h-5" />
  }));

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-white overflow-hidden">
      {/* Enhanced Background Effects - Exactly like Hero */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full border border-cyan-400/60"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Enhanced Dynamic Gradient Orb */}
        <motion.div
          style={{ y: parallaxY, rotateX }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.06, 0.12, 0.06],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full bg-gradient-conic from-cyan-500/40 via-fuchsia-500/40 to-cyan-500/40 rounded-full blur-3xl"
          />
        </motion.div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-7xl w-full">
        {loading ? (
          <motion.div 
            {...fadeInUp(0)}
            className="py-32"
          >
            <div className="relative">
              {/* Enhanced Loading Animation */}
              <motion.div
                className="relative w-24 h-24 mx-auto mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-fuchsia-400" />
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-400 border-l-blue-400" />
                <motion.div
                  className="absolute inset-4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.h3
                className="text-3xl md:text-4xl font-black tracking-tighter mb-4"
                style={titleStyle}
              >
                Loading Events
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
                    repeatDelay: 4,
                  }}
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Loading Events
                </motion.span>
              </motion.h3>
              
              <div className="w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto mb-6 opacity-60" />
              
              <motion.p 
                className="text-gray-200 text-lg font-light"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Preparing amazing experiences...
              </motion.p>
            </div>
          </motion.div>
        ) : noEvents ? (
          <motion.div 
            {...fadeInUp(0)}
            className="py-32"
          >
            <div className="relative">
              {/* Enhanced Empty State */}
              <motion.div
                className="relative w-40 h-40 mx-auto mb-12"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Floating Icons around FileImage */}
                <motion.div
                  className="absolute -top-4 -left-6 text-cyan-400"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  className="absolute -top-6 -right-4 text-fuchsia-400"
                  animate={{
                    rotate: [360, 0],
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <Sparkles className="w-7 h-7" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 left-8 text-purple-400"
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  <Calendar className="w-5 h-5" />
                </motion.div>

                <motion.div
                  className="absolute bottom-4 -right-2 text-blue-400"
                  animate={{
                    rotate: [360, 0],
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </motion.div>

                {/* Main Icon with enhanced effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-xl" />
                <motion.div
                  className="absolute inset-4 bg-gradient-to-r from-cyan-400/30 to-fuchsia-400/30 rounded-full blur-lg"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <FileImage className="w-40 h-40 text-gray-300 relative z-10 drop-shadow-2xl" />
              </motion.div>
              
              <motion.h3 
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 relative"
                style={titleStyle}
              >
                No Events Yet
                {/* Glitch Effect (matching hero) */}
                <motion.span
                  className="absolute inset-0 opacity-15"
                  animate={{
                    x: [0, 3, -2, 0],
                    y: [0, -2, 2, 0],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  No Events Yet
                </motion.span>
                
                {/* Floating Icons around title (matching hero) */}
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
                  <Zap className="w-5 h-5" />
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
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </motion.h3>
              
              <div className="w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto mb-6 opacity-60" />
              
              <motion.p 
                className="text-gray-200 text-xl md:text-2xl mb-4 font-light"
                {...fadeInUp(0.2)}
              >
                The stage is set, the story begins soon
              </motion.p>
              
              <motion.p 
                className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-light"
                {...fadeInUp(0.4)}
              >
                We&apos;re crafting extraordinary experiences that will shape the future. 
                <span className="text-cyan-300 font-medium"> Innovation</span> meets{" "}
                <span className="text-fuchsia-300 font-medium">community</span> in ways you&apos;ve never imagined.
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <ScrollTimeline
            events={enhancedEvents}
            title="Our Journey"
            subtitle="Discover moments that shaped our community through immersive experiences and unforgettable gatherings"
            revealAnimation="glitch"
            cardAlignment="alternating"
            connectorStyle="circuit"
            cardEffect="cyber"
            className="min-h-[800px]"
            onCardClick={(event) => {
              console.log("Event clicked:", event);
              // Handle event click - could open modal, navigate, etc.
            }}
          />
        )}
      </div>

      {/* Custom CSS for animations (matching hero) */}
      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
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
}