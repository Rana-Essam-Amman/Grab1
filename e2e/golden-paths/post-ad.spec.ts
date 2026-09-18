import { test, expect } from '../fixtures';
import { setupConsoleErrorListener, expectNoConsoleErrors } from '../helpers/assertions';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 2 — Post Ad Wizard (Steps 1-6)', () => {
  test('Authenticated user can open Post Ad wizard (Step 1)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB button (Post Ad / أضف إعلان)
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();

    // Assert wizard opened (category selection heading / Step 1 indicator is visible)
    const step1Indicator = loggedInPage.locator('text=Step 1 of 6').or(loggedInPage.locator('text=الخطوة 1 من 6')).first();
    await expect(step1Indicator).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can select category and subcategory (Steps 1-2)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();

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

  test('User can generate AI listing draft (Step 5)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();

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

    // Select city and neighborhood
    const citySelect = loggedInPage.locator(SELECTORS.postAd.citySelect).first();
    await citySelect.selectOption({ index: 0 });
    const neighborhoodSelect = loggedInPage.locator(SELECTORS.postAd.neighborhoodSelect).first();
    await neighborhoodSelect.selectOption({ index: 0 });

    // Click Continue to AI Drafter
    const continueToAiBtn = loggedInPage.locator(SELECTORS.postAd.continueToAiDrafterBtn).first();
    await expect(continueToAiBtn).toBeVisible({ timeout: 5000 });
    await continueToAiBtn.click();

    // Assert Step 5 indicator is visible
    const step5Indicator = loggedInPage.locator('text=Step 5 of 6').or(loggedInPage.locator('text=الخطوة 5 من 6')).first();
    await expect(step5Indicator).toBeVisible({ timeout: 5000 });

    // Fill textarea
    const noteTextarea = loggedInPage.locator(SELECTORS.postAd.noteTextarea).first();
    await expect(noteTextarea).toBeVisible({ timeout: 5000 });
    await noteTextarea.fill('تويوتا كامري 2018 بحالة ممتازة');

    // Click Generate Listing button
    const generateBtn = loggedInPage.locator(SELECTORS.postAd.generateListingBtn).first();
    await expect(generateBtn).toBeVisible({ timeout: 5000 });
    await expect(generateBtn).not.toBeDisabled();
    await generateBtn.click();

    // Wait for review step to appear (Step 6)
    const step6Indicator = loggedInPage.locator('text=Step 6 of 6').or(loggedInPage.locator('text=الخطوة 6 من 6')).first();
    await expect(step6Indicator).toBeVisible({ timeout: 10000 });

    // Assert review fields visible (Title, Price)
    const titleInput = loggedInPage.locator('input[value*="motors"], input[value*="Motors"], input[value*="سيارات"]').first();
    const priceInput = loggedInPage.locator('input[type="number"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await expect(priceInput).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });

  test('User can publish the listing (Step 6)', async ({ loggedInPage }) => {
    const consoleErrors = setupConsoleErrorListener(loggedInPage);

    // Click FAB
    await loggedInPage.locator(SELECTORS.postAd.fabButton).first().click();

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

    // Select city and neighborhood
    const citySelect = loggedInPage.locator(SELECTORS.postAd.citySelect).first();
    await citySelect.selectOption({ index: 0 });
    const neighborhoodSelect = loggedInPage.locator(SELECTORS.postAd.neighborhoodSelect).first();
    await neighborhoodSelect.selectOption({ index: 0 });

    // Click Continue to AI Drafter
    const continueToAiBtn = loggedInPage.locator(SELECTORS.postAd.continueToAiDrafterBtn).first();
    await expect(continueToAiBtn).toBeVisible({ timeout: 5000 });
    await continueToAiBtn.click();

    // Fill textarea
    const noteTextarea = loggedInPage.locator(SELECTORS.postAd.noteTextarea).first();
    await expect(noteTextarea).toBeVisible({ timeout: 5000 });
    await noteTextarea.fill('تويوتا كامري 2018 بحالة ممتازة');

    // Click Generate Listing button
    const generateBtn = loggedInPage.locator(SELECTORS.postAd.generateListingBtn).first();
    await expect(generateBtn).toBeVisible({ timeout: 5000 });
    await generateBtn.click();

    // Wait for Step 6 to appear
    const step6Indicator = loggedInPage.locator('text=Step 6 of 6').or(loggedInPage.locator('text=الخطوة 6 من 6')).first();
    await expect(step6Indicator).toBeVisible({ timeout: 10000 });

    // Verify Title field has content
    const titleInput = loggedInPage.locator('input[value*="motors"], input[value*="Motors"], input[value*="سيارات"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    const titleVal = await titleInput.inputValue();
    expect(titleVal.length).toBeGreaterThan(0);

    // Click Publish Now
    const publishBtn = loggedInPage.locator(SELECTORS.postAd.publishNowBtn).first();
    await expect(publishBtn).toBeVisible({ timeout: 5000 });
    await expect(publishBtn).not.toBeDisabled();
    await publishBtn.click();

    // Assert success (redirect to home/main, active tab is my-ads, which has 'My Ads' or 'إعلاناتي' visible in bottom nav)
    const myAdsTab = loggedInPage.locator('text="My Ads"').or(loggedInPage.locator('text="إعلاناتي"')).first();
    await expect(myAdsTab).toBeVisible({ timeout: 5000 });

    await expectNoConsoleErrors(consoleErrors);
  });
});
