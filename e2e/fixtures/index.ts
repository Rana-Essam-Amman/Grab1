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
    const fakeUser = {
      id: 'e2e00000-0000-0000-0000-000000000002',
      firstName: 'E2E',
      lastName: 'LoggedIn',
      email: 'loggedin@example.com',
      phone: '0790000000',
      countryCode: 'JO',
    };
    
    await page.addInitScript((user) => {
      const fakeAuth = {
        state: {
          user,
          sessionToken: 'e2e-logged-in-token',
          authStatus: 'authenticated',
          isAnonymous: false,
        },
        version: 0,
      };
      localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
      localStorage.setItem('catch_user', JSON.stringify(user));
      localStorage.setItem('catch_token', 'e2e-logged-in-token');
      localStorage.setItem('catch_browse_country', 'JO');
    }, fakeUser);
    
    await installChatMocks(page); 
    
    // ✅ اعتراض طلبات Auth عشان نرجع بيانات المستخدم بدل null
    await page.route('**/auth/v1/user*', route => 
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fakeUser) })
    );
    await page.route('**/auth/v1/token*', route => 
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ access_token: 'e2e-token', user: fakeUser }) })
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
