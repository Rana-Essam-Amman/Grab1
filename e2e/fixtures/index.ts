import { test as base, Page } from '@playwright/test';
import { performQuickDemoLogin } from '../helpers/navigation';
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
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await performQuickDemoLogin(page);
    await use(page);
  },

  chatReadyPage: async ({ page }, use) => {
    // Seed an authenticated user with an id BEFORE the app boots.
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
          registeredUsers: [],
        },
        version: 0,
      };
      localStorage.setItem('catch_auth', JSON.stringify(fakeAuth));
    });

    // installChatMocks also blocks /auth/v1/** so no SIGNED_IN overwrites
    // the seeded user during boot.
    await installChatMocks(page);
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await use(page);
  },
});

export { expect } from '@playwright/test';
