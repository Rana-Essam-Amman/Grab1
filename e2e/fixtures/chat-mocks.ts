import type { Page } from '@playwright/test';

const FIXED_USER_ID = 'e2e00000-0000-0000-0000-000000000001';
const OTHER_USER_ID = 'e2e00000-0000-0000-0000-000000000002';
const LISTING_ID = 'e2e00000-0000-0000-0000-000000000003';
const CONVERSATION_ID = 'e2e00000-0000-0000-0000-000000000004';

const ISO = new Date('2026-01-01T00:00:00Z').toISOString();

const CONVERSATION_ROW = {
  id: CONVERSATION_ID,
  listing_id: LISTING_ID,
  buyer_id: FIXED_USER_ID,
  seller_id: OTHER_USER_ID,
  market_code: 'JO',
  created_at: ISO,
  updated_at: ISO,
};

const LISTING_ROW = {
  id: LISTING_ID,
  user_id: OTHER_USER_ID,
  title: 'E2E Test Listing',
  description: 'Listing created by chat-mocks.',
  price: '100',
  currency: 'JOD',
  country_code: 'JO',
  city: 'Amman',
  neighborhood: 'Abdoun',
  category_slug: 'real-estate',
  subcategory_slug: 'villas',
  images: [],
  attributes: [],
  status: 'active',
  views: 0,
  seller_name: 'Seller E2E',
  seller_phone: '+962790000000',
  created_at: ISO,
  updated_at: ISO,
};

export async function installChatMocks(page: Page): Promise<void> {
  await page.route('**/rest/v1/conversations*', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([CONVERSATION_ROW]),
      });
    }
    if (method === 'POST') {
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([CONVERSATION_ROW]),
      });
    }
    return route.continue();
  });

  await page.route('**/rest/v1/messages*', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    }
    if (method === 'POST') {
      const body = route.request().postDataJSON() as { text?: string } | null;
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'e2e-msg-' + Date.now(),
          conversation_id: CONVERSATION_ID,
          sender_id: FIXED_USER_ID,
          text: body?.text ?? '',
          deleted_at: null,
          read_at: null,
          created_at: new Date().toISOString(),
        }]),
      });
    }
    return route.continue();
  });

  await page.route('**/rest/v1/listings*', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([LISTING_ROW]),
      });
    }
    return route.continue();
  });

  await page.route('**/rest/v1/rpc/mark_messages_read*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: 'null' }),
  );
}

export const CHAT_MOCK_IDS = {
  USER_ID: FIXED_USER_ID,
  OTHER_USER_ID,
  LISTING_ID,
  CONVERSATION_ID,
} as const;
