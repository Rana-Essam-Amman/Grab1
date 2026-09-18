import React, { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from '../Input';
import { renderWithProviders } from '@/test/helpers';

describe('Input Primitive Component', () => {
  it('renders label and binds it to the input field', () => {
    renderWithProviders(<Input label="Phone Number" id="test-phone" />);
    const label = screen.getByText('Phone Number');
    const input = screen.getByRole('textbox', { name: 'Phone Number' });

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-phone');
  });

  it('renders placeholder correctly', () => {
    renderWithProviders(<Input placeholder="Search listings..." />);
    expect(screen.getByPlaceholderText('Search listings...')).toBeInTheDocument();
  });

  it('renders error message and applies error variant styles with aria-invalid="true"', () => {
    renderWithProviders(
      <Input label="Email" error="Invalid email address" id="email-field" />
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const errorMessage = screen.getByText('Invalid email address');

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-field-error');
    expect(input).toHaveClass('border-danger');
  });

  it('renders hint when no error is present', () => {
    renderWithProviders(
      <Input label="Username" hint="Must be at least 3 characters" id="username-field" />
    );

    expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: 'Username' });
    expect(input).toHaveAttribute('aria-describedby', 'username-field-hint');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('renders left icon and right icon', () => {
    renderWithProviders(
      <Input
        placeholder="Icon input"
        icon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✓</span>}
      />
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('renders password input type properly', () => {
    renderWithProviders(<Input label="Password" type="password" />);
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('fires onChange handler when typed into', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithProviders(
      <Input label="Name" onChange={handleChange} placeholder="Type name" />
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'Ahmad');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Ahmad');
  });

  it('disabled state prevents typing and interaction', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithProviders(
      <Input label="Disabled Field" disabled onChange={handleChange} />
    );

    const input = screen.getByRole('textbox', { name: 'Disabled Field' });
    expect(input).toBeDisabled();

    await user.type(input, 'test');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders sm, md, and lg sizes correctly', () => {
    const { rerender } = renderWithProviders(<Input size="sm" placeholder="sm" />);
    expect(screen.getByPlaceholderText('sm')).toHaveClass('h-8');

    rerender(<Input size="md" placeholder="md" />);
    expect(screen.getByPlaceholderText('md')).toHaveClass('h-10');

    rerender(<Input size="lg" placeholder="lg" />);
    expect(screen.getByPlaceholderText('lg')).toHaveClass('h-12');
  });

  it('forwards input ref properly', () => {
    const ref = createRef<HTMLInputElement>();
    renderWithProviders(<Input ref={ref} placeholder="Ref Test" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <Input
        label="Full Name"
        hint="Please enter your first and last name"
        placeholder="e.g. Sami Omar"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with error state', async () => {
    const { container } = renderWithProviders(
      <Input
        label="Email Address"
        error="Please provide a valid email"
        placeholder="user@example.com"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
