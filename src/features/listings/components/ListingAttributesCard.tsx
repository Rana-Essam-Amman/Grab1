import React from 'react';
import { Card } from '@/shared/ui/Card';
import { getListingFields } from '@/data/listingFields';
import type { ListingAttribute } from '@/types';

export interface ListingAttributesCardProps {
  attributes?: readonly ListingAttribute[];
  categorySlug?: string;
  subcategorySlug?: string | null;
  isArabic: boolean;
}

export const ListingAttributesCard: React.FC<ListingAttributesCardProps> = React.memo(({ 
  attributes, categorySlug, subcategorySlug, isArabic 
}) => {
  const LEGACY_HIDDEN = new Set(['category', 'city']);
  const visible = (attributes || []).filter(
    (a) => !LEGACY_HIDDEN.has(a.key || '')
  );
  if (visible.length === 0) return null;

  const fields = getListingFields(categorySlug || '', subcategorySlug || undefined);

  const formatValue = (attr: ListingAttribute) => {
    const field = fields.find((f) => f.key === attr.key);
    if (!field) return attr.value;

    // Handle multi-select comma separated values
    const values = attr.value.split(',').map(v => v.trim());
    
    return values.map(val => {
      if (field.options) {
        const opt = field.options.find(
          (o) => o.value.toLowerCase() === val.toLowerCase() || 
                 o.labelAr === val || 
                 o.labelEn.toLowerCase() === val.toLowerCase()
        );
        if (opt) return isArabic ? opt.labelAr : opt.labelEn;
      }
      
      if (val.toLowerCase() === 'true') return isArabic ? 'نعم' : 'Yes';
      if (val.toLowerCase() === 'false') return isArabic ? 'لا' : 'No';

      return val;
    }).join('، '); // Join with Arabic comma
  };

  return (
    <Card variant="default" className="p-4">
      <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
        {isArabic ? 'المواصفات الرئيسية' : 'Key Specifications'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {visible.map((attr, i) => {
          const field = fields.find(f => f.key === attr.key);
          const translatedLabel = isArabic ? (field?.labelAr || attr.label) : (field?.labelEn || attr.label);
          
          return (
            <div key={i} className="p-2.5 rounded-xl bg-surface border border-border/60">
              <div className="text-[11px] text-ink-muted font-medium">{translatedLabel}</div>
              <div className="text-xs font-bold text-ink mt-0.5">{formatValue(attr)}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});

ListingAttributesCard.displayName = 'ListingAttributesCard';
