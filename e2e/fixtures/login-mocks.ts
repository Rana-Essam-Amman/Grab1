import type { Page, Route } from '@playwright/test';

/**
 * J4 Login fixtures.
 *
 * CRITICAL: This fixture does NOT install fake authenticated state.
 * The app must boot unauthenticated so LoginScreen renders.
 * INITIAL_MOCK_USERS (in auth.slice.helpers.ts) provides the demo
 * registered accounts for login — no localStorage seeding needed.
 *
 * Credentials available:
 *   phone: '791234567'  country: 'JO'  password: 'password123'  firstName: 'Demo'
 */
export async function installLoginMocks(page: Page): Promise<void> {
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
    if (route.request().method() !== 'GET') return route.continue();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
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
      body: JSON.stringify([{ id: 'e2e-login-user', country_code: 'JO', first_name: 'Demo' }]),
    });
  });
  await page.route(/\/rest\/v1\/wishlists(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/realtime\/v1\//, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}
