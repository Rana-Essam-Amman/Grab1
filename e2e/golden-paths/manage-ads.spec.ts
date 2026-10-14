import { test, expect, type Page } from '@playwright/test';
import { installFakeAuth, installFiltersMocks } from '../fixtures/filters-mocks';

async function gotToMyAds(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('nav').getByRole('button', { name: /إعلاناتي|My Ads/i }).click();
  await expect(
    page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020' })
  ).toBeVisible({ timeout: 5000 });
}

test.describe('Golden Path — J5 Manage Ads', () => {
  test.beforeEach(async ({ page }) => {
    await installFakeAuth(page);
    await installFiltersMocks(page);
  });

  test('J5: owner edits a listing title', async ({ page }) => {
    await gotToMyAds(page);

    const toyotaCard = page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020' });
    const toyotaWrapper = toyotaCard.locator('..');

    await toyotaWrapper.getByRole('button', { name: /تعديل|Edit/i }).click();

    const titleInput = page.getByRole('textbox', { name: 'عنوان الإعلان' });
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await expect(titleInput).toHaveValue('Toyota Camry 2020');

    const saveBtn = page.getByRole('button', { name: /حفظ التعديلات|Save Changes/i });
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });

    await titleInput.fill('Toyota Camry 2020 UPDATED');
    await saveBtn.click();

    await expect(
      page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020 UPDATED' })
    ).toBeVisible({ timeout: 5000 });
  });

  test('J5: owner marks a listing as sold', async ({ page }) => {
    await gotToMyAds(page);

    const toyotaCard = page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020' });
    const toyotaWrapper = toyotaCard.locator('..');

    const soldBtn = toyotaWrapper.getByRole('button', { name: /^تم البيع$|^Sold$/i });
    await expect(soldBtn).toBeVisible({ timeout: 5000 });
    await soldBtn.click();

    await expect(soldBtn).toHaveCount(0, { timeout: 5000 });
  });

  test('J5: owner deletes a listing', async ({ page }) => {
    await gotToMyAds(page);

    const toyotaCard = page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020' });
    const toyotaWrapper = toyotaCard.locator('..');

    await toyotaWrapper.getByRole('button', { name: /^حذف$|^Delete$/i }).click();

    await expect(
      page.locator('[data-testid="listing-card"]').filter({ hasText: 'Toyota Camry 2020' })
    ).toHaveCount(0, { timeout: 10000 });
  });
});
