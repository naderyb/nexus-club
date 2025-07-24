"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-white bg-black overflow-hidden">
      {/* Decorative Blur Glow */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-2xl z-0" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/logo-nexus.png"
            alt="Nexus Club Logo"
            width={240}
            height={80}
            className="mx-auto mb-8"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-tight"
        >
          Build. Break. Belong.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-4 text-lg md:text-xl text-gray-300"
        >
          We are Nexus - a creative tech collective for developers, designers,
          and dreamers who do.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <button className="group relative inline-flex items-center gap-2 px-7 py-3 bg-transparent border border-cyan-400 text-cyan-300 font-medium rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_20px_#22d3ee33]">
            Join Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="absolute inset-0 rounded-full blur-lg opacity-20 bg-gradient-to-r from-cyan-400 to-fuchsia-500 -z-10" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
