import type { UserProfile, Conversation, PostDraft } from '@/types';

export function createMockConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 'test-conv-' + Math.random().toString(36).slice(2, 8),
    listingId: 'test-listing-1',
    title: 'Test Listing Conversation',
    imageUrl: '/test.jpg',
    sellerPhone: '+962791234567',
    messages: [
      {
        id: 'msg-1',
        text: 'Hello, is this still available?',
        fromBuyer: true,
        timestamp: '2026-01-01T10:00:00Z',
      },
    ],
    ...overrides,
  };
}

export function createMockDraft(overrides: Partial<PostDraft> = {}): PostDraft {
  return {
    categorySlug: 'motors',
    subcategorySlug: 'cars',
    photos: ['data:image/jpeg;base64,/9j/4AAQSkZJRg=='],
    city: 'Amman',
    neighborhood: 'Abdoun',
    site: 'catch-deals',
    noteText: 'Draft notes here',
    generated: {
      title: 'Mercedes Benz C200 2022',
      description: 'Excellent condition, low mileage',
      price: '35000',
      categorySlug: 'motors',
      subcategorySlug: 'cars',
      city: 'Amman',
      year: '2022',
      make: 'Mercedes',
      missing: [],
    },
    ...overrides,
  };
}

export function createMockSession(overrides: Partial<UserProfile> = {}) {
  const user: UserProfile = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+962791234567',
    countryCode: 'JO',
    ...overrides,
  };
  const token = 'mock-jwt-token-' + Math.random().toString(36).slice(2, 8);
  return { user, token };
}
