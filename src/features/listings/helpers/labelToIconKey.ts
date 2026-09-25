// Maps an attribute label (EN or AR) to a Fluent Emoji key.
// Falls back to 'default' if unrecognized.

const LABEL_MAP: readonly (readonly [RegExp, string])[] = [
  [/ممشى|الممشى|ماشي|قطعت|km|mileage/i, 'km'],
  [/غرف|غرفة|أجنحة|جناح|rooms|bedrooms/i, 'rooms'],
  [/حمام|حمامات|bathrooms/i, 'bathrooms'],
  [/مساحة|م²|sqm|area/i, 'area'],
  [/موديل|year|سنة/i, 'year'],
  [/لون|color/i, 'color'],
  [/حالة|condition/i, 'condition'],
  [/وارد|origin/i, 'origin'],
  [/فحص|inspection/i, 'inspection'],
  [/ناقل|جير|قير|transmission/i, 'transmission'],
  [/وقود|بنزين|ديزل|fuel/i, 'fuel'],
  [/محرك|engine/i, 'type'],
  [/إضافات|مميزات|features/i, 'features'],
  [/مسنح|مصعد|مسبح|مفروش/i, 'features'],
  [/make|model|brand|ماركة|موديل/i, 'make'],
  [/year|سنة|موديل/i, 'year'],
  [/km|mileage|كيلو|عداد|ممشى/i, 'km'],
  [/color|لون/i, 'color'],
  [/transmission|ناقل|جير|قير/i, 'transmission'],
  [/fuel|وقود|بنزين|ديزل/i, 'fuel'],
  [/inspection|فحص/i, 'inspection'],
  [/origin|وارد/i, 'origin'],
  [/storage|ذاكرة|تخزين/i, 'storage'],
  [/battery|بطارية/i, 'battery'],
  [/processor|معالج/i, 'processor'],
  [/ram|رام/i, 'ram'],
  [/size|مقاس|قياس/i, 'size'],
  [/condition|حالة/i, 'condition'],
  [/material|ماده|مادة/i, 'material'],
  [/area|مساحة/i, 'area'],
  [/rooms|غرف/i, 'rooms'],
  [/bathrooms|حمام/i, 'bathrooms'],
  [/floor|طابق/i, 'floor'],
  [/furnished|مفروش/i, 'furnished'],
  [/age|عمر/i, 'age'],
  [/gender|نوع|رجالي|نسائي/i, 'gender'],
  [/type|نوع/i, 'type'],
  [/service|خدمة/i, 'serviceType'],
  [/salary|راتب/i, 'salary'],
  [/field|مجال/i, 'field'],
  [/language|لغة/i, 'language'],
  [/breed|سلالة/i, 'breed'],
  [/engine|محرك|cc/i, 'type'],
];

export function labelToIconKey(label: string): string {
  for (const [re, key] of LABEL_MAP) {
    if (re.test(label)) return key;
  }
  return 'default';
}
