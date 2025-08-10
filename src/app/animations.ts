import { cubicBezier } from "framer-motion";

export const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-30px" },
  transition: {
    duration,
    delay,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
});

export const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    staggerChildren: 0.1,
    delayChildren: 0.05,
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
};
