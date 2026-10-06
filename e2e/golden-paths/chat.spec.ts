import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

test.describe('Chat Golden Path', () => {
  test('Messages tab shows the mocked conversation', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    const messagesTab = chatReadyPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    // Strict: the actual mocked listing title must render in a row.
    const row = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await expect(row).toBeVisible({ timeout: 5000 });
    await expect(row).toContainText('E2E Test Listing', { timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can open the thread and see the input', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    await chatReadyPage.locator(SELECTORS.chat.messagesTab).first().click();

    const row = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.click();

    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
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

    await expectNoConsoleErrors(consoleErrors);
  });
});
