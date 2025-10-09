"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes,FaUsers } from "react-icons/fa";
import { useEffect, useCallback } from "react";

interface JoinNexusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Move constants outside component to prevent recreation
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function JoinNexusModal({
  isOpen,
  onClose,
}: JoinNexusModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Close modal on Escape key
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] rounded-2xl border border-fuchsia-500/30 p-8 max-w-md w-full mx-4 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 50px rgba(192, 38, 211, 0.3), 0 0 100px rgba(0, 255, 255, 0.2)",
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 bg-fuchsia-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Fermer"
            >
              <FaTimes size={16} />
            </motion.button>

            {/* Content */}
            <div className="relative text-center">
              {/* Icon */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 rounded-full flex items-center justify-center border border-fuchsia-500/30">
                  <FaUsers className="text-3xl text-fuchsia-400" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Inscriptions Fermées
              </motion.h2>

              {/* Message */}
              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-300 text-lg leading-relaxed">
                  Les inscriptions sont actuellement{" "}
                  <span className="text-fuchsia-400 font-semibold">
                    fermées
                  </span>
                  , mais pas de panique !
                </p>

                <p className="text-gray-400 text-base">
                  De nombreux{" "}
                  <span className="text-cyan-400 font-medium">
                    événements passionnants
                  </span>{" "}
                  arrivent bientôt. Restez connectés pour ne rien manquer !
                </p>
              </motion.div>

              {/* Action button */}
              <motion.button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Compris ! 🚀
              </motion.button>

              {/* Footer note */}
              <motion.p
                className="text-gray-500 text-xs mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Suivez nos réseaux sociaux pour les dernières actualités
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
