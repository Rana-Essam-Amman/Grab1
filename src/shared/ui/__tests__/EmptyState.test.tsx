import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { EmptyState, EmptyStateNoResults } from '../EmptyState';
import { renderWithProviders } from '@/test/helpers';

describe('EmptyState Primitive Component', () => {
  it('renders title and description properly', () => {
    renderWithProviders(
      <EmptyState
        title="No items found"
        description="You have not added any listings to your collection yet."
      />
    );

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(
      screen.getByText('You have not added any listings to your collection yet.')
    ).toBeInTheDocument();
  });

  it('renders action node when provided', () => {
    renderWithProviders(
      <EmptyState
        title="Empty Wishlist"
        action={<button>Browse Deals</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Browse Deals' })).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    renderWithProviders(
      <EmptyState
        title="Custom State"
        icon={<span data-testid="custom-icon">✨</span>}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('EmptyStateNoResults renders default Arabic search empty state', () => {
    renderWithProviders(<EmptyStateNoResults />);

    expect(screen.getByText('لا توجد نتائج')).toBeInTheDocument();
    expect(
      screen.getByText('جرب البحث بكلمات أخرى أو تعديل خيارات التصفية')
    ).toBeInTheDocument();
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <EmptyState
        title="Accessible Empty State"
        description="Clear instructions are displayed here."
        action={<button>Refresh</button>}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
