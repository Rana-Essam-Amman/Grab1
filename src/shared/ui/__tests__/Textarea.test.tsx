import React, { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Textarea } from '../Textarea';
import { renderWithProviders } from '@/test/helpers';

describe('Textarea Primitive Component', () => {
  it('renders label and binds it to the textarea', () => {
    renderWithProviders(<Textarea label="Notes" id="notes-field" />);
    const label = screen.getByText('Notes');
    const textarea = screen.getByRole('textbox', { name: 'Notes' });

    expect(label).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'notes-field');
  });

  it('renders error message and sets aria-invalid="true"', () => {
    renderWithProviders(
      <Textarea label="Description" error="Description is required" id="desc-area" />
    );

    const textarea = screen.getByRole('textbox', { name: 'Description' });
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'desc-area-error');
  });

  it('renders hint when provided without error', () => {
    renderWithProviders(
      <Textarea label="Bio" hint="Max 500 characters" id="bio-field" />
    );

    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveAttribute('aria-describedby', 'bio-field-hint');
  });

  it('handles user typing and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithProviders(<Textarea label="Message" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'Hello world');
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Hello world');
  });

  it('forwards ref properly', () => {
    const ref = createRef<HTMLTextAreaElement>();
    renderWithProviders(<Textarea ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('has no accessibility violations with jest-axe', async () => {
    const { container } = renderWithProviders(
      <Textarea label="Feedback" placeholder="Write feedback here..." />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
