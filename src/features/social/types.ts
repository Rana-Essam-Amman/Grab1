// Verified from live RPC: get_social_feed
// Note: images_list is the JSON alias for the listings.images column.
export interface SocialPost {
  id: string;
  title: string;
  description: string | null;
  price: string;
  currency: string;
  city: string;
  category_slug: string;
  images_list: string[];
  created_at: string;
  seller_name: string;
  seller_avatar: string | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
}
