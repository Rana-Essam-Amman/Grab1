import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Sheet } from '../Sheet';
import { renderWithProviders } from '@/test/helpers';

describe('Sheet Primitive Component - Behavior Tests', () => {
  it('1. User can close via backdrop click', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = renderWithProviders(
      <Sheet open={true} onClose={handleClose} title="Backdrop Sheet Test">
        Sheet Content
      </Sheet>
    );

    const backdrop = container.querySelector('.bg-black\\/60');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('2. User can close via Escape key', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderWithProviders(
      <Sheet open={true} onClose={handleClose} title="Escape Sheet">
        Content
      </Sheet>
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('3. User CANNOT close by clicking sheet content (stopPropagation works)', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderWithProviders(
      <Sheet open={true} onClose={handleClose} title="Inner Sheet Click">
        <div data-testid="sheet-inner">Inside sheet content</div>
      </Sheet>
    );

    const inner = screen.getByTestId('sheet-inner');
    await user.click(inner);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('4. Sheet respects RTL direction inheritance', () => {
    document.documentElement.dir = 'rtl';
    renderWithProviders(
      <div dir="rtl">
        <Sheet open={true} onClose={vi.fn()} title="اختر المدينة">
          <p>قائمة المدن المتاحة</p>
        </Sheet>
      </div>
    );

    expect(screen.getByText('اختر المدينة')).toBeInTheDocument();
    expect(screen.getByText('قائمة المدن المتاحة')).toBeInTheDocument();
  });

  it('5. Sheet renders children correctly', () => {
    renderWithProviders(
      <Sheet open={true} onClose={vi.fn()} title="Select Location">
        <div data-testid="child-location">Amman, Jordan</div>
      </Sheet>
    );

    expect(screen.getByTestId('child-location')).toBeInTheDocument();
    expect(screen.getByText('Amman, Jordan')).toBeInTheDocument();
  });

  it('6. Sheet title is announced for screen readers (role="dialog", aria-labelledby)', () => {
    renderWithProviders(
      <Sheet open={true} onClose={vi.fn()} title="Screen Reader Sheet Title">
        <p>Sheet body</p>
      </Sheet>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleElement = document.getElementById(labelledById!);
    expect(titleElement).toHaveTextContent('Screen Reader Sheet Title');
  });

  it('7. Body scroll lock prevents background scroll', () => {
    const { unmount, rerender } = renderWithProviders(
      <Sheet open={true} onClose={vi.fn()} title="Scroll Lock Sheet">
        Content
      </Sheet>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Sheet open={false} onClose={vi.fn()} title="Scroll Lock Sheet">
        Content
      </Sheet>
    );

    expect(document.body.style.overflow).not.toBe('hidden');
    unmount();
  });

  it('8. jest-axe: zero violations', async () => {
    const { container } = renderWithProviders(
      <Sheet open={true} onClose={vi.fn()} title="Accessible Sheet">
        <p>Sheet body content</p>
      </Sheet>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

