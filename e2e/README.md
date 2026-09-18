# Playwright E2E Tests

This directory contains End-to-End (E2E) tests for Grab The Deals built using Playwright.

## Running Tests

- **Run all E2E tests:**
  ```bash
  npx playwright test
  ```

- **Run tests in headed mode (UI browser):**
  ```bash
  npx playwright test --headed
  ```

- **Debug tests:**
  ```bash
  npx playwright test --debug
  ```

- **View HTML test report:**
  ```bash
  npx playwright show-report
  ```

## Folder Structure

```
e2e/
├── constants/
│   └── selectors.ts     # Selector map
├── fixtures/
│   └── index.ts         # Custom Playwright test fixtures
├── helpers/
│   ├── assertions.ts    # Custom assertion utilities
│   └── navigation.ts    # Page navigation helpers
├── smoke.spec.ts        # Smoke verification test
└── README.md
```
