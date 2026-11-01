import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FiltersLocationBlock } from '../FiltersLocationBlock';

describe('hierarchy reset integration', () => {
  it('clears visible governorate and district when parent draft is reset', () => {
    const onDraftChange = vi.fn();
    const { rerender } = render(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        initialGovSlug="amman"
        initialDistSlug="marka"
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
        onDraftChange={onDraftChange}
      />
    );
    expect(screen.getByRole('button', { name: /^Amman$/ }).className).toContain('bg-accent/15');
    expect(screen.getByRole('button', { name: 'Marka' }).className).toContain('bg-accent/15');

    rerender(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        initialGovSlug={null}
        initialDistSlug={null}
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
        onDraftChange={onDraftChange}
      />
    );
    expect(screen.getByRole('button', { name: /^Amman$/ }).className).not.toContain('bg-accent/15');
    expect(screen.queryByRole('button', { name: 'Marka' })).not.toBeInTheDocument();
  });

  it('does not keep a previous market selection after country change', () => {
    const { rerender } = render(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="JO"
        activeNeighborhood={null}
        initialGovSlug="amman"
        initialDistSlug={null}
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
        onDraftChange={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /^Amman$/ }).className).toContain('bg-accent/15');
    rerender(
      <FiltersLocationBlock
        isArabic={false}
        countryCode="SA"
        activeNeighborhood={null}
        initialGovSlug={null}
        initialDistSlug={null}
        onCityChange={vi.fn()}
        onNeighborhoodChange={vi.fn()}
        onDraftChange={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /^Amman$/ })).not.toBeInTheDocument();
  });
});
