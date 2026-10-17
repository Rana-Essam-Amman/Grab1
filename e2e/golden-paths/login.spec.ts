import { test, expect } from '../fixtures';
import { goToAuthGateway } from '../helpers/navigation';

test.describe('Golden Path — OAuth Login Gateway', () => {
  test('Google sign-in button is visible and Facebook is removed', async ({ page }) => {
    await goToAuthGateway(page);

    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام Google|Continue with Google/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /تابع باستخدام Facebook|Continue with Facebook/i,
      }),
    ).toHaveCount(0);
  });

  test('Apple shows Coming Soon behavior', async ({ page }) => {
    await goToAuthGateway(page);

    const appleButton = page.getByRole('button', {
      name: /تابع باستخدام Apple|Continue with Apple/i,
    });

    await expect(appleButton).toBeVisible();
    await expect(appleButton).toContainText(/قريباً جداً|Coming soon/i);

    // Use force: true because the button has aria-disabled="true"
    await appleButton.click({ force: true });

    await expect(page.getByRole('status')).toContainText(
      /هذه الميزة ستكون متاحة قريباً|This feature is coming soon/i,
    );
  });

  test('WhatsApp shows Coming Soon behavior', async ({ page }) => {
    await goToAuthGateway(page);

    const whatsappButton = page.getByRole('button', {
      name: /تابع باستخدام WhatsApp|Continue with WhatsApp/i,
    });

    await expect(whatsappButton).toBeVisible();
    await expect(whatsappButton).toContainText(/قريباً جداً|Coming soon/i);

    // Use force: true because the button has aria-disabled="true"
    await whatsappButton.click({ force: true });

    await expect(page.getByRole('status')).toContainText(
      /هذه الميزة ستكون متاحة قريباً|This feature is coming soon/i,
    );
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
