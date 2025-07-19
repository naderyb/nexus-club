"use client";

import { useState, useEffect, memo } from "react";
import { motion, cubicBezier } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TeamCarousel from "../../../components/TeamCarousel"; // Ensure default import if TeamCarousel uses export default

const mediaItems = [
  { type: "image", src: "/media/groupe2-itfc.jpeg" },
  { type: "image", src: "/media/heetch.jpeg" },
  { type: "image", src: "/media/heetch3.jpeg" },
  { type: "image", src: "/media/2nd_expo-itfc.jpeg" },
  { type: "image", src: "/media/workshop1.jpeg" },
  { type: "image", src: "/media/tshirt-day.jpeg" },
];

// ✅ Fixed: Use proper Framer Motion easing
const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration,
    delay,
    ease: cubicBezier(0.42, 0, 0.58, 1), // Use a valid Framer Motion easing array
  },
});

type CarouselItem = {
  id: string;
  name: string;
  role: string;
  image: string;
  objectFit: "cover" | "contain";
  objectPosition: string;
};

function AboutSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const getImageOrientation = (
      src: string
    ): Promise<"portrait" | "landscape"> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          resolve(img.height > img.width ? "portrait" : "landscape");
        };
      });

    const prepareItems = async () => {
      const items: CarouselItem[] = await Promise.all(
        mediaItems.map(async (item, idx) => {
          const orientation = await getImageOrientation(item.src);
          return {
            id: `${idx + 1}`,
            name: ``,
            role: "",
            image: item.src,
            objectFit: orientation === "portrait" ? "contain" : "cover",
            objectPosition: "center",
          };
        })
      );
      setCarouselItems(items);
    };

    prepareItems();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-40 text-white z-10">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          delay: 0,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="mx-auto mb-4 w-fit text-4xl font-extrabold tracking-wide uppercase"
        whileHover={{ rotateX: 5, rotateY: -5 }}
        style={{
          background: "linear-gradient(to right, #22d3ee, #c026d3)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: `
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
      </motion.h2>

      {/* Tagline */}
      <motion.p
        {...fadeInUp(0.1)}
        className="text-center text-base text-cyan-300 font-light tracking-wide mb-6"
      >
        We believe creativity is the spark of every revolution.
      </motion.p>

      {/* Description */}
      <motion.p
        {...fadeInUp(0.2)}
        className="relative z-10 mx-auto -mb-20 max-w-3xl text-center text-lg md:text-xl text-gray-300 leading-relaxed"
      >
        Nexus Club unites brilliant minds to explore creativity, code, and
        community. Our mission: spark ideas, build projects, and shape the
        future - one innovative session at a time.
      </motion.p>

      {/* Carousel */}
      <motion.div {...fadeInUp(0.3)} className="z-10">
        <TeamCarousel
          members={carouselItems}
          title=""
          cardWidth={280}
          cardHeight={380}
          visibleCards={2}
          showArrows={true}
          showDots={false}
          background="transparent"
          grayscaleEffect={true}
          autoPlay={2000}
        />
      </motion.div>

      {/* Neon Blur Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full blur-3xl -z-10 top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* CTA Button */}
      <motion.div {...fadeInUp(0.4)} className="mt-14 text-center">
        <Link href="/about">
          <motion.a
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px #e879f9, 0 0 60px #9333ea",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300 hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_20px_#e879f9]/30"
          >
            Learn More
            <ArrowRight className="ml-1 w-5 h-5" />
          </motion.a>
        </Link>
      </motion.div>
    </section>
  );
}

export default memo(AboutSection);
