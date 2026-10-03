import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

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
  // Fill title
  const titleTrigger = page.locator('[data-testid="inline-edit-trigger-title"]').first();
  await expect(titleTrigger).toBeVisible({ timeout: 5000 });
  await titleTrigger.click();
  const titleInput = page.locator('[data-testid="inline-edit-input-title"]').first();
  await expect(titleInput).toBeVisible({ timeout: 5000 });
  await titleInput.fill('تويوتا كامري 2018 بحالة ممتازة');
  await titleInput.press('Enter');
  await page.waitForTimeout(300);

  // Fill price
  const priceTrigger = page.locator('[data-testid="inline-edit-trigger-price"]').first();
  await expect(priceTrigger).toBeVisible({ timeout: 5000 });
  await priceTrigger.click();
  const priceInput = page.locator('[data-testid="inline-edit-input-price"]').first();
  await expect(priceInput).toBeVisible({ timeout: 5000 });
  await priceInput.fill('12000');
  await priceInput.press('Enter');
  await page.waitForTimeout(300);
}

test.describe('Golden Path 2 — Post Ad Wizard (Unified Flow)', () => {
  test('Authenticated user can open Post Ad wizard (Step 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB button (Post Ad / أضف إعلان)
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Assert wizard opened (category selection heading / Step 1 of 3 indicator is visible)
    const step1Indicator = loggedInPage
      .locator('text=Step 1 of 3')
      .or(loggedInPage.locator('text=الخطوة 1 من 3'))
      .first();
    await expect(step1Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can select category and subcategory inline (Page 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Click Motors / سيارات category
    const motorsCategory = loggedInPage
      .locator(SELECTORS.postAd.categoryCard)
      .filter({ hasText: /Motors|سيارات/i })
      .first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    // Click Cars for Sale / سيارات للبيع subcategory
    const carsSubcategory = loggedInPage
      .locator('button')
      .filter({ hasText: /Cars for Sale|سيارات للبيع/i })
      .first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    // Assert Photo & Location screen is visible (Step 2 of 3 indicator)
    const step2Indicator = loggedInPage
      .locator('text=Step 2 of 3')
      .or(loggedInPage.locator('text=الخطوة 2 من 3'))
      .first();
    await expect(step2Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can add photo and location details on page 2 (Page 2)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const startBtn = loggedInPage.locator('[data-testid="post-ad-entry-start"], #post-ad-entry-start').first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
    await startBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Select category and subcategory
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

    // Assert Page 2 is visible
    const step2Indicator = loggedInPage
      .locator('text=Step 2 of 3')
      .or(loggedInPage.locator('text=الخطوة 2 من 3'))
      .first();
    await expect(step2Indicator).toBeVisible({ timeout: 5000 });

    // Click "Use sample photo"
    const samplePhotoBtn = loggedInPage.locator(SELECTORS.postAd.samplePhotoButton).first();
    await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
    await samplePhotoBtn.click();

    // Select city
    const citySelect = loggedInPage.locator(SELECTORS.postAd.citySelect).first();
    if ((await citySelect.count()) > 0) {
      await expect(citySelect).toBeVisible({ timeout: 5000 });
      await citySelect.selectOption({ index: 0 });
    }

    // Continue to Details button
    const continueBtn = loggedInPage
      .locator('button')
      .filter({ hasText: /Continue to Details|متابعة لتفاصيل الإعلان|متابعة/i })
      .first();
    await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
    await continueBtn.click();

    // Assert details screen is visible (Step 3 of 3 indicator)
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

    const publishBtn = loggedInPage
      .locator('[data-testid="post-details-publish-btn"], [data-testid="post-publish-btn"]')
      .first();
    await expect(publishBtn).toBeVisible({ timeout: 5000 });
    await expect(publishBtn).not.toBeDisabled({ timeout: 5000 });
    await publishBtn.click();

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

    const publishBtn = loggedInPage
      .locator('[data-testid="post-details-publish-btn"], [data-testid="post-publish-btn"]')
      .first();
    await expect(publishBtn).toBeVisible({ timeout: 5000 });
    await expect(publishBtn).not.toBeDisabled({ timeout: 5000 });
    await publishBtn.click();

    // After publish, expect to be on PublishSuccessScreen
    const successScreen = loggedInPage
      .locator('[data-testid="publish-success-screen"], #publish-success-screen')
      .first();
    await expect(successScreen).toBeVisible({ timeout: 8000 });

    // Expect text "تم نشر الإعلان" or "Listing Published"
    const heading = loggedInPage.locator('text=/تم نشر الإعلان|Listing Published/i').first();
    await expect(heading).toBeVisible({ timeout: 5000 });

    // Expect two buttons visible
    const viewListingBtn = loggedInPage
      .locator('[data-testid="publish-success-view-btn"], button')
      .filter({ hasText: /View Listing|شاهد الإعلان/i })
      .first();
    await expect(viewListingBtn).toBeVisible({ timeout: 5000 });

    const postAnotherBtn = loggedInPage
      .locator('[data-testid="publish-success-add-another-btn"], button')
      .filter({ hasText: /Post Another Ad|أضف إعلان آخر/i })
      .first();
    await expect(postAnotherBtn).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
