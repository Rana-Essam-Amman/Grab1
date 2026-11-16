
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchableDropdown } from '../SearchableDropdown';

const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterAll(() => {
  if (originalScrollIntoView) {
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      {
        configurable: true,
        value: originalScrollIntoView,
      },
    );
  } else {
    Reflect.deleteProperty(
      HTMLElement.prototype,
      'scrollIntoView',
    );
  }
});

describe('SearchableDropdown keyboard focus', () => {
  const defaultProps = {
    options: ['Amman', 'Zarqa', 'Irbid'],
    value: '',
    onChange: vi.fn(),
    placeholder: 'Select city',
  };

  it('does not autofocus the search input when autoFocusSearch is false', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        autoFocusSearch={false}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /select city/i }),
    );

    const searchInput = screen.getByRole('combobox');

    expect(searchInput).toBeInTheDocument();
    expect(document.activeElement).not.toBe(searchInput);
  });

  it('preserves autofocus by default when autoFocusSearch is omitted', () => {
    render(
      <SearchableDropdown {...defaultProps} />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /select city/i }),
    );

    const searchInput = screen.getByRole('combobox');

    expect(searchInput).toBeInTheDocument();
    expect(document.activeElement).toBe(searchInput);
  });

  it('autofocuses the search input when autoFocusSearch is explicitly true', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        autoFocusSearch={true}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /select city/i }),
    );

    const searchInput = screen.getByRole('combobox');

    expect(document.activeElement).toBe(searchInput);
  });
});
