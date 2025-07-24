"use client";

import { useState, useEffect, memo } from "react";
import { motion, cubicBezier } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TeamCarousel from "../../../components/TeamCarousel";

const mediaItems = [
  { type: "image", src: "/media/groupe2-itfc.jpeg" },
  { type: "image", src: "/media/heetch.jpeg" },
  { type: "image", src: "/media/heetch3.jpeg" },
  { type: "image", src: "/media/2nd_expo-itfc.jpeg" },
  { type: "image", src: "/media/workshop1.jpeg" },
  { type: "image", src: "/media/tshirt-day.jpeg" },
];

const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration,
    delay,
    ease: cubicBezier(0.42, 0, 0.58, 1),
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
    <section className="relative min-h-screen px-6 py-32 text-white z-10 overflow-hidden">
      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto mb-6 w-fit text-5xl md:text-6xl font-bold tracking-tight text-center leading-tight"
        style={{
          background: "linear-gradient(to right, #22d3ee, #c026d3)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: `
            ${mousePosition.x / 210}px ${
            mousePosition.y / 210
          }px 60px rgba(0, 255, 255, 0.5),
            ${mousePosition.x / 510}px ${
            mousePosition.y / 410
          }px 30px rgba(147, 51, 234, 0.3)
          `,
        }}
      >
        Who We Are
      </motion.h2>

      {/* TAGLINE */}
      <motion.p
        {...fadeInUp(0.1)}
        className="text-center text-base md:text-lg text-cyan-400 tracking-wide mb-6"
      >
        Creativity is the spark of every revolution.
      </motion.p>

      {/* DESCRIPTION */}
      <motion.p
        {...fadeInUp(0.2)}
        className="mx-auto max-w-3xl text-center text-gray-400 text-lg md:text-xl leading-relaxed -mb-50"
      >
        Nexus Club unites brilliant minds to explore creativity, code, and
        community. Our mission? Spark ideas, build projects, and shape the
        future-one session at a time.
      </motion.p>

      {/* Subtle Gradient Neon Glow Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_#ec4899_20%,_#06b6d4_80%)] rounded-full blur-[120px] -z-10 top-[58%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* CAROUSEL */}
      <motion.div {...fadeInUp(0.3)} className="mt-24">
        <TeamCarousel
          members={carouselItems}
          title=""
          cardWidth={280}
          cardHeight={360}
          visibleCards={2}
          showArrows
          showDots={false}
          background="transparent"
          grayscaleEffect
          autoPlay={3000}
        />
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeInUp(0.4)} className="-mt-15 text-center -mb-10">
        <Link href="/about">
          <motion.a
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px #e879f9, 0 0 40px #9333ea",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400 px-7 py-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300 hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_20px_#e879f9]/30"
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
