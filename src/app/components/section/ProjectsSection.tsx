"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";

type Project = {
  id: number;
  name: string;
  description: string;
  site_url: string;
  image_url: string;
  start_date?: string;
  end_date?: string;
};

// 5️⃣ Animation constants - Fixed ease property
const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { 
    duration: 1, 
    delay, 
    ease: [0.25, 0.46, 0.45, 0.94] as const
  },
});

// 3️⃣ Loading skeleton component
const LoadingSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div
    className={`${
      isMobile
        ? "flex overflow-x-auto gap-4 pb-4"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"
    }`}
  >
    {[...Array(isMobile ? 6 : 6)].map((_, i) => (
      <div
        key={i}
        className={`bg-gray-800/50 rounded-2xl animate-pulse border border-gray-700/30 ${
          isMobile ? "min-w-[280px] h-48" : "h-48"
        }`}
      >
        <div className="p-4 sm:p-5 space-y-3">
          <div className="h-6 bg-gray-700/50 rounded-lg w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-700/30 rounded w-full" />
            <div className="h-4 bg-gray-700/30 rounded w-2/3" />
            <div className="h-4 bg-gray-700/30 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 4️⃣ Mouse shadow optimization - skip on mobile
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if ("ontouchstart" in window) return; // Skip on mobile/touch devices
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window) return; // Skip on mobile
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Optimized title style
  const titleStyle = useMemo(() => {
    const baseStyle = {
      background: "linear-gradient(to right, #22d3ee, #c026d3)",
      WebkitBackgroundClip: "text",
      color: "transparent",
    };

    // Skip complex shadows on mobile
    if (isMobile || "ontouchstart" in window) {
      return {
        ...baseStyle,
        textShadow: "2px 2px 8px rgba(34, 211, 238, 0.3)",
      };
    }

    return {
      ...baseStyle,
      textShadow: `
        ${mousePosition.x / 210}px ${
        mousePosition.y / 210
      }px 60px rgba(0, 255, 255, 0.5),
        ${mousePosition.x / 510}px ${
        mousePosition.y / 410
      }px 30px rgba(147, 51, 234, 0.3)
      `,
    };
  }, [mousePosition, isMobile]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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
          console.error("Invalid format:", data);
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

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 sm:py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent"
      >
        No Projects Yet
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-sm sm:text-base"
      >
        We&apos;re working on amazing projects. Check back soon!
      </motion.p>
    </motion.div>
  );

  return (
    <section className="relative py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none max-w-full max-h-full overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] pointer-events-none"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 360],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: isMobile ? 40 : 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className={`w-full h-full bg-gradient-conic from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-full ${
              isMobile ? "blur-2xl" : "blur-3xl"
            }`}
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div {...fadeInUp(0)} className="text-center mb-8 sm:mb-12">
          <motion.h2
            {...fadeInUp(0.1)}
            className="mx-auto mb-4 sm:mb-6 w-fit text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center leading-tight"
            style={titleStyle}
          >
            Our Projects
          </motion.h2>

          <motion.div {...fadeInUp(0.2)} className="mb-4 sm:mb-6">
            <p className="text-base sm:text-lg md:text-xl font-light tracking-wide mb-3 px-2 sm:px-0">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                Innovation
              </span>{" "}
              meets{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-medium">
                execution
              </span>
              .
            </p>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto opacity-50" />
          </motion.div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton isMobile={isMobile} />
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          /* 2️⃣ Responsive layout - grid on desktop, horizontal scroll on mobile */
          <motion.div
            {...fadeInUp(0.3)}
            className={`${
              isMobile
                ? "flex overflow-x-auto gap-4 pb-4 -mx-4 px-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"
            }`}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94] as const
                }}
                whileHover={{ scale: isMobile ? 1.02 : 1.03 }}
                onClick={() => setSelectedProject(project)}
                  className={`group bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-fuchsia-600 shadow-md hover:shadow-fuchsia-500/30 transition-all cursor-pointer ${
                    isMobile ? "min-w-[280px] flex-shrink-0" : ""
                  }`}
                >
                  {/* 6️⃣ Project image */}
                  {project.image_url && (
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <Image
                        src={project.image_url}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 to-transparent" />
                    </div>
                  )}

                {/* 1️⃣ Mobile-first card content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-2">
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Date info for mobile */}
                  {project.start_date && (
                    <p className="text-xs text-gray-500">
                      {format(new Date(project.start_date), "MMM yyyy")}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 7️⃣ Responsive Modal with scroll */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-[#111] p-4 sm:p-6 rounded-xl max-w-full sm:max-w-2xl w-full relative border border-fuchsia-700/30 shadow-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl z-10"
              >
                ✕
              </button>

              {/* Modal image */}
              {selectedProject.image_url && (
                <div className="relative h-48 sm:h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProject.image_url}
                    alt={selectedProject.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 672px"
                  />
                </div>
              )}

              <h3 className="text-xl sm:text-2xl font-bold mb-4 pr-8">
                {selectedProject.name}
              </h3>

              <p className="mb-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                {selectedProject.description}
              </p>

              {selectedProject.start_date && selectedProject.end_date && (
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  <span className="font-medium">Duration:</span>{" "}
                  {format(new Date(selectedProject.start_date), "PPP")} →{" "}
                  {format(new Date(selectedProject.end_date), "PPP")}
                </p>
              )}

              {selectedProject.site_url && (
                <a
                  href={selectedProject.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 sm:px-5 py-2 sm:py-3 rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white font-semibold text-sm sm:text-base"
                >
                  🔗 View Live
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS */}
      <style jsx>{`
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}