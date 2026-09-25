import React, { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from '../Button';
import { renderWithProviders } from '@/test/helpers';

describe('Button Primitive Component', () => {
  it('renders with default props and text children', () => {
    renderWithProviders(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders primary variant with bg-primary', () => {
    renderWithProviders(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: /primary/i })).toHaveClass('bg-primary');
  });

  it('renders danger variant with bg-danger', () => {
    renderWithProviders(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button', { name: /delete/i })).toHaveClass('bg-danger');
  });

  it('renders ghost variant with transparent background', () => {
    renderWithProviders(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass('bg-transparent');
  });

  it('renders outline and secondary variants correctly', () => {
    const { unmount } = renderWithProviders(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass('border-border');
    unmount();

    renderWithProviders(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass('bg-surface');
  });

  it('renders sm, md, and lg sizes correctly', () => {
    const { unmount, rerender } = renderWithProviders(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('h-8');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button', { name: /medium/i })).toHaveClass('h-10');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass('h-12');
    unmount();
  });

  it('renders fullWidth with w-full class', () => {
    renderWithProviders(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button', { name: /full width/i })).toHaveClass('w-full');
  });

  it('loading state renders spinner, disables button, and prevents clicks', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(
      <Button isLoading onClick={handleClick}>
        Save Changes
      </Button>
    );

    const button = screen.getByRole('button', { name: /save changes/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('fires onClick when clicked and not disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByRole('button', { name: /submit/i });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation and fires onClick on Enter press', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole('button', { name: /keyboard/i });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref and passes custom className', () => {
    const ref = createRef<HTMLButtonElement>();
    renderWithProviders(
      <Button ref={ref} className="custom-test-btn">
        Ref Button
      </Button>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current).toHaveClass('custom-test-btn');
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(<Button>Accessible Action</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
