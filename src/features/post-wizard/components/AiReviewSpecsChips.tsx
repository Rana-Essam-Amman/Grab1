import React, { useState } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { Combobox } from '@/shared/ui/Combobox';
import { iconFor } from './data/fluentIconMap';
import { type Confidence } from '@/ai/extractors/confidence';
import { ConfidenceDot } from './ConfidenceDot';

interface AttributeShape {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly type?: 'text' | 'number' | 'select' | 'textarea';
  readonly options?: readonly string[];
  readonly placeholder?: string;
  readonly confidence?: Confidence;
}

interface AiReviewSpecsChipsProps {
  readonly isArabic: boolean;
  readonly attributes: readonly AttributeShape[];
  readonly onAttributeChange: (key: string, value: string) => void;
}

const INPUT_ATTRS = { autoComplete: 'off' as const, autoCorrect: 'off' as const, autoCapitalize: 'off' as const, spellCheck: false };

export const AiReviewSpecsChips: React.FC<AiReviewSpecsChipsProps> = ({
  isArabic, attributes, onAttributeChange,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {attributes.map((attr) => {
        const filled = Boolean(attr.value && attr.value.trim());
        const isEditing = editingKey === attr.key;

        if (isEditing) {
          return (
            <div key={attr.key} className="col-span-2 rounded-2xl border-2 border-accent bg-surface p-3.5 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Icon icon={iconFor(attr.key)} width={20} height={20} />
                <span className="text-[13px] font-bold text-ink">{attr.label}</span>
                <ConfidenceDot confidence={attr.confidence} isArabic={isArabic} />
              </div>
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
                    className="w-full h-11 px-3.5 rounded-xl border border-line bg-canvas text-sm font-bold text-ink outline-none appearance-none cursor-pointer focus:border-accent"
                  >
                    <option value="">{isArabic ? 'اختر...' : 'Select...'}</option>
                    {attr.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                  <ArrowDown2 size={14} variant="Bold" className="absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted" />
                </div>
              ) : (
                <input
                  autoFocus
                  type={attr.type === 'number' ? 'number' : 'text'}
                  value={attr.value || ''}
                  onChange={(e) => onAttributeChange(attr.key, e.target.value)}
                  onBlur={() => setEditingKey(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingKey(null); }}
                  placeholder={isArabic ? 'اكتب...' : 'Type...'}
                  className="w-full h-11 px-3.5 rounded-xl border border-line bg-canvas text-sm font-bold text-ink outline-none focus:border-accent"
                  {...INPUT_ATTRS}
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={attr.key}
            type="button"
            onClick={() => setEditingKey(attr.key)}
            className={`flex flex-col items-start gap-1.5 rounded-2xl border px-3.5 py-3 transition-all cursor-pointer text-start min-h-[92px] ${
              filled
                ? 'border-line bg-surface hover:border-accent/60 hover:shadow-sm'
                : 'border-line bg-canvas/50 hover:bg-canvas hover:border-line-strong'
            }`}
          >
            <Icon
              icon={iconFor(attr.key)}
              width={22}
              height={22}
              className={filled ? '' : 'opacity-60'}
            />
            <span className={`text-[11px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${filled ? 'text-ink-muted' : 'text-ink-muted/70'}`}>
              {attr.label}
              <ConfidenceDot confidence={attr.confidence} isArabic={isArabic} />
            </span>
            <span className={`text-[14px] truncate w-full ${filled ? 'font-bold text-ink' : 'font-bold text-accent'}`}>
              {filled ? attr.value : (isArabic ? '+ أضف' : '+ Add')}
            </span>
          </button>
        );
      })}
    </div>
  );
};
