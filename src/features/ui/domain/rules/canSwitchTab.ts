import type { AppLocale, BottomTab } from '../entities/AppLocale';

export const ALL_TABS: readonly BottomTab[] = [
  'explore',
  'categories',
  'post',
  'chat',
  'profile',
];

export function canSwitchTab(tab: string): tab is BottomTab {
  return (ALL_TABS as readonly string[]).includes(tab);
}

const TAB_LABELS: Record<BottomTab, Record<AppLocale, string>> = {
  explore: { ar: 'استكشف', en: 'Explore' },
  categories: { ar: 'الأقسام', en: 'Categories' },
  post: { ar: 'أضف إعلان', en: 'Post Ad' },
  chat: { ar: 'الرسائل', en: 'Messages' },
  profile: { ar: 'حسابي', en: 'Profile' },
};

export function getInitialsForTab(tab: BottomTab, locale: AppLocale): string {
  return TAB_LABELS[tab][locale];
}
