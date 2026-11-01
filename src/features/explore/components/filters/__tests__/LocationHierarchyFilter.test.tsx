
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationHierarchyFilter } from '../LocationHierarchyFilter';

vi.mock('@/data/locations/registry', () => {
  const data = {
    JO: [
      {
        slug: 'amman',
        nameAr: 'العاصمة',
        nameEn: 'Amman',
        districts: [
          {
            slug: 'amman-qasabah',
            nameAr: 'لواء قصبة عمان',
            nameEn: 'Amman Qasabah',
            villages: [
              {
                slug: 'wadi-as-sir',
                nameAr: 'وادي السير',
                nameEn: 'Wadi as Sir',
              },
            ],
          },
        ],
      },
    ],
    SA: [
      {
        slug: 'riyadh-region',
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        districts: [],
      },
    ],
  };

  return {
    getAllGovernorates: (countryCode: string) =>
      data[countryCode as keyof typeof data] ?? [],

    getAllDistricts: (countryCode: string, governorateSlug: string) =>
      data[countryCode as keyof typeof data]?.find(
        (governorate) => governorate.slug === governorateSlug
      )?.districts ?? [],

    getAllCamps: () => [],
  };
});

describe('LocationHierarchyFilter', () => {
  it('clears search and selected hierarchy when market changes', async () => {
    const onSelect = vi.fn();

    const { rerender } = render(
      <LocationHierarchyFilter
        countryCode="JO"
        isArabic={false}
        activeNeighborhood={null}
        onSelect={onSelect}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: /^Amman$/ })
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Amman Qasabah' })
    );

    expect(
      screen.getByRole('button', { name: 'Wadi as Sir' })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('geo-hierarchy-search'), {
      target: { value: 'Wadi' },
    });

    rerender(
      <LocationHierarchyFilter
        countryCode="SA"
        isArabic={false}
        activeNeighborhood={null}
        onSelect={onSelect}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('geo-hierarchy-search')
      ).toHaveValue('');

      expect(
        screen.getByRole('button', { name: 'Riyadh' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Amman' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Amman Qasabah' })
      ).not.toBeInTheDocument();
    });

    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
