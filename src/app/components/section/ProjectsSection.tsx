"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";

// 🎯 Enhanced Types
interface Project {
  id: number;
  name: string;
  description: string;
  site_url?: string;
  media: string[];
  start_date?: string;
  end_date?: string;
  status?: "Live" | "Completed" | "In Progress" | "Archived";
  technologies?: string[];
  category?: string;
  featured?: boolean;
  github_url?: string;
}

interface ProjectStatus {
  text: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface ApiResponse {
  projects?: Project[];
  data?: Project[];
  [key: string]: unknown;
}

// 🔧 Utility Functions - Optimized
const mediaUtils = {
  isImage: (url: string): boolean =>
    /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url),
  isVideo: (url: string): boolean => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url),
  getImages: (media: string[]): string[] =>
    media?.filter(mediaUtils.isImage) || [],
  getVideos: (media: string[]): string[] =>
    media?.filter(mediaUtils.isVideo) || [],
};

const formatUtils = {
  formatDate: (date: string): string => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Unknown";
    }
  },
  truncateText: (text: string, maxLength: number): string =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text,
};

// 🎯 Enhanced Status Logic
const getProjectStatus = (project: Project): ProjectStatus => {
  const statusMap: Record<string, ProjectStatus> = {
    Live: {
      text: "Live",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20 border-emerald-500/40",
      icon: "🚀",
    },
    Completed: {
      text: "Completed",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20 border-blue-500/40",
      icon: "✅",
    },
    "In Progress": {
      text: "In Progress",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20 border-amber-500/40",
      icon: "⚡",
    },
    Archived: {
      text: "Archived",
      color: "text-gray-400",
      bgColor: "bg-gray-500/20 border-gray-500/40",
      icon: "📦",
    },
  };

  if (project.status && statusMap[project.status]) {
    return statusMap[project.status];
  }

  if (project.site_url) return statusMap.Live;
  if (project.end_date) return statusMap.Completed;
  return statusMap["In Progress"];
};

