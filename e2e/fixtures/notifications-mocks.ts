import type { Page, Route } from '@playwright/test';

export interface NotificationRow {
  readonly id: string;
  readonly user_id: string;
  readonly type: 'message' | 'review' | 'listing_status' | 'price_alert' | 'system';
  readonly payload: Record<string, unknown>;
  readonly read_at: string | null;
  readonly created_at: string;
}

const FAKE_USER_ID = 'e2e00000-0000-0000-0000-000000000001';

export function makeNotification(
  overrides: Partial<NotificationRow> & Pick<NotificationRow, 'id'>
): NotificationRow {
  return {
    user_id: FAKE_USER_ID,
    type: 'system',
    payload: { title: 'Test notification', body: 'Body' },
    read_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Install Playwright route mocks for the Supabase notifications REST API.
 * Returns a mutable list so tests can toggle read state without reloading.
 */
export async function installNotificationsMocks(
  page: Page,
  seed: readonly NotificationRow[]
): Promise<{ setNotifications: (next: readonly NotificationRow[]) => void }> {
  let state: NotificationRow[] = [...seed];

  // Keep the seeded localStorage user. A live getSession would sign the test out.
  await page.route('**/auth/v1/**', async (route: Route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    }
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'auth_disabled_for_e2e' }),
    });
  });

  await page.route(/\/rest\/v1\/notifications(\?|$)/, async (route: Route) => {
    const method = route.request().method();
    if (method !== 'GET') return route.continue();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(state),
    });
  });

  await page.route(/\/rest\/v1\/rpc\/mark_notification_read(\?|$)/, async (route: Route) => {
    try {
      const body = route.request().postDataJSON() as { p_notification_id?: string };
      const id = body?.p_notification_id;
      if (id) {
        const now = new Date().toISOString();
        state = state.map((n) => (n.id === id && !n.read_at ? { ...n, read_at: now } : n));
      }
    } catch {
      // ignore malformed body
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
  });

  await page.route(/\/rest\/v1\/rpc\/mark_all_notifications_read(\?|$)/, async (route: Route) => {
    const now = new Date().toISOString();
    const count = state.filter((n) => !n.read_at).length;
    state = state.map((n) => (n.read_at ? n : { ...n, read_at: now }));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(count) });
  });

  await page.route(/\/rest\/v1\/rpc\/get_unread_notification_count(\?|$)/, async (route: Route) => {
    const count = state.filter((n) => !n.read_at).length;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(count) });
  });

  await page.route(/\/realtime\/v1\//, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  return {
    setNotifications: (next) => {
      state = [...next];
    },
  };
}

export async function installFakeAuth(page: Page): Promise<void> {
  await page.addInitScript((userId: string) => {
    const fakeAuth = {
      state: {
        authStatus: 'authenticated',
        isAnonymous: false,
        profileHydrated: true,
        user: {
          id: userId,
          firstName: 'E2E',
          lastName: 'User',
          phone: '0790000000',
          countryCode: 'JO',
          email: 'e2e@test.local',
        },
        sessionToken: 'e2e-fake-token',
      },
      version: 0,
    };
    window.localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
  }, FAKE_USER_ID);
}

export const E2E_USER_ID = FAKE_USER_ID;
