"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mediaItems = [
  { type: "image", src: "/media/groupe2-itfc.jpeg" },
  { type: "image", src: "/media/heetch.jpeg" },
  { type: "image", src: "/media/heetch3.jpeg" },
];

// Reusable animation helpers
const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: "easeOut" },
});

function AboutSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Throttle mouse updates to reduce frequency
  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-60 text-white">
      {/* Gradient glowing title */}
      <motion.div
        {...fadeInUp(0, 20, 1)}
        className="mx-auto mb-10 w-fit px-6 py-3 rounded-full border-2 border-transparent text-lg uppercase tracking-widest font-semibold"
        style={{
          fontSize: "2rem",
          background: "linear-gradient(to right, #a7f3d0, #9333ea)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          boxShadow: `
            ${mousePosition.x / 210}px ${
            mousePosition.y / 210
          }px 60px rgba(0, 255, 255, 0.6),
            ${mousePosition.x / 510}px ${
            mousePosition.y / 410
          }px 30px rgba(147, 51, 234, 0.4),
            0 0 80px rgba(0, 255, 255, 0.3)
          `,
        }}
      >
        Who We Are?
      </motion.div>

      {/* Description */}
      <motion.p
        {...fadeInUp(0.2)}
        className="relative z-10 mx-auto mb-16 max-w-3xl text-center text-lg text-gray-300 md:text-xl"
      >
        Nexus Club unites brilliant minds to explore creativity, code, and
        community. Our mission: spark ideas, build projects, and shape the
        future — one innovative session at a time.
      </motion.p>

      {/* Gallery Grid */}
      <div className="relative z-10 columns-1 gap-4 space-y-4 px-4 sm:columns-2 lg:columns-3">
        {mediaItems.map((item, idx) => (
          <motion.div
            key={idx}
            {...fadeInUp(idx * 0.15, 40, 0.6)}
            className="break-inside-avoid overflow-hidden rounded-xl shadow-xl"
          >
            <Image
              src={item.src}
              alt="Gallery image"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </motion.div>
        ))}

        {/* Learn More Button */}
          <Link href="/about">
            <motion.a className="mt-6 ml-2 inline-flex items-center gap-2 rounded-full border border-cyan-400 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-lg">
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </Link>
        
      </div>
    </section>
  );
}

export default memo(AboutSection);

