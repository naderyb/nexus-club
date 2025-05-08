"use client";
import { motion } from "framer-motion";
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
      className="fixed top-0 left-0 w-full z-50 px-6 py-2 backdrop-blur-md border-b border-cyan-400/20 shadow-[0_0_12px_#8a2be2] ring-1 ring-[#8a2be2]/20 rounded-b-xl flex justify-between items-center"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo-nexus.png"
          alt="Nexus Club Logo"
          width={180}
          height={50}
          className="rounded-full"
        />
      </Link>

      {/* Desktop Navbar */}
      <ul className="hidden md:flex space-x-8 text-gray-300 font-medium tracking-wide">
        {links.map((link) => (
          <li key={link}>
            <Link
              href={`#${link.toLowerCase()}`}
              onMouseEnter={() => setHovered(link)}
              onMouseLeave={() => setHovered(null)}
              className={`relative transition-all duration-200 hover:text-cyan-300 ${
                hovered === link ? "text-cyan-300" : ""
              }`}
            >
              {link}
              {hovered === link && (
                <motion.span
                  layoutId="underline"
                  className="absolute left-0 -bottom-1 h-[2px] w-full bg-fuchsia-500 shadow-[0_0_6px_#ff00ff] rounded-full"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Hamburger */}
      <div
        className="md:hidden flex flex-col justify-center items-center space-y-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`w-6 h-0.5 bg-cyan-300 shadow-[0_0_6px_#00ffff] transition-transform duration-300 ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <div
          className={`w-5 h-0.5 bg-cyan-300 shadow-[0_0_6px_#00ffff] transition-opacity duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`w-6 h-0.5 bg-cyan-300 shadow-[0_0_6px_#00ffff] transition-transform duration-300 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute top-[80px] left-0 w-full bg-[#0f0f1e]/90 backdrop-blur-md 
          text-gray-300 text-center py-6 space-y-6 md:hidden z-40 border-t border-fuchsia-500/20"
        >
          {links.map((link) => (
            <li key={link}>
              <Link
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-lg font-semibold transition hover:text-cyan-300 hover:scale-105 hover:drop-shadow-[0_0_6px_#00ffff]"
              >
                {link}
              </Link>
            </li>
          ))}
          <div className="flex justify-center space-x-6 pt-4 text-[#bbbbbb]">
            <a
              href="https://tiktok.com/@nexus.club_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:drop-shadow-[0_0_6px_#ff00ff] transition"
            >
              <FaTiktok size={22} />
            </a>
            <a
              href="https://instagram.com/nexus.club_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:drop-shadow-[0_0_6px_#ff00ff] transition"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/nexus-club-692baa334/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:drop-shadow-[0_0_6px_#ff00ff] transition"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
        </motion.ul>
      )}
    </motion.nav>
  );
}
