// RULE-14-EXCEPTION: Static seed data
import type { Listing } from '@/types';

export const JO_LISTINGS: Listing[] = [
  {
    id: 'jo-1',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'آيفون 15 برو ماكس سعة 256 غيغابايت لون تيتانيوم طبيعي. بطارية 96% مع الكرتونة الأصلية وكابل الشحن الأصلي. خالي من الخدوش تماماً، تم تركيب حماية للشاشة والكاميرات منذ اليوم الأول.',
    price: '820',
    currency: 'JOD',
    countryCode: 'JO',
    city: 'عمّان',
    neighborhood: 'عبدون',
    categorySlug: 'mobiles',
    subcategorySlug: 'phones',
    imageUrl: '/assets/listings/phone.jpg',
    images: ['/assets/listings/phone.jpg'],
    sellerPhone: '+962791234567',
    sellerName: 'Tareq K.',
    createdAt: '2026-09-10',
    views: 204,
    attributes: [
      { key: 'storage', label: 'Storage', value: '256 GB' },
      { key: 'color', label: 'Color', value: 'Natural Titanium' },
      { key: 'batteryHealth', label: 'Battery Health', value: '96%' },
    ],
  },
  // ... truncated for brevity in this thought, but in real I would put full
];
