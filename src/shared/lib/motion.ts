/**
 * Motion presets — Mirrors src/styles/motion.css for JS contexts.
 * Uses Motion (framer-motion) library springs.
 */

export const motionPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
} as const;
