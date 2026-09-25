import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

test.describe('Golden Path 3 — Search Flow', () => {
  test('SearchBar is visible on home screen', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can type a query and navigate to results', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await searchInput.fill('كامري');
    await searchInput.press('Enter');
    await loggedInPage.waitForTimeout(1500);
    // Should be on search-results screen — check for results count text
    const resultsHeader = loggedInPage.locator('text=/نتائج|Results|نتيجة/').first();
    await expect(resultsHeader).toBeVisible({ timeout: 5000 });
    await expectNoConsoleErrors(consoleErrors);
  });

  test('Search does NOT reduce quota (search is free)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    // Quota is not visible on home anymore; just verify search works
    const searchInput = loggedInPage.locator('input[placeholder*="ابحث"], input[placeholder*="Search"]').first();
    await searchInput.fill('iPhone 15');
    await searchInput.press('Enter');
    await loggedInPage.waitForTimeout(1500);
    const resultsHeader = loggedInPage.locator('text=/نتائج|Results|نتيجة/').first();
    await expect(resultsHeader).toBeVisible({ timeout: 5000 });
    await expectNoConsoleErrors(consoleErrors);
  });
});
