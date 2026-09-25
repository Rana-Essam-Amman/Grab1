import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AiReviewScreen } from '../AiReviewScreen';

const mockGoBack = vi.fn();
const mockSetIsCountrySheetOpen = vi.fn();
let mockHookError: string | null = null;

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: mockGoBack,
    activeCurrency: 'JOD',
    setIsCountrySheetOpen: mockSetIsCountrySheetOpen,
    browseCountryCode: 'JO',
  }),
}));

vi.mock('../../hooks/useAiReview', () => ({
  useAiReview: () => ({
    title: 'Review Title',
    price: '100',
    city: 'Amman',
    neighborhood: 'Sweifieh',
    description: 'Review description',
    photos: ['p1.jpg'],
    hasMissingParams: false,
    missingRequiredLabels: [],
    isPublishing: false,
    attributes: [],
    setAttributeValue: vi.fn(),
    setTitle: vi.fn(),
    setPrice: vi.fn(),
    setCity: vi.fn(),
    setNeighborhood: vi.fn(),
    setDescription: vi.fn(),
    addPhotos: vi.fn(),
    removePhoto: vi.fn(),
    handlePublish: vi.fn(),
    error: mockHookError,
  }),
}));

describe('AiReviewScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHookError = null;
  });

  it('renders without crash and shows review elements', () => {
    render(<AiReviewScreen />);
    expect(screen.getByText('Review Listing')).toBeInTheDocument();
    expect(screen.getByText('Review Title')).toBeInTheDocument();
  });

  it('passes error prop from hook to body component', () => {
    mockHookError = 'Error from review hook';
    render(<AiReviewScreen />);
    expect(screen.getByText('Error from review hook')).toBeInTheDocument();
  });

  it('renders publish button and it is enabled when valid', () => {
    render(<AiReviewScreen />);
    const btn = screen.getByRole('button', { name: /publish now/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });
});
