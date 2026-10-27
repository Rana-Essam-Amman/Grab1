import React from 'react';
import type { Listing } from '@/types';
import { ExploreListingFeed } from './ExploreListingFeed';
import { SectionHeader } from './SectionHeader';

type ExploreFeedProps = React.ComponentProps<typeof ExploreListingFeed>;

interface ExploreListingsSectionsProps {
  primaryFeedProps: ExploreFeedProps;
  tier2Listings: Listing[];
  isArabic: boolean;
  showTier2: boolean;
  hasTier1: boolean;
}

export const ExploreListingsSections: React.FC<ExploreListingsSectionsProps> = ({
  primaryFeedProps,
  tier2Listings,
  isArabic,
  showTier2,
  hasTier1,
}) => (
  <>
    {/* Listings Feed: Show empty state if there's an active search, even if Tier 2 exists */}
    {(hasTier1 || primaryFeedProps.activeSearchText) ? (
      <ExploreListingFeed {...primaryFeedProps} />
    ) : showTier2 ? null : (
      <ExploreListingFeed {...primaryFeedProps} />
    )}

    {showTier2 && (
      <section data-testid="tier2-section" className="mt-4">
        <SectionHeader title={isArabic ? 'قد يهمك' : 'You may also like'} />
        <ExploreListingFeed
          {...primaryFeedProps}
          listings={tier2Listings}
          hasMore={false}
          isLoadingMore={false}
          onLoadMore={() => {}}
        />
      </section>
    )}
  </>
);
