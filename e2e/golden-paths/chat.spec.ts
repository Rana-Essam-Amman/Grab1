import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

test.describe('Chat Golden Path', () => {
  test('User can open Messages tab and see conversations list', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    const messagesTab = chatReadyPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    await expect(chatReadyPage.locator('body')).toContainText(/E2E Test Listing|Messages|الرسائل/, {
      timeout: 5000,
    });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can open thread and see message input', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    const messagesTab = chatReadyPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    const threadRow = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await threadRow.click();

    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('Sending a message keeps the input usable', async ({ chatReadyPage }) => {
    const consoleErrors = setupConsoleErrorListener(chatReadyPage);

    const messagesTab = chatReadyPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    const threadRow = chatReadyPage.locator(SELECTORS.chat.threadRow).first();
    await threadRow.click();

    const input = chatReadyPage.locator(SELECTORS.chat.messageInput).first();
    await expect(input).toBeVisible({ timeout: 5000 });

    await input.fill('Hello from E2E');
    const send = chatReadyPage.locator(SELECTORS.chat.sendButton).first();
    await send.click();

    await expect(input).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
