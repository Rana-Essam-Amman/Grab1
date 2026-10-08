import type { Listing } from '@/types';

export interface SupabaseListingRow {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly currency: string;
  readonly country_code: string;
  readonly city: string;
  readonly neighborhood: string | null;
  readonly category_slug: string;
  readonly subcategory_slug: string | null;
  readonly images: string[];
  readonly image_width?: number | null;
  readonly image_height?: number | null;
  readonly attributes: unknown;
  readonly status: string;
  readonly views: number;
  readonly seller_name: string | null;
  readonly seller_phone: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly bumps_today?: number | null;
  readonly bumps_reset_date?: string | null;
  readonly is_premium?: boolean | null;
  readonly premium_expires_at?: string | null;
  readonly auto_bump_active?: boolean | null;
  readonly auto_bump_expires_at?: string | null;
}

export function rowToListing(row: SupabaseListingRow): Listing {
  const attrs = Array.isArray(row.attributes)
    ? (row.attributes as Array<{ key?: string; label: string; value: string }>)
    : [];
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency as Listing['currency'],
    countryCode: row.country_code as Listing['countryCode'],
    city: row.city,
    neighborhood: row.neighborhood || '',
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug || '',
    imageUrl: row.images?.[0] || '',
    images: row.images || [],
    imageWidth: row.image_width ?? undefined,
    imageHeight: row.image_height ?? undefined,
    sellerPhone: row.seller_phone || '',
    sellerName: row.seller_name || '',
    createdAt: row.created_at.split('T')[0],
    views: row.views,
    status: row.status as Listing['status'],
    isPremium: Boolean(row.is_premium) && (!row.premium_expires_at || new Date(row.premium_expires_at) >= new Date()),
    premiumExpiresAt: row.premium_expires_at ?? undefined,
    autoBumpActive: row.auto_bump_active ?? false,
    autoBumpExpiresAt: row.auto_bump_expires_at ?? undefined,
    bumpsToday: row.bumps_today ?? 0,
    bumpsResetDate: row.bumps_reset_date ?? undefined,
    attributes: attrs as Listing['attributes'],
  };
}
