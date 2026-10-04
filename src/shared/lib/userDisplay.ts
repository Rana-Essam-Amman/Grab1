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
