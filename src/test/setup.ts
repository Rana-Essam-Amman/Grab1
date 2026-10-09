import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, afterAll, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw-server';
import { toHaveNoViolations } from 'jest-axe';
import { useUIStore } from '@/store/ui.slice';
import { useAuthStore } from '@/features/auth';
import { registerUIGetter } from '@/shared/store-getters/ui.getter';
import { registerAuthGetter } from '@/shared/store-getters/auth.getter';

registerUIGetter(() => useUIStore.getState());
registerAuthGetter(() => useAuthStore.getState().user);

expect.extend(toHaveNoViolations);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
});
afterAll(() => server.close());

// Mock window.matchMedia (needed for some components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
