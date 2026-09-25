import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Modal } from '../Modal';
import { renderWithProviders } from '@/test/helpers';

describe('Modal Primitive Component - Behavior Tests', () => {
  it('1. User can close via Escape key', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Escape Test">
        Modal Content
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('2. User can close via backdrop click', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { container } = renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Backdrop Test">
        Modal Content
      </Modal>
    );

    const backdrop = container.querySelector('.bg-black\\/50') || container.querySelector('[data-testid="modal-backdrop"]');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('3. User CANNOT close by clicking modal content (stopPropagation works)', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderWithProviders(
      <Modal open={true} onClose={handleClose} title="Inner Click Test">
        <div data-testid="modal-inner">Inside content</div>
      </Modal>
    );

    const innerContent = screen.getByTestId('modal-inner');
    await user.click(innerContent);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('4. Modal respects RTL direction inheritance', () => {
    document.documentElement.dir = 'rtl';
    const { container } = renderWithProviders(
      <div dir="rtl">
        <Modal open={true} onClose={vi.fn()} title="عنوان النافذة">
          <p>محتوى النافذة المنبثقة</p>
        </Modal>
      </div>
    );

    expect(screen.getByText('عنوان النافذة')).toBeInTheDocument();
    expect(screen.getByText('محتوى النافذة المنبثقة')).toBeInTheDocument();
    // Close button uses logical padding end-4
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toHaveClass('end-4');
  });

  it('5. Modal renders children correctly', () => {
    renderWithProviders(
      <Modal
        open={true}
        onClose={vi.fn()}
        title="Terms & Conditions"
        description="Please read carefully"
        footer={<button>Agree</button>}
      >
        <div data-testid="custom-child">Child Element Content</div>
      </Modal>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Child Element Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agree' })).toBeInTheDocument();
  });

  it('6. Modal title is announced for screen readers (role="dialog", aria-labelledby)', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="A11y Announcement Title" description="A11y description">
        Accessible body
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleElement = document.getElementById(labelledById!);
    expect(titleElement).toHaveTextContent('A11y Announcement Title');
  });

  it('7. Body scroll lock prevents background scroll', () => {
    const { unmount, rerender } = renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Scroll Lock">
        Content
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal open={false} onClose={vi.fn()} title="Scroll Lock">
        Content
      </Modal>
    );

    expect(document.body.style.overflow).not.toBe('hidden');
    unmount();
  });

  it('8. jest-axe: zero violations', async () => {
    const { container } = renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Accessible Modal Dialog" description="Screen reader description">
        <p>This is a fully accessible modal dialog.</p>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

