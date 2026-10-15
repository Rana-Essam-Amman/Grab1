import { test, expect, type Page } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

/**
 * Inline search RPC mock for the loggedInPage context.
 * loggedInPage does not install any search mocks or return listings,
 * so we intercept the same RPCs as search.spec.ts to keep tests
 * deterministic and independent of the real backend.
 */
async function installCamrySearchMock(page: Page): Promise<void> {
  const CAMRY = {
    id: 'e2e-toyota-camry',
    user_id: '00000000-0000-4000-8000-000000000001',
    title: 'تويوتا كامري 2018 بحالة ممتازة',
    description: 'سيارة تويوتا بحالة ممتازة',
    price: '12000',
    currency: 'JOD',
    country_code: 'JO',
    city: 'عمّان',
    neighborhood: 'عبدون',
    category_slug: 'motors',
    subcategory_slug: 'cars',
    images: [],
    attributes: [{ key: 'make', label: 'Make', value: 'toyota' }],
    status: 'active',
    views: 10,
    seller_name: 'E2E Toyota Seller',
    seller_phone: '0790000001',
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-01T10:00:00Z',
    is_demo: false,
  };

  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/rest/v1/rpc/detect_query_category**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    });
  });

  const fulfill = async (route: import('@playwright/test').Route) => {
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = query === 'كامري' ? [CAMRY] : [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  };

  const fulfillV4 = async (route: import('@playwright/test').Route) => {
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = (query === 'كامري' ? [CAMRY] : []).map((row) => ({
      ...row,
      match_kind: 'exact',
      matched_tokens: [query],
      total_matched_tokens: 1,
    }));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  };

  await page.route('**/rest/v1/rpc/search_listings_v4_exact**', fulfillV4);
  await page.route('**/rest/v1/rpc/search_listings_v2_intent_typo**', fulfill);
  await page.route('**/rest/v1/rpc/search_listings_hybrid**', fulfill);

  await page.route('**/functions/v1/embed-query', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'text/plain',
      body: 'E2E: embeddings disabled',
    });
  });
}

test.describe('Golden Path 3 — Search Flow', () => {
  test('SearchBar is visible on home screen', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can type a query and see inline results on Home', async ({ loggedInPage }) => {
    await installCamrySearchMock(loggedInPage);
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await searchInput.fill('كامري');
    await searchInput.press('Enter');
    await expect(loggedInPage).toHaveURL(/\/$/);
    await expect(loggedInPage.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });
    await expect(loggedInPage.getByTestId('search-results')).toHaveCount(0);
    await expectNoConsoleErrors(consoleErrors);
  });

  test('Search does NOT reduce quota (search is free)', async ({ loggedInPage }) => {
    await installCamrySearchMock(loggedInPage);
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await searchInput.fill('كامري');
    await searchInput.press('Enter');
    await expect(loggedInPage).toHaveURL(/\/$/);
    await expect(loggedInPage.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });
    await expect(loggedInPage.getByTestId('search-results')).toHaveCount(0);
    await expectNoConsoleErrors(consoleErrors);
  });
});
