import { test, expect, type Page } from '@playwright/test';
import { installFakeAuth, installFiltersMocks } from '../fixtures/filters-mocks';

const SEARCH_FIXTURE = {
  id: 'search-listing-1',
  user_id: 'e2e00000-0000-0000-0000-000000000001',
  title: 'تويوتا كامري 2018',
  description: 'بحالة ممتازة',
  price: '10000',
  currency: 'JOD',
  country_code: 'JO',
  city: 'Amman',
  neighborhood: 'Abdoun',
  category_slug: 'motors',
  subcategory_slug: 'cars',
  images: ['https://example.com/camry.jpg'],
  attributes: [{ key: 'make', label: 'Make', value: 'toyota' }],
  status: 'active',
  seller_name: 'E2E',
  seller_phone: '0790000000',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

async function installSearchMock(page: Page, results: unknown[]): Promise<void> {
  await page.route('**/rest/v1/rpc/search_listings**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  });
}

test.describe('Golden Path — Search', () => {
  test.beforeEach(async ({ page }) => {
    await installFakeAuth(page);
    await installFiltersMocks(page);
  });

  test('full word shows matching listing', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);
    await page.goto('/');
    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await input.press('Enter');
    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('listing-card').first()).toBeVisible({ timeout: 5000 });
  });

  test('empty result shows empty state', async ({ page }) => {
    await installSearchMock(page, []);
    await page.goto('/');
    const input = page.getByTestId('search-input');
    await input.fill('xyzxyz');
    await input.press('Enter');
    await expect(page.getByTestId('search-empty')).toBeVisible({ timeout: 5000 });
  });

  test('clearing the query empties the input', async ({ page }) => {
    await installSearchMock(page, [SEARCH_FIXTURE]);
    await page.goto('/');
    const input = page.getByTestId('search-input');
    await input.fill('كامري');
    await expect(input).toHaveValue('كامري');
    await input.fill('');
    await expect(input).toHaveValue('');
  });
});
