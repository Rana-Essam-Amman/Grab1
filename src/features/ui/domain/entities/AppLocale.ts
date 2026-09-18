export type AppLocale = 'ar' | 'en';
export type AppTheme = 'light' | 'dark';
export type BottomTab = 'explore' | 'categories' | 'post' | 'chat' | 'profile';

export interface UiState {
  readonly locale: AppLocale;
  readonly theme: AppTheme;
  readonly activeTab: BottomTab;
}
