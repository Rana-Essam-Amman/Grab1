import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockMaybeSingle = vi.fn();
const mockEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockUpsert = vi.fn(() => ({ select: mockSelect }));

vi.mock('../supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

import { fetchProfile, upsertProfile, savePhone } from '../profilesService';

describe('profilesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-attach the chain — this is what the previous version was missing.
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
    // For upsert path:
    mockFrom.mockImplementation(() => ({ upsert: mockUpsert } as never));
  });

  describe('fetchProfile', () => {
    it('returns null for empty userId', async () => {
      const r = await fetchProfile('');
      expect(r).toBeNull();
      expect(mockFrom).not.toHaveBeenCalled();
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
      mockMaybeSingle.mockResolvedValue({ data: fakeProfile, error: null });
      // Force the select chain (not upsert) for this test:
      mockFrom.mockReturnValue({ select: mockSelect });

      const r = await fetchProfile('u1');
      expect(r).toEqual(fakeProfile);
      expect(mockFrom).toHaveBeenCalledWith('profiles');
    });

    it('returns null when Supabase returns an error', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: null,
        error: { message: 'oops' },
      });
      mockFrom.mockReturnValue({ select: mockSelect });

      const r = await fetchProfile('u1');
      expect(r).toBeNull();
    });
  });

  describe('upsertProfile', () => {
    it('returns null for empty userId', async () => {
      const r = await upsertProfile('', { phone: '+962790000000' });
      expect(r).toBeNull();
    });

    it('calls upsert with onConflict id', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: { id: 'u1', phone: '+962790000000' },
        error: null,
      });
      mockUpsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ maybeSingle: mockMaybeSingle } as never);
      mockFrom.mockReturnValue({ upsert: mockUpsert } as never);

      const r = await upsertProfile('u1', { phone: '+962790000000' });
      expect(mockUpsert).toHaveBeenCalledWith(
        { id: 'u1', phone: '+962790000000' },
        { onConflict: 'id' }
      );
      expect(r).toEqual({ id: 'u1', phone: '+962790000000' });
    });
  });

  describe('savePhone', () => {
    it('returns null for empty string', async () => {
      const r = await savePhone('u1', '   ');
      expect(r).toBeNull();
    });

    it('trims and forwards to upsertProfile', async () => {
      mockMaybeSingle.mockResolvedValue({
        data: { id: 'u1', phone: '+962790000000' },
        error: null,
      });
      mockUpsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ maybeSingle: mockMaybeSingle } as never);
      mockFrom.mockReturnValue({ upsert: mockUpsert } as never);

      const r = await savePhone('u1', '  +962790000000  ');
      expect(mockUpsert).toHaveBeenCalled();
      expect(r).toEqual({ id: 'u1', phone: '+962790000000' });
    });
  });
});
