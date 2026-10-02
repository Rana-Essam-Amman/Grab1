import { useCallback } from 'react';
import { extractFacts } from '@/ai/listingCopyAgent';
import { composeListing } from '@/ai/expert/composer';
import type { PostDraft } from '@/types';

interface RegenerateParams {
  readonly postDraft: PostDraft;
  readonly updatePostDraft: (updates: Partial<PostDraft>) => void;
}

/**
 * Regenerate the listing title + description with a fresh variantSeed.
 * Facts stay the same — only the wording changes.
 */
export function useRegenerateListing({
  postDraft,
  updatePostDraft,
}: RegenerateParams): () => void {
  return useCallback(() => {
    const raw = postDraft.noteText || '';
    if (!raw.trim()) return;
    const facts = extractFacts(raw, undefined);
    const nextSeed = (postDraft.variantSeed ?? 0) + 1;
    const composed = composeListing(facts, postDraft.categorySlug, nextSeed);
    if (!composed) return;
    updatePostDraft({
      variantSeed: nextSeed,
      generated: postDraft.generated
        ? {
            ...postDraft.generated,
            title: composed.title,
            description: composed.description,
          }
        : undefined,
    });
  }, [postDraft, updatePostDraft]);
}
