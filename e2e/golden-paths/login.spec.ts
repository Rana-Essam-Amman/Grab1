import { test, expect } from '../fixtures';
import { goToAuthGateway } from '../helpers/navigation';

test.describe('Golden Path — OAuth Login Gateway', () => {
  test('Google sign-in button is visible, Facebook is removed', async ({ page }) => {
    await goToAuthGateway(page);

    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام Google|Continue with Google/i,
      }),
    ).toBeVisible();

    // Assert that Facebook button is completely removed
    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام Facebook|Continue with Facebook/i,
      }),
    ).toHaveCount(0);
  });

  test('Apple and WhatsApp show as coming soon providers', async ({ page }) => {
    await goToAuthGateway(page);

    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام Apple|Continue with Apple/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام WhatsApp|Continue with WhatsApp/i,
      }),
    ).toBeVisible();
  });

  test('Quick Demo button is visible', async ({ page }) => {
    await goToAuthGateway(page);

    await expect(
      page.getByTestId('demo-login-btn'),
    ).toBeVisible();
  });

  test('guest browsing action is visible', async ({ page }) => {
    await goToAuthGateway(page);

    await expect(
      page.getByRole('button', {
        name: /تصفح كضيف|Browse as Guest/i,
      }),
    ).toBeVisible();
  });
});
