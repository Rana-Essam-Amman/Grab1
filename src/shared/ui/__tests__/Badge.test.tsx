import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from '../Badge';
import { renderWithProviders } from '@/test/helpers';

describe('Badge Primitive Component', () => {
  it('renders badge text content correctly', () => {
    renderWithProviders(<Badge>Featured</Badge>);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders various color variants', () => {
    const { rerender } = renderWithProviders(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-warning');

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger')).toHaveClass('bg-danger');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border-border');
  });

  it('renders sm and md sizes correctly', () => {
    const { rerender } = renderWithProviders(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('text-[11px]');

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass('text-xs');
  });

  it('renders leading icon properly alongside children', () => {
    renderWithProviders(
      <Badge icon={<span data-testid="badge-icon">⭐</span>}>Verified</Badge>
    );

    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <Badge variant="primary">New Listing</Badge>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
