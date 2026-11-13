import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackButton } from '../BackButton';

// Deterministic mocks so we can assert the exact icon component used
vi.mock('iconsax-react', () => {
  const ArrowLeft = (props: Record<string, unknown>) => (
    <svg data-testid="arrow-left" aria-hidden={props['aria-hidden']} />
  );
  const ArrowRight = (props: Record<string, unknown>) => (
    <svg data-testid="arrow-right" aria-hidden={props['aria-hidden']} />
  );
  return { ArrowLeft, ArrowRight };
});

describe('BackButton', () => {
  it('renders English LTR label and ArrowLeft', () => {
    render(<BackButton isArabic={false} onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Back' });
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Back');
    // Explicit icon assertion
    expect(screen.getByTestId('arrow-left')).toBeTruthy();
    expect(screen.queryByTestId('arrow-right')).toBeNull();
    expect(btn.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders Arabic RTL label and ArrowRight', () => {
    render(<BackButton isArabic={true} onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'رجوع' });
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('رجوع');
    // Explicit icon assertion
    expect(screen.getByTestId('arrow-right')).toBeTruthy();
    expect(screen.queryByTestId('arrow-left')).toBeNull();
  });

  it('meets 44x44 minimum interactive target', () => {
    render(<BackButton isArabic={false} onClick={vi.fn()} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('min-h-11');
    expect(btn.className).toContain('min-w-11');
  });

  it('invokes onClick callback', () => {
    const onClick = vi.fn();
    render(<BackButton isArabic={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
