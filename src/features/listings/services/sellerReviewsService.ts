import { supabase } from '@/shared/lib/supabase';

export interface SellerReview {
  readonly id: string;
  readonly sellerId: string;
  readonly reviewerId: string;
  readonly listingId: string | null;
  readonly rating: number;
  readonly comment: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface SellerReviewRow {
  readonly id: string;
  readonly seller_id: string;
  readonly reviewer_id: string;
  readonly listing_id: string | null;
  readonly rating: number;
  readonly comment: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

function rowToReview(row: SellerReviewRow): SellerReview {
  return {
    id: row.id,
    sellerId: row.seller_id,
    reviewerId: row.reviewer_id,
    listingId: row.listing_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchSellerReviews(sellerId: string, limit = 20): Promise<{ data: SellerReview[]; error: string | null }> {
  if (!sellerId) return { data: [], error: 'missing sellerId' };
  try {
    const { data, error } = await supabase
      .from('seller_reviews')
      .select('id, seller_id, reviewer_id, listing_id, rating, comment, created_at, updated_at')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return { data: [], error: error.message };
    return { data: (data ?? []).map(rowToReview), error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'unknown' };
  }
}

export async function submitSellerReview(listingId: string, rating: number, comment?: string): Promise<{ id: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('submit_seller_review', {
      p_listing_id: listingId,
      p_rating: rating,
      p_comment: comment ?? null,
    });
    if (error) return { id: null, error: error.message };
    return { id: typeof data === 'string' ? data : null, error: null };
  } catch (err) {
    return { id: null, error: err instanceof Error ? err.message : 'unknown' };
  }
}
