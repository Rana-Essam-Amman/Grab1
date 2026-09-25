/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom/vitest" />

import 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
