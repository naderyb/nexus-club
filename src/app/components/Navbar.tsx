"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const links = [
  { name: "Home", href: "/" },
  { name: "Who are we?", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Projects", href: "/projects" },
  { name: "Community", href: "/community" },
  { name: "Contact us", href: "/contact" },
];

const socialLinks = [
  {
    icon: FaTiktok,
    href: "https://tiktok.com/@nexus.club_",
    label: "TikTok",
    color: "hover:text-pink-400",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com/nexus.club_",
    label: "Instagram",
    color: "hover:text-pink-500",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/nexus-club-692baa334/",
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
];


export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const linkVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a14]/90 backdrop-blur-xl shadow-xl shadow-fuchsia-500/10"
            : "bg-[#0e0e1a]/70 backdrop-blur-md"
        } border-b border-fuchsia-400/20`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/logo-nexus.png"
                alt="Nexus Club Logo"
                width={160}
                height={40}
                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white rounded-lg group"
                >
                  <span className="relative z-10">{link.name}</span>

                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Animated underline */}
                  {hovered === link.name && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-full"
                      style={{
                        boxShadow:
                          "0 0 10px rgba(192, 38, 211, 0.6), 0 0 20px rgba(0, 255, 255, 0.3)",
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Enhanced Hamburger Menu */}
          <button
            className="md:hidden relative p-2 rounded-lg bg-gradient-to-r from-fuchsia-600/20 to-cyan-500/20 backdrop-blur-sm border border-fuchsia-400/30 transition-all duration-300 hover:from-fuchsia-500/30 hover:to-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`w-5 h-0.5 bg-gradient-to-r from-fuchsia-400 to-cyan-300 rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-gradient-to-r from-fuchsia-400 to-cyan-300 rounded-full transition-all duration-300 my-1 ${
                  isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-gradient-to-r from-fuchsia-400 to-cyan-300 rounded-full transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 w-[85%] max-w-sm h-screen bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] z-50 shadow-2xl border-l border-gradient-to-b border-fuchsia-500/30"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative flex flex-col h-full px-6 py-6">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                  Menu
                </h2>
                <button
                  className="p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <HiX size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1">
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center px-4 py-3 text-gray-300 rounded-lg transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-fuchsia-600/20 hover:to-cyan-500/20 border border-transparent hover:border-fuchsia-400/20"
                      >
                        <span className="text-lg font-medium tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Social Icons */}
              <div className="pt-6 border-t border-fuchsia-400/20">
                <p className="text-sm text-gray-400 text-center mb-4 font-medium">
                  Connect with us
                </p>
                <div className="flex justify-center space-x-6">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full bg-gradient-to-r from-fuchsia-600/20 to-cyan-500/20 text-gray-300 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-fuchsia-500/25 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Visit our ${label}`}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
