/**
 * Design Tokens 2.0 — TypeScript access
 * Mirrors src/styles/tokens.css for use in JS/TS contexts.
 */

export const tokens = {
  color: {
    brand: 'var(--color-brand)',
    brandSoft: 'var(--color-brand-soft)',
    brandStrong: 'var(--color-brand-strong)',
    accent: 'var(--color-accent)',
    accentSoft: 'var(--color-accent-soft)',
    accentStrong: 'var(--color-accent-strong)',
    canvas: 'var(--color-canvas)',
    surface: 'var(--color-surface)',
    surfaceElevated: 'var(--color-surface-elevated)',
    surfaceSunken: 'var(--color-surface-sunken)',
    ink: 'var(--color-ink)',
    inkSoft: 'var(--color-ink-soft)',
    inkMuted: 'var(--color-ink-muted)',
    inkInverse: 'var(--color-ink-inverse)',
    line: 'var(--color-line)',
    lineStrong: 'var(--color-line-strong)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    info: 'var(--color-info)',
  },
  radius: {
    xs: 'var(--radius-xs)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    full: 'var(--radius-full)',
  },
  shadow: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  duration: {
    fast: 'var(--duration-fast)',
    base: 'var(--duration-base)',
    slow: 'var(--duration-slow)',
  },
} as const;

export type DesignTokens = typeof tokens;
