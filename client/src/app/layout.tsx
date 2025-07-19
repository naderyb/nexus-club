"use client";
import React from "react";
import Navbar from "../app/components/Navbar";
import Hero from "@/app/components/section/hero";
import AboutUs from "@/app/components/section/AboutUs";
import Footer from "../app/components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import Cursor from "@/components/cursor";
import AnimatedBubbleParticles from "@/app/components/ui/bg";
import EventsTimeline from "./components/section/eventSection";

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
      <body className={`${inter.className} bg-black text-white relative`}>
        <AnimatedBubbleParticles />
        <Cursor />
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
          <Footer />
          {children}
        </motion.div>
      </body>
      
    </html>
  );
}
