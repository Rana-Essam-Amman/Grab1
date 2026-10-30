import type { Page, Route } from '@playwright/test';
import { installFakeAuth, E2E_USER_ID } from './filters-mocks';

const NOW = '2026-10-14T00:00:00.000Z';

type BrowseMode = 'default' | 'empty' | 'cross';

interface ListingSeed {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  country_code: string;
  city: string;
  neighborhood: string;
  category_slug: string;
  subcategory_slug: string;
  images: string[];
  attributes: Array<{ key: string; label: string; value: string }>;
  status: string;
  views: number;
  seller_name: string;
  seller_phone: string;
  created_at: string;
  updated_at: string;
}

const JO_LISTINGS: ListingSeed[] = [
  {
    id: 'listing-jo-1',
    user_id: E2E_USER_ID,
    title: 'Toyota Camry 2020',
    description: 'Clean car',
    price: '1800',
    currency: 'JOD',
    country_code: 'JO',
    city: 'Amman',
    neighborhood: 'Abdoun',
    category_slug: 'motors',
    subcategory_slug: 'cars',
    images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='],
    attributes: [{ key: 'make', label: 'Make', value: 'toyota' }],
    status: 'active',
    views: 0,
    seller_name: 'E2E',
    seller_phone: '0790000000',
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'listing-jo-2',
    user_id: E2E_USER_ID,
    title: 'Honda Civic 2019',
    description: 'Nice car',
    price: '6000',
    currency: 'JOD',
    country_code: 'JO',
    city: 'Amman',
    neighborhood: 'Abdoun',
    category_slug: 'motors',
    subcategory_slug: 'cars',
    images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='],
    attributes: [{ key: 'make', label: 'Make', value: 'honda' }],
    status: 'active',
    views: 0,
    seller_name: 'E2E',
    seller_phone: '0790000000',
    created_at: NOW,
    updated_at: NOW,
  },
];

const SA_LISTING: ListingSeed = {
  id: 'listing-sa-1',
  user_id: E2E_USER_ID,
  title: 'Riyadh Furniture Set',
  description: 'Living room',
  price: '2000',
  currency: 'SAR',
  country_code: 'SA',
  city: 'Riyadh',
  neighborhood: 'Olaya',
  category_slug: 'furniture',
  subcategory_slug: 'sofas',
  images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='],
  attributes: [{ key: 'material', label: 'Material', value: 'wood' }],
  status: 'active',
  views: 0,
  seller_name: 'E2E',
  seller_phone: '0500000000',
  created_at: NOW,
  updated_at: NOW,
};

function seedForMode(mode: BrowseMode): ListingSeed[] {
  if (mode === 'empty') return [];
  if (mode === 'cross') return [...JO_LISTINGS, SA_LISTING];
  return JO_LISTINGS;
}

export async function installBrowseMocks(
  page: Page,
  mode: BrowseMode = 'default',
): Promise<void> {
  await installFakeAuth(page);

  await page.route('**/auth/v1/**', async (route: Route) => {
    const method = route.request().method();
    if (method === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    }
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'auth_disabled_for_e2e' }),
    });
  });

  await page.route(/\/rest\/v1\/notifications(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/rest\/v1\/rpc\/get_unread_notification_count(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '0' });
  });
  await page.route(/\/rest\/v1\/conversations(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/rest\/v1\/profiles(\?|$)/, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: E2E_USER_ID, country_code: 'JO', first_name: 'E2E' }]),
    });
  });
  await page.route(/\/rest\/v1\/wishlists(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/realtime\/v1\//, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  const seeds = seedForMode(mode);
  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route: Route) => {
    const method = route.request().method();
    if (method !== 'GET') return route.continue();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(seeds),
    });
  });
}
