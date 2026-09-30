import { test, expect } from './fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors, expectVisible } from './helpers/assertions';
import { SELECTORS } from './constants/selectors';

test.describe('Smoke Test', () => {
  test('App loads and shows the main screen', async ({ appPage }) => {
    const consoleErrors = setupConsoleErrorListener(appPage);

    // Check page title
    await expect(appPage).toHaveTitle(/FOX|Marketplace/i);

    // Verify root mounting using selectors constant
    await expectVisible(appPage, SELECTORS.app.root, 'Root element should be mounted');

    // Verify console clean
    await expectNoConsoleErrors(consoleErrors);
  });
});
