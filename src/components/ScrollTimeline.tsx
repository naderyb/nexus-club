"use client";

import React, { memo, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  media?: string[];
}

interface EventCardProps {
  event: Event;
}

// Optimized animation variants
const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

const descriptionVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: { duration: 0.2, ease: "easeInOut" as const },
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 16,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { type: "spring" as const, stiffness: 400 },
  },
  tap: { scale: 0.95 },
};

// Media animation variants
const mediaItemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

const EventCard: React.FC<EventCardProps> = memo(({ event }) => {
  const [showDescription, setShowDescription] = useState(false);

  // Memoize formatted date to prevent recalculation
  const formattedDate = useMemo(() => {
    return new Date(event.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [event.date]);

  // Optimized toggle handler with useCallback
  const toggleDescription = useCallback(() => {
    setShowDescription((prev) => !prev);
  }, []);

  // Memoize description content
  const descriptionContent = useMemo(
    () => event.description?.trim() || "No description provided.",
    [event.description]
  );

  // Memoize media content and check if media exists
  const hasMedia = useMemo(
    () => event.media && event.media.length > 0,
    [event.media]
  );

  const mediaCount = useMemo(() => event.media?.length || 0, [event.media]);

  // Helper function to determine if URL is video
  const isVideoUrl = useCallback((url: string) => {
    return (
      url.includes("/video/") ||
      url.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) ||
      url.includes("video")
    );
  }, []);

  return (
    <motion.article
      className="relative bg-black/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl group will-change-transform"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      role="article"
      aria-labelledby={`event-title-${event.id}`}
    >
      {/* Optimized gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        aria-hidden="true"
      />

      {/* Media Section - Always Visible */}
      {hasMedia && (
        <div className="relative">
          <motion.div
            className="p-4 pb-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {/* Media Grid */}
            <div className={`grid gap-3 ${
              mediaCount === 1 ? 'grid-cols-1' : 
              mediaCount === 2 ? 'grid-cols-2' : 
              mediaCount === 3 ? 'grid-cols-3' : 
              'grid-cols-2'
            }`}>
              {event.media?.slice(0, 4).map((url, i) => (
                <motion.div
                  key={i}
                  variants={mediaItemVariants}
                  className="relative group/media overflow-hidden rounded-lg bg-slate-900/50 border border-white/10"
                >
                  {isVideoUrl(url) ? (
                    <video
                      src={url}
                      controls
                      className="w-full h-32 sm:h-40 object-cover rounded-lg transition-transform duration-300 group-hover/media:scale-105"
                      poster="/api/placeholder/400/300"
                      preload="metadata"
                      aria-label={`${event.title} video ${i + 1}`}
                    />
                  ) : (
                    <div className="relative overflow-hidden rounded-lg">
                      <Image
                        src={url}
                        alt={`${event.title} media ${i + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover/media:scale-105"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyydlPvRQOz2bTU6C9NN1vB0"
                      />

                      {/* Image overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300 rounded-lg" />

                      {/* Image index indicator */}
                      {mediaCount > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          {i + 1}/{mediaCount > 4 ? '4+' : mediaCount}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media type indicator */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {isVideoUrl(url) ? (
                      <>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Video
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Image
                      </>
                    )}
                  </div>

                  {/* Show remaining media count if more than 4 */}
                  {i === 3 && mediaCount > 4 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                      <div className="text-white text-lg font-bold">
                        +{mediaCount - 4}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 relative z-10">
        {/* Enhanced Title */}
        <h3
          id={`event-title-${event.id}`}
          className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500"
        >
          {event.title}
        </h3>

        {/* Date and Location */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <div
              className="w-4 h-4 mr-3 flex-shrink-0 text-cyan-400"
              aria-hidden="true"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <time className="font-medium text-white" dateTime={event.date}>
              {formattedDate}
            </time>
          </div>

          <div className="flex items-center text-sm">
            <div
              className="w-4 h-4 mr-3 flex-shrink-0 text-fuchsia-400"
              aria-hidden="true"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <address className="text-white not-italic">
              {event.location}
            </address>
          </div>
        </div>

        {/* Action Button - Only Show Description */}
        <div className="pt-3 border-t border-white/10">
          <motion.button
            onClick={toggleDescription}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="group/btn relative overflow-hidden flex items-center space-x-2 text-xs font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 w-full justify-center"
            aria-expanded={showDescription}
            aria-controls={`event-description-${event.id}`}
            aria-label={
              showDescription
                ? "Hide event description"
                : "Show event description"
            }
          >
            {/* Button background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-full blur-sm" />

            {/* Button content */}
            <span className="relative z-10">
              {showDescription ? "Hide Details" : "Show Details"}
            </span>

            {/* Enhanced arrow icon */}
            <motion.div
              className="relative z-10 w-3 h-3"
              animate={{
                rotate: showDescription ? 90 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.div>
          </motion.button>
        </div>

        {/* Optimized Description Reveal */}
        <AnimatePresence mode="wait">
          {showDescription && (
            <motion.div
              key={`description-${event.id}`}
              id={`event-description-${event.id}`}
              variants={descriptionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
              role="region"
              aria-live="polite"
            >
              <div className="p-4 bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 rounded-xl border border-white/10 shadow-inner backdrop-blur-sm">
                <h4 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent mb-3">
                  Event Details
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line break-words">
                  {descriptionContent}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced subtle glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-cyan-500/2 via-transparent to-fuchsia-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;