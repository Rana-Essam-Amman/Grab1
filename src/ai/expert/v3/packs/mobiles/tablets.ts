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
    const name = facts.subject !== 'تابلت' ? facts.subject : 'التابلت';
    const storage = facts.storage ? `بسعة ${facts.storage} جيجا` : '';
    return pick(seed, [storage ? `${name} ${storage}.` : `${name} للبيع.`, `${name}.`, `${name} للبيع.`], 1);
  },
  composition: (facts) => {
    const screen = facts.extras.find((item) => item.startsWith('شاشة '));
    return screen ? `يأتي ب${screen}.` : null;
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
    facts.subject !== 'تابلت' ? `جهاز أصلي من ${facts.subject}.` : '',
    'مفحوص قبل العرض.',
  ].filter(Boolean).slice(0, 4);
}
