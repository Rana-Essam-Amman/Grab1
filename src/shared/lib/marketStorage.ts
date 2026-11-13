import type { MarketCode } from './marketGate';
import type { ZodSchema } from 'zod';
import { readValidated, writeValidated, removeStored } from './safeStorage';

const PREFIX = 'catch';

function resolveKey(key: string, market?: MarketCode): string {
  if (market) {
    const marketPrefix = `${PREFIX}_${market}_`;
    if (key.startsWith(marketPrefix)) return key;
    return `${marketPrefix}${key}`;
  }
  if (key.startsWith(`${PREFIX}_`) || key.startsWith('ctd_')) return key;
  return `${PREFIX}_${key}`;
}

function createRawStore(market?: MarketCode) {
  return {
    get<T>(key: string): T | null {
      try {
        const raw = localStorage.getItem(resolveKey(key, market));
        if (raw === null || raw === undefined) return null;
        try {
          return JSON.parse(raw) as T;
        } catch {
          return raw as unknown as T;
        }
      } catch {
        return null;
      }
    },
    set<T>(key: string, value: T): void {
      try {
        const val = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(resolveKey(key, market), val);
      } catch {}
    },
    remove(key: string): void {
      localStorage.removeItem(resolveKey(key, market));
    },
  };
}

export function marketStorage(market: MarketCode) {
  const raw = createRawStore(market);
  return {
    ...raw,
    readValidated<T>(key: string, schema: ZodSchema<T>, fallback: T): T {
      return readValidated(resolveKey(key, market), schema, fallback);
    },
    writeValidated<T>(key: string, schema: ZodSchema<T>, value: T): boolean {
      return writeValidated(resolveKey(key, market), schema, value, { cleanupOnQuota: false });
    },
    removeValidated(key: string): boolean {
      return removeStored(resolveKey(key, market));
    },
  };
}

export function globalStorage() {
  return createRawStore();
}
