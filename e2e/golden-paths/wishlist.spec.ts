import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 5 — Wishlist Flow', () => {

  test('User can open Wishlist from Header menu', async ({ loggedInPage }) => {
    await loggedInPage.locator(SELECTORS.app.menuButton).click();
    await loggedInPage.locator(SELECTORS.wishlist.wishlistTab).click();
    await expect(loggedInPage.locator('h1, h2, h3').filter({ hasText: /Wishlist|المفضلة/ })).toBeVisible();
  });

  test('User can bookmark a listing from Listing Detail', async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage.locator(SELECTORS.wishlist.listingCard).first().click();

    // Wait for navigation to listing detail before interacting with bookmarks.
    // Otherwise we match the feed's bookmark that is about to unmount.
    await loggedInPage.waitForURL(/\/jo\/[^/]+\/[^/]+$/i, { timeout: 15000 });

    const bookmark = loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first();
    await bookmark.waitFor({ state: 'visible', timeout: 10000 });
    await bookmark.click();

    await expect(loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first())
      .toHaveAttribute('aria-label', /Remove from favorites|إزالة من المفضلة/);
  });

  test('Bookmarked listing appears in Wishlist', async ({ loggedInPage }) => {
    await loggedInPage.goto('/');
    await loggedInPage.locator(SELECTORS.wishlist.listingCard).first().click();
    await loggedInPage.waitForURL(/\/jo\/[^/]+\/[^/]+$/i, { timeout: 15000 });

    const bookmark = loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first();
    await bookmark.waitFor({ state: 'visible', timeout: 10000 });
    await bookmark.click();

    await loggedInPage.goto('/');
    await loggedInPage.locator(SELECTORS.app.menuButton).click();
    await loggedInPage.locator(SELECTORS.wishlist.wishlistTab).click();

    await expect(loggedInPage.locator(SELECTORS.wishlist.listingCard).first()).toBeVisible();
  });
});
