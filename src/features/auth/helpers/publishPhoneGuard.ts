import { useAuthStore } from '../store/auth.slice';
import { usePhoneModalStore } from '../store/phoneModal.slice';
import type { UserProfile } from '@/types';

/**
 * Read fresh user from store (avoids stale closures after phone save).
 */
export function getCurrentUser(): UserProfile | null {
  return useAuthStore.getState().user;
}

/**
 * Gate publish on user.phone being present.
 *
 * Returns true if phone exists (publish allowed).
 * Returns false and opens PhoneCaptureModal if phone is missing.
 * After the modal saves the phone, `retry` is invoked to resume publish.
 */
export function requirePhoneForPublish(retry: () => void): boolean {
  const user = useAuthStore.getState().user;
  if (user?.phone) return true;
  usePhoneModalStore.getState().open(retry);
  return false;
}
