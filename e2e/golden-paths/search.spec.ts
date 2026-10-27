import { test, expect } from '@playwright/test';

test.describe('Search — inline on Home', () => {
  test.beforeEach(async ({ page }) => {
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

    await expect(page.getByText(/لا نتائج لـ/i)).toBeVisible();
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

    // Initial state
    await expect(header).toBeVisible();
    await expect(searchBar).toBeVisible();

    const initialHeaderBox = await header.boundingBox();
    const initialSearchBox = await searchBar.boundingBox();
    expect(initialHeaderBox).not.toBeNull();
    expect(initialSearchBox).not.toBeNull();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500); // Wait for transition

    // Check if header moved off-screen (Y < 0)
    const scrolledHeaderBox = await header.boundingBox();
    expect(scrolledHeaderBox).not.toBeNull();
    expect(scrolledHeaderBox!.y).toBeLessThan(0);

    // Search bar should have moved up
    const scrolledSearchBox = await searchBar.boundingBox();
    expect(scrolledSearchBox).not.toBeNull();
    expect(scrolledSearchBox!.y).toBeLessThan(initialSearchBox!.y);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Header should be visible again
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
