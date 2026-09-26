import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { RegistryProvider } from '@/shared/registry';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <RegistryProvider>{children}</RegistryProvider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
