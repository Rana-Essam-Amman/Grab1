import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';

test.describe('Chat Golden Path', () => {
  /**
   * Full P2P chat E2E requires Supabase fixtures:
   *   - a test user with a stable auth session
   *   - a test listing owned by a different user
   *   - cleanup between runs
   *
   * That fixture layer ships in a dedicated commit after URL-routing. 
   * Until then we test the parts that don't need DB side-effects.
   */

  test('User can open Messages tab and see empty state', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    const messagesTab = loggedInPage.locator(SELECTORS.chat.messagesTab).first();
    await messagesTab.click();

    // No conversations exist yet → empty state must render
    const emptyState = loggedInPage.locator(SELECTORS.chat.emptyStateTitle).first();
    await expect(emptyState).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test.skip('User can open thread and send a message', async () => {
    // TODO(chat-e2e-fixtures): requires Supabase test user + listing.
    // Tracked in agenda as CHAT-E2E-FIXTURES.
  });

  test.skip('Anti-spam (soft 30-msg limit) renders after threshold', async () => {
    // TODO(chat-e2e-fixtures): requires Supabase test user + listing.
    // Tracked in agenda as CHAT-E2E-FIXTURES.
  });
});
