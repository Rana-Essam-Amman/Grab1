import { test as base, Page } from '@playwright/test';
import { performQuickDemoLogin } from '../helpers/navigation';

export interface TestUser {
  phone: string;
  country: string;
  name: string;
}

export interface Fixtures {
  appPage: Page;
  testUser: TestUser;
  loggedInPage: Page;
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
});

export { expect } from '@playwright/test';
