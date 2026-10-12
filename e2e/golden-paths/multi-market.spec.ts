import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';

const SB_URL = 'https://wmchqotsforwcoxilaeo.supabase.co';

function isListingsRequest(url: string): boolean {
  if (!url.startsWith(SB_URL)) return false;
  return (
    url.includes('/rest/v1/listings?') ||
    url.includes('/rest/v1/rpc/search_listings')
  );
}

test.describe('Golden Path — Multi-Market Isolation', () => {
  test('default browse scopes listings request to JO', async ({ page }) => {
    const captured: string[] = [];
    page.on('request', (r) => {
      if (isListingsRequest(r.url())) captured.push(r.url());
    });

    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });

    await expect.poll(() => captured.length, { timeout: 15000 }).toBeGreaterThan(0);

    const joScoped = captured.filter((u) => u.includes('country_code=eq.JO'));
    expect(
      joScoped.length,
      `Expected at least one listings request with country_code=eq.JO.\nCaptured:\n${captured.join('\n')}`,
    ).toBeGreaterThan(0);
  });

  test('selecting SA scopes subsequent listings request to SA', async ({ page }) => {
    const captured: string[] = [];
    page.on('request', (r) => {
      if (isListingsRequest(r.url())) captured.push(r.url());
    });

    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });

    await expect.poll(() => captured.length, { timeout: 15000 }).toBeGreaterThan(0);
    const beforeCount = captured.length;

    await page.locator(SELECTORS.app.menuButton).click();
    await page.locator('[data-testid="header-market-btn"]').click();
    await page.locator('[data-testid="market-option-SA"]').click();

    await expect.poll(() => captured.length, { timeout: 15000 }).toBeGreaterThan(beforeCount);

    const saScoped = captured.slice(beforeCount).filter((u) => u.includes('country_code=eq.SA'));
    expect(
      saScoped.length,
      `Expected a listings request with country_code=eq.SA after selecting SA.\nNew captures:\n${captured.slice(beforeCount).join('\n')}`,
    ).toBeGreaterThan(0);
  });

  test('selecting LB scopes subsequent listings request to LB', async ({ page }) => {
    const captured: string[] = [];
    page.on('request', (r) => {
      if (isListingsRequest(r.url())) captured.push(r.url());
    });

    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });

    await expect.poll(() => captured.length, { timeout: 15000 }).toBeGreaterThan(0);
    const beforeCount = captured.length;

    await page.locator(SELECTORS.app.menuButton).click();
    await page.locator('[data-testid="header-market-btn"]').click();
    await page.locator('[data-testid="market-option-LB"]').click();

    await expect.poll(() => captured.length, { timeout: 15000 }).toBeGreaterThan(beforeCount);

    const lbScoped = captured.slice(beforeCount).filter((u) => u.includes('country_code=eq.LB'));
    expect(
      lbScoped.length,
      `Expected a listings request with country_code=eq.LB after selecting LB.\nNew captures:\n${captured.slice(beforeCount).join('\n')}`,
    ).toBeGreaterThan(0);
  });
});
