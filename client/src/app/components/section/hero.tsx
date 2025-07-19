"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center text-white overflow-hidden z-0">
      {/* Subtle Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-black -z-10" />

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/logo-nexus.png"
            alt="Nexus Club Logo"
            width={260}
            height={80}
            className="mx-auto mb-8"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500"
        >
          Welcome to Nexus Club
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg text-gray-300 md:text-xl"
        >
          A vibrant community of creators, developers, and designers pushing the boundaries of technology and imagination.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <button className="group relative inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_15px_#22d3ee]">
            Join Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="absolute inset-0 rounded-full blur-md opacity-20 bg-gradient-to-r from-cyan-400 to-fuchsia-500 -z-10" />
          </button>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 text-sm text-teal-400"
        >
          Discover. Collaborate. Grow.
        </motion.p>
      </div>
    </section>
  );
}

export default memo(Hero);
