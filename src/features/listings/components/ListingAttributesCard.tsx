import React from 'react';
import { Card } from '@/shared/ui/Card';

export interface ListingAttributesCardProps {
  attributes?: Array<{ label: string; value: string }>;
  isArabic: boolean;
}

export const ListingAttributesCard: React.FC<ListingAttributesCardProps> = React.memo(({ attributes, isArabic }) => {
  const LEGACY_HIDDEN = new Set(['category', 'city']);
  const visible = (attributes || []).filter(
    (a) => !LEGACY_HIDDEN.has((a as { key?: string }).key || '')
  );
  if (visible.length === 0) return null;

  return (
    <Card variant="default" className="p-4">
      <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
        {isArabic ? 'المواصفات الرئيسية' : 'Key Specifications'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {visible.map((attr, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-surface border border-border/60">
            <div className="text-[11px] text-ink-muted font-medium">{attr.label}</div>
            <div className="text-xs font-bold text-ink mt-0.5">{attr.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
});

ListingAttributesCard.displayName = 'ListingAttributesCard';
