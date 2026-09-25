import * as Sentry from '@sentry/react';
import { SENTRY_CONFIG, isSentryEnabled } from './sentry.config';

/**
 * Initialize Sentry observability.
 * Safe to call in dev — runs in no-op mode if DSN is missing.
 */
export function initSentry(): void {
  if (!isSentryEnabled()) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] Disabled — no VITE_SENTRY_DSN set.');
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
    replaysSessionSampleRate: SENTRY_CONFIG.replaysSessionSampleRate,
    replaysOnErrorSampleRate: SENTRY_CONFIG.replaysOnErrorSampleRate,
  });
}

export { Sentry };
