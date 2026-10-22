import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ListingCardHorizontal } from '../ListingCardHorizontal';
import { Listing } from '@/types';

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: true,
    setSelectedListingId: vi.fn(),
    navigateTo: vi.fn(),
  }),
}));

const mockListing: Listing = {
  id: '123',
  title: 'Toyota Camry 2022',
  description: 'Clean car',
  price: '15000',
  currency: 'JOD',
  categorySlug: 'motors',
  subcategorySlug: 'cars',
  city: 'Amman',
  neighborhood: 'Abdoun',
  countryCode: 'JO',
  imageUrl: 'https://example.com/car.jpg',
  images: ['https://example.com/car.jpg'],
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  views: 10,
  attributes: [
    { key: 'color', label: 'اللون', value: 'أبيض' },
  ],
  sellerName: 'John Doe',
  sellerPhone: '123456789',
};

describe('ListingCardHorizontal', () => {
  it('renders relative date and location', () => {
    render(
      <ListingCardHorizontal
        listing={mockListing}
        isArabic={true}
        locationText="عمان"
        displayCurrency="JOD"
        premiumClasses=""
        sellerKey="123456789"
        handleClick={() => {}}
        handleImageError={() => {}}
      />
    );

    expect(screen.getByText('عمان')).toBeInTheDocument();
    expect(screen.getByText('منذ ساعتين')).toBeInTheDocument();
  });
});
