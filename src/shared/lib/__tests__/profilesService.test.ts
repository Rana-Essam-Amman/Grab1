import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase module BEFORE importing profilesService
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { fetchProfile, upsertProfile, savePhone } from '../profilesService';
import { supabase } from '../supabase';

describe('profilesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProfile', () => {
    it('returns null for empty userId', async () => {
      const r = await fetchProfile('');
      expect(r).toBeNull();
    });

    it('returns the profile when Supabase returns data', async () => {
      const fakeProfile = {
        id: 'u1',
        first_name: 'Ali',
        last_name: 'Saeed',
        phone: '+962790000000',
        avatar_url: null,
        country_code: 'JO',
      };
      const maybeSingle = vi.fn().mockResolvedValue({ data: fakeProfile, error: null });
      const eq = vi.fn(() => ({ maybeSingle }));
      const select = vi.fn(() => ({ eq }));
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ select });

      const r = await fetchProfile('u1');
      expect(r).toEqual(fakeProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('returns null when Supabase returns an error', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'oops' } });
      const eq = vi.fn(() => ({ maybeSingle }));
      const select = vi.fn(() => ({ eq }));
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ select });

      const r = await fetchProfile('u1');
      expect(r).toBeNull();
    });
  });

  describe('upsertProfile', () => {
    it('calls upsert with onConflict id', async () => {
      const maybeSingle = vi.fn().mockResolvedValue({
        data: { id: 'u1', phone: '+962790000000' },
        error: null,
      });
      const select = vi.fn(() => ({ maybeSingle }));
      const upsert = vi.fn(() => ({ select }));
      (supabase.from as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ upsert });

      const r = await upsertProfile('u1', { phone: '+962790000000' });
      expect(upsert).toHaveBeenCalledWith(
        { id: 'u1', phone: '+962790000000' },
        { onConflict: 'id' }
      );
      expect(r).toEqual({ id: 'u1', phone: '+962790000000' });
    });

    it('returns null for empty userId', async () => {
      const r = await upsertProfile('', { phone: '+962790000000' });
      expect(r).toBeNull();
    });
  });

  describe('savePhone', () => {
    it('trims and skips empty', async () => {
      const r = await savePhone('u1', '   ');
      expect(r).toBeNull();
    });
  });
});
