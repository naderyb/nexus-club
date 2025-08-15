"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";


type Project = {
  id: number;
  name: string;
  description: string;
  site_url: string;
  image_url: string;
  start_date?: string;
  end_date?: string;
};

// Enhanced animation variants
const animations = {
  fadeInUp: (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),

  cardHover: {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.02,
      rotateY: 2,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  },

  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  },
};

// Enhanced loading skeleton
const LoadingSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div
    className={`${
      isMobile
        ? "flex overflow-x-auto gap-6 pb-4 -mx-4 px-4"
        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
    }`}
  >
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-700/30 overflow-hidden ${
          isMobile ? "min-w-[320px] h-[400px]" : "h-[400px]"
        }`}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Image skeleton */}
        <div className="h-32 bg-gray-700/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-700/50 rounded-xl w-3/4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-700/30 rounded-lg w-full animate-pulse" />
            <div className="h-3 bg-gray-700/30 rounded-lg w-4/5 animate-pulse" />
            <div className="h-3 bg-gray-700/30 rounded-lg w-2/3 animate-pulse" />
          </div>
          <div className="h-6 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-xl w-20 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Enhanced project card component
const ProjectCard = ({
  project,
  index,
  isMobile,
  onSelect,
}: {
  project: Project;
  index: number;
  isMobile: boolean;
  onSelect: (project: Project) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotateX: 10, scale: 1, rotateY: 0 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      delay: index * 0.1,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    whileHover={{
      scale: 1.02,
      rotateY: 2,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(project)}
    className={`group relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/40 hover:border-cyan-400/60 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer overflow-hidden ${
      isMobile ? "min-w-[280px] w-[280px] flex-shrink-0" : ""
    }`}
    style={{
      perspective: "1000px",
      transformStyle: "preserve-3d",
    }}
  >
    {/* Gradient border effect */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

    {/* Glass effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

    {/* Project image with enhanced effects */}
    <div className="relative h-10 overflow-hidden rounded-t-3xl">

      {/* Floating badge */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-cyan-400 border border-cyan-400/30">
        {project.start_date
          ? format(new Date(project.start_date), "yyyy")
          : "New"}
      </div>
    </div>

    {/* Enhanced content area */}
    <div className="relative p-4 space-y-3 bg-gradient-to-b from-transparent to-gray-900/20">
      {/* Project title with gradient */}
      <h3 className="text-base font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent break-words hyphens-auto leading-tight group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500">
        {project.name}
      </h3>

      {/* Description with better typography */}
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 break-words hyphens-auto group-hover:text-gray-300 transition-colors duration-300">
        {project.description}
      </p>

      {/* Enhanced action area */}
      <div className="flex items-center justify-between pt-2">
        {/* Date info */}
        {project.start_date && (
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            {format(new Date(project.start_date), "MMM yyyy")}
          </span>
        )}

        {/* View more button */}
        <motion.div
          className="flex items-center gap-1 text-xs font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300"
          whileHover={{ x: 2 }}
        >
          <span className="whitespace-nowrap">View</span>
          <motion.div
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* Subtle corner accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
);

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection with improved logic
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Optimized mouse tracking
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isMobile) return;
      setMousePosition({ x: event.clientX, y: event.clientY });
    },
    [isMobile]
  );

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isMobile]);

  // Enhanced title style with better mobile handling
  const titleStyle = useMemo(() => {
    const baseStyle = {
      background:
        "linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      backgroundSize: "200% 200%",
    };

    if (isMobile) {
      return {
        ...baseStyle,
        animation: "gradientShift 4s ease-in-out infinite",
        textShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
      };
    }

    return {
      ...baseStyle,
      textShadow: `
        ${mousePosition.x / 300}px ${
        mousePosition.y / 300
      }px 40px rgba(34, 211, 238, 0.4),
        ${-mousePosition.x / 400}px ${
        -mousePosition.y / 400
      }px 20px rgba(168, 85, 247, 0.3),
        0 0 60px rgba(236, 72, 153, 0.2)
      `,
    };
  }, [mousePosition, isMobile]);

  // Data fetching with better error handling
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/projects");
        const data: unknown = res.data;

        if (Array.isArray(data)) {
          setProjects(data as Project[]);
        } else if (
          typeof data === "object" &&
          data !== null &&
          "projects" in data &&
          Array.isArray((data as { projects?: unknown }).projects)
        ) {
          setProjects((data as { projects: Project[] }).projects);
        } else {
          console.error("Invalid API response format:", data);
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Enhanced empty state
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-6xl mb-6 opacity-40"
      >
        🚀
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
      >
        Amazing Projects Coming Soon
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-lg max-w-md mx-auto"
      >
        We&apos;re crafting innovative solutions that will transform the digital
        landscape. Stay tuned for something extraordinary!
      </motion.p>
    </motion.div>
  );

  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-gradient-conic from-cyan-500 via-purple-500 to-cyan-500 rounded-full blur-3xl" />
        </motion.div>

        {/* Secondary effects */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-purple-400/10 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced section header */}
        <motion.div {...animations.fadeInUp(0)} className="text-center mb-16">
          <motion.h2
            {...animations.fadeInUp(0.1)}
            className="mx-auto mb-8 w-fit text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            style={titleStyle}
          >
            Our Projects
          </motion.h2>

          <motion.div {...animations.fadeInUp(0.2)} className="mb-8">
            <p className="text-xl md:text-2xl font-light tracking-wide mb-6 text-gray-300">
              Where{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                innovation
              </span>{" "}
              meets{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                execution
              </span>
            </p>
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>
        </motion.div>

        {/* Content area */}
        {loading ? (
          <LoadingSkeleton isMobile={isMobile} />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : isMobile ? (
          <motion.div
            {...animations.fadeInUp(0.3)}
            className="flex overflow-x-auto gap-6 pb-6 -mx-6 px-6"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isMobile={isMobile}
                onSelect={setSelectedProject}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            {...animations.fadeInUp(0.3)}
            className="flex justify-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl w-full justify-items-center">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isMobile={isMobile}
                  onSelect={setSelectedProject}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl p-8 rounded-3xl max-w-4xl w-full relative border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-all duration-200 flex items-center justify-center text-xl z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>

              {/* Modal content */}
              <div className="space-y-6">

                {/* Title and content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent pr-12">
                    {selectedProject.name}
                  </h3>

                  <p className="text-gray-300 text-lg leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* Project timeline */}
                  {selectedProject.start_date && selectedProject.end_date && (
                    <div className="flex items-center gap-4 text-sm text-gray-400 bg-gray-800/50 rounded-xl p-4">
                      <span className="font-medium text-cyan-400">
                        Timeline:
                      </span>
                      <span>
                        {format(
                          new Date(selectedProject.start_date),
                          "MMM yyyy"
                        )}
                        {" → "}
                        {format(new Date(selectedProject.end_date), "MMM yyyy")}
                      </span>
                    </div>
                  )}

                  {/* Call to action */}
                  {selectedProject.site_url && (
                    <motion.a
                      href={selectedProject.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/25"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span>🚀 View Live Project</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced custom styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes scrollGlow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(34, 211, 238, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.6),
              0 0 25px rgba(34, 211, 238, 0.4);
          }
        }

        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          hyphens: auto;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          hyphens: auto;
        }

        .break-words {
          word-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        .hyphens-auto {
          hyphens: auto;
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
        }

        /* 🚀 Enhanced Custom Scrollbar Styling */
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.7) rgba(0, 0, 0, 0.1);
          scroll-behavior: smooth;
        }

        /* Webkit browsers (Chrome, Safari, Edge) */
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background: linear-gradient(
            90deg,
            rgba(10, 10, 20, 0.8) 0%,
            rgba(26, 26, 46, 0.6) 50%,
            rgba(10, 10, 20, 0.8) 100%
          );
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(
            90deg,
            rgba(34, 211, 238, 0.8) 0%,
            rgba(168, 85, 247, 0.9) 30%,
            rgba(236, 72, 153, 0.8) 70%,
            rgba(34, 211, 238, 0.8) 100%
          );
          background-size: 200% 100%;
          border-radius: 10px;
          border: 1px solid rgba(34, 211, 238, 0.3);
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.4),
            0 0 20px rgba(168, 85, 247, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          animation: gradientShift 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            90deg,
            rgba(34, 211, 238, 1) 0%,
            rgba(168, 85, 247, 1) 30%,
            rgba(236, 72, 153, 1) 70%,
            rgba(34, 211, 238, 1) 100%
          );
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8),
            0 0 30px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: scrollGlow 2s ease-in-out infinite;
          transform: scaleY(1.2);
        }

        .overflow-x-auto::-webkit-scrollbar-thumb:active {
          background: linear-gradient(
            90deg,
            rgba(6, 182, 212, 1) 0%,
            rgba(147, 51, 234, 1) 30%,
            rgba(219, 39, 119, 1) 70%,
            rgba(6, 182, 212, 1) 100%
          );
          box-shadow: 0 0 20px rgba(34, 211, 238, 1),
            0 0 40px rgba(168, 85, 247, 0.8), inset 0 2px 4px rgba(0, 0, 0, 0.3);
          transform: scaleY(1.1);
        }

        /* Corner styling */
        .overflow-x-auto::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Enhanced focus and interaction states */
        .overflow-x-auto:focus-within::-webkit-scrollbar-thumb {
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8),
            0 0 30px rgba(168, 85, 247, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        /* 🎨 Animated background for the scrollable container */
        .overflow-x-auto {
          position: relative;
        }

        .overflow-x-auto::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(34, 211, 238, 0.3) 20%,
            rgba(168, 85, 247, 0.3) 50%,
            rgba(236, 72, 153, 0.3) 80%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .overflow-x-auto:hover::before {
          opacity: 1;
        }

        /* 📱 Mobile-specific enhancements */
        @media (max-width: 768px) {
          .overflow-x-auto::-webkit-scrollbar {
            height: 6px;
          }

          .overflow-x-auto::-webkit-scrollbar-thumb {
            border-radius: 8px;
          }

          .overflow-x-auto::-webkit-scrollbar-track {
            border-radius: 8px;
          }
        }

        /* 🌟 Additional glow effect for the entire scrollable area */
        .overflow-x-auto {
          border-radius: 12px;
          padding-bottom: 8px;
          margin-bottom: -8px;
        }

        .overflow-x-auto:hover {
          box-shadow: 0 4px 20px rgba(34, 211, 238, 0.1),
            0 8px 40px rgba(168, 85, 247, 0.05);
        }

        /* 🎭 Smooth scroll snap for better UX */
        .overflow-x-auto {
          scroll-snap-type: x proximity;
        }

        .overflow-x-auto > * {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}
