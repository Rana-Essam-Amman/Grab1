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
    const url = new URL(route.request().url());
    const select = url.searchParams.get('select');

    const now = new Date().toISOString();
    const seed = [
      {
        id: 'listing-1',
        user_id: FAKE_USER_ID,
        title: 'Toyota Camry 2020',
        description: 'Clean car in perfect condition',
        price: '1800',
        currency: 'JOD',
        country_code: 'JO',
        city: 'Amman',
        neighborhood: 'Abdoun',
        category_slug: 'motors',
        subcategory_slug: 'cars',
        images: ['https://example.com/car.jpg'],
        attributes: [
          { key: 'make', label: 'Make', value: 'toyota' },
          { key: 'model', label: 'Model', value: 'Camry' },
          { key: 'year', label: 'Year', value: '2020' },
          { key: 'km', label: 'Mileage (km)', value: '50000' },
          { key: 'color', label: 'Color', value: 'أبيض' },
          { key: 'transmission', label: 'Transmission', value: 'أوتوماتيك' },
          { key: 'fuel', label: 'Fuel', value: 'بنزين' },
          { key: 'inspection', label: 'Inspection', value: 'فحص كامل' },
          { key: 'origin', label: 'Origin', value: 'وارد وكالة' },
        ],
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

    // Image-select GET (deleteListing service) → return single object.
    if (method === 'GET' && select === 'images') {
      const idParam = url.searchParams.get('id') ?? '';
      const id = idParam.replace(/^eq\./, '');
      const match = seed.find((l) => l.id === id);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id, images: match?.images ?? [] }),
      });
      return;
    }

    // DELETE → 204 No Content
    if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    // PATCH → 200 with merged row (edit flow via updateListingRemote)
    if (method === 'PATCH') {
      const idParam = url.searchParams.get('id') ?? '';
      const id = idParam.replace(/^eq\./, '');
      const match = seed.find((l) => l.id === id);
      if (!match) {
        await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Listing not found' }) });
        return;
      }
      const patch = JSON.parse(route.request().postData() || '{}');
      const updated = { ...match, ...patch, updated_at: new Date().toISOString() };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(updated) });
      return;
    }

    if (method !== 'GET') return route.continue();

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
