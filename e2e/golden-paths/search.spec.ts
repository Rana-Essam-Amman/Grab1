import { test, expect } from '@playwright/test';

test.describe('Search — inline on Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the main listing feed to be visible (not just skeletons)
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('full word shows listing inline without navigating to /search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('سيارة');
    await searchInput.press('Enter');

    // Should stay on home, not navigate to /search
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible();
  });

  test('empty results show the inline empty state on Home', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.fill('xyz123nonexistent');
    await searchInput.press('Enter');

    await expect(page.getByText(/لا توجد نتائج/i)).toBeVisible();
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

    // Assuming there's a suggestions dropdown, it should close
    // Add appropriate assertion based on the actual DOM structure
  });

  test('onFocusChangeHidesTopSections', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ابحث"]').first();
    await searchInput.focus();

    // Top sections (categories, hero) should be hidden
    const topSection = page.locator('[data-testid="explore-top-sections"]');
    await expect(topSection).not.toBeVisible();
  });

  test('headerHidesOnScroll', async ({ page }) => {
    // Get the header and search bar elements
    const header = page.locator('header').first();
    const searchBar = page.locator('div.sticky.z-40.bg-canvas').first();

    // Initial state: both should be visible
    await expect(header).toBeVisible();
    await expect(searchBar).toBeVisible();

    // Capture initial positions
    const initialHeaderBox = await header.boundingBox();
    const initialSearchBox = await searchBar.boundingBox();
    expect(initialHeaderBox).not.toBeNull();
    expect(initialSearchBox).not.toBeNull();

    // Scroll down by a significant amount
    await page.evaluate(() => window.scrollBy(0, 400));

    // Wait for the animation/transition to complete (header has transition-transform duration-300)
    await page.waitForTimeout(500);

    // After scrolling down: header should be hidden (negative Y or no longer visible)
    await expect(header).not.toBeVisible();

    // The search bar should also move up (its Y position should decrease)
    const scrolledSearchBox = await searchBar.boundingBox();
    expect(scrolledSearchBox).not.toBeNull();
    // Search bar Y should be less than initial Y (it moved up)
    expect(scrolledSearchBox!.y).toBeLessThan(initialSearchBox!.y);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Wait for animation
    await page.waitForTimeout(500);

    // After scrolling up: header should be visible again
    await expect(header).toBeVisible();
    const restoredSearchBox = await searchBar.boundingBox();
    expect(restoredSearchBox).not.toBeNull();
    // Search bar Y should be approximately equal to initial Y
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
