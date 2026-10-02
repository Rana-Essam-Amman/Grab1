import type { Facts } from '../../types';
import { pick } from '../../seeded';
import { bullets, packOf } from './shared';

const spec = {
  id: 'mobileAccPack',
  noun: 'إكسسوار جوال',
  detect: /كفر|شاحن|سماعة/,
  brands: ['سامسونج', 'آيفون', 'ايفون'],
};

export const mobileAccPack = packOf(spec, {
  title: (facts) => `إكسسوار جوال للبيع${facts.place ? ` — ${facts.place}` : ''}`.replace(/\s+/g, ' '),
  opening: (_facts, seed) => pick(seed, ['القطعة جاهزة للمعاينة.', 'الإكسسوار متاح قبل الشراء.', 'القطعة جاهزة للتسليم بعد الاتفاق.'], 3),
  composition: (facts) => facts.subject !== 'إكسسوار جوال' ? `يناسب ${facts.subject}، وجاهز للمعاينة.` : 'جاهز للمعاينة قبل الشراء.',
  details: (facts) => bullets('🔹 تفاصيل الإكسسوار:', accDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', accFeatures(facts)),
});

function accDetails(facts: Facts): string[] {
  const color = facts.extras.find((item) => item.startsWith('لون '));
  return [
    'النوع: إكسسوار جوال.',
    facts.subject !== 'إكسسوار جوال' ? `التوافق: ${facts.subject}.` : '',
    color ? `${color}.` : '',
  ].filter(Boolean);
}

function accFeatures(facts: Facts): string[] {
  return [
    facts.subject !== 'إكسسوار جوال' ? `يناسب ${facts.subject}.` : '',
    'فحص مسبق قبل العرض.',
    'معاينة متاحة قبل الشراء.',
  ].filter(Boolean);
}
