import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

async function reachDetailsScreen(page: any) {
  await page.locator(SELECTORS.postAd.fabButton).first().click();
  const tradBtn = page.locator('[data-testid="post-entry-traditional-card"]').first();
  await expect(tradBtn).toBeVisible({ timeout: 5000 });
  await tradBtn.click();
  await page.waitForTimeout(800);

  const motorsCategory = page.locator(SELECTORS.postAd.categoryCard).filter({ hasText: /Motors|سيارات/i }).first();
  await expect(motorsCategory).toBeVisible({ timeout: 5000 });
  await motorsCategory.click();

  const carsSubcategory = page.locator(SELECTORS.postAd.subcategoryCard).filter({ hasText: /Cars for Sale|سيارات للبيع/i }).first();
  await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
  await carsSubcategory.click();

  const samplePhotoBtn = page.locator(SELECTORS.postAd.samplePhotoButton).first();
  await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
  await samplePhotoBtn.click();

  const continueBtn = page.locator(SELECTORS.postAd.continueToLocationButton).first();
  await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
  await continueBtn.click();

  const citySelect = page.locator(SELECTORS.postAd.citySelect).first();
  await citySelect.selectOption({ index: 0 });
  const neighborhoodSelect = page.locator(SELECTORS.postAd.neighborhoodSelect).first();
  await neighborhoodSelect.selectOption({ index: 0 });

  const continueToDetails = page.locator(SELECTORS.postAd.continueToDetailsBtn).first();
  await expect(continueToDetails).toBeVisible({ timeout: 5000 });
  await continueToDetails.click();
  await page.waitForTimeout(800);
}

async function fillDetailsForm(page: any) {
  // Title
  const titleInput = page.locator(SELECTORS.postAd.detailsTitleInput).first();
  await expect(titleInput).toBeVisible({ timeout: 5000 });
  await titleInput.fill('تويوتا كامري 2018 بحالة ممتازة');

  // Price
  const priceInput = page.locator(SELECTORS.postAd.detailsPriceInput).first();
  await expect(priceInput).toBeVisible({ timeout: 5000 });
  await priceInput.fill('12000');

  // Description
  const descTextarea = page.locator(SELECTORS.postAd.noteTextarea).first();
  await expect(descTextarea).toBeVisible({ timeout: 5000 });
  await descTextarea.fill('سيارة نظيفة بحالة ممتازة، جاهزة للمعاينة.');

  // Fill only EMPTY text inputs (skip title which is already filled)
  const textInputs = page.locator('input[type="text"], input:not([type])');
  const tCount = await textInputs.count();
  for (let i = 0; i < tCount; i++) {
    const inp = textInputs.nth(i);
    const val = await inp.inputValue().catch(() => '');
    if (!val.trim()) await inp.fill('قيمة تجريبية');
  }

  // Fill only EMPTY number inputs (skip price which is already filled)
  const numInputs = page.locator('input[type="number"]');
  const nCount = await numInputs.count();
  for (let i = 0; i < nCount; i++) {
    const inp = numInputs.nth(i);
    const val = await inp.inputValue().catch(() => '');
    if (!val.trim()) await inp.fill('100');
  }

  // Select first non-empty option on EVERY select on the page
  const allSelects = page.locator('select');
  const sCount = await allSelects.count();
  for (let i = 0; i < sCount; i++) {
    const sel = allSelects.nth(i);
    const cur = await sel.inputValue().catch(() => '');
    if (cur && cur.trim()) continue;
    const opts = await sel.locator('option').evaluateAll((els) =>
      els.map((o) => (o as HTMLOptionElement).value).filter((v) => v !== '')
    );
    if (opts.length > 0) await sel.selectOption(opts[0]);
  }

  // Fill make/model Comboboxes explicitly (motors + tech)
  const fillCombobox = async (testId: string) => {
    const wrapper = page.locator(`[data-testid="${testId}"]`).first();
    if ((await wrapper.count()) === 0) return;

    // Prefer Combobox if present
    const cb = wrapper.locator('[data-combobox="true"]');
    if ((await cb.count()) > 0) {
      const current = ((await cb.textContent().catch(() => '')) || '').trim();
      if (current && !/اختر|Select|Choose|ابحث|Search/i.test(current)) return;
      await cb.click();
      await page.waitForTimeout(200);
      const option = page.locator('[data-combobox-option="true"]').first();
      if ((await option.count()) > 0) {
        await option.click();
        await page.waitForTimeout(200);
      } else {
        await page.keyboard.press('Escape');
      }
      return;
    }

    // Native select fallback
    const sel = wrapper.locator('select');
    if ((await sel.count()) === 0) return;
    const cur = await sel.inputValue().catch(() => '');
    if (cur && cur.trim()) return;
    const opts = await sel.locator('option').evaluateAll((els) =>
      els.map((o) => (o as HTMLOptionElement).value).filter((v) => v !== '')
    );
    if (opts.length > 0) {
      await sel.selectOption(opts[0]);
    }
  };

  await fillCombobox('field-make');
  await fillCombobox('field-brand');
  await page.waitForTimeout(600); // wait for model options to re-render
  await fillCombobox('field-model');
}

