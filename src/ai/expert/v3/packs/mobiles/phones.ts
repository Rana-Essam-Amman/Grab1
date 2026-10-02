import type { Facts } from '../../types';
import { pick } from '../../seeded';
import { bullets, packOf } from './shared';

const spec = {
  id: 'phonesPack',
  noun: 'جوال',
  detect: /ايفون|آيفون|جوال|هاتف|سامسونج/,
  brands: ['آيفون', 'ايفون', 'سامسونج', 'Samsung'],
};

export const phonesPack = packOf(spec, {
  title: (facts) => {
    const place = facts.place ? ` — ${facts.place}` : '';
    const storage = facts.storage ? `${facts.place ? '، ' : ' — '}${facts.storage} جيجا` : '';
    const brand = facts.subject !== 'جوال' ? facts.subject : '';
    return `جوال ${brand} للبيع${place}${storage}`.replace(/\s+/g, ' ').trim();
  },
  opening: (facts, seed) => {
    const brand = facts.subject !== 'جوال' ? facts.subject : 'الجوال';
    const state = facts.extras.find((item) => item === 'جديد' || item === 'مستعمل') || 'كما ورد في الجملة';
    return pick(seed, [
      `${brand} ${state}، والجهاز جاهز للمعاينة.`,
      `العرض يخص ${brand}، والحالة ${state}.`,
      `${brand} معروض للبيع، ويمكن معاينته قبل الاتفاق.`,
    ], 1);
  },
  composition: (facts) => facts.storage ? `السعة المذكورة ${facts.storage} جيجا.` : null,
  details: (facts) => bullets('🔹 تفاصيل الجوال:', phoneDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', phoneFeatures(facts)),
});

function phoneDetails(facts: Facts): string[] {
  const brand = facts.subject !== 'جوال' ? facts.subject : '';
  return [
    `النوع: جوال${brand ? ` ${brand}` : ''}.`,
    facts.storage ? `السعة: ${facts.storage} جيجا.` : '',
    facts.extras.includes('جديد') ? 'الحالة: جديد.' : facts.extras.includes('مستعمل') ? 'الحالة: مستعمل.' : 'الحالة: كما كتبها البائع.',
    facts.extras.find((item) => item.startsWith('لون ')) ? `${facts.extras.find((item) => item.startsWith('لون '))}.` : 'اللون: لم يُذكر في الجملة.',
    facts.extras.includes('ضمان') ? 'الضمان: مذكور في الجملة.' : '',
  ].filter(Boolean);
}

function phoneFeatures(facts: Facts): string[] {
  return [
    facts.storage ? `${facts.storage} جيجا تكفي للصور والتطبيقات اليومية.` : '',
    facts.extras.includes('مستعمل') ? 'ذكر الاستعمال يوضح أن الجهاز ليس جديداً.' : '',
    facts.extras.find((item) => item.startsWith('لون ')) ? 'ذكر اللون يغني عن تخمين شكل الجهاز.' : '',
    facts.extras.includes('ضمان') ? 'وجود الضمان يسهل الاتفاق على المعاينة.' : '',
    facts.subject !== 'جوال' ? `${facts.subject} معروف، والمواصفات المذكورة هي ما يعتمده الإعلان.` : 'الجوال معروض بالمواصفات المكتوبة فقط.',
  ].filter(Boolean).slice(0, 4);
}
