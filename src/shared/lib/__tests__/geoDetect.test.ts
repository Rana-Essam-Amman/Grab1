import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectCountry } from '../geoDetect';

describe('geoDetect', () => {
  const originalFetch = global.fetch;
  const originalIntl = Intl.DateTimeFormat;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Intl.DateTimeFormat = originalIntl;
  });

  it('returns IP country when /api/geo responds with a supported code', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ country: 'SA', source: 'ip' }),
    }) as unknown as typeof fetch;

    const r = await detectCountry();
    expect(r.country).toBe('SA');
    expect(r.source).toBe('ip');
  });

  it('falls back to timezone when IP is null', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ country: null, source: 'ip' }),
    }) as unknown as typeof fetch;

    const spy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: 'Asia/Beirut' }) } as unknown as Intl.DateTimeFormat)
    );

    const r = await detectCountry();
    expect(r.country).toBe('LB');
    expect(r.source).toBe('timezone');
    spy.mockRestore();
  });

  it('falls back to JO when nothing matches', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    const spy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: 'UTC' }) } as unknown as Intl.DateTimeFormat)
    );

    const r = await detectCountry();
    expect(r.country).toBe('JO');
    expect(['language', 'fallback']).toContain(r.source);
    spy.mockRestore();
  });
});
