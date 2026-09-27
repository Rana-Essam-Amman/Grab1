import React, { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { Combobox } from '@/shared/ui/Combobox';
import { iconFor } from './data/fluentIconMap';

interface AttributeShape {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly type?: 'text' | 'number' | 'select' | 'textarea';
  readonly options?: readonly string[];
  readonly placeholder?: string;
}

interface AiReviewSpecsChipsProps {
  readonly isArabic: boolean;
  readonly attributes: readonly AttributeShape[];
  readonly onAttributeChange: (key: string, value: string) => void;
}



export const AiReviewSpecsChips: React.FC<AiReviewSpecsChipsProps> = ({
  isArabic, attributes, onAttributeChange,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5 items-center">
      {attributes.map((attr) => {
        const filled = Boolean(attr.value && attr.value.trim());
        const isEditing = editingKey === attr.key;

        if (isEditing) {
          return (
            <div key={attr.key} className="flex items-center gap-2 rounded-2xl border-2 border-accent bg-surface px-3.5 py-2.5 shadow-sm">
              <Icon icon={iconFor(attr.key)} width={20} height={20} className="shrink-0" />
              <span className="text-[11px] font-bold text-ink-muted">{attr.label}</span>
              {attr.type === 'select' && attr.options && attr.options.length > 20 ? (
                <Combobox
                  value={attr.value || ''}
                  options={attr.options}
                  placeholder={isArabic ? 'اختر' : 'Select'}
                  searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
                  emptyText={isArabic ? 'لا نتائج' : 'No results'}
                  onChange={(v) => { onAttributeChange(attr.key, v); setEditingKey(null); }}
                />
              ) : attr.type === 'select' && attr.options && attr.options.length > 0 ? (
                <div className="relative">
                  <select
                    autoFocus
                    value={attr.value || ''}
                    onChange={(e) => { onAttributeChange(attr.key, e.target.value); setEditingKey(null); }}
                    onBlur={() => setEditingKey(null)}
                    className="text-[12px] font-bold text-brand bg-transparent outline-none appearance-none cursor-pointer pe-4"
                  >
                    <option value="">{isArabic ? 'اختر' : 'Select'}</option>
                    {attr.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                  <ArrowDown2 size={10} variant="Bold" color="#E57E25" className="absolute end-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <input
                  autoFocus
                  type={attr.type === 'number' ? 'number' : 'text'}
                  value={attr.value || ''}
                  onChange={(e) => onAttributeChange(attr.key, e.target.value)}
                  onBlur={() => setEditingKey(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingKey(null); }}
                  placeholder="—"
                  className="text-[12px] font-bold text-brand bg-transparent outline-none w-20"
                />
              )}
            </div>
          );
        }

        if (filled) {
          return (
            <button
              key={attr.key}
              type="button"
              onClick={() => setEditingKey(attr.key)}
              className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-xs hover:border-line-strong hover:shadow-sm transition-all cursor-pointer"
            >
              <Icon icon={iconFor(attr.key)} width={20} height={20} className="shrink-0" />
              <span className="text-[13px] font-bold text-ink">{attr.label}</span>
              <span className="text-[11px] text-ink-muted">·</span>
              <span className="text-[13px] font-medium text-ink-soft">{attr.value}</span>
            </button>
          );
        }

        return (
          <button
            key={attr.key}
            type="button"
            onClick={() => setEditingKey(attr.key)}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-canvas/50 px-3.5 py-2.5 hover:bg-canvas hover:border-line-strong transition-all cursor-pointer"
          >
            <Icon icon={iconFor(attr.key)} width={20} height={20} className="shrink-0 opacity-60" />
            <span className="text-[13px] font-bold text-ink-muted">
              {attr.label}
            </span>
            <span className="text-[11px] font-bold text-accent">+</span>
          </button>
        );
      })}
    </div>
  );
};
