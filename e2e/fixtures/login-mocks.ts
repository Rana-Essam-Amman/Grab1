import type { Page, Route } from '@playwright/test';

const SEEDED_EMAIL = 'demo@example.com';
const SEEDED_PASSWORD = 'password123';
const SEEDED_USER_ID = 'e2e-login-user';
const ACCESS_TOKEN = 'e2e-access-token';
const REFRESH_TOKEN = 'e2e-refresh-token';

const SEEDED_USER = {
  id: SEEDED_USER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: SEEDED_EMAIL,
  email_confirmed_at: '2026-01-01T00:00:00Z',
  phone: '',
  confirmed_at: '2026-01-01T00:00:00Z',
  last_sign_in_at: '2026-01-01T00:00:00Z',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { first_name: 'Demo', last_name: '', country_code: 'JO' },
  identities: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

function sessionResponse() {
  return {
    access_token: ACCESS_TOKEN,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: REFRESH_TOKEN,
    user: SEEDED_USER,
  };
}

export async function installLoginMocks(page: Page): Promise<void> {
  await page.route('**/auth/v1/**', async (route: Route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const path = url.pathname;

    if (path.endsWith('/token') && method === 'POST') {
      const grant = url.searchParams.get('grant_type');

      if (grant === 'password') {
        let body: { email?: string; password?: string } = {};
        try {
          body = JSON.parse(req.postData() || '{}');
        } catch {
          body = {};
        }

        if (body.email === SEEDED_EMAIL && body.password === SEEDED_PASSWORD) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(sessionResponse()),
          });
        }

        return route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'invalid_grant',
            error_description: 'Invalid login credentials',
            code: 'invalid_credentials',
          }),
        });
      }

      if (grant === 'refresh_token') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sessionResponse()),
        });
      }

      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'unsupported_grant' }),
      });
    }

    if (path.endsWith('/user') && method === 'GET') {
      const auth = req.headers()['authorization'] || '';
      if (auth.includes(ACCESS_TOKEN)) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(SEEDED_USER),
        });
      }
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_token' }),
      });
    }

    if (path.endsWith('/logout') && method === 'POST') {
      return route.fulfill({ status: 204, body: '' });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  await page.route(/\/rest\/v1\/listings(\?|$)/, async (route: Route) => {
    if (route.request().method() !== 'GET') return route.continue();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await page.route(/\/rest\/v1\/notifications(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/rest\/v1\/rpc\/get_unread_notification_count(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '0' });
  });
  await page.route(/\/rest\/v1\/conversations(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/rest\/v1\/profiles(\?|$)/, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: SEEDED_USER_ID,
          country_code: 'JO',
          first_name: 'Demo',
          last_name: '',
          phone: '791234567',
        },
      ]),
    });
  });
  await page.route(/\/rest\/v1\/wishlists(\?|$)/, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.route(/\/realtime\/v1\//, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}
