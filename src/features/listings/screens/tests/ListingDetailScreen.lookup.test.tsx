import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ListingDetailScreen } from '../ListingDetailScreen';
import { useListingDetail } from '../../hooks/useListingDetail';
import type { Listing } from '@/types';

vi.mock('../../hooks/useListingDetail', () => ({ useListingDetail: vi.fn() }));
vi.mock('@/hooks/useIsAdmin', () => ({ useIsAdmin: () => ({ isAdmin: false }) }));
vi.mock('@/shared/hooks/useSEO', () => ({ useSEO: vi.fn() }));
vi.mock('@/shared/analytics/posthog', () => ({ capture: vi.fn() }));
vi.mock('@/shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'listings.loadErrorTitle': 'Could not load listing',
        'listings.loadErrorDescription': 'Please try again later.',
        'listings.goBack': 'Go back',
      };
      return map[key] || key;
    },
    locale: 'en',
    isLoaded: true,
  }),
}));
vi.mock('../../components/ListingDetailHeader', () => ({ ListingDetailHeader: () => <div>header</div> }));
vi.mock('../../components/ListingAntiFraudBanner', () => ({ ListingAntiFraudBanner: () => null }));
vi.mock('../../components/ListingImageSlider', () => ({ ListingImageSlider: () => null }));
vi.mock('../../components/ListingMainInfo', () => ({ ListingMainInfo: ({ title }: { title: string }) => <h1>{title}</h1> }));
vi.mock('../../components/ListingSellerCard', () => ({ ListingSellerCard: () => null }));
vi.mock('../../components/ListingRateSellerButton', () => ({ ListingRateSellerButton: () => null }));
vi.mock('../../components/ListingAttributesCard', () => ({ ListingAttributesCard: () => null }));
vi.mock('../../components/ListingDescriptionCard', () => ({ ListingDescriptionCard: () => null }));
vi.mock('../../components/ListingLocationCard', () => ({ ListingLocationCard: () => null }));
vi.mock('../../components/ListingActionBar', () => ({ ListingActionBar: () => null }));
vi.mock('../../components/WhatsAppIntentSheet', () => ({ WhatsAppIntentSheet: () => null }));
vi.mock('../../components/DeleteConfirmDialog', () => ({ DeleteConfirmDialog: () => null }));
vi.mock('@/shared/components', () => ({ ShareModal: () => null, ReportModal: () => null, ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/shared/components/ListingIdBadge', () => ({ ListingIdBadge: () => null }));

const listing: Listing = {
  id: 'item-1',
  title: 'Visible listing',
  description: 'desc',
  price: '100',
  currency: 'JOD',
  countryCode: 'JO',
  city: 'Amman',
  neighborhood: 'Khalda',
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  imageUrl: '/assets/listings/car.jpg',
  images: ['/assets/listings/car.jpg'],
  sellerPhone: '',
  sellerName: 'Sam',
  createdAt: '2026-01-01T00:00:00.000Z',
  views: 0,
  attributes: [],
  status: 'active',
};

function mockDetail(overrides: Record<string, unknown>) {
  (useListingDetail as ReturnType<typeof vi.fn>).mockReturnValue({
    listing: null,
    lookupStatus: 'idle',
    isArabic: false,
    goBack: vi.fn(),
    isCountryMismatch: false,
    isAuthenticated: false,
    isOwner: false,
    locationText: '',
    mapQuery: '',
    mapUrl: '',
    displayCurrency: 'JOD',
    images: [],
    activePhotoIdx: 0,
    setActivePhotoIdx: vi.fn(),
    showShare: false,
    setShowShare: vi.fn(),
    showReport: false,
    setShowReport: vi.fn(),
    showWhatsAppSheet: false,
    setShowWhatsAppSheet: vi.fn(),
    handleStartChat: vi.fn(),
    handleCall: vi.fn(),
    handleWhatsApp: vi.fn(),
    handleWhatsAppClick: vi.fn(),
    handleWhatsAppIntent: vi.fn(),
    handleDelete: vi.fn(),
    handleEdit: vi.fn(),
    handleSelectSeller: vi.fn(),
    isDeleting: false,
    isRevealingPhone: false,
    navigateTo: vi.fn(),
    ...overrides,
  });
}

describe('ListingDetailScreen lookup states', () => {
  it('does not show ListingNotFound while the remote lookup is pending', () => {
    mockDetail({ listing: null, lookupStatus: 'loading' });
    render(<ListingDetailScreen />);
    expect(screen.queryByText(/Listing not found/i)).toBeNull();
    expect(screen.queryByRole('status')).toBeTruthy();
  });

  it('shows ListingNotFound only after a confirmed missing lookup', () => {
    mockDetail({ listing: null, lookupStatus: 'not_found' });
    render(<ListingDetailScreen />);
    expect(screen.getByText(/Listing not found or removed/i)).toBeTruthy();
  });

  it('shows an error state, not not-found, when the remote request fails', () => {
    mockDetail({ listing: null, lookupStatus: 'error' });
    render(<ListingDetailScreen />);
    expect(screen.queryByText(/Listing not found/i)).toBeNull();
    expect(screen.getByText(/Could not load listing/i)).toBeTruthy();
  });

  it('renders a locally available listing without a not-found state', () => {
    mockDetail({ listing, lookupStatus: 'found' });
    render(<ListingDetailScreen />);
    expect(screen.queryByText(/Listing not found/i)).toBeNull();
    expect(screen.getByText('Visible listing')).toBeTruthy();
  });
});
