import type { Page, Route } from '@playwright/test';

const FAKE_USER_ID = 'e2e00000-0000-0000-0000-000000000001';

/**
 * Minimal Supabase REST mocks for the filter E2E suite.
 * We only need enough endpoints for the app to boot with a fake session,
 * a couple of listings, and an empty notifications table.
 */
export async function installFiltersMocks(page: Page): Promise<void> {
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

  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route: Route) => {
    const method = route.request().method();
    if (method !== 'GET') return route.continue();
    const now = new Date().toISOString();
    const seed = [
      {
        id: 'listing-1',
        user_id: FAKE_USER_ID,
        title: 'Toyota Camry 2020',
        description: 'Clean car',
        price: '1800',
        currency: 'JOD',
        country_code: 'JO',
        city: 'Amman',
        neighborhood: 'Abdoun',
        category_slug: 'motors',
        subcategory_slug: 'cars',
        images: ['https://example.com/car.jpg'],
        attributes: [{ key: 'make', label: 'Make', value: 'toyota' }],
        status: 'active',
        seller_name: 'E2E',
        seller_phone: '0790000000',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'listing-2',
        user_id: FAKE_USER_ID,
        title: 'Honda Civic 2019',
        description: 'Nice car',
        price: '6000',
        currency: 'JOD',
        country_code: 'JO',
        city: 'Amman',
        neighborhood: 'Abdoun',
        category_slug: 'motors',
        subcategory_slug: 'cars',
        images: ['https://example.com/car2.jpg'],
        attributes: [{ key: 'make', label: 'Make', value: 'honda' }],
        status: 'active',
        seller_name: 'E2E',
        seller_phone: '0790000000',
        created_at: now,
        updated_at: now,
      },
    ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(seed) });
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
      body: JSON.stringify([{ id: FAKE_USER_ID, country_code: 'JO', first_name: 'E2E' }]),
    });
  });

  await page.route(/\/rest\/v1\/wishlists(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await page.route(/\/realtime\/v1\//, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

export async function installFakeAuth(page: Page): Promise<void> {
  await page.addInitScript((userId: string) => {
    const fakeAuth = {
      state: {
        authStatus: 'authenticated',
        isAnonymous: false,
        profileHydrated: true,
        user: {
          id: userId,
          firstName: 'E2E',
          lastName: 'User',
          phone: '0790000000',
          countryCode: 'JO',
          email: 'e2e@test.local',
        },
        sessionToken: 'e2e-fake-token',
      },
      version: 0,
    };
    window.localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
    window.localStorage.setItem('catch_browse_country', 'JO');
  }, FAKE_USER_ID);
}

export const E2E_USER_ID = FAKE_USER_ID;