test.describe('Golden Path 2 — Post Ad Wizard (Steps 1-6)', () => {
  test('Authenticated user can open Post Ad wizard (Step 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB button (Post Ad / أضف إعلان)
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const tradBtn = loggedInPage.locator('[data-testid="post-entry-traditional-card"]').first();
    await expect(tradBtn).toBeVisible({ timeout: 5000 });
    await tradBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Assert wizard opened (category selection heading / Step 1 indicator is visible)
    const step1Indicator = loggedInPage.locator('text=Step 1 of 6').or(loggedInPage.locator('text=الخطوة 1 من 6')).first();
    await expect(step1Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can select category and subcategory (Steps 1-2)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const tradBtn = loggedInPage.locator('[data-testid="post-entry-traditional-card"]').first();
    await expect(tradBtn).toBeVisible({ timeout: 5000 });
    await tradBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Click Motors / سيارات ومركبات category
    const motorsCategory = loggedInPage.locator(SELECTORS.postAd.categoryCard).filter({ hasText: /Motors|سيارات ومركبات/i }).first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    // Assert subcategory screen is visible (Step 2 of 6 indicator)
    const step2Indicator = loggedInPage.locator('text=Step 2 of 6').or(loggedInPage.locator('text=الخطوة 2 من 6')).first();
    await expect(step2Indicator).toBeVisible({ timeout: 5000 });

    // Click Cars for Sale / سيارات للبيع subcategory
    const carsSubcategory = loggedInPage.locator(SELECTORS.postAd.subcategoryCard).filter({ hasText: /Cars for Sale|سيارات للبيع/i }).first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    // Assert Photo Upload screen is visible (Step 3 of 6 indicator)
    const step3Indicator = loggedInPage.locator('text=Step 3 of 6').or(loggedInPage.locator('text=الخطوة 3 من 6')).first();
    await expect(step3Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can add sample photo and continue to location (Step 3)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const tradBtn = loggedInPage.locator('[data-testid="post-entry-traditional-card"]').first();
    await expect(tradBtn).toBeVisible({ timeout: 5000 });
    await tradBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Select category and subcategory
    const motorsCategory = loggedInPage.locator(SELECTORS.postAd.categoryCard).filter({ hasText: /Motors|سيارات/i }).first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    const carsSubcategory = loggedInPage.locator(SELECTORS.postAd.subcategoryCard).filter({ hasText: /Cars for Sale|سيارات للبيع/i }).first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    // Assert Photo Upload screen is visible
    const step3Indicator = loggedInPage.locator('text=Step 3 of 6').or(loggedInPage.locator('text=الخطوة 3 من 6')).first();
    await expect(step3Indicator).toBeVisible({ timeout: 5000 });

    // Click "Use sample photo"
    const samplePhotoBtn = loggedInPage.locator(SELECTORS.postAd.samplePhotoButton).first();
    await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
    await samplePhotoBtn.click();

    // Assert Continue button is enabled and click it
    const continueBtn = loggedInPage.locator(SELECTORS.postAd.continueToLocationButton).first();
    await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
    await continueBtn.click();

    // Assert location screen is visible (Step 4 of 6 indicator)
    const step4Indicator = loggedInPage.locator('text=Step 4 of 6').or(loggedInPage.locator('text=الخطوة 4 من 6')).first();
    await expect(step4Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can fill location details (Step 4)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();
    const tradBtn = loggedInPage.locator('[data-testid="post-entry-traditional-card"]').first();
    await expect(tradBtn).toBeVisible({ timeout: 5000 });
    await tradBtn.click();
    await loggedInPage.waitForTimeout(800);

    // Select category and subcategory
    const motorsCategory = loggedInPage.locator(SELECTORS.postAd.categoryCard).filter({ hasText: /Motors|سيارات/i }).first();
    await expect(motorsCategory).toBeVisible({ timeout: 5000 });
    await motorsCategory.click();

    const carsSubcategory = loggedInPage.locator(SELECTORS.postAd.subcategoryCard).filter({ hasText: /Cars for Sale|سيارات للبيع/i }).first();
    await expect(carsSubcategory).toBeVisible({ timeout: 5000 });
    await carsSubcategory.click();

    // Click "Use sample photo"
    const samplePhotoBtn = loggedInPage.locator(SELECTORS.postAd.samplePhotoButton).first();
    await expect(samplePhotoBtn).toBeVisible({ timeout: 5000 });
    await samplePhotoBtn.click();

    // Click Continue to Location
    const continueBtn = loggedInPage.locator(SELECTORS.postAd.continueToLocationButton).first();
    await expect(continueBtn).not.toBeDisabled({ timeout: 5000 });
    await continueBtn.click();

    // Assert location screen is visible
    const step4Indicator = loggedInPage.locator('text=Step 4 of 6').or(loggedInPage.locator('text=الخطوة 4 من 6')).first();
    await expect(step4Indicator).toBeVisible({ timeout: 5000 });

    // Select city from first select
    const citySelect = loggedInPage.locator(SELECTORS.postAd.citySelect).first();
    await expect(citySelect).toBeVisible({ timeout: 5000 });
    await citySelect.selectOption({ index: 0 });

    // Select neighborhood from second select
    const neighborhoodSelect = loggedInPage.locator(SELECTORS.postAd.neighborhoodSelect).first();
    await expect(neighborhoodSelect).toBeVisible({ timeout: 5000 });
    await neighborhoodSelect.selectOption({ index: 0 });

    // Fill optional landmark input to test selector
    const landmarkInput = loggedInPage.locator(SELECTORS.postAd.landmarkInput).first();
    await expect(landmarkInput).toBeVisible({ timeout: 5000 });
    await landmarkInput.fill('Test Landmark Near Center');

    // Assert continue button is enabled/visible
    const continueToAiBtn = loggedInPage.locator(SELECTORS.postAd.continueToAiDrafterBtn).first();
    await expect(continueToAiBtn).toBeVisible({ timeout: 5000 });
    await expect(continueToAiBtn).not.toBeDisabled();

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can fill details and publish directly (Step 5)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);
    await reachDetailsScreen(loggedInPage);
    await fillDetailsForm(loggedInPage);

    const publishBtn = loggedInPage.locator('[data-testid="post-publish-btn"]').first();
    await expect(publishBtn).toBeVisible({ timeout: 5000 });
    await expect(publishBtn).not.toBeDisabled();
    await publishBtn.click();

    const myAdsTab = loggedInPage.locator('text="My Ads"').or(loggedInPage.locator('text="إعلاناتي"')).first();
    await expect(myAdsTab).toBeVisible({ timeout: 8000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
