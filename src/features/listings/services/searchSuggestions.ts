import { supabase } from '@/shared/lib/supabase';

export interface SearchSuggestion {
  readonly suggestion: string;
  readonly suggestionType: 'keyword' | 'synonym' | 'category' | 'subcategory' | 'token';
  readonly weight: number;
  readonly categorySlug: string | null;
}

export async function searchSuggestions(
  query: string,
  limit = 10,
): Promise<SearchSuggestion[]> {
  const { data, error } = await supabase.rpc('search_suggestions', {
    p_query: query,
    p_limit: limit,
  });

  if (error || !data) return [];

  return (data as Array<{
    suggestion: string;
    suggestion_type: string;
    weight: number;
    category_slug: string | null;
  }>).map((row) => ({
    suggestion: row.suggestion,
    suggestionType: row.suggestion_type as SearchSuggestion['suggestionType'],
    weight: Number(row.weight),
    categorySlug: row.category_slug,
  }));
}
