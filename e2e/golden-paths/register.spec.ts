import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors, expectVisible } from '../helpers/assertions';
import { goToRegister } from '../helpers/navigation';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 1 — User Registration Flow', () => {
  test('User can reach the register screen from home', async ({ appPage }) => {
    const consoleErrors = setupConsoleErrorListener(appPage);

    await goToRegister(appPage);

    // Assert register screen elements are visible
    await expectVisible(appPage, SELECTORS.auth.register.phoneInput, 'Phone input should be visible');
    await expectVisible(appPage, SELECTORS.auth.register.countrySelector, 'Country selector should be visible');

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can submit phone number in register flow', async ({ appPage }) => {
    const consoleErrors = setupConsoleErrorListener(appPage);

    await goToRegister(appPage);

    // Fill registration form
    await appPage.locator(SELECTORS.auth.register.firstNameInput).first().fill('Test');
    await appPage.locator(SELECTORS.auth.register.phoneInput).first().fill('0790000000');
    await appPage.locator(SELECTORS.auth.register.emailInput).first().fill('testuser@example.com');

    const passInputs = appPage.locator(SELECTORS.auth.register.passwordInput);
    await passInputs.nth(0).fill('Password123');
    await passInputs.nth(1).fill('Password123');

    // Submit form
    await appPage.locator(SELECTORS.auth.register.submitButton).first().click();

    // Assert step 2 / activation link screen appears
    const step2Header = appPage.locator(SELECTORS.auth.register.step2Header).first();
    await expect(step2Header).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('Register flow shows validation for invalid phone', async ({ appPage }) => {
    const consoleErrors = setupConsoleErrorListener(appPage);

    await goToRegister(appPage);

    // Fill invalid phone
    await appPage.locator(SELECTORS.auth.register.firstNameInput).first().fill('Test');
    await appPage.locator(SELECTORS.auth.register.phoneInput).first().fill('123');
    await appPage.locator(SELECTORS.auth.register.emailInput).first().fill('test@example.com');
    const passInputs = appPage.locator(SELECTORS.auth.register.passwordInput);
    await passInputs.nth(0).fill('Password123');
    await passInputs.nth(1).fill('Password123');

    // Submit form
    await appPage.locator(SELECTORS.auth.register.submitButton).first().click();

    // Assert error message appears
    await expectVisible(appPage, SELECTORS.auth.register.errorBanner, 'Validation error banner should appear');

    await expectNoConsoleErrors(consoleErrors);
  });
});
