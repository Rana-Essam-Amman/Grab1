import { describe, it, expect, beforeEach } from 'vitest';
import { migrateDraftsToMarket } from '../draftsMigration';
import { scopedKey } from '@/data/markets/storage';

describe('Drafts migration — global → market-scoped', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('no-op when no legacy data exists', () => {
    const r = migrateDraftsToMarket('JO');
    expect(r.migrated).toBe(false);
    expect(r.reason).toBe('no-legacy-data');
    expect(localStorage.getItem('catch_post_draft_v1')).toBeNull();
  });

  it('migrates legacy draft to scoped key', () => {
    const draft = JSON.stringify({ categorySlug: 'motors', noteText: 'test' });
    localStorage.setItem('catch_post_draft_v1', draft);

    const r = migrateDraftsToMarket('JO');
    expect(r.migrated).toBe(true);
    expect(r.market).toBe('JO');
    expect(localStorage.getItem(scopedKey('JO', 'post_draft_v1'))).toBe(draft);
    expect(localStorage.getItem('catch_post_draft_v1')).toBeNull();
  });

  it('does not migrate to LB if already migrated to JO', () => {
    localStorage.setItem('catch_post_draft_v1', '{"x":1}');
    migrateDraftsToMarket('JO');

    // Now try LB — no legacy left, so LB should be no-op.
    const r = migrateDraftsToMarket('LB');
    expect(r.migrated).toBe(false);
    expect(localStorage.getItem(scopedKey('LB', 'post_draft_v1'))).toBeNull();
  });

  it('rejects invalid market codes', () => {
    localStorage.setItem('catch_post_draft_v1', '{"x":1}');
    const r = migrateDraftsToMarket('XX');
    expect(r.migrated).toBe(false);
    expect(r.reason).toBe('invalid-market');
    // Legacy must remain untouched.
    expect(localStorage.getItem('catch_post_draft_v1')).toBe('{"x":1}');
  });

  it('rejects undefined / null market', () => {
    localStorage.setItem('catch_post_draft_v1', '{"x":1}');
    expect(migrateDraftsToMarket(undefined).reason).toBe('invalid-market');
    expect(migrateDraftsToMarket(null).reason).toBe('invalid-market');
  });

  it('is idempotent — second run is no-op', () => {
    localStorage.setItem('catch_post_draft_v1', '{"x":1}');
    migrateDraftsToMarket('JO');
    const r2 = migrateDraftsToMarket('JO');
    expect(r2.migrated).toBe(false);
    expect(r2.reason).toBe('already-migrated');
  });

  it('preserves draft content exactly (byte-for-byte)', () => {
    const draft = '{"categorySlug":"motors","photos":["a","b"],"noteText":"كامري 2020"}';
    localStorage.setItem('catch_post_draft_v1', draft);
    migrateDraftsToMarket('SA');
    expect(localStorage.getItem(scopedKey('SA', 'post_draft_v1'))).toBe(draft);
  });
});
