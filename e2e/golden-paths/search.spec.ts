import { test, expect, type Page } from '@playwright/test';

/**
 * Search E2E coverage.
 *
 * Home: inline search; Enter must not navigate to /search.
 * /search: dedicated screen remains available for direct deep links.
 *
 * The query-specific RPC mocks below test UI plumbing and rendering.
 * They do NOT prove the real database's FTS, typo, stopword, or synonym
 * behavior; that requires a separate database-backed regression test.
 */

const TOYOTA_FIXTURE = {
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

const HONDA_FIXTURE = {
  ...TOYOTA_FIXTURE,
  id: 'e2e-honda-civic',
  title: 'هوندا سيفيك 2020',
  description: 'سيارة هوندا نظيفة',
  seller_name: 'E2E Honda Seller',
  seller_phone: '0790000002',
  attributes: [{ key: 'make', label: 'Make', value: 'honda' }],
};

const KIA_FIXTURE = {
  ...TOYOTA_FIXTURE,
  id: 'e2e-kia-sportage',
  title: 'كيا سبورتاج 2022',
  description: 'سيارة كيا بحالة ممتازة',
  seller_name: 'E2E Kia Seller',
  seller_phone: '0790000003',
  attributes: [{ key: 'make', label: 'Make', value: 'kia' }],
};

const SAMSUNG_FIXTURE = {
  ...TOYOTA_FIXTURE,
  id: 'e2e-samsung-galaxy',
  title: 'Samsung Galaxy S24 Plus 256GB Onyx Black',
  description: 'Samsung Galaxy phone',
  category_slug: 'electronics',
  subcategory_slug: 'phones',
  seller_name: 'E2E Samsung Seller',
  seller_phone: '0790000004',
  attributes: [{ key: 'brand', label: 'Brand', value: 'samsung' }],
};

type SearchResultsByQuery = Record<string, unknown[]>;

async function installSearchMock(
  page: Page,
  resultsByQuery: SearchResultsByQuery,
): Promise<void> {
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

  const fulfillQueryResults = async (route: import('@playwright/test').Route) => {
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = resultsByQuery[query] ?? [];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  };

  await page.route(
    '**/rest/v1/rpc/search_listings_v2_intent_typo**',
    fulfillQueryResults,
  );

  await page.route(
    '**/rest/v1/rpc/search_listings_hybrid**',
    fulfillQueryResults,
  );

  await page.route('**/functions/v1/embed-query', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'text/plain',
      body: 'E2E: embeddings disabled',
    });
  });
}

async function searchFromHome(page: Page, query: string): Promise<void> {
  const input = page.getByTestId('search-input');
  await input.fill(query);
  await input.press('Enter');
  await expect(page).toHaveURL(/\/$/);
}

test.describe('Golden Path — Search quality UI', () => {
  test('FTS query "سيارة" renders both returned listings inline', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [TOYOTA_FIXTURE, HONDA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'سيارة');

    await expect(page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(HONDA_FIXTURE.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByTestId('search-results')).toHaveCount(0);
  });

  test('typo query "تويوتا كمرى" renders the Toyota result', async ({ page }) => {
    await installSearchMock(page, {
      'تويوتا كمرى': [TOYOTA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'تويوتا كمرى');

    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();
  });

  test('query "بدي سيارة كيا" renders the Kia result', async ({ page }) => {
    await installSearchMock(page, {
      'بدي سيارة كيا': [KIA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'بدي سيارة كيا');

    await expect(
      page.getByText(KIA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();
  });

  test('query "سامسونج جالاكسي" renders the Samsung result', async ({ page }) => {
    await installSearchMock(page, {
      'سامسونج جالاكسي': [SAMSUNG_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'سامسونج جالاكسي');

    await expect(
      page.getByText(SAMSUNG_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();
  });

  test('sequential searches replace Toyota and Honda with Kia only', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [TOYOTA_FIXTURE, HONDA_FIXTURE],
      كيا: [KIA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'سيارة');
    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText(HONDA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();

    await searchFromHome(page, 'كيا');

    await expect(
      page.getByText(KIA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByText(HONDA_FIXTURE.title, { exact: true }),
    ).toHaveCount(0);
  });
});

test.describe('Search — inline on Home', () => {
  test('full word shows listing inline without navigating to /search', async ({ page }) => {
    await installSearchMock(page, {
      كامري: [TOYOTA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'كامري');

    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('search-results')).toHaveCount(0);
  });

  test('empty results show the inline empty state on Home', async ({ page }) => {
    await installSearchMock(page, {
      xyzxyz: [],
    });
    await page.goto('/');

    await searchFromHome(page, 'xyzxyz');

    await expect(
      page.getByText(/No results|لا نتائج/i).first(),
    ).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/$/);
  });

  test('clearing the query empties the input', async ({ page }) => {
    await installSearchMock(page, {
      كامري: [TOYOTA_FIXTURE],
    });
    await page.goto('/');

    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await input.press('Enter');

    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible({ timeout: 5000 });

    await input.fill('');
    await expect(input).toHaveValue('');
  });

  test('clicking an inline search result opens listing detail', async ({ page }) => {
    await installSearchMock(page, {
      كامري: [TOYOTA_FIXTURE],
    });
    await page.goto('/');

    await searchFromHome(page, 'كامري');

    const title = page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/$/);
    await title.click();

    await expect(
      page.getByRole('heading', { name: TOYOTA_FIXTURE.title }),
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Search — /search deep link', () => {
  test('deep link preserves the query and renders results on the dedicated screen', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [TOYOTA_FIXTURE],
    });

    await page.goto('/search?q=%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9');

    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first(),
    ).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/search\?q=/);
  });
});
