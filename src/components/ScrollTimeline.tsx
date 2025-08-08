// components/EventCard.tsx
import React, { memo } from "react";
import { motion } from "framer-motion";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
  video_url?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = memo(({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      className="relative bg-black/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl group will-change-transform"
      whileHover={{ 
        y: -4, // Reduced movement
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      layout={false} // Disable layout animations for better performance
    >
      {/* Static Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Content Section */}
      <div className="p-6 relative z-10">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {event.title}
        </h3>

        {/* Date and Location */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-300">
            <div className="w-4 h-4 mr-3 flex-shrink-0 text-cyan-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="font-medium text-white">{formattedDate}</span>
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <div className="w-4 h-4 mr-3 flex-shrink-0 text-fuchsia-400">
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
            <span className="text-white">{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 group-hover:text-gray-200 transition-colors duration-300">
          {event.description}
        </p>

        {/* Bottom Section */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">

            <motion.button
              className="flex items-center space-x-2 text-xs font-medium bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white px-3 py-1.5 rounded-full hover:from-cyan-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg"
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Details</span>
              <motion.svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ 
                  x: 1,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Subtle Inner Glow - Static version for better performance */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;