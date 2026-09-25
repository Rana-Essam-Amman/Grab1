import { describe, it, expect, beforeEach } from 'vitest';
import { marketStorage, globalStorage } from '../marketStorage';

describe('marketStorage & globalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('marketStorage', () => {
    it('prefixes keys with catch_{market}_ correctly', () => {
      const storage = marketStorage('JO');
      storage.set('draft', { title: 'Car' });

      expect(localStorage.getItem('catch_JO_draft')).toBe(JSON.stringify({ title: 'Car' }));
      expect(storage.get('draft')).toEqual({ title: 'Car' });
    });

    it('handles already prefixed keys without double prefixing', () => {
      const storage = marketStorage('JO');
      storage.set('catch_JO_custom', 'hello');

      expect(localStorage.getItem('catch_JO_custom')).toBe('hello');
      expect(storage.get('catch_JO_custom')).toBe('hello');
    });

    it('returns raw string when JSON.parse fails', () => {
      localStorage.setItem('catch_SA_simple', 'plain-string');
      const storage = marketStorage('SA');
      expect(storage.get('simple')).toBe('plain-string');
    });

    it('returns null when item is missing', () => {
      const storage = marketStorage('LB');
      expect(storage.get('missing')).toBeNull();
    });

    it('removes items cleanly', () => {
      const storage = marketStorage('PS');
      storage.set('favs', [1, 2]);
      expect(storage.get('favs')).toEqual([1, 2]);

      storage.remove('favs');
      expect(storage.get('favs')).toBeNull();
      expect(localStorage.getItem('catch_PS_favs')).toBeNull();
    });
  });

  describe('globalStorage', () => {
    it('prefixes global keys with catch_ correctly', () => {
      const storage = globalStorage();
      storage.set('user_pref', { theme: 'dark' });

      expect(localStorage.getItem('catch_user_pref')).toBe(JSON.stringify({ theme: 'dark' }));
      expect(storage.get('user_pref')).toEqual({ theme: 'dark' });
    });

    it('handles keys that already start with catch_ or ctd_', () => {
      const storage = globalStorage();
      storage.set('catch_browse_country', 'JO');
      storage.set('ctd_daily_ai_credits', 5);

      expect(localStorage.getItem('catch_browse_country')).toBe('JO');
      expect(localStorage.getItem('ctd_daily_ai_credits')).toBe('5');
      expect(storage.get('catch_browse_country')).toBe('JO');
      expect(storage.get('ctd_daily_ai_credits')).toBe(5);
    });

    it('returns raw string when not JSON', () => {
      localStorage.setItem('catch_raw_key', 'plain_value');
      const storage = globalStorage();
      expect(storage.get('raw_key')).toBe('plain_value');
    });

    it('returns null for nonexistent keys', () => {
      const storage = globalStorage();
      expect(storage.get('nonexistent')).toBeNull();
    });

    it('removes keys correctly', () => {
      const storage = globalStorage();
      storage.set('session', 'active');
      expect(storage.get('session')).toBe('active');

      storage.remove('session');
      expect(storage.get('session')).toBeNull();
      expect(localStorage.getItem('catch_session')).toBeNull();
    });
  });
});
