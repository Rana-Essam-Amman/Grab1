import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PostDetailsScreen } from '../PostDetailsScreen';

const mockHandlePublish = vi.fn();
let mockState = {
  title: '',
  price: '',
  city: 'Amman',
  neighborhood: 'Sweifieh',
  description: '',
  photos: ['p1.jpg'],
  hasMissingParams: true,
  isPublishing: false,
  attributes: [] as { key: string; label: string; value: string; required?: boolean }[],
  missingRequiredLabels: [] as string[],
  error: null as string | null,
};

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    isArabic: false,
    goBack: vi.fn(),
    activeCurrency: 'JOD',
    browseCountryCode: 'JO',
  }),
}));

vi.mock('../../hooks/usePostWizard', () => ({
  usePostWizard: () => ({
    postDraft: { categorySlug: 'cars', subcategorySlug: 'sedan', city: 'Amman', neighborhood: 'Sweifieh' },
  }),
}));

vi.mock('../../hooks/useAiReview', () => ({
  useAiReview: () => ({
    ...mockState,
    setAttributeValue: vi.fn(),
    setTitle: vi.fn(),
    setPrice: vi.fn(),
    setCity: vi.fn(),
    setDescription: vi.fn(),
    handlePublish: mockHandlePublish,
  }),
}));

vi.mock('@/data/categories', () => ({
  categories: [{ slug: 'cars', nameEn: 'Cars', nameAr: 'سيارات', asset: '' }],
}));

vi.mock('@/data/subcategories', () => ({
  findSubcategoryBySlug: () => ({ nameEn: 'Sedan', nameAr: 'سيدان' }),
}));

vi.mock('@/data/listingFields', () => ({
  getListingFields: () => [],
}));

vi.mock('../components/PostFlowHeader', () => ({
  PostFlowHeader: () => <div data-testid="post-flow-header" />,
}));

vi.mock('../components/PreviewChips', () => ({
  PreviewChips: () => null,
}));

vi.mock('../components/DynamicFieldRenderer', () => ({
  DynamicFieldRenderer: () => null,
}));

vi.mock('../components/StaticMapPreview', () => ({
  StaticMapPreview: () => null,
}));

vi.mock('@/shared/lib/formatPrice', () => ({
  formatPrice: (p: string) => p,
}));

function getNoticeContainer(): HTMLElement {
  const heading = screen.getByText(/Required fields:/);
  const container = heading.parentElement;
  if (!container) {
    throw new Error('MissingFieldsNotice container not found');
  }
  return container;
}

describe('PostDetailsScreen validation feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState = {
      title: '',
      price: '',
      city: 'Amman',
      neighborhood: 'Sweifieh',
      description: '',
      photos: ['p1.jpg'],
      hasMissingParams: true,
      isPublishing: false,
      attributes: [],
      missingRequiredLabels: [],
      error: null,
    };
  });

  it('shows Listing Title when title is missing and disables Publish', () => {
    mockState.missingRequiredLabels = ['Listing Title'];
    mockState.hasMissingParams = true;
    render(<PostDetailsScreen />);
    const notice = getNoticeContainer();
    expect(notice).toHaveTextContent('Listing Title');
    expect(screen.getByTestId('post-details-publish-btn')).toBeDisabled();
  });

  it('shows Price when price is missing and disables Publish', () => {
    mockState.title = 'My Car';
    mockState.price = '';
    mockState.missingRequiredLabels = ['Price'];
    mockState.hasMissingParams = true;
    render(<PostDetailsScreen />);
    const notice = getNoticeContainer();
    expect(notice).toHaveTextContent('Price');
    expect(screen.getByTestId('post-details-publish-btn')).toBeDisabled();
  });

  it('shows required attribute labels and disables Publish', () => {
    mockState.title = 'My Car';
    mockState.price = '5000';
    mockState.attributes = [{ key: 'year', label: 'Year', value: '', required: true }];
    mockState.missingRequiredLabels = ['Year'];
    mockState.hasMissingParams = true;
    render(<PostDetailsScreen />);
    const notice = getNoticeContainer();
    expect(notice).toHaveTextContent('Year');
    expect(screen.getByTestId('post-details-publish-btn')).toBeDisabled();
  });

  it('enables Publish and hides notice when all required fields are present', () => {
    mockState.title = 'My Car';
    mockState.price = '5000';
    mockState.missingRequiredLabels = [];
    mockState.hasMissingParams = false;
    render(<PostDetailsScreen />);
    expect(screen.queryByText(/Required fields:/)).toBeNull();
    const btn = screen.getByTestId('post-details-publish-btn');
    expect(btn).not.toBeDisabled();
  });
});
