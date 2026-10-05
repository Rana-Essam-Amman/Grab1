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
  readonly attributes: unknown;
  readonly status: string;
  readonly views: number;
  readonly seller_name: string | null;
  readonly seller_phone: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly bumps_today?: number | null;
  readonly bumps_reset_date?: string | null;
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
    sellerPhone: row.seller_phone || '',
    sellerName: row.seller_name || '',
    createdAt: row.created_at.split('T')[0],
    views: row.views,
    status: row.status as Listing['status'],
    bumpsToday: row.bumps_today ?? 0,
    bumpsResetDate: row.bumps_reset_date ?? undefined,
    attributes: attrs as Listing['attributes'],
  };
}
