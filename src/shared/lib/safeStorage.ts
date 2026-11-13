import { ZodSchema } from 'zod';
import { persist } from './safeStorage.persist';

// NOTE (Rule 11 — as-built):
// This module reads/writes RAW localStorage WITHOUT a market prefix.
// Market-scoped callers must prefix the key first (see marketStorage).
// LocalStorageDraftAdapter is a current marketStorage consumer.

export interface WriteValidatedOptions {
  readonly cleanupOnQuota?: boolean;
}

/**
 * Safely reads and validates data from localStorage using a Zod schema.
 * If reading or validation fails, logs a warning in dev mode and returns fallback.
 */
export function readValidated<T>(key: string, schema: ZodSchema<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsedJson = JSON.parse(raw);
    const result = schema.safeParse(parsedJson);
    if (result.success) return result.data;
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
 * Validates and writes data. Returns true only when the value is persisted.
 * cleanupOnQuota defaults to true. Market-scoped callers must disable it.
 */
export function writeValidated<T>(key: string, schema: ZodSchema<T>, value: T, options?: WriteValidatedOptions): boolean {
  try {
    const result = schema.safeParse(value);
    if (!result.success) {
      if (import.meta.env?.DEV) {
        console.error(`[safeStorage] Validation failed before writing key "${key}":`, result.error);
      }
      return false;
    }
    return persist(key, JSON.stringify(result.data), options?.cleanupOnQuota !== false);
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error(`[safeStorage] Failed to write key "${key}":`, error);
    }
    return false;
  }
}

/** Removes a key. Returns true when removal did not throw. */
export function removeStored(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error(`[safeStorage] Failed to remove key "${key}":`, error);
    }
    return false;
  }
}
