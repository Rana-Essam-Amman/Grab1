import type { Facts } from '../../types';
import { pick } from '../../seeded';
import { bullets, packOf } from './shared';

const spec = {
  id: 'numbersPack',
  noun: 'رقم',
  detect: /رقم مميز/,
  brands: [],
};

export const numbersPack = packOf(spec, {
  title: (facts) => `رقم مميز للبيع${facts.priceLabel ? ` — ${facts.priceLabel}` : ''}`.replace(/\s+/g, ' '),
  opening: (_facts, seed) => pick(seed, [
    'الرقم معروض للبيع، والسعر يذكر إذا كتبه البائع.',
    'العرض يخص رقماً مميزاً كما ورد في الجملة.',
    'نقل الرقم يتم بالتنسيق بعد الاتفاق.',
  ], 5),
  composition: (facts) => facts.priceLabel ? `السعر المذكور ${facts.priceLabel}.` : null,
  details: (facts) => bullets('🔹 تفاصيل الرقم:', [
    'النوع: رقم مميز.',
    facts.priceLabel ? `السعر: ${facts.priceLabel}.` : 'السعر: لم يُذكر.',
    'النقل: بالتنسيق مع البائع.',
    'لا تُذكر أرقام إضافية غير المكتوبة.',
  ]),
  features: (facts) => bullets('🔹 أبرز المميزات:', [
    facts.priceLabel ? 'السعر مكتوب، وهذا يوضح أساس التفاوض.' : 'السعر غير مذكور، والسؤال عنه مباشرة.',
    'النقل يتم بعد الاتفاق، لا قبله.',
    'الإعلان لا يضيف ميزة للرقم غير المكتوبة.',
    'المعاينة هنا تعني التأكد من الرقم مع البائع.',
  ]),
});
