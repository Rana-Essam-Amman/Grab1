import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AiReviewBody } from '../AiReviewBody';

const defaultProps = {
  isArabic: false,
  photos: ['photo1.jpg'],
  onAddPhotos: vi.fn(),
  onRemovePhoto: vi.fn(),
  title: 'Toyota Camry 2020',
  price: '15000',
  city: 'Amman',
  neighborhood: 'Abdoun',
  description: 'Clean car in great condition.',
  currency: 'JOD',
  attributes: [
    { key: 'year', label: 'Year', value: '2020', required: true, type: 'text' as const },
    { key: 'color', label: 'Color', value: 'White', required: true, type: 'select' as const, options: ['White', 'Black'] },
    { key: 'km', label: 'KM', value: '', required: true, type: 'number' as const },
  ],
  onAttributeChange: vi.fn(),
  mapQuery: 'Abdoun, Amman',
  onTitleChange: vi.fn(),
  onPriceChange: vi.fn(),
  onOpenCityPicker: vi.fn(),
  onOpenNeighborhoodPicker: vi.fn(),
  onDescriptionChange: vi.fn(),
  hasMissing: true,
  missingRequiredLabels: ['KM'] as string[],
};

describe('AiReviewBody — v5 inline-edit architecture', () => {
  it('renders photo hero with the first photo', () => {
    const { container } = render(<AiReviewBody {...defaultProps} />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'photo1.jpg');
  });

  it('renders title as text (view mode)', () => {
    render(<AiReviewBody {...defaultProps} />);
    expect(screen.getByText('Toyota Camry 2020')).toBeInTheDocument();
  });

  it('renders price as text and currency separately', () => {
    render(<AiReviewBody {...defaultProps} />);
    expect(screen.getByText('15000')).toBeInTheDocument();
    expect(screen.getByText('JOD')).toBeInTheDocument();
  });

  it('renders city and area as separate chips', () => {
    render(<AiReviewBody {...defaultProps} />);
    expect(screen.getByText('Amman')).toBeInTheDocument();
    expect(screen.getByText('Abdoun')).toBeInTheDocument();
  });

  it('renders description as text (view mode)', () => {
    render(<AiReviewBody {...defaultProps} />);
    expect(screen.getByText('Clean car in great condition.')).toBeInTheDocument();
  });

  it('renders filled spec chips with values', () => {
    render(<AiReviewBody {...defaultProps} />);
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });

  it('renders empty required spec chip with its label', () => {
    render(<AiReviewBody {...defaultProps} />);
    const kmMatches = screen.getAllByText('KM');
    expect(kmMatches.length).toBeGreaterThan(0);
  });

  it('renders missing fields message when missingRequiredLabels not empty', () => {
    render(<AiReviewBody {...defaultProps} />);
    const el = screen.getByText(/Complete:/);
    expect(el).toBeInTheDocument();
  });
});
