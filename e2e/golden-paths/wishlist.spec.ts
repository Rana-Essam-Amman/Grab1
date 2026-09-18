import { test, expect } from '../fixtures';
import { SELECTORS } from '../constants/selectors';

test.describe('Golden Path 5 — Wishlist Flow', () => {

  test('User can open Wishlist from Header menu', async ({ loggedInPage }) => {
    // Open menu
    await loggedInPage.locator(SELECTORS.app.menuButton).click();
    // Click Wishlist tab in menu
    await loggedInPage.locator(SELECTORS.wishlist.wishlistTab).click();
    // Assert WishlistScreen is visible
    await expect(loggedInPage.locator('h1, h2, h3').filter({ hasText: /Wishlist|المفضلة/ })).toBeVisible();
  });

  test('User can bookmark a listing from Listing Detail', async ({ loggedInPage }) => {
    // Navigate to home
    await loggedInPage.goto('/');
    // Click first listing card
    await loggedInPage.locator(SELECTORS.wishlist.listingCard).first().click();
    // Click bookmark heart button
    await loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first().click();
    // Assert heart becomes filled/active
    await expect(loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first()).toHaveAttribute('aria-label', /Remove from favorites|إزالة من المفضلة/);
  });

  test('Bookmarked listing appears in Wishlist', async ({ loggedInPage }) => {
    // Bookmarked listing, navigate to Wishlist
    await loggedInPage.goto('/');
    await loggedInPage.locator(SELECTORS.wishlist.listingCard).first().click();
    await loggedInPage.locator(SELECTORS.wishlist.bookmarkHeart).first().click();
    
    // Navigate to Wishlist
    await loggedInPage.goto('/');
    await loggedInPage.locator(SELECTORS.app.menuButton).click();
    await loggedInPage.locator(SELECTORS.wishlist.wishlistTab).click();
    
    // Assert bookmarked listing is visible
    await expect(loggedInPage.locator(SELECTORS.wishlist.listingCard).first()).toBeVisible();
  });
});
