import { test as base, Page } from '@playwright/test';
import { installChatMocks } from './chat-mocks';

const E2E_USER_ID = 'e2e00000-0000-0000-0000-000000000002';
const E2E_USER = {
  id: E2E_USER_ID,
  firstName: 'E2E',
  lastName: 'LoggedIn',
  email: 'loggedin@example.com',
  phone: '+962790000000',
  countryCode: 'JO',
};
const E2E_PROFILE = {
  id: E2E_USER_ID,
  nickname: 'E2E LoggedIn',
  first_name: 'E2E',
  last_name: 'LoggedIn',
  email: 'loggedin@example.com',
  country_code: 'JO',
  feed_layout: 'list',
  phone: '+962790000000',
  phone_locked: true,
  is_demo: false,
  browse_market: null,
};

export interface TestUser {
  phone: string;
  country: string;
  name: string;
}

export interface Fixtures {
  appPage: Page;
  testUser: TestUser;
  loggedInPage: Page;
  chatReadyPage: Page;
}

export const test = base.extend<Fixtures>({
  testUser: async ({}, use) => {
    await use({
      phone: '0790000000',
      country: 'JO',
      name: 'Test User',
    });
  },

  appPage: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await use(page);
  },

  loggedInPage: async ({ page }, use) => {
    await page.addInitScript(({ user }) => {
      const fakeAuth = {
        state: {
          user,
          sessionToken: 'e2e-logged-in-token',
          authStatus: 'authenticated',
          isAnonymous: false,
          feedLayout: 'list',
        },
        version: 0,
      };
      localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
      localStorage.setItem('catch_user', JSON.stringify(user));
      localStorage.setItem('catch_token', JSON.stringify('e2e-logged-in-token'));
      localStorage.setItem('catch_browse_country', 'JO');
    }, { user: E2E_USER });

    // 1. اعتراض عام لكل طلبات rest/v1 (أقل أولوية)
    await page.route('**/rest/v1/**', route => {
      const url = route.request().url();
      const method = route.request().method();
      if (url.includes('/rpc/')) {
        return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
      }
      if (method === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    });

    // 2. Chat Mocks (أولوية متوسطة)
    await installChatMocks(page);

    // 3. اعتراضات محددة (أعلى أولوية)
    await page.route('**/auth/v1/user*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(E2E_USER) })
    );
    await page.route('**/rest/v1/profiles*', route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([E2E_PROFILE]) });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    });
    await page.route('**/rest/v1/rpc/get_own_phone*', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(E2E_USER.phone) })
    );

    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await use(page);
  },

  chatReadyPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      const fakeAuth = {
        state: {
          user: {
            id: 'e2e00000-0000-0000-0000-000000000001',
            firstName: 'E2E',
            lastName: 'Test',
            email: 'e2e@example.com',
            phone: '0790000000',
            countryCode: 'JO',
          },
          sessionToken: 'e2e-fake-token',
          authStatus: 'authenticated',
        },
        version: 0,
      };
      localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
    });

    await installChatMocks(page);
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await use(page);
  },
});

export { expect } from '@playwright/test';
