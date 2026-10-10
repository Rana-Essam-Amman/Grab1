import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

async function pickFirstNonEmptyOption(page: Page, testId: string): Promise<void> {
  const field = page.locator(`[data-testid="${testId}"]`).first();
  if ((await field.count()) === 0) return;

  const tag = await field.evaluate((el) => el.tagName.toLowerCase());

  if (tag === 'select') {
    await field.selectOption({ index: 1 });
    await page.waitForTimeout(300);
    return;
  }

  // SearchableDropdown wrapper — click trigger, then pick first option
  const trigger = field.locator('button').first();
  await trigger.click();
  await page.waitForTimeout(200);
  const firstOption = page.locator('[role="option"]').first();
  await firstOption.click();
  await page.waitForTimeout(300);
}

async function reachDetailsScreen(page: Page) {
  await page.locator(SELECTORS.postAd.fabButton).first().click();
  const startBtn = page.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
  await expect(startBtn).toBeVisible({ timeout: 5000 });
  await startBtn.click();
  await page.waitForTimeout(800);

  const motorsCategory = page.locator(SELECTORS.postAd.categoryCard).filter({ hasText: /Motors|سيارات/i }).first();
  await expect(motorsCategory).toBeVisible({ timeout: 5000 });
  await motorsCategory.click();

  const carsSubcategory = page.locator('button').filter({ hasText: /Cars for Sale|سيارات للبيع/i }).first();
  await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
  await carsSubcategory.click();
  await page.waitForTimeout(800);

  const samplePhotoBtn = page.locator(SELECTORS.postAd.samplePhotoButton).first();
  await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
  await samplePhotoBtn.click();

  const citySelect = page.locator(SELECTORS.postAd.citySelect).first();
  if ((await citySelect.count()) > 0) {
    await citySelect.selectOption({ index: 0 });
  }

  const continueBtn = page
    .locator('button')
    .filter({ hasText: /Continue to Details|متابعة لتفاصيل الإعلان|متابعة/i })
    .first();
  await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
  await continueBtn.click();
  await page.waitForTimeout(800);
}

async function fillDetailsForm(page: Page) {
  await page.locator('[data-testid="post-details-title-input"]').fill('شقة 3 غرف في عبدون');
  await page.locator('[data-testid="post-details-price-input"]').fill('50000');
  await page.locator('[data-testid="post-details-description"]').fill('شقة واسعة بتشطيب حديث');

  // Fill required dynamic fields for cars (works with either <select> or SearchableDropdown)
  await pickFirstNonEmptyOption(page, 'field-make');
  await pickFirstNonEmptyOption(page, 'field-model');
  await pickFirstNonEmptyOption(page, 'field-year');

  // Fill a dynamic field if required (e.g. bedrooms)
  const bedrooms = page.locator('[data-testid="post-details-field-bedrooms"]');
  if ((await bedrooms.count()) > 0) {
    await bedrooms.fill('3');
  }

  // Publish
  await page.locator('[data-testid="post-details-publish-btn"]').click();
}

test.describe('Golden Path 2 — Post Ad Wizard (Unified Flow)', () => {
  test('Authenticated user can open Post Ad wizard (Step 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    const step1Indicator = loggedInPage
      .locator('text=Step 1 of 3')
      .or(loggedInPage.locator('text=الخطوة 1 من 3'))
      .first();
    await expect(step1Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can select category and subcategory inline (Page 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    const motorsCategory = loggedInPage
      .locator(SELECTORS.postAd.categoryCard)
      .filter({ hasText: /Motors|سيارات/i })
      .first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    const carsSubcategory = loggedInPage
      .locator('button')
      .filter({ hasText: /Cars for Sale|سيارات للبيع/i })
      .first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    const step2Indicator = loggedInPage
      .locator('text=Step 2 of 3')
      .or(loggedInPage.locator('text=الخطوة 2 من 3'))
      .first();
    await expect(step2Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can add photo and location details on page 2 (Page 2)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    const motorsCategory = loggedInPage
      .locator(SELECTORS.postAd.categoryCard)
      .filter({ hasText: /Motors|سيارات/i })
      .first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    const carsSubcategory = loggedInPage
      .locator('button')
      .filter({ hasText: /Cars for Sale|سيارات للبيع/i })
      .first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    const step2Indicator = loggedInPage
      .locator('text=Step 2 of 3')
      .or(loggedInPage.locator('text=الخطوة 2 من 3'))
      .first();
    await expect(step2Indicator).toBeVisible({ timeout: 5000 });

    const samplePhotoBtn = loggedInPage.locator(SELECTORS.postAd.samplePhotoButton).first();
    await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
    await samplePhotoBtn.click();

    const citySelect = loggedInPage.locator(SELECTORS.postAd.citySelect).first();
    if ((await citySelect.count()) > 0) {
      await expect(citySelect).toBeVisible({ timeout: 5000 });
      await citySelect.selectOption({ index: 0 });
    }

    const continueBtn = loggedInPage
      .locator('button')
      .filter({ hasText: /Continue to Details|متابعة لتفاصيل الإعلان|متابعة/i })
      .first();
    await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
    await continueBtn.click();

    const step3Indicator = loggedInPage
      .locator('text=Step 3 of 3')
      .or(loggedInPage.locator('text=الخطوة 3 من 3'))
      .first();
    await expect(step3Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can fill details and publish directly (Page 3)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    await reachDetailsScreen(loggedInPage);
    await fillDetailsForm(loggedInPage);

    const successScreen = loggedInPage
      .locator('[data-testid="publish-success-screen"], #publish-success-screen')
      .first();
    await expect(successScreen).toBeVisible({ timeout: 8000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('Publish success screen displays confirmation and action buttons', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    await reachDetailsScreen(loggedInPage);
    await fillDetailsForm(loggedInPage);

    const successScreen = loggedInPage
      .locator('[data-testid="publish-success-screen"], #publish-success-screen')
      .first();
    await expect(successScreen).toBeVisible({ timeout: 8000 });

    const heading = loggedInPage.locator('text=/تم نشر الإعلان|Listing Published/i').first();
    await expect(heading).toBeVisible({ timeout: 5000 });

    const viewListingBtn = loggedInPage
      .locator('[data-testid="publish-success-view-btn"], button')
      .filter({ hasText: /View Listing|شاهد الإعلان/i })
      .first();
    await expect(viewListingBtn).toBeVisible({ timeout: 5000 });

    const postAnotherBtn = loggedInPage
      .locator('[data-testid="publish-success-post-another-btn"], button')
      .filter({ hasText: /Post Another Ad|أضف إعلان آخر/i })
      .first();
    await expect(postAnotherBtn).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
