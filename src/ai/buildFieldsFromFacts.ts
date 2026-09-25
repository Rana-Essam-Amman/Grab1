import { ListingFacts } from '../types';
import { getCategoryFields } from '@/data/categoryFields';

export interface FieldItem {
  key: string;
  label: string;
  value: string;
  required?: boolean;
  type?: 'text' | 'number' | 'select' | 'textarea';
  options?: readonly string[];
  placeholder?: string;
}

function getValueForKey(key: string, facts: ListingFacts, arabic: boolean): string {
  // Legacy aliases (extractFacts uses 'inspect'/'make'/'price',
  // but schema uses 'inspection'/'brand'/'salary')
  if (key === 'inspection' && facts.inspect === true) {
    return arabic ? 'فحص كامل' : 'Full Inspection';
  }
  if (key === 'brand' && !facts.brand && typeof facts.make === 'string') return facts.make;
  if (key === 'make' && !facts.make && typeof facts.brand === 'string') return facts.brand;
  if (key === 'salary' && !facts.salary && typeof facts.price === 'string') return facts.price;

  // Direct access via index signature (universal)
  const v = facts[key];
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? (arabic ? 'نعم' : 'Yes') : '';
  return '';
}

export function buildFieldsFromFacts(
  facts: ListingFacts,
  categorySlug: string,
  arabic: boolean
): FieldItem[] {
  const defs = getCategoryFields(categorySlug);
  return defs.map((def) => ({
    key: def.key,
    label: arabic ? def.labelAr : def.labelEn,
    value: getValueForKey(def.key, facts, arabic),
    required: def.required,
    type: def.type,
    options: def.options,
    placeholder: def.placeholder,
  }));
}
