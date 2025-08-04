"use client";
import React from "react";
import Navbar from "../app/components/Navbar";
import Hero from "@/app/components/section/hero";
import AboutUs from "@/app/components/section/AboutUs";
import EventsTimeline from "./components/section/eventSection";
import ProjectsSection from "@/app/components/section/ProjectsSection";
import Footer from "../app/components/Footer";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-black text-white relative overflow-x-hidden`}>
        <div className="absolute inset-0 pointer-events-none">
                {[...Array(200)].map((_, i) => (
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
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 4,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Navbar />
          <Hero />
          <AboutUs />
          <EventsTimeline />
          <ProjectsSection />
          <Footer />
          {children}
        </motion.div>
      </body>
      
    </html>
  );
}
