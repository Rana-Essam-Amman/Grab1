import React from 'react';
import { Tag } from 'lucide-react';
import { Listing } from '@/types';
import { ListingCard } from '@/shared/components';
import { EmptyState } from '@/shared/ui/EmptyState';

interface ProfileActiveListingsProps {
  isArabic: boolean;
  userAds: Listing[];
}

export const ProfileActiveListings: React.FC<ProfileActiveListingsProps> = ({
  isArabic,
  userAds,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-ink font-cairo">
            {isArabic ? 'إعلاناتي النشطة' : 'My Active Listings'}
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-ink-muted">
          {userAds.length} {isArabic ? 'إعلان' : 'ads'}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {userAds.length > 0 ? (
          userAds.map((listing: Listing) => (
            <ListingCard key={listing.id} listing={listing} layout="horizontal" />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <EmptyState
              icon={<Tag size={40} className="text-ink-muted" />}
              title={isArabic ? 'لا توجد إعلانات نشطة حالياً' : 'No active listings at the moment'}
              description=""
            />
          </div>
        )}
      </div>
    </div>
  );
};
