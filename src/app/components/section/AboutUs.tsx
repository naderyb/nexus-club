"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TeamCarousel from "../../../components/TeamCarousel";
import { fadeInUp, staggerContainer, staggerItem } from "../../animations";
import { mediaItems } from "@/app/data/mediaItems";

type CarouselItem = {
  id: string;
  name: string;
  role: string;
  image: string;
  objectFit: "cover" | "contain";
  objectPosition: string;
  alt: string;
};

// Orientation cache with expiry
const ORIENTATION_CACHE_KEY = "nexus_image_orientations";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

function AboutSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 4️⃣ Touch-friendly parallax toggle
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if ("ontouchstart" in window) return; // Skip on mobile/touch devices
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window) return; // Skip on mobile
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // 6️⃣ Orientation detection with caching
  const getCachedOrientation = useCallback(
    (src: string): "portrait" | "landscape" | null => {
      try {
        const cached = localStorage.getItem(ORIENTATION_CACHE_KEY);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - data.timestamp > CACHE_EXPIRY) {
          localStorage.removeItem(ORIENTATION_CACHE_KEY);
          return null;
        }

        return data.orientations[src] || null;
      } catch {
        return null;
      }
    },
    []
  );

  const setCachedOrientation = useCallback(
    (src: string, orientation: "portrait" | "landscape") => {
      try {
        const cached = localStorage.getItem(ORIENTATION_CACHE_KEY);
        const data = cached
          ? JSON.parse(cached)
          : { orientations: {}, timestamp: Date.now() };

        data.orientations[src] = orientation;
        data.timestamp = Date.now();

        localStorage.setItem(ORIENTATION_CACHE_KEY, JSON.stringify(data));
      } catch {
        // Ignore localStorage errors
      }
    },
    []
  );

  const getImageOrientation = useCallback(
    (src: string): Promise<"portrait" | "landscape"> => {
      // Check cache first
      const cached = getCachedOrientation(src);
      if (cached) {
        return Promise.resolve(cached);
      }

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        const timeout = setTimeout(() => {
          reject(new Error("Image load timeout"));
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          const orientation = img.height > img.width ? "portrait" : "landscape";
          setCachedOrientation(src, orientation);
          resolve(orientation);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Failed to load image"));
        };

        img.src = src;
      });
    },
    [getCachedOrientation, setCachedOrientation]
  );

  useEffect(() => {
    const prepareItems = async () => {
      try {
        const items: CarouselItem[] = await Promise.all(
          mediaItems.map(async (item, idx) => {
            try {
              const orientation = await getImageOrientation(item.src);
              return {
                id: `media-${idx + 1}`,
                name: ``,
                role: item.alt,
                image: item.src,
                alt: item.alt,
                objectFit: orientation === "portrait" ? "contain" : "cover",
                objectPosition: "center",
              };
            } catch (error) {
              console.warn(`Failed to process image ${item.src}:`, error);
              return {
                id: `media-${idx + 1}`,
                name: ``,
                role: item.alt,
                image: item.src,
                alt: item.alt,
                objectFit: "cover" as const,
                objectPosition: "center",
              };
            }
          })
        );
        setCarouselItems(items);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error preparing carousel items:", error);
        setIsLoaded(true);
      }
    };

    prepareItems();
  }, [getImageOrientation]);

  // 1️⃣ Mobile-first carousel configuration
  const carouselConfig = useMemo(
    () => ({
      cardWidth: isMobile ? 250 : 300,
      cardHeight: isMobile ? 280 : 360,
      visibleCards: isMobile ? 1 : 3,
    }),
    [isMobile]
  );

  // Simplified dynamic text shadow for performance
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

  // 3️⃣ Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex gap-4 justify-center px-4 sm:px-0">
      {[...Array(carouselConfig.visibleCards)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 animate-pulse rounded-lg border border-gray-700/30"
          style={{
            width: carouselConfig.cardWidth,
            height: carouselConfig.cardHeight,
          }}
        >
          <div className="w-full h-3/4 bg-gray-700/30 rounded-t-lg mb-4"></div>
          <div className="px-4 space-y-2">
            <div className="h-4 bg-gray-700/30 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700/30 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative min-h-screen px-4 sm:px-6 py-8 sm:py-16 md:py-24 text-white overflow-hidden">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 pointer-events-none max-w-full max-h-full overflow-hidden">
        {/* Subtle Animated Gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" />
          <div className="absolute top-1/3 right-0 w-64 sm:w-96 h-64 sm:h-96" />
          <div className="absolute bottom-1/3 left-0 w-64 sm:w-96 h-64 sm:h-96" />
        </div>

        {/* Simplified Dynamic Orb */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] pointer-events-none"
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
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center -mb-60 sm:mb-12 md:mb-16" // Reduced mobile margin
        >
          {/* Simplified Title */}
          <motion.h2
            variants={staggerItem}
            className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none relative"
            style={titleStyle}
          >
            Who We Are
          </motion.h2>

          {/* Cleaner Tagline */}
          <motion.div variants={staggerItem} className="mb-4 sm:mb-6">
            <p className="text-base sm:text-lg md:text-xl font-light tracking-wide mb-3 px-2 sm:px-0">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                Creativity
              </span>{" "}
              is the spark of every{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-medium">
                revolution
              </span>
              .
            </p>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto opacity-50" />
          </motion.div>

          {/* Simplified Description */}
          <motion.p
            variants={staggerItem}
            className="max-w-3xl mx-auto text-gray-300 text-sm sm:text-lg md:text-xl leading-relaxed font-light px-4 sm:px-0"
          >
            <span className="text-white font-medium">Nexus Club</span> unites
            brilliant minds to explore{" "}
            <span className="text-cyan-400">creativity</span>,{" "}
            <span className="text-blue-400">code</span>, and{" "}
            <span className="text-fuchsia-400">community</span>. We{" "}
            <span className="text-white font-medium">spark ideas</span>,{" "}
            <span className="text-white font-medium">build projects</span>, and{" "}
            <span className="text-white font-medium">shape the future</span>.
          </motion.p>
        </motion.div>

        {/* Responsive Carousel Section */}
        <motion.div {...fadeInUp(0.2)}>
          {isLoaded ? (
            <TeamCarousel
              members={carouselItems}
              title=""
              cardWidth={carouselConfig.cardWidth}
              cardHeight={carouselConfig.cardHeight}
              visibleCards={carouselConfig.visibleCards}
              showArrows
              showDots={false}
              background="transparent"
              grayscaleEffect
              autoPlay={isMobile ? 3000 : 4000} // Faster on mobile
            />
          ) : (
            <LoadingSkeleton />
          )}
        </motion.div>
      </div>

      {/* Simplified Custom CSS */}
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
}

export default memo(AboutSection);
