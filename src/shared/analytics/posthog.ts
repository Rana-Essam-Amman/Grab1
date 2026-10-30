import type { PostHog } from 'posthog-js';

let posthogInstance: PostHog | null = null;
let isInitialized = false;
const eventQueue: Array<{ name: string; props?: Record<string, string | number | boolean | null | undefined> }> = [];
const MAX_QUEUE_SIZE = 100;

export async function initPosthog(): Promise<void> {
  if (isInitialized) return;
  try {
    const mod = await import('posthog-js');
    const posthog = mod.default;
    const key = import.meta.env.VITE_POSTHOG_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

    if (!key || typeof key !== 'string' || key.trim() === '') {
      isInitialized = true;
      return;
    }

    posthog.init(key, {
      api_host: host,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      persistence: 'localStorage',
      person_profiles: 'identified_only',
      mask_all_text: true,
      mask_all_element_attributes: true,
    });
    posthogInstance = posthog;
    isInitialized = true;

    for (const event of eventQueue) {
      try { posthog.capture(event.name, event.props); } catch {}
    }
    eventQueue.length = 0;
  } catch (error) {
    console.warn('[PostHog] Failed to initialize:', error);
    eventQueue.length = 0;
    isInitialized = true;
  }
}

export function capture(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (!isInitialized) {
    if (eventQueue.length < MAX_QUEUE_SIZE) {
      eventQueue.push({ name: eventName, props: properties });
    }
    return;
  }
  if (!posthogInstance) return;
  try {
    posthogInstance.capture(eventName, properties);
  } catch (error) {
    console.warn('[PostHog] Failed to capture event:', eventName, error);
  }
}
