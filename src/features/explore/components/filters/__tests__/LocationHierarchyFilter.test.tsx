
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocationHierarchyFilter } from '../LocationHierarchyFilter';

vi.mock('@/data/locations/registry', () => {
  const data = {
    JO: [
      {
        slug: 'amman',
        nameAr: 'عمان',
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
      { slug: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa', districts: [] },
    ],
    SA: [
      {
        slug: 'riyadh-region',
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        districts: [],
      },
    ],
    PS: [
      { slug: 'jenin', nameAr: 'جنين', nameEn: 'Jenin', districts: [] },
      { slug: 'nablus', nameAr: 'نابلس', nameEn: 'Nablus', districts: [] },
    ],
    LB: [
      { slug: 'beirut', nameAr: 'بيروت', nameEn: 'Beirut', districts: [] },
    ],
    SY: [
      { slug: 'damascus', nameAr: 'دمشق', nameEn: 'Damascus', districts: [] },
    ],
    KW: [
      {
        slug: 'al-asimah',
        nameAr: 'العاصمة',
        nameEn: 'Al Asimah',
        districts: [
          {
            slug: 'al-kuwait-city',
            nameAr: 'مدينة الكويت',
            nameEn: 'Kuwait City',
            villages: [{ slug: 'should-not-render', nameAr: 'لا يظهر', nameEn: 'Should Not Render' }],
          },
        ],
      },
    ],
  };
  const camps = [
    { slug: 'amman-camp', nameAr: 'مخيم عمان', nameEn: 'Amman Camp', governorateSlug: 'amman' },
    { slug: 'zarqa-camp', nameAr: 'مخيم الزرقاء', nameEn: 'Zarqa Camp', governorateSlug: 'zarqa' },
    { slug: 'jenin-camp', nameAr: 'مخيم جنين', nameEn: 'Jenin Camp', governorateSlug: 'jenin' },
  ];

  return {
    getAllGovernorates: (countryCode: string) =>
      data[countryCode as keyof typeof data] ?? [],

    getAllDistricts: (countryCode: string, governorateSlug: string) =>
      data[countryCode as keyof typeof data]?.find(
        (governorate) => governorate.slug === governorateSlug
      )?.districts ?? [],

    getAllCamps: () => camps,
    registerCountry: () => undefined,
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

  it('returns canonical slugs for governorate, district, and village', () => {
    const onLocationChange = vi.fn();
    render(
      <LocationHierarchyFilter
        countryCode="JO"
        isArabic={false}
        activeNeighborhood={null}
        onSelect={vi.fn()}
        onLocationChange={onLocationChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));
    expect(onLocationChange).toHaveBeenLastCalledWith({
      governorateSlug: 'amman',
      districtSlug: null,
      neighborhoodSlug: null,
      label: 'Amman',
      cityEn: 'Amman',
      cityAr: 'العاصمة',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Amman Qasabah' }));
    expect(onLocationChange).toHaveBeenLastCalledWith({
      governorateSlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: null,
      label: 'Amman Qasabah',
      cityEn: null,
      cityAr: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Wadi as Sir' }));
    expect(onLocationChange).toHaveBeenLastCalledWith({
      governorateSlug: 'amman',
      districtSlug: 'amman-qasabah',
      neighborhoodSlug: 'wadi-as-sir',
      label: 'Wadi as Sir',
      cityEn: null,
      cityAr: null,
    });
  });

  it('uses Market Profile labels and hides Kuwait third level', () => {
    const { rerender } = render(
      <LocationHierarchyFilter countryCode="JO" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />
    );
    expect(screen.getByText('City')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));
    expect(screen.getByText('Neighbourhood')).toBeInTheDocument();
    expect(screen.queryByText('Districts')).not.toBeInTheDocument();
    expect(screen.queryByText('Liwa')).not.toBeInTheDocument();

    const arabic = render(<LocationHierarchyFilter countryCode="JO" isArabic={true} activeNeighborhood={null} onSelect={vi.fn()} />);
    fireEvent.click(arabic.getByRole('button', { name: 'عمان' }));
    expect(arabic.getByText('الحي')).toBeInTheDocument();
    expect(arabic.queryByText('اللواء')).not.toBeInTheDocument();
    expect(arabic.queryByText('الأقضية')).not.toBeInTheDocument();
    arabic.unmount();

    rerender(<LocationHierarchyFilter countryCode="SA" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Region')).toBeInTheDocument();
    rerender(<LocationHierarchyFilter countryCode="PS" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Area')).toBeInTheDocument();
    rerender(<LocationHierarchyFilter countryCode="LB" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Governorate')).toBeInTheDocument();
    rerender(<LocationHierarchyFilter countryCode="SY" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Governorate')).toBeInTheDocument();

    rerender(<LocationHierarchyFilter countryCode="KW" isArabic={false} activeNeighborhood={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Governorate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Al Asimah' }));
    expect(screen.getByText('Area')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Kuwait City' }));
    expect(screen.queryByTestId('hierarchy-level-3')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Should Not Render' })).not.toBeInTheDocument();
  });

  it('scopes camps to the selected governorate and clears them on parent change', () => {
    const onLocationChange = vi.fn();
    const onSelect = vi.fn();
    render(
      <LocationHierarchyFilter
        countryCode="JO"
        isArabic={false}
        activeNeighborhood={null}
        onSelect={onSelect}
        onLocationChange={onLocationChange}
      />
    );

    expect(screen.queryByTestId('hierarchy-camps')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Amman Camp' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Amman$/ }));
    expect(screen.getByRole('button', { name: 'Amman Camp' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Zarqa Camp' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Amman Camp' }));
    expect(onLocationChange).toHaveBeenLastCalledWith(expect.objectContaining({
      governorateSlug: 'amman',
      districtSlug: null,
      neighborhoodSlug: 'amman-camp',
    }));

    fireEvent.click(screen.getByRole('button', { name: 'Zarqa' }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
    expect(onLocationChange).toHaveBeenLastCalledWith(expect.objectContaining({
      governorateSlug: 'zarqa',
      districtSlug: null,
      neighborhoodSlug: null,
    }));
    expect(screen.queryByRole('button', { name: 'Amman Camp' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zarqa Camp' })).toBeInTheDocument();
  });
});
