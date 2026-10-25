import { supabase } from '@/shared/lib/supabase';

export interface SocialComment {
  id: string; content: string; created_at: string; user_id: string; user_name: string; user_avatar: string | null; parent_comment_id: string | null;
}
export interface LikeResult { liked: boolean; like_count: number; }

export async function toggleLike(listingId: string): Promise<LikeResult | null> {
  const { data, error } = await supabase.rpc('toggle_post_like', { p_listing_id: listingId });
  if (error) { console.error('toggleLike error:', error); return null; }
  return data as LikeResult;
}

export async function getComments(listingId: string): Promise<SocialComment[]> {
  const { data, error } = await supabase.rpc('get_post_comments', { p_listing_id: listingId });
  if (error) { console.error('getComments error:', error); return []; }
  return (data as SocialComment[]) || [];
}

export async function addComment(listingId: string, content: string, parentId?: string | null): Promise<boolean> {
  const { error } = await supabase.rpc('add_post_comment', { p_listing_id: listingId, p_content: content, p_parent_id: parentId || null });
  if (error) { console.error('addComment error:', error); return false; }
  return true;
}
