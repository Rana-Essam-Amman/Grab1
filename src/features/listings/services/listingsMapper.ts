import type { Listing } from '@/types';

export interface SupabaseListingRow {
  readonly id: string;
  readonly user_id: string;
  readonly is_demo?: boolean;
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
    isDemo: row.is_demo ?? false,
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

export function listingToRow(updates: Partial<Listing>): Partial<SupabaseListingRow> {
  const row: Record<string, unknown> = {};
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.price !== undefined) row.price = updates.price;
  if (updates.currency !== undefined) row.currency = updates.currency;
  if (updates.countryCode !== undefined) row.country_code = updates.countryCode;
  if (updates.city !== undefined) row.city = updates.city;
  if (updates.neighborhood !== undefined) row.neighborhood = updates.neighborhood || null;
  if (updates.categorySlug !== undefined) row.category_slug = updates.categorySlug;
  if (updates.subcategorySlug !== undefined) row.subcategory_slug = updates.subcategorySlug || null;
  if (updates.images !== undefined) row.images = updates.images;
  if (updates.imageWidth !== undefined) row.image_width = updates.imageWidth ?? null;
  if (updates.imageHeight !== undefined) row.image_height = updates.imageHeight ?? null;
  if (updates.attributes !== undefined) row.attributes = updates.attributes;
  if (updates.sellerName !== undefined) row.seller_name = updates.sellerName || null;
  if (updates.sellerPhone !== undefined) row.seller_phone = updates.sellerPhone || null;
  return row as Partial<SupabaseListingRow>;
}
