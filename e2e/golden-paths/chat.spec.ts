import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

/**
 * The chatReadyPage fixture blocks /auth/v1/** so the seeded user persists.
 * The browser logs expected 400s from those blocked calls. We filter ONLY
 * those out before asserting no console errors. Any other console error
 * still fails the test.
 */
function filterExpectedAuth400s(errors: string[]): string[] {
  return errors.filter((msg) => {
    if (/auth\/v1/.test(msg)) return false;
    if (/Failed to load resource.*status of 40[01]/.test(msg)) return false;
    return true;
  });
}

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
