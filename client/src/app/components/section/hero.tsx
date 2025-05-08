"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

// Reusable fade-in-up config
const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut", delay },
});

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 text-center overflow-hidden">
      <div className="mx-auto max-w-4xl px-4">
        {/* Logo */}
        <motion.div {...fadeInUp(0)}>
          <Image
            src="/logo-nexus.png"
            alt="Nexus Club Logo"
            width={500}
            height={150}
            className="mx-auto mb-6"
            priority
          />
        </motion.div>

        {/* Welcome Title */}
        <motion.h1
          {...fadeInUp(0.1)}
          className="text-4xl font-semibold text-white md:text-5xl"
        >
          Hello there, welcome to Nexus Club!
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fadeInUp(0.3)}
          className="mt-4 text-lg font-light tracking-wide text-gray-400 md:text-xl"
        >
          A community of innovators and creators at the intersection of
          technology, marketing, and design. Where we make sense from chaos.
        </motion.p>

        {/* Call to Action Button (kept as is) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <button className="button flex items-center justify-center px-6 py-2 bg-transparent border-2 border-teal-500 text-teal-500 rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300">
            Join Us
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </motion.div>

        {/* Text under the button (kept as is) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-6 text-xl font-medium text-teal-500"
        >
          Join us to enhance your skills and make a difference!
        </motion.p>
      </div>

      {/* Background Overlay (Glowing Effect - kept as is) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur-3xl -z-10 top-[-250px] left-[-150px] opacity-15"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-violet-500 to-blue-600 rounded-full blur-3xl -z-10 bottom-[-200px] right-[-100px] opacity-20"
      />
    </section>
  );
}

export default memo(Hero);
