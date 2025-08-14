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

  // Enhanced body scroll and blur effect when sidebar is open
  useEffect(() => {
    const body = document.body;
    const mainContent =
      document.getElementById("main-content") || document.querySelector("main");

    if (isOpen) {
      // Prevent body scroll
      body.style.overflow = "hidden";

      // Add blur effect to main content
      if (mainContent) {
        mainContent.style.filter = "blur(8px)";
        mainContent.style.transition = "filter 0.3s ease-in-out";
      }

      // Add blur class to other elements (optional)
      const elementsToBlur = document.querySelectorAll(
        "section, article, .page-content"
      );
      elementsToBlur.forEach((element) => {
        (element as HTMLElement).style.filter = "blur(8px)";
        (element as HTMLElement).style.transition = "filter 0.3s ease-in-out";
      });
    } else {
      // Restore body scroll
      body.style.overflow = "unset";

      // Remove blur effect from main content
      if (mainContent) {
        mainContent.style.filter = "none";
      }

      // Remove blur from other elements
      const elementsToBlur = document.querySelectorAll(
        "section, article, .page-content"
      );
      elementsToBlur.forEach((element) => {
        (element as HTMLElement).style.filter = "none";
      });
    }

    // Cleanup function
    return () => {
      body.style.overflow = "unset";
      if (mainContent) {
        mainContent.style.filter = "none";
      }
      const elementsToBlur = document.querySelectorAll(
        "section, article, .page-content"
      );
      elementsToBlur.forEach((element) => {
        (element as HTMLElement).style.filter = "none";
      });
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
                src="/logo-nexus.svg"
                alt="Nexus Club Logo"
                width={120}
                height={40}
                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
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

      {/* Enhanced Backdrop with stronger blur effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(12px)",
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              transition: { duration: 0.3, ease: "easeIn" },
            }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,40,0.9) 50%, rgba(0,0,0,0.8) 100%)",
            }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              },
            }}
            exit={{
              x: "100%",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 35,
                duration: 0.3,
              },
            }}
            className="fixed top-0 right-0 w-[85%] max-w-sm h-screen bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] z-50 shadow-2xl border-l border-gradient-to-b border-fuchsia-500/30"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 0 50px rgba(192, 38, 211, 0.3), 0 0 100px rgba(0, 255, 255, 0.2)",
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            <div className="relative flex flex-col h-full px-6 py-6">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Menu
                </motion.h2>
                <motion.button
                  className="p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiX size={24} />
                </motion.button>
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
              <motion.div
                className="pt-6 border-t border-fuchsia-400/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-gray-400 text-center mb-4 font-medium">
                  Connect with us
                </p>
                <div className="flex justify-center space-x-6">
                  {socialLinks.map(
                    ({ icon: Icon, href, label, color }, index) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full bg-gradient-to-r from-fuchsia-600/20 to-cyan-500/20 text-gray-300 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-fuchsia-500/25 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Visit our ${label}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <Icon size={20} />
                      </motion.a>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Global styles for blur effect */}
      <style jsx global>{`
        .navbar-blur-active main,
        .navbar-blur-active section,
        .navbar-blur-active article,
        .navbar-blur-active .page-content {
          filter: blur(8px);
          transition: filter 0.3s ease-in-out;
        }

        .navbar-blur-active .navbar {
          filter: none !important;
        }
      `}</style>
    </>
  );
}
