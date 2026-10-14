import { test, expect } from '@playwright/test';
import { installBrowseMocks } from '../fixtures/browse-mocks';

test.describe('Golden Path — Browse Marketplace (J1)', () => {
  test('browse feed renders listings on load', async ({ page }) => {
    await installBrowseMocks(page, 'default');
    await page.goto('/');
    await expect(page.locator('[data-testid="listing-card"]').first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="listing-card"]')).toHaveCount(2);
  });

  test('browse feed shows fixture listing titles', async ({ page }) => {
    await installBrowseMocks(page, 'default');
    await page.goto('/');
    await expect(page.locator('text=Toyota Camry 2020')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Honda Civic 2019')).toBeVisible({ timeout: 10000 });
  });

  test('market isolation — SA listing hidden in JO browse', async ({ page }) => {
    await installBrowseMocks(page, 'cross');
    await page.goto('/');
    await expect(page.locator('text=Toyota Camry 2020')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Honda Civic 2019')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Riyadh Furniture Set')).toHaveCount(0);
  });

  test('empty listings show defined empty state', async ({ page }) => {
    await installBrowseMocks(page, 'empty');
    await page.goto('/');
    await expect(page.locator('text=لا إعلانات متوفرة حالياً')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="listing-card"]')).toHaveCount(0);
  });
});
