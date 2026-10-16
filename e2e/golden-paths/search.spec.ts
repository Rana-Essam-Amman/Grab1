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

type SearchMockOptions = {
  emptyV4?: boolean;
  v4Error?: boolean;
  extraListings?: Array<typeof TOYOTA_FIXTURE>;
};

function makeTieredRow(fixture: typeof TOYOTA_FIXTURE, tier: 1 | 2) {
  return {
    ...fixture,
    tier,
    tier_reason: tier === 1 ? 'exact_substring' : 'similar_category',
    rank_in_tier: 1,
    match_kind: tier === 1 ? 'exact' : null,
    matched_tokens: tier === 1 ? ['x'] : null,
    total_matched_tokens: tier === 1 ? 1 : 0,
  };
}

async function installSearchMock(
  page: Page,
  resultsByQuery: SearchResultsByQuery,
  options?: SearchMockOptions,
): Promise<void> {
  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    const body = options?.extraListings ?? [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
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

  const fulfillV4Results = async (route: import('@playwright/test').Route) => {
    if (options?.v4Error) {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }
    if (options?.emptyV4) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      return;
    }
    const body = route.request().postDataJSON() as { p_query?: string };
    const query = body.p_query ?? '';
    const results = (resultsByQuery[query] ?? []).map((row) => {
      const r = row as Record<string, unknown>;
      if ('tier' in r) return r;
      return {
        ...r,
        tier: 1,
        tier_reason: 'exact_substring',
        rank_in_tier: 1,
        match_kind: 'exact',
        matched_tokens: query.split(/\s+/).filter(Boolean),
        total_matched_tokens: query.split(/\s+/).filter(Boolean).length,
      };
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  };

  await page.route(
    '**/rest/v1/rpc/search_listings_v4_tiered_v2**',
    fulfillV4Results,
  );

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

async function installSuggestionsMock(
  page: Page,
  suggestions: Array<{
    suggestion: string;
    suggestion_type: string;
    weight: number;
    category_slug: string | null;
  }>,
): Promise<void> {
  await page.route('**/rest/v1/rpc/search_suggestions**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(suggestions),
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

  test('both tiers show two sections', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [
        makeTieredRow(TOYOTA_FIXTURE, 1),
        makeTieredRow(HONDA_FIXTURE, 2),
        makeTieredRow(KIA_FIXTURE, 2),
      ],
    });
    await page.goto('/');

    await searchFromHome(page, 'سيارة');

    await expect(page.getByTestId('tier2-section')).toBeVisible();
    await expect(page.getByText('قد يهمك')).toBeVisible();
    await expect(page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first()).toBeVisible();
  });

  test('only tier1 shows one section', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [makeTieredRow(TOYOTA_FIXTURE, 1)],
    });
    await page.goto('/');

    await searchFromHome(page, 'سيارة');

    await expect(page.getByTestId('tier2-section')).toHaveCount(0);
    await expect(page.getByText('قد يهمك')).toHaveCount(0);
    await expect(page.getByText(TOYOTA_FIXTURE.title, { exact: true }).first()).toBeVisible();
  });

  test('only tier2 shows recommendations without empty state', async ({ page }) => {
    await installSearchMock(page, {
      سيارة: [
        makeTieredRow(HONDA_FIXTURE, 2),
        makeTieredRow(KIA_FIXTURE, 2),
      ],
    });
    await page.goto('/');

    await searchFromHome(page, 'سيارة');

    await expect(page.getByTestId('tier2-section')).toBeVisible();
    await expect(page.getByText(HONDA_FIXTURE.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(KIA_FIXTURE.title, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/لا نتائج/)).toHaveCount(0);
    await expect(page.getByTestId('search-empty')).toHaveCount(0);
  });

  test('searchFallbackRunsWhenPrimaryReturnsEmpty', async ({ page }) => {
    let v4Calls = 0;
    let v2TypoCalls = 0;

    await page.route('**/rest/v1/rpc/search_listings_v4_tiered_v2**', async (route) => {
      v4Calls++;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.route('**/rest/v1/rpc/search_listings_v2_intent_typo**', async (route) => {
      v2TypoCalls++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([TOYOTA_FIXTURE]),
      });
    });

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

    await page.goto('/');
    await page.getByTestId('search-input').fill('تويوتا كمرى');
    await page.getByTestId('search-input').press('Enter');

    await expect(page.getByText(TOYOTA_FIXTURE.title).first()).toBeVisible();
    expect(v4Calls).toBeGreaterThanOrEqual(1);
    expect(v2TypoCalls).toBe(1);
    expect(page.url()).not.toContain('/search?q=');
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
      page.getByRole('heading', { name: TOYOTA_FIXTURE.title }).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test('enterClosesSearchSuggestions', async ({ page }) => {
    await installSearchMock(page, {});
    await installSuggestionsMock(page, [{
      suggestion: 'تويوتا كامري',
      suggestion_type: 'keyword',
      weight: 1,
      category_slug: 'motors',
    }]);

    await page.goto('/');
    await page.getByTestId('search-input').fill('توي');
    await expect(page.getByRole('option', { name: 'تويوتا كامري' })).toBeVisible();
    await page.getByTestId('search-input').press('Enter');

    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(page.getByTestId('search-input')).toHaveValue('توي');
    expect(page.url()).not.toContain('/search?q=');
  });

  test('onFocusChangeHidesTopSections', async ({ page }) => {
    await installSearchMock(page, {});
    await page.goto('/');

    // TrustSignal is always rendered inside ExploreTopSections (no conditional).
    // Locator uses its unique "active listings" text (Arabic or English).
    const topSectionLocator = page.getByText(/إعلان نشط اليوم|active listings/);
    await expect(topSectionLocator).toBeVisible();

    await page.getByTestId('search-input').focus();

    await expect(topSectionLocator).toHaveCount(0);
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('stickySearchStaysBelowHeaderOnScroll', async ({ page }) => {
    const extraListings = Array.from({ length: 15 }, (_, i) => ({
      ...TOYOTA_FIXTURE,
      id: `e2e-scroll-${i}`,
      title: `Listing for scroll test ${i} — long enough title to occupy space`,
      description: 'Description text to help ensure the page is scrollable with multiple cards.',
    }));

    await installSearchMock(page, {}, { extraListings });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Wait for content and confirm scrollability
    await expect(page.getByText(/Listing for scroll test/).first()).toBeVisible({ timeout: 5000 });
    const isScrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
    if (!isScrollable) {
      throw new Error('Document is not scrollable; extraListings did not produce enough content');
    }

    const stickyWrapper = page.locator('div.sticky.top-\\[72px\\].z-40.bg-canvas').first();
    await expect(stickyWrapper).toBeVisible();
    const before = await stickyWrapper.boundingBox();
    expect(before).not.toBeNull();

    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(200);

    await expect(stickyWrapper).toBeInViewport();
    const after = await stickyWrapper.boundingBox();
    expect(after).not.toBeNull();
    expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThanOrEqual(2);

    // Header must remain visible above the sticky wrapper (no overlap)
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    if (headerBox && after) {
      // Sticky wrapper's top must be at or below the header's bottom edge
      expect(after.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 2);
    }
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
