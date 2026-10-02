import type { Facts } from '../../types';
import { pick } from '../../seeded';
import { bullets, packOf } from './shared';

const spec = {
  id: 'smartWatchesPack',
  noun: 'ساعة ذكية',
  detect: /ساعة ذكية|ابل ووتش/,
  brands: ['أبل', 'سامسونج'],
};

export const smartWatchesPack = packOf(spec, {
  title: (facts) => `ساعة ذكية للبيع${facts.place ? ` — ${facts.place}` : ''}`.replace(/\s+/g, ' '),
  opening: (_facts, seed) => pick(seed, ['الساعة جاهزة للمعاينة.', 'الساعة متاحة قبل الشراء.', 'الساعة جاهزة للتسليم بعد الاتفاق.'], 2),
  composition: (facts) => {
    const color = facts.extras.find((item) => item.startsWith('لون '));
    return color ? `تأتي ${color}، وجاهزة للمعاينة.` : 'جاهزة للمعاينة قبل الشراء.';
  },
  details: (facts) => bullets('🔹 تفاصيل الساعة:', watchDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', watchFeatures(facts)),
});

function watchDetails(facts: Facts): string[] {
  const color = facts.extras.find((item) => item.startsWith('لون '));
  const battery = facts.extras.find((item) => item.startsWith('بطارية '));
  return [
    'النوع: ساعة ذكية.',
    color ? `${color}.` : '',
    battery ? `${battery}.` : '',
    facts.extras.includes('مقاومة ماء') ? 'مقاومة الماء: نعم.' : '',
  ].filter(Boolean);
}

function watchFeatures(facts: Facts): string[] {
  return [
    facts.extras.includes('مقاومة ماء') ? 'الساعة تتحمل الاستخدام مع الماء حسب وصف البائع.' : '',
    facts.extras.some((item) => item.startsWith('بطارية ')) ? 'بطارية مفحوصة قبل العرض.' : '',
    'فحص مسبق قبل العرض.',
    'معاينة متاحة قبل الشراء.',
  ].filter(Boolean);
}
