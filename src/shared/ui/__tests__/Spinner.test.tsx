import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Spinner } from '../Spinner';
import { renderWithProviders } from '@/test/helpers';

describe('Spinner Primitive Component', () => {
  it('renders with role="status" and default aria-label="Loading"', () => {
    renderWithProviders(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
    expect(screen.getByText('Loading')).toHaveClass('sr-only');
  });

  it('allows custom aria label', () => {
    renderWithProviders(<Spinner label="جاري التحميل..." />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'جاري التحميل...');
    expect(screen.getByText('جاري التحميل...')).toBeInTheDocument();
  });

  it('renders all size variants (xs, sm, md, lg, xl)', () => {
    const { rerender } = renderWithProviders(<Spinner size="xs" />);
    expect(screen.getByRole('status')).toHaveClass('h-3');

    rerender(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('h-4');

    rerender(<Spinner size="md" />);
    expect(screen.getByRole('status')).toHaveClass('h-6');

    rerender(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('h-8');

    rerender(<Spinner size="xl" />);
    expect(screen.getByRole('status')).toHaveClass('h-12');
  });

  it('renders color variants (primary, white, muted)', () => {
    const { rerender } = renderWithProviders(<Spinner variant="primary" />);
    expect(screen.getByRole('status')).toHaveClass('text-primary');

    rerender(<Spinner variant="white" />);
    expect(screen.getByRole('status')).toHaveClass('text-white');

    rerender(<Spinner variant="muted" />);
    expect(screen.getByRole('status')).toHaveClass('text-ink-muted');
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(<Spinner label="Processing..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
