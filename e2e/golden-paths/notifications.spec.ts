import { test, expect } from '@playwright/test';
import {
  installFakeAuth,
  installNotificationsMocks,
  makeNotification,
} from '../fixtures/notifications-mocks';

test.describe('Golden Path — Notifications', () => {
  test('shows empty state when there are zero notifications', async ({ page }) => {
    await installFakeAuth(page);
    await installNotificationsMocks(page, []);
    await page.goto('/notifications');
    await expect(page.getByTestId('notifications-empty')).toBeVisible();
    await expect(page.getByTestId('notifications-list')).toHaveCount(0);
  });

  test('renders one row per notification', async ({ page }) => {
    await installFakeAuth(page);
    await installNotificationsMocks(page, [
      makeNotification({ id: 'n-1' }),
      makeNotification({ id: 'n-2', read_at: new Date().toISOString() }),
      makeNotification({ id: 'n-3' }),
    ]);
    await page.goto('/notifications');
    await expect(page.getByTestId('notifications-list')).toBeVisible();
    await expect(page.getByTestId('notification-row')).toHaveCount(3);
  });

  test('clicking an unread row marks it read (dot disappears)', async ({ page }) => {
    await installFakeAuth(page);
    await installNotificationsMocks(page, [
      makeNotification({ id: 'n-unread', read_at: null }),
    ]);
    await page.goto('/notifications');

    const row = page.getByTestId('notification-row').first();
    await expect(row).toHaveAttribute('data-unread', 'true');
    await expect(page.getByTestId('notification-unread-dot')).toHaveCount(1);

    await row.click();

    await expect(row).toHaveAttribute('data-unread', 'false');
    await expect(page.getByTestId('notification-unread-dot')).toHaveCount(0);
  });

  test('"Mark all" clears every unread dot', async ({ page }) => {
    await installFakeAuth(page);
    await installNotificationsMocks(page, [
      makeNotification({ id: 'n-a' }),
      makeNotification({ id: 'n-b' }),
      makeNotification({ id: 'n-c' }),
    ]);
    await page.goto('/notifications');
    await expect(page.getByTestId('notification-unread-dot')).toHaveCount(3);

    await page.getByTestId('notifications-mark-all').click();

    await expect(page.getByTestId('notification-unread-dot')).toHaveCount(0);
  });

  test('shows mark-all button only when there are unread items', async ({ page }) => {
    await installFakeAuth(page);
    const past = new Date(Date.now() - 3_600_000).toISOString();
    await installNotificationsMocks(page, [
      makeNotification({ id: 'n-read-1', read_at: past }),
      makeNotification({ id: 'n-read-2', read_at: past }),
    ]);
    await page.goto('/notifications');
    await expect(page.getByTestId('notification-row')).toHaveCount(2);
    await expect(page.getByTestId('notifications-mark-all')).toHaveCount(0);
  });
});
