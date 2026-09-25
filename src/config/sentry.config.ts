/**
 * Sentry Observability Configuration
 * 
 * DSN is provided via environment variable VITE_SENTRY_DSN.
 * If not set, Sentry runs in no-op mode (no events sent).
 */

export const SENTRY_CONFIG = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE || 'development',
  enabled: Boolean(import.meta.env.VITE_SENTRY_DSN),
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
} as const;

export const isSentryEnabled = (): boolean => SENTRY_CONFIG.enabled;
