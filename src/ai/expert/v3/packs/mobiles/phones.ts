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
    const state = facts.extras.includes('مستعمل') ? 'بحالة مستعملة' : facts.extras.includes('جديد') ? 'بحالة جديدة' : '';
    const leads = [
      state ? `${brand} ${state}.` : `${brand} جاهز للمعاينة.`,
      `${brand} متاح للمعاينة قبل الشراء.`,
      `${brand} جاهز للتسليم بعد الاتفاق.`,
    ];
    return pick(seed, leads, 1);
  },
  composition: (facts) => {
    const color = facts.extras.find((item) => item.startsWith('لون '));
    return color ? `يأتي ب${color}، وجاهز للمعاينة.` : null;
  },
  details: (facts) => bullets('🔹 تفاصيل الجوال:', phoneDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', phoneFeatures(facts)),
});

function phoneDetails(facts: Facts): string[] {
  const brand = facts.subject !== 'جوال' ? facts.subject : '';
  const color = facts.extras.find((item) => item.startsWith('لون '));
  return [
    `النوع: جوال${brand ? ` ${brand}` : ''}.`,
    facts.storage ? `السعة: ${facts.storage} جيجا.` : '',
    facts.extras.includes('جديد') ? 'الحالة: جديد.' : facts.extras.includes('مستعمل') ? 'الحالة: مستعمل.' : '',
    color ? `${color}.` : '',
    facts.extras.includes('ضمان') ? 'الضمان: نعم.' : '',
  ].filter(Boolean);
}

function phoneFeatures(facts: Facts): string[] {
  return [
    facts.storage ? `${facts.storage} جيجا تكفي للصور والتطبيقات اليومية.` : '',
    facts.extras.includes('مستعمل') ? 'الجهاز بحالة مستعملة وجاهز للاستخدام.' : facts.extras.includes('جديد') ? 'الجهاز بحالة جديدة وجاهز للاستخدام.' : '',
    facts.extras.includes('ضمان') ? 'ضمان ساري حتى انتهاء المدة المعلنة.' : '',
    facts.extras.some((item) => item.startsWith('بطارية ')) ? 'بطارية مفحوصة قبل العرض.' : '',
    facts.subject !== 'جوال' ? 'جهاز أصلي من ماركة معروفة.' : '',
    'فحص مسبق قبل العرض.',
    'معاينة متاحة قبل الشراء.',
  ].filter(Boolean).slice(0, 4);
}
