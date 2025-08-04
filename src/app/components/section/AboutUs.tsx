"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, cubicBezier, useScroll, useTransform } from "framer-motion";
import TeamCarousel from "../../../components/TeamCarousel";

const mediaItems = [
  { type: "image", src: "/media/groupe2-itfc.jpeg", alt: "" },
  { type: "image", src: "/media/heetch.jpeg", alt: "" },
  { type: "image", src: "/media/heetch3.jpeg", alt: "" },
  { type: "image", src: "/media/2nd_expo-itfc.jpeg", alt: "" },
  { type: "image", src: "/media/workshop1.jpeg", alt: "" },
  { type: "image", src: "/media/tshirt-day.jpeg", alt: "" },
];

// Simplified animation variants
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

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    staggerChildren: 0.1,
    delayChildren: 0.05,
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
};

type CarouselItem = {
  id: string;
  name: string;
  role: string;
  image: string;
  objectFit: "cover" | "contain";
  objectPosition: string;
  alt: string;
};

function AboutSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);

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

  // Enhanced image orientation detection with error handling
  const getImageOrientation = useCallback((src: string): Promise<"portrait" | "landscape"> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      const timeout = setTimeout(() => {
        reject(new Error("Image load timeout"));
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img.height > img.width ? "portrait" : "landscape");
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Failed to load image"));
      };
      
      img.src = src;
    });
  }, []);

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

  // Simplified dynamic text shadow for performance
  const titleStyle = useMemo(() => ({
    background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 30%, #8b5cf6 70%, #ec4899 100%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    filter: `drop-shadow(${mousePosition.x / 400}px ${mousePosition.y / 400}px 15px rgba(34, 211, 238, 0.3))`,
  }), [mousePosition]);

  return (
    <section className="relative min-h-screen px-6 py-24 text-white overflow-hidden">
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle Animated Gradient */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" />
          <div className="absolute top-1/3 right-0 w-96 h-96" />
          <div className="absolute bottom-1/3 left-0 w-96 h-96" />
        </div>

        {/* Simplified Dynamic Orb */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 360],
              opacity: [0.02, 0.05, 0.02]
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
          className="text-center mb-16"
        >
          {/* Simplified Title */}
          <motion.h2
            variants={staggerItem}
            className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none relative"
            style={titleStyle}
          >
            Who We Are
          </motion.h2>

          {/* Cleaner Tagline */}
          <motion.div
            variants={staggerItem}
            className="mb-6"
          >
            <p className="text-lg md:text-xl font-light tracking-wide mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                Creativity
              </span>{" "}
              is the spark of every{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-medium">
                revolution
              </span>.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto opacity-50" />
          </motion.div>

          {/* Simplified Description */}
          <motion.p
            variants={staggerItem}
            className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed font-light"
          >
            <span className="text-white font-medium">Nexus Club</span> unites brilliant minds to explore{" "}
            <span className="text-cyan-400">creativity</span>, <span className="text-blue-400">code</span>, and{" "}
            <span className="text-fuchsia-400">community</span>. We{" "}
            <span className="text-white font-medium">spark ideas</span>,{" "}
            <span className="text-white font-medium">build projects</span>, and{" "}
            <span className="text-white font-medium">shape the future</span>.
          </motion.p>
        </motion.div>

        {/* Simplified Carousel Section */}
        <motion.div 
          {...fadeInUp(0.2)}
        >
          {isLoaded ? (
            <TeamCarousel
              members={carouselItems}
              title=""
              cardWidth={300}
              cardHeight={360}
              visibleCards={3}
              showArrows
              showDots={false}
              background="transparent"
              grayscaleEffect
              autoPlay={4000}
            />
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-fuchsia-400 rounded-full animate-spin animation-delay-300" />
              </div>
            </div>
          )}
        </motion.div>
      
      </div>

      {/* Simplified Custom CSS */}
      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes gradient-conic {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}

export default memo(AboutSection);