import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchListings } from '../listingsService';
import { supabase } from '@/shared/lib/supabase';

vi.mock('@/shared/lib/supabase', () => ({
  supabase: { from: vi.fn() },
}));

const FORBIDDEN_COLUMNS = ['seller_phone', 'bumps_today', 'bumps_reset_date', 'auto_bump_active', 'auto_bump_expires_at'];

function assertSafeColumns(columns: string) {
  expect(columns).toContain('is_premium');
  expect(columns).toContain('premium_expires_at');
  for (const col of FORBIDDEN_COLUMNS) {
    expect(columns).not.toContain(col);
  }
}

describe('listingsService fetchListings column privacy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('selects only safe public columns, excluding seller_phone and internal bump fields', async () => {
    const range = vi.fn().mockResolvedValue({ data: [], error: null });
    const order = vi.fn(() => ({ range }));
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ select });

    await fetchListings();

    expect(select).toHaveBeenCalled();
    const columns = (select.mock.calls[0] as unknown as [string])[0];
    assertSafeColumns(columns);
    expect(columns).toContain('id');
    expect(columns).toContain('seller_name');
  });
});
