import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

/**
 * The chatReadyPage fixture blocks /auth/v1/** so the seeded user persists.
 * The browser logs expected 400s from those blocked calls. 
 * It also logs CORS errors from the external IP API. We filter BOTH out.
 */
function filterExpectedAuth400s(errors: string[]): string[] {
  return errors.filter((msg) => {
    if (/auth\/v1/.test(msg)) return false;
    if (/Failed to load resource.*status of 40[01]/.test(msg)) return false;
    if (/ipapi\.co/.test(msg)) return false; // Ignore IP API CORS errors
    return true;
  });
}

test.beforeEach(async ({ chatReadyPage }) => {
  // Mock external IP API to prevent CORS/Network errors in CI
  await chatReadyPage.route('**/ipapi.co/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ country_code: 'JO' }),
    });
  });
});

test.describe('Chat Golden Path', () => {
  test('Messages tab shows the mocked conversation', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    const messagesTab = chatReadyPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    const row = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await expect(row).toBeVisible({ timeout: 5000 });
    await expect(row).toContainText('E2E Test Listing', { timeout: 5000 });

    await expectNoConsoleErrors(filterExpectedAuth400s(consoleErrors));
  });

  test('User can open the thread and see the input', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    await chatReadyPage.locator(SELECTORS.chat.messagesTab).first().click();

    const row = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.click();

    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(filterExpectedAuth400s(consoleErrors));
  });

  test('Sending a message keeps the input usable', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    await chatReadyPage.locator(SELECTORS.chat.messagesTab).first().click();

    const row = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.click();

    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 5000 });

    await input.fill('Hello from E2E');
    await chatReadyPage.locator(SELECTORS.chat.sendButton).first().click();

    await expect(input).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(filterExpectedAuth400s(consoleErrors));
  });
});

test.describe('Golden Path — J3 View + Contact (from listing detail)', () => {
  test('listing detail shows all three contact actions', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    await chatReadyPage.goto('/');
    await chatReadyPage.locator(SELECTORS.wishlist.listingCard).first().click();

    const chatBtn = chatReadyPage.locator('[data-testid="listing-chat-button"]').first();
    const waBtn = chatReadyPage
      .getByRole('button', { name: /Contact via WhatsApp|تواصل عبر واتساب/ })
      .first();
    const callBtn = chatReadyPage
      .getByRole('button', { name: /^Call$|^اتصال$/ })
      .first();

    await expect(chatBtn).toBeVisible({ timeout: 5000 });
    await expect(waBtn).toBeVisible({ timeout: 5000 });
    await expect(callBtn).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(filterExpectedAuth400s(consoleErrors));
  });

  test('clicking chat on listing detail opens the thread with input', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    await chatReadyPage.goto('/');
    await chatReadyPage.locator(SELECTORS.wishlist.listingCard).first().click();

    const chatBtn = chatReadyPage.locator('[data-testid="listing-chat-button"]').first();
    await expect(chatBtn).toBeVisible({ timeout: 5000 });

    await chatBtn.click();

    // ThreadScreen renders → message input visible + seller header text.
    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 10000 });

    await expect(chatReadyPage.getByText('Seller E2E').first()).toBeVisible({
      timeout: 5000,
    });

    await expectNoConsoleErrors(filterExpectedAuth400s(consoleErrors));
  });
});
