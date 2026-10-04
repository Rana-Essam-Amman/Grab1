/**
 * Single source of truth for user-facing identity rendering.
 *
 * Avatar priority: uploaded avatar → Google avatar → brand default.
 * Nickname priority: (added in a follow-up commit) nickname → firstName → 
 * localized generic.
 *
 * Any new UI that renders a user's avatar MUST use getUserAvatar() so 
 * the fallback stays consistent across the app.
 */

export const DEFAULT_AVATAR = '/assets/icons/logo.png';

interface AvatarSource {
  readonly avatar?: string;
  readonly avatarUrl?: string;
}

/**
 * Resolve the avatar URL for a user, falling back to the FOX logo.
 * Returns DEFAULT_AVATAR if the user is null or has no image set.
 */
export function getUserAvatar(user: AvatarSource | null | undefined): string {
  return user?.avatar || user?.avatarUrl || DEFAULT_AVATAR;
}

interface DisplayNameSource {
  readonly nickname?: string;
  readonly firstName?: string;
}

/**
 * Resolve the display name for a user.
 *
 * Priority: nickname → firstName → locale-generic fallback.
 * Sentinels ('User', 'زائر') from the auth listener are ignored so we 
 * don't show them as real names.
 */
export function getUserDisplayName(
  user: DisplayNameSource | null | undefined,
  isArabic = true
): string {
  const nick = user?.nickname?.trim();
  if (nick) return nick;

  const first = user?.firstName?.trim();
  if (first && first !== 'User' && first !== 'زائر') return first;

  return isArabic ? 'مستخدم FOX' : 'FOX User';
}
