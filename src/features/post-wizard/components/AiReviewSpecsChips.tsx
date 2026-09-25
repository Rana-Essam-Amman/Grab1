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
            <div key={attr.key} className="flex items-center gap-2 rounded-2xl border-2 border-brand bg-white px-3 py-2">
              <Icon icon={iconFor(attr.key)} width={16} height={16} className="shrink-0" />
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
              className="flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 hover:border-brand transition-colors cursor-pointer"
            >
              <Icon icon={iconFor(attr.key)} width={16} height={16} className="shrink-0" />
              <span className="text-[12px] font-bold text-ink">{attr.label}</span>
              <span className="text-[10px] text-ink-muted">·</span>
              <span className="text-[12px] font-medium text-ink-soft">{attr.value}</span>
            </button>
          );
        }

        return (
          <button
            key={attr.key}
            type="button"
            onClick={() => setEditingKey(attr.key)}
            className={`flex items-center gap-2 rounded-2xl border-2 border-dashed px-3 py-2 hover:bg-canvas/60 transition-colors cursor-pointer ${
              attr.required ? 'border-danger/40' : 'border-line'
            }`}
          >
            <Icon icon={iconFor(attr.key)} width={16} height={16} className="shrink-0 opacity-50" />
            <span className={`text-[12px] font-bold ${attr.required ? 'text-danger' : 'text-ink-muted'}`}>
              {attr.label}
            </span>
            {attr.required && (
              <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
