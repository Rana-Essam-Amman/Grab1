import type { CategoryMatch } from './ai/categoryMatch';

export type {
  VisionHints,
  ListingFacts,
  ListingCopyResult,
  GeneratedListing,
} from './ai/listingTypes';

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
  readonly key?: string;
  readonly label: string;
  readonly value: string;
}

export type ListingStatus = 'active' | 'pending' | 'sold' | 'archived';

export interface Listing {
  id: string;
  userId?: string;
  title: string;
  description: string;
  price: string;
  currency: 'JOD' | 'SAR' | 'ILS' | 'LBP' | 'SYP' | 'USD';
  countryCode: 'JO' | 'LB' | 'PS' | 'SY' | 'SA';
  city: string;
  neighborhood: string;
  categorySlug: string;
  subcategorySlug: string;
  imageUrl: string;
  images: string[];
  imageWidth?: number;
  imageHeight?: number;
  sellerPhone: string;
  sellerName: string;
  createdAt: string;
  views: number;
  attributes: ListingAttribute[];
  isPremium?: boolean;
  premiumExpiresAt?: string;
  autoBumpActive?: boolean;
  autoBumpExpiresAt?: string;
  status?: ListingStatus;
  lastBumpedAt?: string;
  isAutoBumpActive?: boolean;
  bumpsToday?: number;
  bumpsResetDate?: string;
  sourceLocale?: 'ar' | 'en';
  titleEn?: string;
  descriptionEn?: string;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  text: string;
  fromBuyer: boolean;
  timestamp: string;
  readAt?: string | null;
  isDeleted?: boolean;
}

import type { Conversation as DomainConversation } from '@/features/chat';

// Re-export from domain (single source of truth) with mutable compatibility
export type Conversation = {
  -readonly [K in keyof DomainConversation]: K extends 'messages'
    ? ChatMessage[]
    : DomainConversation[K];
};

export interface ListingComment {
  id: string;
  userId?: string;
  listingId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone: string;
  countryCode: string;
  avatarUrl?: string;
  avatar?: string;
  isVipShop?: boolean;
  browseMarket?: 'JO' | 'SA' | 'LB' | 'PS' | 'SY' | null;
}

export interface RegisteredAccount {
  email: string;
  phone: string;
  countryCode: string;
  password?: string;
  firstName: string;
  lastName?: string;
  status?: ListingStatus;
}

export interface PostDraft {
  categorySlug: string;
  subcategorySlug: string;
  photos: string[];
  city: string;
  neighborhood: string;
  site: string;
  latitude?: number;
  longitude?: number;
  noteText: string;
  title?: string;
  price?: string;
  description?: string;
  generated?: GeneratedListing;
  readonly variantSeed?: number;
  readonly draftId?: string;
}
