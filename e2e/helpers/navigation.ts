import { Page, expect } from '@playwright/test';

export async function waitForAppReady(page: Page): Promise<void> {
  await expect(page.locator('#root')).toBeVisible();
}

export async function goToHome(page: Page): Promise<void> {
  await page.goto('/');
  await waitForAppReady(page);
}

export async function goToAuthGateway(page: Page): Promise<void> {
  await goToHome(page);

  const menuBtn = page.locator('[data-testid="header-menu-btn"]').first();
  await expect(menuBtn).toBeVisible({ timeout: 5000 });
  await menuBtn.click();

  const settingsItem = page
    .locator('button')
    .filter({ hasText: /إعدادات الحساب|Account Settings/i })
    .first();
  await expect(settingsItem).toBeVisible({ timeout: 5000 });
  await settingsItem.click();

  const settingsCta = page
    .locator('button')
    .filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i })
    .first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  await expect(
    page.getByRole('button', {
      name: /تابع باستخدام Google|Continue with Google/i,
    }),
  ).toBeVisible({ timeout: 5000 });
}

export async function performQuickDemoLogin(page: Page): Promise<void> {
  await goToHome(page);

  const menuBtn = page.locator('[data-testid="header-menu-btn"]').first();
  await expect(menuBtn).toBeVisible({ timeout: 5000 });
  await menuBtn.click();

  const settingsItem = page
    .locator('button')
    .filter({ hasText: /إعدادات الحساب|Account Settings/i })
    .first();
  await expect(settingsItem).toBeVisible({ timeout: 5000 });
  await settingsItem.click();

  const settingsCta = page
    .locator('button')
    .filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i })
    .first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  const bypassBtn = page
    .locator('button')
    .filter({ hasText: /الدخول كحساب تجريبي|Bypass with Quick Demo/i })
    .first();
  await expect(bypassBtn).toBeVisible({ timeout: 5000 });
  await bypassBtn.click();

  const demoCountryBtn = page
    .locator('button')
    .filter({ hasText: /Jordan|الأردن/i })
    .first();
  await expect(demoCountryBtn).toBeVisible({ timeout: 5000 });
  await demoCountryBtn.click();

  const fabBtn = page.locator(
    'button[aria-label="Post ad"], button[aria-label="أضف إعلان"]',
  ).first();
  await expect(fabBtn).toBeVisible({ timeout: 5000 });
}
