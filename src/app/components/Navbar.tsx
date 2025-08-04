"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

const links = [
  "Home",
  "Who are we?",
  "Events",
  "Projects",
  "Community",
  "Contact us",
];

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-3 bg-[#0e0e1a]/70 backdrop-blur-md border-b border-fuchsia-400/20 shadow-[0_0_15px_#c026d3]/30"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-nexus.png"
            alt="Nexus Club Logo"
            width={160}
            height={40}
            className="rounded-md object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300 tracking-wide">
          {links.map((link) => (
            <li key={link}>
              <Link
                href={`#${link.toLowerCase()}`}
                onMouseEnter={() => setHovered(link)}
                onMouseLeave={() => setHovered(null)}
                className="relative px-2 py-1 transition hover:text-white"
              >
                {link}
                {hovered === link && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 shadow-[0_0_10px_#00ffff] rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger Icon */}
        <div
          className="md:hidden flex flex-col justify-center items-center space-y-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`w-6 h-0.5 bg-fuchsia-400 transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-fuchsia-400 transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-fuchsia-400 transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-[75%] h-screen bg-[#0f0f1e] text-gray-200 z-40 shadow-2xl border-l border-fuchsia-500/20 backdrop-blur-md"
          >
            <div className="flex flex-col h-full justify-between px-6 py-8">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  className="text-fuchsia-400 hover:text-white transition text-4xl font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>

              {/* Navigation Links */}
              <ul className="space-y-6 text-lg font-semibold tracking-wide text-center">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setIsOpen(false)}
                      className="block transition hover:text-cyan-300 hover:drop-shadow-[0_0_8px_#00ffff]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Icons */}
              <div className="flex justify-center space-x-6 text-fuchsia-300 pt-6">
                <a
                  href="https://tiktok.com/@nexus.club_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <FaTiktok size={22} />
                </a>
                <a
                  href="https://instagram.com/nexus.club_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="https://www.linkedin.com/in/nexus-club-692baa334/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <FaLinkedin size={22} />
                </a>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
