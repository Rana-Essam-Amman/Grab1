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
  opening: (_facts, seed) => pick(seed, ['الرقم للبيع، والنقل بعد الاتفاق.', 'الرقم ضمن العرض، والنقل بالتنسيق.', 'نقل الرقم يتم بعد الاتفاق والمعاينة.'], 5),
  composition: () => null,
  details: (facts) => bullets('🔹 تفاصيل الرقم:', ['النوع: رقم مميز.', facts.priceLabel ? `السعر: ${facts.priceLabel}.` : ''].filter(Boolean)),
  features: (facts) => bullets('🔹 أبرز المميزات:', [facts.priceLabel ? 'السعر واضح قبل التواصل.' : ''].filter(Boolean)),
});
