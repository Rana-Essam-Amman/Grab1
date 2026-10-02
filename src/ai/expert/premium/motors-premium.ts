import { CategoryTemplateSet } from '../categoryTemplates';

export const MOTORS_PREMIUM: CategoryTemplateSet = {
  titleTemplates: [
    '{make} {model} موديل {year} لون {color} {fuel} — {hook}',
    '{make} {model} {year} {color} {fuel} — {hook}',
    '{year} {make} {model} {fuel} {color} — {hook}',
    '{make} {model} {year} {fuel} لون {color} مميزة — {hook}',
    '{make} {model} {year} {fuel} {colorTone} — {hook}',
    'سيارة {make} {model} {year} {color} {fuel} — {hook}',
    '{make} {model} {year} {fuel} {color} — {hook}',
    '{make} {model} {year} {color} {fuel} — {yearTone} و{hook}',
    'فرصة {make} {model} {year} {color} {fuel} — {hook}',
    '{make} {model} {year} {color} {fuel} — {yearTone} — {hook}'
  ],
  paragraph1: [
    '{open} سيارة {make} {model} موديل {year} بمحرك {fuel} ولون {color}، {hook}.',
    '{open} {make} {model} {year} بلون {color} الفخم ونظام {fuel}، {hook}.',
    '{open} سيارة {make} {model} {year} بمحرك {fuel} قوية ولون {color}، {hook}.'
  ],
  paragraph2: [
    'السيارة بلون {color}، {colorTone}. نظام {fuel} {fuelTone} وموديل {year} يحافظ على {yearTone}.',
    'لون {color}، {colorTone}. نظام {fuel} {fuelTone}. السيارة موديل {year}، {yearTone}.',
    '{colorTone} مع اللون {color}. محرك {fuel} {fuelTone} وموديل {year} يؤكد {yearTone}.'
  ],
  paragraph3: [
    'السعر المطلوب {price} دينار قابل للتفاوض المعقول للجادين. {close}.',
    'السعر {price} دينار، مع إمكانية تفاوض بسيط عند المعاينة. {close}.',
    '{price} دينار، سعر مناسب جداً ومنافس مقارنة بالسوق. {close}.'
  ]
};
