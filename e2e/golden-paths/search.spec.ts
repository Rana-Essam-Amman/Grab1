import { test, expect, type Page, type Route } from '@playwright/test';

// Mock listing for valid search queries
const MOCK_CAR = {
  id: 'e2e-car-1',
  title: 'سيارة تويوتا كامري',
  description: 'سيارة بحالة ممتازة',
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
  seller_name: 'E2E Seller',
  seller_phone: '0790000001',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_demo: false,
};

async function installSearchMocks(page: Page): Promise<void> {
  await page.route('**/rest/v1/rpc/detect_query_category**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
  });

  const fulfillSearch = async (route: Route) => {
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = query.includes('xyz123') ? [] : [MOCK_CAR];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(results) });
  };

  const fulfillSearchV4 = async (route: Route) => {
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = (query.includes('xyz123') ? [] : [MOCK_CAR]).map((row) => ({
      ...row,
      match_kind: 'exact',
      matched_tokens: [query],
      total_matched_tokens: 1,
    }));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(results) });
  };

  await page.route('**/rest/v1/rpc/search_listings_v4_exact**', fulfillSearchV4);
  await page.route('**/rest/v1/rpc/search_listings_v2_intent_typo**', fulfillSearch);
  await page.route('**/rest/v1/rpc/search_listings_hybrid**', fulfillSearch);

  await page.route('**/functions/v1/embed-query', async (route) => {
    await route.fulfill({ status: 503, contentType: 'text/plain', body: 'E2E: embeddings disabled' });
  });
}

test.describe('Search — inline on Home', () => {
  test.beforeEach(async ({ page }) => {
    await installSearchMocks(page);
    await page.goto('/');
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('full word shows listing inline without navigating to /search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('سيارة');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible();
  });

  test('empty results show the inline empty state on Home', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('xyz123nonexistent');
    await searchInput.press('Enter');

    const emptyState = page.locator('[data-testid="explore-empty-search-state"]');
    await expect(emptyState).toBeVisible({ timeout: 10000 });
  });

  test('clearing the query empties the input', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('سيارة');
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('clicking an inline search result opens listing detail', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('سيارة');
    await searchInput.press('Enter');

    await page.locator('[data-testid="listing-card"]').first().click();
    await expect(page.locator('[data-testid="listing-detail-header"]')).toBeVisible();
  });

  test('enterClosesSearchSuggestions', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('سيارة');
    await searchInput.press('Enter');
  });

  test('onFocusChangeHidesTopSections', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.focus();

    const topSection = page.locator('[data-testid="explore-top-sections"]');
    await expect(topSection).not.toBeVisible();
  });

  test('headerHidesOnScroll', async ({ page }) => {
    const header = page.locator('header').first();
    const searchBar = page.locator('div.sticky.z-40.bg-canvas').first();

    await expect(header).toBeVisible();
    await expect(searchBar).toBeVisible();

    const initialHeaderBox = await header.boundingBox();
    const initialSearchBox = await searchBar.boundingBox();
    expect(initialHeaderBox).not.toBeNull();
    expect(initialSearchBox).not.toBeNull();

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    const scrolledHeaderBox = await header.boundingBox();
    expect(scrolledHeaderBox).not.toBeNull();
    expect(scrolledHeaderBox!.y).toBeLessThan(0);

    const scrolledSearchBox = await searchBar.boundingBox();
    expect(scrolledSearchBox).not.toBeNull();
    expect(scrolledSearchBox!.y).toBeLessThan(initialSearchBox!.y);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const restoredHeaderBox = await header.boundingBox();
    expect(restoredHeaderBox).not.toBeNull();
    expect(Math.abs(restoredHeaderBox!.y)).toBeLessThanOrEqual(5);

    const restoredSearchBox = await searchBar.boundingBox();
    expect(restoredSearchBox).not.toBeNull();
    expect(Math.abs(restoredSearchBox!.y - initialSearchBox!.y)).toBeLessThanOrEqual(5);
  });
});

test.describe('Search — /search deep link', () => {
  test('deep link preserves the query and renders results on the dedicated screen', async ({ page }) => {
    await page.goto('/search?q=سيارة');

    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await expect(searchInput).toHaveValue('سيارة');
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible();
  });
});
