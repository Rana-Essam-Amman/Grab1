export const ANIMATIONS = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Micro-interactions
  tap: {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 },
  },
  
  // List item entrance
  listItem: {
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.15 },
  },
  
  // Modal / Sheet
  modal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
  
  // Badge pulse
  badgePulse: {
    animate: { scale: [1, 1.15, 1] },
    transition: { duration: 1.5, repeat: Infinity },
  },
} as const;

export type AnimationKey = keyof typeof ANIMATIONS;
