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
  opening: (facts, seed) => pick(seed, [
    'الساعة معروضة للبيع، ويمكن معاينتها قبل الاتفاق.',
    'العرض يخص ساعة ذكية بالمواصفات المكتوبة.',
    'الساعة جاهزة للفحص عند المعاينة.',
  ], 2),
  composition: () => 'السوار والشاشة يذكران فقط إذا وردا في الجملة.',
  details: (facts) => bullets('🔹 تفاصيل الساعة:', watchDetails(facts)),
  features: (facts) => bullets('🔹 أبرز المميزات:', watchFeatures(facts)),
});

function watchDetails(facts: Facts): string[] {
  return [
    'النوع: ساعة ذكية.',
    facts.extras.find((item) => item.startsWith('لون ')) ? `${facts.extras.find((item) => item.startsWith('لون '))}.` : 'اللون: لم يُذكر.',
    facts.extras.find((item) => item.startsWith('بطارية ')) ? `${facts.extras.find((item) => item.startsWith('بطارية '))}.` : 'البطارية: لم تُذكر.',
    facts.extras.includes('مقاومة ماء') ? 'مقاومة الماء: مذكورة في الجملة.' : 'مقاومة الماء: لم تُذكر.',
  ];
}

function watchFeatures(facts: Facts): string[] {
  return [
    facts.extras.includes('مقاومة ماء') ? 'ذكر مقاومة الماء يوضح حدود الاستخدام.' : 'مقاومة الماء غير مذكورة، والسؤال عنها قبل الشراء.',
    facts.extras.some((item) => item.startsWith('بطارية ')) ? 'ذكر البطارية يساعد على تقدير الاستخدام اليومي.' : 'عمر البطارية غير مذكور في الجملة.',
    'الساعة يمكن تجربتها عند المعاينة.',
    'الإعلان لا يضيف مواصفة غير مكتوبة.',
  ];
}
