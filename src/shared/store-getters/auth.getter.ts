import type { UserProfile } from '@/types';

let _getUser: (() => UserProfile | null) | null = null;

export function registerAuthGetter(getter: () => UserProfile | null): void {
  _getUser = getter;
}

export function getCurrentUser(): UserProfile | null {
  return _getUser ? _getUser() : null;
}
