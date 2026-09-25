import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 4 — P2P Chat Flow', () => {
  test('User can open Messages tab and see seeded thread', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click Messages tab in BottomNav
    const messagesTab = loggedInPage.locator(SELECTORS.chat.messagesTab).first();
    await expect(messagesTab).toBeVisible({ timeout: 5000 });
    await messagesTab.click();

    // Assert MessagesScreen title/header is visible
    const messagesHeader = loggedInPage.locator('h1:has-text("Messages"), h1:has-text("الرسائل")').first();
    await expect(messagesHeader).toBeVisible({ timeout: 5000 });

    // Assert seed thread (Rolex Submariner) is visible
    const seedThread = loggedInPage.locator(SELECTORS.chat.seedThread).first();
    await expect(seedThread).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can open thread and send a message', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Go to Messages tab
    const messagesTab = loggedInPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    // Click the seed thread (Rolex Submariner)
    const seedThread = loggedInPage.locator(SELECTORS.chat.seedThread).first();
    await seedThread.click();

    // Assert ThreadScreen input bar is visible
    const messageInput = loggedInPage.locator(SELECTORS.chat.messageInput).first();
    await expect(messageInput).toBeVisible({ timeout: 5000 });

    // Fill message text
    const queryText = 'Is the watch still available?';
    await messageInput.fill(queryText);

    // Submit using Send button
    const sendButton = loggedInPage.locator(SELECTORS.chat.sendButton).first();
    await sendButton.click();

    // Assert message bubble appears in the flow
    const queryBubble = loggedInPage.locator(`div:has-text("${queryText}")`).first();
    await expect(queryBubble).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('Anti-spam paywall appears after 6 messages', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Go to Messages tab
    const messagesTab = loggedInPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    // Click the seed thread (Rolex Submariner)
    const seedThread = loggedInPage.locator(SELECTORS.chat.seedThread).first();
    await seedThread.click();

    // The seed conversation already contains 2 initial messages in `initialConversations` list!
    // Let's type and send messages until we hit the MAX_MESSAGES limit of 6 total messages.
    const messageInput = loggedInPage.locator(SELECTORS.chat.messageInput).first();
    const sendButton = loggedInPage.locator(SELECTORS.chat.sendButton).first();

    // Loop to send 4 messages (which will bring total to 6)
    for (let i = 1; i <= 4; i++) {
      await messageInput.fill(`Test spam message number ${i}`);
      await sendButton.click();
      // Short delay for UI updates
      await loggedInPage.waitForTimeout(300);
    }

    // After the 6th message, verify the anti-spam paywall banner appears
    const paywallBanner = loggedInPage.locator(SELECTORS.chat.paywallBanner).first();
    await expect(paywallBanner).toBeVisible({ timeout: 5000 });

    // Verify input is hidden or disabled (it is not rendered under isMessageLimitReached)
    await expect(messageInput).not.toBeVisible();

    // Assert "Call Seller" or "اتصل بالبائع" action is visible
    const callSellerLink = loggedInPage.locator('a:has-text("Call Seller"), a:has-text("اتصل بالبائع")').first();
    await expect(callSellerLink).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
