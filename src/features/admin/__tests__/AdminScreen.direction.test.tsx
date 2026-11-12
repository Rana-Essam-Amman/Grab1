import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminScreen } from '../AdminScreen';
import { useUI } from '@/hooks/useUI';

vi.mock('@/hooks/useUI', () => ({ useUI: vi.fn() }));
vi.mock('@/shared/lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { user: { email: 'sufyanyounis83@gmail.com' } } } }) } },
}));
vi.mock('../useAdmin', () => ({
  useAdmin: () => ({
    market: 'JO',
    setMarket: vi.fn(),
    dashboard: null,
    loading: false,
    error: null,
    actionLoading: false,
    refresh: vi.fn(),
  }),
}));
vi.mock('../AdminOverview', () => ({ AdminOverview: () => null }));
vi.mock('../AdminTabs', () => ({ AdminTabs: () => null }));

describe('AdminScreen direction', () => {
  beforeEach(() => {
    (useUI as ReturnType<typeof vi.fn>).mockReturnValue({
      navigateTo: vi.fn(),
      goBack: vi.fn(),
      isArabic: false,
    });
  });

  it('sets dir=ltr when English', async () => {
    (useUI as ReturnType<typeof vi.fn>).mockReturnValue({
      navigateTo: vi.fn(),
      goBack: vi.fn(),
      isArabic: false,
    });
    const { container } = render(<AdminScreen />);
    // Wait for auth check
    await screen.findByText('لوحة التحكم');
    expect(container.firstElementChild?.getAttribute('dir')).toBe('ltr');
  });

  it('sets dir=rtl when Arabic', async () => {
    (useUI as ReturnType<typeof vi.fn>).mockReturnValue({
      navigateTo: vi.fn(),
      goBack: vi.fn(),
      isArabic: true,
    });
    const { container } = render(<AdminScreen />);
    await screen.findByText('لوحة التحكم');
    expect(container.firstElementChild?.getAttribute('dir')).toBe('rtl');
  });
});
