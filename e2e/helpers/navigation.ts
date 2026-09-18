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

  // Click profile icon in Header to go to Settings
  const profileBtn = page.locator('header button[title*="Settings"], header button[title*="الإعدادات"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();
  
  // In SettingsScreen, click Sign In / Register CTA ('تسجيل' or 'Sign In')
  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  // Wait for register input to be visible
  const phoneInput = page.locator('input[placeholder="07xxxxxxxx"]');
  await expect(phoneInput).toBeVisible({ timeout: 5000 });
}

export async function goToLogin(page: Page): Promise<void> {
  await goToHome(page);

  const profileBtn = page.locator('header button[title*="Settings"], header button[title*="الإعدادات"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();

  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  // Wait for registration screen to load
  const regHeader = page.locator('h1, h2').filter({ hasText: /New Registration|إنشاء حساب جديد/i }).first();
  await expect(regHeader).toBeVisible({ timeout: 5000 });

  // Click back button in AuthTopBar to go to Gateway
  const backBtn = page.locator('.sticky button').first();
  await backBtn.click();

  // Click "Sign In" on Gateway to show login form
  const signInBtn = page.locator('button').filter({ hasText: /Sign In|دخول/i }).first();
  await expect(signInBtn).toBeVisible({ timeout: 5000 });
  await signInBtn.click();
}

export async function performQuickDemoLogin(page: Page): Promise<void> {
  await goToHome(page);

  const profileBtn = page.locator('header button[title*="Settings"], header button[title*="الإعدادات"]').first();
  await expect(profileBtn).toBeVisible({ timeout: 5000 });
  await profileBtn.click();

  const settingsCta = page.locator('button').filter({ hasText: /تسجيل|Sign In|Register|إنشاء/i }).first();
  await expect(settingsCta).toBeVisible({ timeout: 5000 });
  await settingsCta.click();

  // Wait for registration screen to load
  const regHeader = page.locator('h1, h2').filter({ hasText: /New Registration|إنشاء حساب جديد/i }).first();
  await expect(regHeader).toBeVisible({ timeout: 5000 });

  // Click back button in AuthTopBar to go to Gateway
  const backBtn = page.locator('.sticky button').first();
  await backBtn.click();

  // Now we are on gateway, click Bypass with Quick Demo Account
  const bypassBtn = page.locator('button').filter({ hasText: /Bypass with Quick Demo|الدخول كحساب تجريبي/i }).first();
  await expect(bypassBtn).toBeVisible({ timeout: 5000 });
  await bypassBtn.click();

  const demoCountryBtn = page.locator('button').filter({ hasText: /Jordan|الأردن/i }).first();
  await expect(demoCountryBtn).toBeVisible({ timeout: 5000 });
  await demoCountryBtn.click();

  // Wait for login redirection to home and FAB to be visible
  const fabBtn = page.locator('button[aria-label="Post ad"], button[aria-label="أضف إعلان"]').first();
  await expect(fabBtn).toBeVisible({ timeout: 5000 });
}
