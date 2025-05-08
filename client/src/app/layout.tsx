"use client";
import React from "react";
import Navbar from "../app/components/Navbar";
import Hero from "@/app/components/section/hero";
import AbooutUs from "@/app/components/section/AboutUs";
import Footer from "../app/components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-black text-white relative`}>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <Navbar />
          <Hero />
          <AbooutUs />
          <Footer />
          {children}
        </motion.div>
      </body>
      
    </html>
  );
}
