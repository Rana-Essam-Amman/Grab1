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
  opening: (facts, seed) => pick(seed, [
    `${facts.subject} جاهز للمعاينة، والسعة مذكورة في التفاصيل.`,
    `عرض التابلت يخص ${facts.subject}، ويمكن فحصه قبل الشراء.`,
    `${facts.subject} معروض للبيع بالمواصفات المكتوبة.`,
  ], 1),
  composition: (facts) => facts.storage ? `السعة المذكورة ${facts.storage} جيجا.` : null,
  details: (facts) => bullets('🔹 تفاصيل التابلت:', tabletDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', tabletFeatures(facts)),
});

function tabletDetails(facts: Facts): string[] {
  return [
    `النوع: تابلت ${facts.subject}.`,
    facts.storage ? `السعة: ${facts.storage} جيجا.` : 'السعة: لم تُذكر.',
    facts.extras.find((item) => item.startsWith('شاشة ')) ? `${facts.extras.find((item) => item.startsWith('شاشة '))}.` : 'مقاس الشاشة: لم يُذكر.',
    /واي فاي|شريحة/.test(facts.extras.join(' ')) ? 'الاتصال: مذكور في الجملة.' : 'الاتصال: لم يُذكر في الجملة.',
  ];
}

function tabletFeatures(facts: Facts): string[] {
  return [
    facts.storage ? `${facts.storage} جيجا تناسب الدراسة والتصفح.` : 'السعة غير مذكورة، والسؤال عنها قبل المعاينة.',
    facts.extras.some((item) => item.startsWith('شاشة ')) ? 'مقاس الشاشة مذكور، وهذا يوضح مناسبة العرض للقراءة.' : 'مقاس الشاشة غير مذكور في الجملة.',
    `${facts.subject} يمكن معاينته قبل الاتفاق.`,
    'الإعلان يقتصر على ما كتبه البائع.',
  ];
}
