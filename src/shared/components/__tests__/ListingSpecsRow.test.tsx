import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ListingSpecsRow } from '../ListingSpecsRow';

describe('ListingSpecsRow', () => {
  it('renders numeric specs formatted with commas and units', () => {
    const specs = [
      { label: 'المسافة القطوعة', value: '5000000', key: 'km' },
      { label: 'المساحة', value: '2500', key: 'area' },
      { label: 'سنة التصنيع', value: '2020', key: 'year' },
    ];

    render(<ListingSpecsRow specs={specs} isArabic={true} />);

    expect(screen.getByText('5,000,000 كم')).toBeInTheDocument();
    expect(screen.getByText('2,500 م²')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('renders English units when isArabic is false', () => {
    const specs = [
      { label: 'Mileage', value: '120000', key: 'mileage' },
      { label: 'Area', value: '350', key: 'area' },
    ];

    render(<ListingSpecsRow specs={specs} isArabic={false} />);

    expect(screen.getByText('120,000 KM')).toBeInTheDocument();
    expect(screen.getByText('350 m²')).toBeInTheDocument();
  });
});
