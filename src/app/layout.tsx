"use client";

import React from "react";
import Cursor from "@/app/components/ui/cursor";
import Hero from "@/app/components/section/hero";
import AboutUs from "@/app/components/section/AboutUs";
import EventsTimeline from "@/app/components/section/eventSection";
import ProjectsSection from "@/app/components/section/ProjectsSection";
import Footer from "@/app/components/Footer";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import "./globals.css";

// Dynamically load ClubHierarchy without SSR to avoid DOM-related errors
// const ClubHierarchy = dynamic(() => import("./components/section/ClubHierarchy"), {
//   ssr: false,
// });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Nexus Club</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-nexus.svg" />
        <link rel="apple-touch-icon" href="/logo-nexus.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} bg-black text-white relative overflow-x-hidden`}>
        {/* Floating Cyan Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(260)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Cursor />
          <Hero />
          <AboutUs />
          <EventsTimeline />
          <ProjectsSection />
          {/* <ClubHierarchy /> */}
          <Footer />
          {children}
        </motion.div>
      </body>
    </html>
  );
}
