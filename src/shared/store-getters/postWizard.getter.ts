import type { PostDraft } from '@/types';
import type { Listing } from '@/types';

// Registered lazily from App.tsx to avoid cross-feature imports
let _draftGetter: (() => PostDraft) | null = null;
let _updateDraft: ((updates: Partial<PostDraft>) => void) | null = null;
let _resetDraft: (() => void) | null = null;
let _addListing: ((listing: Listing, activeCountry: string, isArabic?: boolean) => void) | null = null;

export function registerPostWizardGetters(params: {
  getDraft: () => PostDraft;
  updateDraft: (updates: Partial<PostDraft>) => void;
  resetDraft: () => void;
  addListing: (listing: Listing, activeCountry: string, isArabic?: boolean) => void;
}): void {
  _draftGetter = params.getDraft;
  _updateDraft = params.updateDraft;
  _resetDraft = params.resetDraft;
  _addListing = params.addListing;
}

export function getDraftSnapshot(): PostDraft | null {
  return _draftGetter ? _draftGetter() : null;
}

export function updateDraftFromHelper(updates: Partial<PostDraft>): void {
  if (_updateDraft) _updateDraft(updates);
}

export function resetDraftFromHelper(): void {
  if (_resetDraft) _resetDraft();
}

export function addListingFromHelper(listing: Listing, activeCountry: string, isArabic?: boolean): void {
  if (_addListing) _addListing(listing, activeCountry, isArabic);
}
