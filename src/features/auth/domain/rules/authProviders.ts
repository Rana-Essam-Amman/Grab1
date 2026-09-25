import { AuthProviderDef } from '../entities/AuthProvider';

const ALL_PLATFORMS = ['web', 'ios', 'android'] as const;
const IOS_ONLY = ['ios'] as const;

export const AUTH_PROVIDERS: readonly AuthProviderDef[] = [
  {
    id: 'google',
    labelAr: 'تابع باستخدام Google',
    labelEn: 'Continue with Google',
    status: 'coming_soon',
    platforms: ALL_PLATFORMS,
  },
  {
    id: 'apple',
    labelAr: 'تابع باستخدام Apple',
    labelEn: 'Continue with Apple',
    status: 'coming_soon',
    platforms: IOS_ONLY,
  },
  {
    id: 'email',
    labelAr: 'تابع بالبريد الإلكتروني',
    labelEn: 'Continue with Email',
    status: 'coming_soon',
    platforms: ALL_PLATFORMS,
  },
  {
    id: 'whatsapp',
    labelAr: 'تابع عبر واتساب',
    labelEn: 'Continue with WhatsApp',
    status: 'coming_soon',
    platforms: ALL_PLATFORMS,
  },
  {
    id: 'sms',
    labelAr: 'تابع برسالة SMS',
    labelEn: 'Continue with SMS',
    status: 'unavailable',
    platforms: ALL_PLATFORMS,
  },
  {
    id: 'guest',
    labelAr: 'تصفح كضيف',
    labelEn: 'Browse as guest',
    status: 'available',
    platforms: ALL_PLATFORMS,
  },
];

export const getProvidersByPlatform = (
  platform: 'web' | 'ios' | 'android',
): readonly AuthProviderDef[] =>
  AUTH_PROVIDERS.filter((p) => p.platforms.includes(platform));
