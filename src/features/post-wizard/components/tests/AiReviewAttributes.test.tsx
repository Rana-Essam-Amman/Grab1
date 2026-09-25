import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AiReviewAttributes } from '../AiReviewAttributes';

const baseProps = {
  isArabic: false,
  onAttributeChange: vi.fn(),
  focusedKey: null,
  onResetFocusedKey: vi.fn(),
};

describe('AiReviewAttributes', () => {
  it('returns null when attributes empty', () => {
    const { container } = render(<AiReviewAttributes {...baseProps} attributes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders text input for type=text', () => {
    render(
      <AiReviewAttributes
        {...baseProps}
        attributes={[{ key: 'model', label: 'Model', value: 'Camry', type: 'text', required: true }]}
      />
    );
    expect(screen.getByDisplayValue('Camry')).toBeInTheDocument();
  });

  it('renders select with options for type=select', () => {
    render(
      <AiReviewAttributes
        {...baseProps}
        attributes={[{
          key: 'transmission',
          label: 'Transmission',
          value: '',
          type: 'select',
          options: ['Automatic', 'Manual'],
          required: true,
          placeholder: 'Select...',
        }]}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Automatic' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Manual' })).toBeInTheDocument();
  });

  it('calls onAttributeChange when select changes', () => {
    const onChange = vi.fn();
    render(
      <AiReviewAttributes
        {...baseProps}
        onAttributeChange={onChange}
        attributes={[{
          key: 'fuel',
          label: 'Fuel',
          value: '',
          type: 'select',
          options: ['Petrol', 'Diesel'],
          required: true,
          placeholder: 'Select...',
        }]}
      />
    );
    const select = screen.getByRole('combobox');
    (select as HTMLSelectElement).value = 'Diesel';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onChange).toHaveBeenCalledWith('fuel', 'Diesel');
  });

  it('renders number input for type=number', () => {
    render(
      <AiReviewAttributes
        {...baseProps}
        attributes={[{ key: 'km', label: 'Mileage', value: '50000', type: 'number', required: true }]}
      />
    );
    expect(screen.getByDisplayValue('50000')).toHaveAttribute('type', 'number');
  });
});
