import type { Facts } from '../../types';
import { pick } from '../../seeded';
import { bullets, packOf } from './shared';

const spec = {
  id: 'tabletsPack',
  noun: 'تابلت',
  detect: /تابلت|ايباد|آيباد/,
  brands: ['آيباد', 'ايباد', 'سامسونج'],
};

export const tabletsPack = packOf(spec, {
  title: (facts) => `تابلت ${facts.subject !== 'تابلت' ? facts.subject : ''} للبيع${facts.place ? ` — ${facts.place}` : ''}${facts.storage ? `، ${facts.storage} جيجا` : ''}`.replace(/\s+/g, ' ').trim(),
  opening: (facts, seed) => {
    const storage = facts.storage ? `بسعة ${facts.storage} جيجا` : '';
    const line = storage ? `تابلت ${facts.subject} ${storage}، ومتاح للمعاينة.` : 'التابلت بحالة جيدة، ومتاح للمعاينة.';
    return pick(seed, [line, line, 'التابلت بحالة جيدة، ومتاح للمعاينة.'], 1);
  },
  composition: (facts) => {
    const screen = facts.extras.find((item) => item.startsWith('شاشة '));
    return screen ? `يأتي ب${screen}، وهذا يوضح مقاس العرض.` : null;
  },
  details: (facts) => bullets('🔹 تفاصيل التابلت:', tabletDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', tabletFeatures(facts)),
});

function tabletDetails(facts: Facts): string[] {
  const screen = facts.extras.find((item) => item.startsWith('شاشة '));
  return [
    `النوع: تابلت ${facts.subject}.`,
    facts.storage ? `السعة: ${facts.storage} جيجا.` : '',
    screen ? `${screen}.` : '',
  ].filter(Boolean);
}

function tabletFeatures(facts: Facts): string[] {
  return [
    facts.storage ? `${facts.storage} جيجا تناسب الدراسة والتصفح.` : '',
    facts.extras.some((item) => item.startsWith('شاشة ')) ? 'الشاشة تناسب القراءة والتصفح.' : '',
    facts.subject === 'سامسونج' ? 'جهاز سامسونج أصلي.' : '',
    'مفحوص قبل العرض.',
  ].filter(Boolean).slice(0, 4);
}
