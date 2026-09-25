import { Page, expect } from '@playwright/test';

export function setupConsoleErrorListener(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

export async function expectNoConsoleErrors(errors: string[]): Promise<void> {
  expect(errors).toEqual([]);
}

export async function expectVisible(
  page: Page,
  selector: string,
  message?: string
): Promise<void> {
  const locator = page.locator(selector);
  await expect(locator, message || `Element '${selector}' should be visible`).toBeVisible();
}
