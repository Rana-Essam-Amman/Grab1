import React from 'react';
import { useUI } from '@/hooks/useUI';
import { Listing } from '@/types';
import { Modal } from '@/shared/ui/Modal';
import { useShareItems } from './useShareItems';
import { ShareModalHeader } from './ShareModalHeader';
import { ShareModalGrid } from './ShareModalGrid';

interface ShareModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ listing, onClose }) => {
  const { isArabic } = useUI();
  const { shareItems, toastMessage, displayCurrency } = useShareItems(listing, isArabic);

  return (
    <Modal
      open={true}
      onClose={onClose}
      size="md"
      className="max-w-[440px] rounded-3xl border border-border p-5 bg-surface [&>button:first-child]:hidden"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4 sm:hidden" />
        <ShareModalHeader
          isArabic={isArabic}
          listing={listing}
          displayCurrency={displayCurrency}
          onClose={onClose}
        />
        <ShareModalGrid
          shareItems={shareItems}
          toastMessage={toastMessage}
        />
      </div>
    </Modal>
  );
};
