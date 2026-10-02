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
  opening: (_facts, seed) => pick(seed, ['الرقم جاهز للنقل بعد الاتفاق.', 'النقل يتم بالتنسيق مع البائع.', 'الرقم متاح للبيع.'], 5),
  composition: () => 'النقل يتم بعد الاتفاق.',
  details: (facts) => bullets('🔹 تفاصيل الرقم:', ['النوع: رقم مميز.', facts.priceLabel ? `السعر: ${facts.priceLabel}.` : ''].filter(Boolean)),
  features: (facts) => bullets('🔹 أبرز المميزات:', [facts.priceLabel ? 'السعر واضح قبل التواصل.' : '', 'معاينة متاحة قبل الشراء.'].filter(Boolean)),
});
