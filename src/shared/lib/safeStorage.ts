import { ZodSchema } from 'zod';

// NOTE (Rule 11 exception): This module reads/writes RAW localStorage
// WITHOUT a market prefix. This is intentional for AUTH data only —
// a user is the same across all markets (JO/LB/PS/SY/SA).
// All market-scoped data MUST use marketStorage() instead.

/**
 * Safely reads and validates data from localStorage using a Zod schema.
 * If reading or validation fails, logs a warning in dev mode and returns fallback.
 */
export function readValidated<T>(key: string, schema: ZodSchema<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsedJson = JSON.parse(raw);
    const result = schema.safeParse(parsedJson);

    if (result.success) {
      return result.data;
    }

    if (import.meta.env?.DEV) {
      console.warn(`[safeStorage] Validation failed for key "${key}":`, result.error);
    }
    return fallback;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(`[safeStorage] Failed to read/parse key "${key}":`, error);
    }
    return fallback;
  }
}

/**
 * Safely validates and writes data to localStorage using a Zod schema.
 * If validation fails, logs an error in dev mode and skips writing.
 */
export function writeValidated<T>(key: string, schema: ZodSchema<T>, value: T): void {
  try {
    const result = schema.safeParse(value);
    if (!result.success) {
      if (import.meta.env?.DEV) {
        console.error(`[safeStorage] Validation failed before writing key "${key}":`, result.error);
      }
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(result.data));
    } catch (quotaError: unknown) {
      const error = quotaError as Error & { code?: number };
      if (error?.name === 'QuotaExceededError' || error?.code === 22) {
        console.warn('[safeStorage] Quota exceeded for ' + key + '. Attempting cleanup.');
        // Attempt to clear stale data
        try {
          localStorage.removeItem('chat_conversations'); // Clear non-critical high-volume keys
          localStorage.setItem(key, JSON.stringify(result.data));
        } catch {
          console.error('[safeStorage] Quota still exceeded. Data not saved.');
        }
      } else {
        throw quotaError;
      }
    }
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error(`[safeStorage] Failed to write key "${key}":`, error);
    }
  }
}

/**
 * Safely removes a key from localStorage.
 */
export function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error(`[safeStorage] Failed to remove key "${key}":`, error);
    }
  }
}
