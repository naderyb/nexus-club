"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, cubicBezier, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import JoinNexusModal from "../JoinNexusModal";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🚀 Add modal state
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);

  // Check for mobile on component mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Enhanced animation variants
  const fadeInUp = (delay = 0, y = 40, duration = 1) => ({
    initial: { opacity: 0, y, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      duration,
      delay,
      ease: cubicBezier(0.23, 1, 0.32, 1),
    },
  });

  // Memoized dynamic text shadow for performance
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

  return (
    <>
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-white overflow-hidden">
        {/* Enhanced Background Effects with Mobile Overflow Control */}
        <div className="absolute inset-0 pointer-events-none max-w-full max-h-full overflow-hidden">
          {/* Floating Geometric Shapes with Reduced Density on Mobile */}
          {[...Array(isMobile ? 4 : 8)].map((_, i) => (
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] md:w-[1000px] h-[600px] sm:h-[800px] md:h-[1000px] pointer-events-none"
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
        <div className="relative z-10 text-center max-w-4xl">
          {/* Logo with Enhanced Animation and Responsive Scaling */}
          <motion.div
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative mb-8"
          >
            <Image
              src="/logo-nexus.svg"
              alt="Nexus Club Logo"
              width={100}
              height={65}
              className="mx-auto filter drop-shadow-lg w-40 sm:w-48 md:w-[200px]"
              priority
            />
          </motion.div>

          {/* Enhanced Title with Mobile Font Scaling */}
          <motion.h1
            className="relative mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none"
            style={titleStyle}
          >
            Build. Break. Belong.
            {/* Glitch Effect Overlay */}
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
              Build. Break. Belong.
            </motion.span>
            {/* Floating Icons */}
            <motion.div
              className="absolute -top-4 -left-6 text-cyan-400"
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
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>
            <motion.div
              className="absolute -top-5 -right-4 text-fuchsia-400"
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
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>
          </motion.h1>

          {/* Enhanced Tagline with Mobile Padding */}
          <motion.div {...fadeInUp(0.4)} className="mb-6">
            <div className="w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto mb-4 opacity-60" />
            <p className="text-base sm:text-lg md:text-xl font-light tracking-wide px-2 sm:px-0">
              A creative tech collective for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-medium">
                developers
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                designers
              </span>
              , and{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-medium">
                dreamers
              </span>{" "}
              who do.
            </p>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.p
            {...fadeInUp(0.6)}
            className="mb-8 max-w-2xl mx-auto text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed font-light px-2 sm:px-0"
          >
            Where <span className="text-cyan-300 font-medium">innovation</span>{" "}
            meets{" "}
            <span className="text-fuchsia-300 font-medium">community</span>.
            Join us to <span className="text-white font-medium">create</span>,{" "}
            <span className="text-white font-medium">collaborate</span>, and{" "}
            <span className="text-white font-medium">shape tomorrow</span>.
          </motion.p>

          {/* 🚀 Enhanced CTA Button with Modal functionality - ONLY ADDED onClick */}
          <motion.div
            {...fadeInUp(0.8)}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          >
            <motion.button
              onClick={() => setIsModalOpen(true)} // 🚀 Only added this line
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 40px rgba(34, 211, 238, 0.5), 0 0 80px rgba(192, 38, 211, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 rounded-full border-2 border-cyan-400/60 px-6 py-3 text-base font-semibold uppercase tracking-widest text-cyan-300 overflow-hidden transition-all duration-500 hover:text-white hover:border-cyan-400"
            >
              {/* Button Background Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

              {/* Button Content */}
              <span className="relative z-10">Join the Nexus</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator with Fixed Centering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-3 bg-gradient-to-b from-cyan-400 to-fuchsia-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Custom CSS for animations */}
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

      {/* 🚀 Add the JoinNexusModal component */}
      <JoinNexusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
