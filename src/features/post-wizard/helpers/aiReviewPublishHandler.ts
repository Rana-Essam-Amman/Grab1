import { buildNewListingPayload } from './buildNewListingPayload';
import { getCurrentUser } from '@/features/auth/helpers/publishPhoneGuard';
import { attachPublishResultHandler } from './attachPublishResultHandler';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import type { PostDraft, Listing } from '@/types';
import type { ScreenType } from '@/store/ui.slice.types';

export interface ExecuteAiPublishParams {
  readonly postDraft: PostDraft;
  readonly browseCountryCode: string;
  readonly activeCurrency: string;
  readonly isAdmin: boolean;
  readonly isArabic: boolean;
  readonly publishListing: (listing: Listing, targetMarket: string, isArabic: boolean) => Promise<{ success: boolean; remoteId: string | null; error: string | null }>;
  readonly resetPostDraft: () => void;
  readonly navigateTo: (screen: ScreenType) => void;
}

export function executeAiPublish(params: ExecuteAiPublishParams): void {
  const { postDraft, browseCountryCode, activeCurrency, isAdmin, isArabic, publishListing, resetPostDraft, navigateTo } = params;
  const { title, price, targetMarket, newListing } = buildNewListingPayload({
    postDraft,
    user: getCurrentUser(),
    browseCountryCode,
    activeCurrency,
    isAdmin,
  });
  if (!title || !price) return;

  const publishPromise = publishListing(newListing, targetMarket, isArabic);
  resetPostDraft();
  capture(EVENTS.LISTING_PUBLISHED, { flow: 'ai' });
  navigateTo('post-publish-success');
  attachPublishResultHandler(publishPromise, 'ai', isArabic, navigateTo);
}
