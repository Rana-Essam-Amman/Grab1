import { test, expect } from '@playwright/test';
import { installLoginMocks } from '../fixtures/login-mocks';
import { goToLogin, goToHome } from '../helpers/navigation';

const SEEDED_PHONE = '791234567';
const SEEDED_PASSWORD = 'password123';

async function performLogin(
  page: Parameters<typeof goToLogin>[0],
  password: string,
): Promise<void> {
  await goToLogin(page);
  await page.locator('input[placeholder="791234567"]').first().fill(SEEDED_PHONE);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('button[type="submit"]').first().click();
}

test.describe('Golden Path — J4 Login + Access Account', () => {
  test.beforeEach(async ({ page }) => {
    await installLoginMocks(page);
  });

  test('registered user can log in with valid credentials', async ({ page }) => {
    await performLogin(page, SEEDED_PASSWORD);
    await expect(page.getByText('تم تسجيل الدخول بنجاح', { exact: true })).toBeVisible({
      timeout: 5000,
    });
  });

  test('invalid password shows error and does not log in', async ({ page }) => {
    await performLogin(page, 'wrongpass123');
    await expect(
      page.getByText('رقم الهاتف أو كلمة المرور غير صحيحة', { exact: true })
    ).toBeVisible({ timeout: 5000 });
    const token = await page.evaluate(() => window.localStorage.getItem('catch_token'));
    expect(token).toBeNull();
  });

  test('session persists across reload', async ({ page }) => {
    await performLogin(page, SEEDED_PASSWORD);
    await expect(page.getByText('تم تسجيل الدخول بنجاح', { exact: true })).toBeVisible({
      timeout: 5000,
    });

    await page.reload();
    await page.waitForSelector('#root', { state: 'visible' });

    const token = await page.evaluate(() => window.localStorage.getItem('catch_token'));
    const raw = await page.evaluate(() => window.localStorage.getItem('catch_user'));
    expect(token).toBeTruthy();
    expect(raw).toBeTruthy();
    const user = JSON.parse(raw as string) as { firstName?: string };
    expect(user.firstName).toBe('Demo');
  });

  test('authenticated user reaches profile from header menu', async ({ page }) => {
    await performLogin(page, SEEDED_PASSWORD);
    await expect(page.getByText('تم تسجيل الدخول بنجاح', { exact: true })).toBeVisible({
      timeout: 5000,
    });

    await goToHome(page);
    const menuBtn = page.locator('[data-testid="header-menu-btn"]').first();
    await expect(menuBtn).toBeVisible({ timeout: 5000 });
    await menuBtn.click();

    const profileItem = page.getByText('الملف الشخصي', { exact: true }).first();
    await expect(profileItem).toBeVisible({ timeout: 5000 });
    await profileItem.click();

    await expect(
      page.getByRole('heading', { name: 'الملف الشخصي', exact: true })
    ).toBeVisible({ timeout: 5000 });
  });
});
