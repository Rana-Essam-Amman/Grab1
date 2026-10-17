import { test as base, Page } from '@playwright/test';
import { installChatMocks } from './chat-mocks';

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
    await page.addInitScript(() => {
      const fakeAuth = {
        state: {
          user: {
            id: 'e2e00000-0000-0000-0000-000000000002',
            firstName: 'E2E',
            lastName: 'LoggedIn',
            email: 'loggedin@example.com',
            phone: '0790000000',
            countryCode: 'JO',
          },
          sessionToken: 'e2e-logged-in-token',
          authStatus: 'authenticated',
          isAnonymous: false,
        },
        version: 0,
      };
      localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
      localStorage.setItem('catch_user', JSON.stringify(fakeAuth.state.user));
      localStorage.setItem('catch_token', fakeAuth.state.sessionToken);
      localStorage.setItem('catch_browse_country', 'JO');
    });
    
    // ✅ إضافة الاعتراض عشان نمنع أخطاء 401
    await installChatMocks(page); 
    
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
