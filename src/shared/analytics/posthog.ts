import posthog from 'posthog-js';

let isInitialized = false;

export function initPosthog(): void {
  if (isInitialized) return;

  const key = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

  console.log('[PostHog Debug] Initialization triggered.');
  console.log('[PostHog Debug] Env check:', {
    hasKey: Boolean(key),
    keyPrefix: key ? key.substring(0, 4) : 'MISSING',
    host: host,
    mode: import.meta.env.MODE,
  });

  if (!key || typeof key !== 'string' || key.trim() === '') {
    isInitialized = true;
    return;
  }

  try {
    posthog.init(key, {
      api_host: host,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: 'localStorage',
      person_profiles: 'identified_only',
      mask_all_text: true,
      mask_all_element_attributes: true,
      loaded: () => { isInitialized = true; },
    });
    isInitialized = true;
  } catch (error) {
    console.warn('[PostHog] Failed to initialize:', error);
    isInitialized = true;
  }
}

export function capture(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (!isInitialized) return;
  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    console.warn('[PostHog] Failed to capture event:', eventName, error);
  }
}
