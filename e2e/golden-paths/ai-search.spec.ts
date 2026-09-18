import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 3 — AI Search Flow', () => {
  test('AI Assistant box is visible on home screen', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Verify textarea is visible
    const textarea = loggedInPage.locator(SELECTORS.aiSearch.textarea).first();
    await expect(textarea).toBeVisible({ timeout: 5000 });

    // Verify submit button is visible (it is the send icon button)
    const sendBtn = loggedInPage.locator(SELECTORS.aiSearch.submitButton).first();
    await expect(sendBtn).toBeVisible({ timeout: 5000 });

    // Verify quota badge is visible (shows "credits" or "رصيد")
    const quotaBadge = loggedInPage.locator(SELECTORS.aiSearch.quotaBadge).first();
    await expect(quotaBadge).toBeVisible({ timeout: 5000 });
    await expect(quotaBadge).toContainText(/5\/5/);

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can type a search query and submit it', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Fill textarea with English query to ensure "Analysis Results" / "نتائج التحليل" shows up
    const textarea = loggedInPage.locator(SELECTORS.aiSearch.textarea).first();
    await textarea.fill('Toyota Camry under 10000 in Amman');
    await loggedInPage.waitForTimeout(500);

    // Press Enter to submit search query
    await textarea.press('Enter');

    // Verify response card appears
    const responseCard = loggedInPage.locator(SELECTORS.aiSearch.responseCard).first();
    await expect(responseCard).toBeVisible({ timeout: 10000 });

    // Assert it contains parsed JSON info
    await expect(responseCard).toContainText('"categorySlug": "motors"');
    await expect(responseCard).toContainText('"maxPrice": 10000');
    await expect(responseCard).toContainText('"city": "Amman"');

    await expectNoConsoleErrors(consoleErrors);
  });

  test('AI search reduces quota after submission', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Get quota badge and verify initial text
    const quotaBadge = loggedInPage.locator(SELECTORS.aiSearch.quotaBadge).first();
    await expect(quotaBadge).toBeVisible({ timeout: 5000 });
    await expect(quotaBadge).toContainText(/5\/5/);

    // Fill search query
    const textarea = loggedInPage.locator(SELECTORS.aiSearch.textarea).first();
    await textarea.fill('iPhone 15 under 800 in Amman');
    await loggedInPage.waitForTimeout(500);

    // Press Enter to submit search query
    await textarea.press('Enter');

    // Verify response card appears to confirm submission processed
    const responseCard = loggedInPage.locator(SELECTORS.aiSearch.responseCard).first();
    await expect(responseCard).toBeVisible({ timeout: 10000 });

    // Assert quota is decremented
    await expect(quotaBadge).toContainText(/4\/5/);

    await expectNoConsoleErrors(consoleErrors);
  });
});
