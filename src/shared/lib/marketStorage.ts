import type { MarketCode } from './marketGate';

const PREFIX = 'catch';

function resolveKey(key: string, market?: MarketCode): string {
  if (market) {
    const marketPrefix = `${PREFIX}_${market}_`;
    if (key.startsWith(marketPrefix)) return key;
    return `${marketPrefix}${key}`;
  }
  if (key.startsWith(`${PREFIX}_`) || key.startsWith('ctd_')) {
    return key;
  }
  return `${PREFIX}_${key}`;
}

export function marketStorage(market: MarketCode) {
  return {
    get<T>(key: string): T | null {
      try {
        const fullKey = resolveKey(key, market);
        const raw = localStorage.getItem(fullKey);
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
        const fullKey = resolveKey(key, market);
        const val = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(fullKey, val);
      } catch {}
    },
    remove(key: string): void {
      const fullKey = resolveKey(key, market);
      localStorage.removeItem(fullKey);
    },
  };
}

// Global (non-market-scoped) storage for auth, locale, session, crash logs, etc.
export function globalStorage() {
  return {
    get<T>(key: string): T | null {
      try {
        const fullKey = resolveKey(key);
        const raw = localStorage.getItem(fullKey);
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
        const fullKey = resolveKey(key);
        const val = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(fullKey, val);
      } catch {}
    },
    remove(key: string): void {
      const fullKey = resolveKey(key);
      localStorage.removeItem(fullKey);
    },
  };
}

