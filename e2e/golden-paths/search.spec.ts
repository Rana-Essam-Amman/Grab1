import { test, expect, type Page } from '@playwright/test';

/**
 * Search E2E tests.
 *
 * Home: inline search. Typing filters Explore in place; Enter does not
 * navigate to /search. RPC fires via useSupabaseListingsSync.
 *
 * /search: dedicated screen for deep links. Kept for bookmarks and
 * shared URLs. Covered separately.
 */

const SEARCH_FIXTURE = {
  id: 'listing-camry-test',
  user_id: '00000000-0000-4000-8000-000000000001',
  title: 'تويوتا كامري 2018 بحالة ممتازة',
  description: 'سيارة بحالة ممتازة',
  price: '12000',
  currency: 'JOD',
  country_code: 'JO',
  city: 'عمّان',
  neighborhood: 'عبدون',
  category_slug: 'cars',
  subcategory_slug: null,
  images: ['/assets/listings/car.jpg'],
  attributes: [],
  status: 'active',
  views: 10,
  seller_name: 'Test Seller',
  seller_phone: '0790000000',
  created_at: '2026-10-01T10:00:00Z',
  updated_at: '2026-10-01T10:00:00Z',
  is_demo: false,
};

async function installSearchMock(page: Page, results: unknown[]): Promise<void> {
  // Browse feed (default listings)
  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  });

  // Category detection — return null (no hint)
  await page.route('**/rest/v1/rpc/detect_query_category**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    });
  });

  // Primary FTS RPC (v2_intent_typo)
  await page.route('**/rest/v1/rpc/search_listings_v2_intent_typo**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  });

  // Hybrid fallback RPC
  await page.route('**/rest/v1/rpc/search_listings_hybrid**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  });

  // Semantic embeddings — disabled in E2E
  await page.route('**/functions/v1/embed-query**', async (route) => {
    await route.fulfill({ status: 503, body: 'E2E: embeddings disabled' });
  });
}

test.describe('Search — inline on Home', () => {
  test('full word shows listing inline, no navigation to /search', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await input.press('Enter');

    await expect(page.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('search-results')).toHaveCount(0);
  });

  test('empty results show inline empty state on Home', async ({ page }) => {
    await installSearchMock(page, []);
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await input.fill('xyzxyz');
    await input.press('Enter');

    await expect(page.getByText(/No results|لا توجد/i).first()).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('clearing the query empties the input', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await input.press('Enter');
    await expect(page.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });

    await input.fill('');
    await expect(input).toHaveValue('');
  });

  test('clicking an inline search result opens listing detail', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await input.press('Enter');
    await expect(page.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/\/$/);
    await page.getByTestId('listing-card').first().click();
    await expect(page.getByText(/تويوتا كامري|Toyota Camry/i).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Search — /search deep link', () => {
  test('deep link preserves query, Back returns Home', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);

    await page.goto('/search?q=%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9');

    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/search\?q=/);
  });
});
