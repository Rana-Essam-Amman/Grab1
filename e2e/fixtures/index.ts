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
    // Install chat API mocks BEFORE the app boots. The mocks only target
    // chat-related Supabase endpoints; the app's initial mount and demo
    // login remain untouched.
    await installChatMocks(page);
    await page.goto('/');
    await page.waitForSelector('#root', { state: 'visible' });
    await performQuickDemoLogin(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
