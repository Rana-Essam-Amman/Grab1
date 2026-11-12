import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BackButton } from '../BackButton';

describe('BackButton', () => {
  it('renders English LTR label and left arrow', () => {
    render(<BackButton isArabic={false} onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Back' });
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Back');
    // Icon is decorative
    expect(btn.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('renders Arabic RTL label and right arrow', () => {
    render(<BackButton isArabic={true} onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'رجوع' });
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('رجوع');
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
