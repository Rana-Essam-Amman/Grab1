import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Avatar } from '../Avatar';
import { renderWithProviders } from '@/test/helpers';

describe('Avatar Primitive Component', () => {
  it('renders image element when valid src is provided', () => {
    renderWithProviders(
      <Avatar src="https://example.com/photo.jpg" alt="User Name" />
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(img).toHaveAttribute('alt', 'User Name');
  });

  it('renders fallback text when no src is provided', () => {
    renderWithProviders(<Avatar fallback="SY" />);
    expect(screen.getByText('SY')).toBeInTheDocument();
  });

  it('renders first letters of alt when neither src nor explicit fallback is provided', () => {
    renderWithProviders(<Avatar alt="Karim Zaid" />);
    expect(screen.getByText('Ka')).toBeInTheDocument();
  });

  it('falls back to initials when image trigger onError', () => {
    renderWithProviders(
      <Avatar src="https://example.com/broken.jpg" alt="Broken Image" fallback="FB" />
    );

    const img = screen.getByRole('img');
    act(() => {
      fireEvent.error(img);
    });

    expect(screen.getByText('FB')).toBeInTheDocument();
  });

  it('renders various sizes (xs, sm, md, lg, xl)', () => {
    const { rerender } = renderWithProviders(<Avatar fallback="A" size="xs" />);
    expect(screen.getByText('A').parentElement).toHaveClass('h-6');

    rerender(<Avatar fallback="B" size="sm" />);
    expect(screen.getByText('B').parentElement).toHaveClass('h-8');

    rerender(<Avatar fallback="C" size="md" />);
    expect(screen.getByText('C').parentElement).toHaveClass('h-10');

    rerender(<Avatar fallback="D" size="lg" />);
    expect(screen.getByText('D').parentElement).toHaveClass('h-14');

    rerender(<Avatar fallback="E" size="xl" />);
    expect(screen.getByText('E').parentElement).toHaveClass('h-20');
  });

  it('renders online and offline status indicators', () => {
    const { rerender } = renderWithProviders(<Avatar fallback="U" status="online" />);
    const onlineBadge = screen.getByLabelText('online');
    expect(onlineBadge).toBeInTheDocument();
    expect(onlineBadge).toHaveClass('bg-success');

    rerender(<Avatar fallback="U" status="offline" />);
    const offlineBadge = screen.getByLabelText('offline');
    expect(offlineBadge).toBeInTheDocument();
    expect(offlineBadge).toHaveClass('bg-ink-muted');
  });

  it('renders circle vs square shape', () => {
    const { rerender } = renderWithProviders(<Avatar fallback="A" shape="circle" />);
    expect(screen.getByText('A').parentElement).toHaveClass('rounded-full');

    rerender(<Avatar fallback="A" shape="square" />);
    expect(screen.getByText('A').parentElement).toHaveClass('rounded-2xl');
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <Avatar fallback="AU" alt="Ahmad User" status="online" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
