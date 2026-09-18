import type { Listing, UserProfile } from '@/types';

export {
  createMockConversation,
  createMockDraft,
  createMockSession,
} from './mockSessionDraft';

export function createMockListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 'test-listing-' + Math.random().toString(36).slice(2, 8),
    title: 'Test Listing',
    description: 'Test description',
    price: '100',
    currency: 'JOD',
    countryCode: 'JO',
    city: 'Amman',
    neighborhood: 'Abdoun',
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    imageUrl: '/test.jpg',
    images: ['/test.jpg'],
    sellerPhone: '+962791234567',
    sellerName: 'Test Seller',
    createdAt: '2026-01-01',
    views: 0,
    attributes: [],
    ...overrides,
  };
}

export function createMockUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+962791234567',
    countryCode: 'JO',
    ...overrides,
  };
}

export function createMockListings(count: number, overrides: Partial<Listing> = {}): Listing[] {
  return Array.from({ length: count }, (_, i) =>
    createMockListing({ id: `test-${i}`, title: `Listing ${i}`, ...overrides })
  );
}
