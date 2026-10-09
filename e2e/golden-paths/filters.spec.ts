import { test, expect } from '@playwright/test';
import { installFakeAuth, installFiltersMocks } from '../fixtures/filters-mocks';

test.describe('Golden Path — Filters', () => {
  test.beforeEach(async ({ page }) => {
    await installFakeAuth(page);
    await installFiltersMocks(page);
  });

  test('opens /filters from the home trigger bar', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('filters-trigger').click();
    await expect(page.getByTestId('filters-screen')).toBeVisible();
  });

  test('apply category + subcategory updates URL to /jo/cars', async ({ page }) => {
    await page.goto('/filters');
    await page.locator('[data-testid="filter-category-option"][data-slug="motors"]').click();
    await expect(page.locator('[data-testid="filter-sub-option"][data-slug="cars"]')).toBeVisible();
    await page.locator('[data-testid="filter-sub-option"][data-slug="cars"]').click();
    await page.getByTestId('filters-apply').click();
    await expect(page).toHaveURL(/\/jo\/cars/);
  });

  test('apply price preset adds min/max to URL', async ({ page }) => {
    await page.goto('/filters');
    await page.locator('[data-testid="filter-price-preset"][data-preset="500 - 2000"]').click();
    await page.getByTestId('filters-apply').click();
    await expect(page).toHaveURL(/min=500/);
    await expect(page).toHaveURL(/max=2000/);
  });

  test('direct URL with query params restores filters into the store', async ({ page }) => {
    await page.goto('/jo/cars?min=500&max=2000');
    await expect(page.getByTestId('filters-active-chips')).toBeVisible();
    await expect(page.getByTestId('filters-trigger')).toContainText(/\d/);
  });

  test('apply sort option reflects in URL', async ({ page }) => {
    await page.goto('/filters');
    await page.locator('[data-testid="filter-sort-option"][data-value="price-asc"]').click();
    await page.getByTestId('filters-apply').click();
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test('reset clears all active filters', async ({ page }) => {
    await page.goto('/jo/cars?min=500&max=2000');
    await expect(page.getByTestId('filters-active-chips')).toBeVisible();
    await page.getByTestId('filters-trigger').click();
    await expect(page.getByTestId('filters-screen')).toBeVisible();
    await page.getByTestId('filters-reset').click();
    await page.getByTestId('filters-apply').click();
    await expect(page).toHaveURL('/');
  });

  test('clear-all chip from home removes every filter', async ({ page }) => {
    await page.goto('/jo/cars?min=500&max=2000');
    const clearAll = page.getByTestId('filters-clear-all');
    if (await clearAll.count()) {
      await clearAll.click();
      await expect(page).toHaveURL('/');
    } else {
      throw new Error('Expected filters-clear-all chip on home with active filters');
    }
  });

  test('opening /filters with query params preloads the drafts', async ({ page }) => {
    await page.goto('/filters?min=500&max=2000&sort=price-asc');
    await expect(page.getByTestId('filter-price-min')).toHaveValue('500');
    await expect(page.getByTestId('filter-price-max')).toHaveValue('2000');
  });
});
