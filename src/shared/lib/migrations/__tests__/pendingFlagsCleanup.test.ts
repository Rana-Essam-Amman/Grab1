import { describe, it, expect, beforeEach } from 'vitest';
import { cleanupLegacyPendingFlags } from '../pendingFlagsCleanup';

describe('Pending flags cleanup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('no-op when no legacy keys exist', () => {
    const r = cleanupLegacyPendingFlags();
    expect(r.cleaned).toBe(true);
    expect(r.removedKeys).toEqual([]);
  });

  it('removes all three legacy keys', () => {
    localStorage.setItem('catch_pending_post_entry', 'true');
    localStorage.setItem('catch_pending_publish', 'true');
    localStorage.setItem('catch_pending_publish_screen', 'post-details');

    const r = cleanupLegacyPendingFlags();
    expect(r.removedKeys.length).toBe(3);
    expect(localStorage.getItem('catch_pending_post_entry')).toBeNull();
    expect(localStorage.getItem('catch_pending_publish')).toBeNull();
    expect(localStorage.getItem('catch_pending_publish_screen')).toBeNull();
  });

  it('removes partial legacy keys', () => {
    localStorage.setItem('catch_pending_publish', 'true');
    const r = cleanupLegacyPendingFlags();
    expect(r.removedKeys).toEqual(['catch_pending_publish']);
  });

  it('is idempotent', () => {
    localStorage.setItem('catch_pending_post_entry', 'true');
    cleanupLegacyPendingFlags();
    const r2 = cleanupLegacyPendingFlags();
    expect(r2.cleaned).toBe(false);
    expect(r2.removedKeys).toEqual([]);
  });

  it('does not touch market-scoped variants', () => {
    localStorage.setItem('catch_JO_pending_publish', 'true');
    localStorage.setItem('catch_pending_publish', 'true');
    cleanupLegacyPendingFlags();
    expect(localStorage.getItem('catch_JO_pending_publish')).toBe('true');
  });
});