// 🎬 Enhanced Media Carousel - Optimized
const MediaCarousel = ({
  media,
  projectName,
}: {
  media: string[];
  projectName: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const allMedia = useMemo(
    () => [...mediaUtils.getImages(media), ...mediaUtils.getVideos(media)],
    [media]
  );

  const navigate = useCallback(
    (direction: "next" | "prev") => {
      setCurrentIndex((prev) => {
        const newIndex =
          direction === "next"
            ? (prev + 1) % allMedia.length
            : (prev - 1 + allMedia.length) % allMedia.length;
        setIsLoading(true);
        return newIndex;
      });
    },
    [allMedia.length]
  );

  if (!allMedia.length) {
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mb-6">
        <div className="text-center">
          <div className="text-6xl opacity-30 mb-4">🎨</div>
          <p className="text-gray-500 text-sm">No media available</p>
        </div>
      </div>
    );
  }

  const currentMedia = allMedia[currentIndex];
  const isVideo = mediaUtils.isVideo(currentMedia);

  return (
    <div className="relative mb-8 rounded-xl overflow-hidden bg-black/20">
      <div className="aspect-video relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {hasError ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl opacity-50 mb-2">⚠️</div>
                  <p className="text-gray-500 text-sm">Failed to load media</p>
                </div>
              </div>
            ) : isVideo ? (
              <video
                src={currentMedia}
                controls
                className="w-full h-full object-contain bg-black rounded-xl"
                onLoadStart={() => setIsLoading(true)}
                onLoadedData={() => setIsLoading(false)}
                onError={() => setHasError(true)}
              />
            ) : (
              <>
                <Image
                  src={currentMedia}
                  alt={`${projectName} - Image ${currentIndex + 1}`}
                  fill
                  className="w-full h-full object-contain bg-black rounded-xl transition-transform duration-500"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setHasError(true)}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={currentIndex === 0}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() => navigate("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              aria-label="Previous media"
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => navigate("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              aria-label="Next media"
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Media Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full border border-white/20">
              {currentIndex + 1} / {allMedia.length}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-cyan-400 scale-125"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 🎨 Enhanced Loading Skeleton - Lighter
const LoadingSkeleton = () => (
  <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 min-w-[400px] border border-gray-700/30"
      >
        <div className="aspect-video bg-gray-800/50 rounded-xl mb-6 animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse" />
          <div className="h-4 bg-gray-800/50 rounded w-3/4 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-800/50 rounded-full w-16 animate-pulse" />
            <div className="h-6 bg-gray-800/50 rounded-full w-20 animate-pulse" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// 🎯 Project Card - EXACT SAME STYLING, just API data
const ProjectCard = ({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}) => {
  const status = getProjectStatus(project);
  const images = mediaUtils.getImages(project.media);
  const primaryImage = images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -12,
        rotateX: 5,
        rotateY: 2,
        transition: { duration: 0.3 },
      }}
      onClick={() => onSelect(project)}
      className="group relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/30 hover:border-cyan-400/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer overflow-hidden min-w-[400px] transform-gpu"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Floating Status Badge */}
      <div className="absolute -top-2 -right-2 z-20">
        <div
          className={`px-3 py-1.5 ${status.bgColor} ${status.color} text-xs font-semibold rounded-xl border backdrop-blur-sm shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}
        >
          <span className="mr-1">{status.icon}</span>
          {status.text}
        </div>
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-medium rounded-full backdrop-blur-sm">
          ⭐ Featured
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={project.name}
              fill
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              sizes="400px"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl opacity-30 mb-2">🚀</div>
              <p className="text-gray-500 text-sm">No preview available</p>
            </div>
          </div>
        )}

        {/* Media Count Indicator */}
        {project.media?.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">
            📸 {project.media.length} items
          </div>
        )}

        {/* Year Badge */}
        {project.start_date && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30">
            {formatUtils.formatDate(project.start_date)}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Click to explore →
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
            {project.name}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
            {formatUtils.truncateText(project.description, 120)}
          </p>
        </div>

        {/* Project Timeline */}
        {project.start_date && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-800/30 rounded-lg px-3 py-2">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {formatUtils.formatDate(project.start_date)}
              {project.end_date &&
                ` - ${formatUtils.formatDate(project.end_date)}`}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700/40">
          <div className="flex gap-2">
            {project.site_url && (
              <div
                className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                title="Live site available"
              />
            )}
            {project.github_url && (
              <div
                className="w-2 h-2 bg-gray-400 rounded-full"
                title="Source code available"
              />
            )}
          </div>

          <div className="text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
            Explore →
          </div>
        </div>
      </div>

      {/* Subtle Gradient Border */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ padding: "1px" }}
      >
        <div className="w-full h-full rounded-2xl bg-gray-900/80 backdrop-blur-xl" />
      </div>
    </motion.article>
  );
};

// 🎭 Enhanced Modal - EXACT SAME STYLING
const ProjectModal = ({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) => {
  if (!project) return null;

  const status = getProjectStatus(project);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-700/50">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-800/60 hover:bg-gray-700/80 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="pr-16">
              <div className="flex items-start gap-4 mb-4">
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {project.name}
                </h2>
                <div
                  className={`px-3 py-1.5 ${status.bgColor} ${status.color} text-sm font-semibold rounded-xl border backdrop-blur-sm`}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.text}
                </div>
              </div>

              {project.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {project.category}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Media Carousel */}
            {project.media?.length > 0 && (
              <MediaCarousel media={project.media} projectName={project.name} />
            )}

            {/* Description */}
            <div className="prose prose-gray prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies & Timeline Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-300 text-sm rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {project.start_date && (
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Timeline
                  </h3>
                  <div className="text-gray-300">
                    <div className="flex items-center gap-2 text-lg">
                      <span className="text-purple-400">Started:</span>
                      <span>{formatUtils.formatDate(project.start_date)}</span>
                    </div>
                    {project.end_date && (
                      <div className="flex items-center gap-2 text-lg mt-2">
                        <span className="text-purple-400">Completed:</span>
                        <span>{formatUtils.formatDate(project.end_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-700/50">
              {project.site_url && (
                <a
                  href={project.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit Live Site
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-gray-500/50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Source Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// 🎨 Empty State Component - Lighter
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center py-20"
  >
    <div className="text-8xl mb-6 opacity-40">🚀</div>
    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
      No Projects Yet
    </h3>
    <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
      Amazing innovations are brewing behind the scenes. Check back soon for
      groundbreaking projects!
    </p>
  </motion.div>
);

// 🎯 Main Component - REAL API INTEGRATION
export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 🚀 REAL API FETCH - Optimized with error handling
  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse | Project[]>("/api/projects", {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📦 Raw API Response:", response.data);

      let projectsData: Project[] = [];

      // Handle different API response formats
      if (Array.isArray(response.data)) {
        projectsData = response.data;
      } else if (
        response.data?.projects &&
        Array.isArray(response.data.projects)
      ) {
        projectsData = response.data.projects;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        projectsData = response.data.data;
      } else {
        console.error("❌ Unexpected API response format:", response.data);
        throw new Error("Invalid API response format");
      }

      console.log(`✅ Successfully fetched ${projectsData.length} projects`);

      // Log each project for debugging
      projectsData.forEach((project, index) => {
        console.log(`📋 Project ${index + 1} (${project.name}):`, {
          id: project.id,
          status: project.status,
          media: project.media,
          mediaCount: project.media?.length || 0,
          technologies: project.technologies,
          start_date: project.start_date,
          end_date: project.end_date,
          site_url: project.site_url,
          github_url: project.github_url,
          category: project.category,
          featured: project.featured,
        });
      });

      setProjects(projectsData);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);

      let errorMessage = "Failed to load projects. Please try again later.";

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          code?: string; 
          response?: { 
            status?: number; 
            data?: { message?: string } 
          } 
        };
        if (axiosError.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Please check your connection.";
        } else if (axiosError.response?.status === 404) {
          errorMessage = "Projects API endpoint not found.";
        } else if (axiosError.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }

        console.error("📡 Response data:", axiosError.response?.data);
        console.error("📡 Response status:", axiosError.response?.status);
      }

      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section className="relative py-24 min-h-screen overflow-hidden">
      {/* Optimized Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
              ✨ Innovation Showcase
            </span>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Where cutting-edge technology meets creative problem-solving.
            Explore our portfolio of innovative solutions that push boundaries
            and create impact.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mx-auto rounded-full"
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4 opacity-50">⚠️</div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
            >
              Try Again
            </button>
          </motion.div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* Projects Display */}
            <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
              {projects.map((project, index) => (
                <div key={project.id} className="snap-center">
                  <ProjectCard
                    project={project}
                    index={index}
                    onSelect={setSelectedProject}
                  />
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            {projects.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-center mt-8"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full text-gray-400 text-sm">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ←
                  </motion.div>
                  Scroll to explore more
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Optimized Global Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
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
