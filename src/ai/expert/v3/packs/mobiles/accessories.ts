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
  opening: (_facts, seed) => pick(seed, [
    'القطعة معروضة للبيع، والتوافق مذكور إن ورد في الجملة.',
    'العرض يخص إكسسوار جوال بالمواصفات المكتوبة.',
    'الإكسسوار جاهز للمعاينة قبل الاتفاق.',
  ], 3),
  composition: () => 'التغليف يذكر فقط إذا كتبه البائع.',
  details: (facts) => bullets('🔹 تفاصيل الإكسسوار:', accDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', accFeatures(facts)),
});

function accDetails(facts: Facts): string[] {
  return [
    'النوع: إكسسوار جوال.',
    facts.subject !== 'إكسسوار جوال' ? `التوافق المذكور: ${facts.subject}.` : 'التوافق: لم يُذكر.',
    facts.extras.find((item) => item.startsWith('لون ')) ? `${facts.extras.find((item) => item.startsWith('لون '))}.` : 'اللون: لم يُذكر.',
    'التغليف: يذكر إذا ورد في الجملة.',
  ];
}

function accFeatures(facts: Facts): string[] {
  return [
    facts.subject !== 'إكسسوار جوال' ? `ذكر ${facts.subject} يوضح الجهاز المتوافق.` : 'التوافق غير مذكور، والسؤال عنه قبل الشراء.',
    'القطعة يمكن فحصها عند المعاينة.',
    'الإعلان لا يضيف خامة غير مكتوبة.',
    'التغليف غير مؤكد إلا إذا ذكره البائع.',
  ];
}
