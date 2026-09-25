import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Chip } from '../Chip';
import { renderWithProviders } from '@/test/helpers';

describe('Chip Primitive Component', () => {
  it('renders chip text children', () => {
    renderWithProviders(<Chip>Electronics</Chip>);
    expect(screen.getByRole('button', { name: 'Electronics' })).toBeInTheDocument();
  });

  it('handles selected state and aria-pressed', () => {
    const { rerender } = renderWithProviders(<Chip selected={false}>Motors</Chip>);
    const chip = screen.getByRole('button', { name: 'Motors' });
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    rerender(<Chip selected={true}>Motors</Chip>);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveClass('bg-primary');
  });

  it('renders leading icon', () => {
    renderWithProviders(
      <Chip icon={<span data-testid="chip-icon">🚗</span>}>Cars</Chip>
    );
    expect(screen.getByTestId('chip-icon')).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(<Chip onClick={handleClick}>Filter</Chip>);

    const chip = screen.getByRole('button', { name: 'Filter' });
    await user.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(<Chip selected={true}>Active Filter</Chip>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
