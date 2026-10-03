import { Page, expect } from '@playwright/test';

export async function waitForAppReady(page: Page): Promise<void> {
  await expect(page.locator('#root')).toBeVisible();
}

export async function goToHome(page: Page): Promise<void> {
  await page.goto('/');
  await waitForAppReady(page);
}

export async function goToRegister(page: Page): Promise<void> {
  await goToHome(page);

  const profileBtn = page.locator('[data-testid="header-profile-btn"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();

  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  const createAccountBtn = page.locator('button').filter({ hasText: /مستخدم جديد|New User|Create Account/i }).first();
  await expect(createAccountBtn).toBeVisible({ timeout: 5000 });
  await createAccountBtn.click();

  const phoneInput = page.locator('input[placeholder="07xxxxxxxx"]');
  await expect(phoneInput).toBeVisible({ timeout: 5000 });
}

export async function goToLogin(page: Page): Promise<void> {
  await goToHome(page);

  const profileBtn = page.locator('[data-testid="header-profile-btn"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();

  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  const haveAccountBtn = page.locator('button').filter({ hasText: /لدي حساب بالفعل|I Have an Account/i }).first();
  await expect(haveAccountBtn).toBeVisible({ timeout: 5000 });
  await haveAccountBtn.click();
}

export async function performQuickDemoLogin(page: Page): Promise<void> {
  await goToHome(page);

  const profileBtn = page.locator('[data-testid="header-profile-btn"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();

  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  const bypassBtn = page.locator('button').filter({ hasText: /الدخول كحساب تجريبي|Bypass with Quick Demo/i }).first();
  await expect(bypassBtn).toBeVisible({ timeout: 5000 });
  await bypassBtn.click();

  const demoCountryBtn = page.locator('button').filter({ hasText: /Jordan|الأردن/i }).first();
  await expect(demoCountryBtn).toBeVisible({ timeout: 5000 });
  await demoCountryBtn.click();

  const fabBtn = page.locator('button[aria-label="Post ad"], button[aria-label="أضف إعلان"]').first();
  await expect(fabBtn).toBeVisible({ timeout: 5000 });
}
