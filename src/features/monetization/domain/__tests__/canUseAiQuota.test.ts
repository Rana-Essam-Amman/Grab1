import { describe, it, expect } from 'vitest';
import { canUseAiQuota } from '../rules/canUseAiQuota';

describe('canUseAiQuota', () => {
  it('allows use when quota has remaining credits', () => {
    const r = canUseAiQuota({ dailyLimit: 5, usedToday: 2, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(3);
  });

  it('blocks when quota is exhausted', () => {
    const r = canUseAiQuota({ dailyLimit: 5, usedToday: 5, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('quota-exhausted');
    expect(r.remaining).toBe(0);
  });

  it('blocks when quota is over-consumed', () => {
    const r = canUseAiQuota({ dailyLimit: 5, usedToday: 7, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('quota-exhausted');
    expect(r.remaining).toBe(0);
  });

  it('rejects invalid daily limit', () => {
    const r = canUseAiQuota({ dailyLimit: 0, usedToday: 0, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('invalid-quota');
  });

  it('rejects negative used count', () => {
    const r = canUseAiQuota({ dailyLimit: 5, usedToday: -1, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('invalid-quota');
  });

  it('calculates remaining correctly for fresh quota', () => {
    const r = canUseAiQuota({ dailyLimit: 5, usedToday: 0, lastResetAt: '2026-09-16' });
    expect(r.allowed).toBe(true);
    expect(r.remaining).toBe(5);
  });
});
