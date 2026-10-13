import { useState, useEffect, useCallback } from 'react';
import { globalStorage } from '@/shared/lib/marketStorage';

const DRAFT_KEY = 'catch_edit_profile_draft_v1';

export interface EditProfileDraft {
  readonly firstName: string;
  readonly lastName: string;
}

/**
 * Persists EditProfileScreen form fields to localStorage so refresh /
 * navigation does not lose unsaved edits. Cleared on save.
 *
 * Avatar is intentionally NOT persisted here — base64 data URLs are
 * large and mostly transient. The saved avatar lives on the user object.
 */
export function useEditProfileDraft(initial: EditProfileDraft): {
  draft: EditProfileDraft;
  setField: (key: keyof EditProfileDraft, value: string) => void;
  clearDraft: () => void;
} {
  const [draft, setDraft] = useState<EditProfileDraft>(() => {
    const stored = globalStorage().get<Partial<EditProfileDraft>>(DRAFT_KEY);
    if (stored && typeof stored === 'object') {
      return {
        firstName: typeof stored.firstName === 'string' ? stored.firstName : initial.firstName,
        lastName: typeof stored.lastName === 'string' ? stored.lastName : initial.lastName,
      };
    }
    return initial;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        globalStorage().set(DRAFT_KEY, draft);
      } catch {
        // Quota exceeded — silent skip.
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [draft]);

  const setField = useCallback((key: keyof EditProfileDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearDraft = useCallback(() => {
    try {
      globalStorage().remove(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { draft, setField, clearDraft };
}
