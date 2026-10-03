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
  opening: (_facts, seed) => pick(seed, ['الساعة بحالة جيدة، ومتاحة للمعاينة.', 'الجهاز ضمن العرض، ومتاح للمعاينة.', 'الساعة معروضة، ويمكن الاتفاق على الزيارة.'], 2),
  composition: (facts) => {
    const color = facts.extras.find((item) => item.startsWith('لون '));
    return color ? `تأتي ${color}.` : null;
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
    facts.extras.some((item) => item.startsWith('بطارية ')) ? 'بطارية تكفي يوماً من الاستخدام.' : '',
    'مفحوصة قبل العرض.',
  ].filter(Boolean);
}
