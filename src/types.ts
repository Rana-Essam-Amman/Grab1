import type { CategoryMatch } from './ai/categoryMatch';

export interface CategoryDef {
  slug: string;
  nameEn: string;
  nameAr: string;
  asset: string;
}

export interface SubcategoryDef {
  slug: string;
  nameEn: string;
  nameAr: string;
}

export interface CurrencyDef {
  code: string;
  nameEn: string;
  nameAr: string;
}

export interface CountryDef {
  code: 'JO' | 'LB' | 'PS' | 'SY' | 'SA';
  nameEn: string;
  nameAr: string;
  flagUrl: string;
  currencies: CurrencyDef[];
}

export interface ListingAttribute {
  label: string;
  value: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  countryCode: string;
  city: string;
  neighborhood: string;
  categorySlug: string;
  subcategorySlug: string;
  imageUrl: string;
  images: string[];
  sellerPhone: string;
  sellerName: string;
  createdAt: string;
  views: number;
  attributes: ListingAttribute[];
  isPremium?: boolean;
  lastBumpedAt?: string;
  isAutoBumpActive?: boolean;
  sourceLocale?: 'ar' | 'en';
  titleEn?: string;
  descriptionEn?: string;
}

export interface VisionHints {
  color?: string;
  body?: string;
  conditionLook?: string;
}

export interface ListingFacts {
  make?: string;
  year?: string;
  price?: string;
  city?: string;
  km?: string;
  inspect?: boolean;
  negotiable?: boolean;
  color?: string;
  body?: string;
}

export interface ListingCopyResult {
  title: string;
  body: string;
  facts: ListingFacts;
  missing: string[];
}

export interface GeneratedListing {
  title: string;
  description: string;
  price: string;
  categorySlug: string;
  subcategorySlug: string;
  city?: string;
  year?: string;
  make?: string;
  missing: string[];
  categoryMatch?: CategoryMatch;
}

export interface ChatMessage {
  id: string;
  text: string;
  fromBuyer: boolean;
  timestamp: string;
}

import type { Conversation as DomainConversation } from '@/features/chat/domain/entities/Conversation';

// Re-export from domain (single source of truth) with mutable compatibility
export type Conversation = {
  -readonly [K in keyof DomainConversation]: K extends 'messages'
    ? ChatMessage[]
    : DomainConversation[K];
};

export interface ListingComment {
  id: string;
  listingId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  avatarUrl?: string;
  avatar?: string;
  isVipShop?: boolean;
}

export interface RegisteredAccount {
  email: string;
  phone: string;
  countryCode: string;
  password?: string;
  firstName: string;
  lastName?: string;
  status?: 'Pending' | 'Active';
}

export interface PostDraft {
  categorySlug: string;
  subcategorySlug: string;
  photos: string[];
  city: string;
  neighborhood: string;
  site: string;
  noteText: string;
  title?: string;
  price?: string;
  description?: string;
  generated?: GeneratedListing;
}
