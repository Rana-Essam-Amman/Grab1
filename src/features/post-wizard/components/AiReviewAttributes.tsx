import React from 'react';
import { ArrowDown2, TickCircle } from 'iconsax-react';

interface AttributeShape {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly type?: 'text' | 'number' | 'select' | 'textarea';
  readonly options?: readonly string[];
  readonly placeholder?: string;
}

interface AiReviewAttributesProps {
  readonly isArabic: boolean;
  readonly attributes: readonly AttributeShape[];
  readonly onAttributeChange: (key: string, value: string) => void;
  readonly focusedKey: string | null;
  readonly onResetFocusedKey: () => void;
}

export const AiReviewAttributes: React.FC<AiReviewAttributesProps> = ({
  isArabic, attributes, onAttributeChange, focusedKey, onResetFocusedKey,
}) => {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 min-w-0">
      {attributes.map((attr) => {
        const filled = Boolean(attr.value && attr.value.trim());
        const isFocused = focusedKey === attr.key;
        const emptyRequired = attr.required && !filled;

        const boxClass = filled
          ? 'border-brand/40 bg-brand/5 shadow-sm shadow-brand/10'
          : emptyRequired
            ? 'border-danger/30 bg-canvas animate-[pulse-danger_2.5s_ease-in-out_infinite]'
            : 'border-line bg-canvas';

        return (
          <div
            key={attr.key}
            className={`relative flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${boxClass} ${isFocused ? 'ring-2 ring-brand/20' : ''}`}
          >
            <label className="text-[10px] font-black text-ink-muted uppercase tracking-widest truncate">
              {attr.label}
              {emptyRequired && <span className="text-danger ms-1">*</span>}
            </label>

            {attr.type === 'select' && attr.options && attr.options.length > 0 ? (
              <div className="relative">
                <select
                  value={attr.value || ''}
                  onFocus={onResetFocusedKey}
                  onChange={(e) => onAttributeChange(attr.key, e.target.value)}
                  className={`w-full text-sm font-bold bg-transparent outline-none appearance-none cursor-pointer pe-6 transition-colors duration-300 ${filled ? 'text-brand' : 'text-ink-soft'}`}
                >
                  <option value="">{isArabic ? 'اختر...' : 'Select...'}</option>
                  {attr.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ArrowDown2
                  size={14}
                  variant="Bold"
                  color={filled ? '#E57E25' : '#94A3B8'}
                  className="absolute end-0 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
                />
              </div>
            ) : (
              <input
                type={attr.type === 'number' ? 'number' : 'text'}
                value={attr.value || ''}
                onFocus={onResetFocusedKey}
                onChange={(e) => onAttributeChange(attr.key, e.target.value)}
                placeholder={attr.placeholder || (isArabic ? 'القيمة...' : 'Value...')}
                className={`w-full text-sm font-bold bg-transparent outline-none placeholder:text-ink-muted/60 transition-colors duration-300 ${filled ? 'text-brand' : 'text-ink-soft'}`}
              />
            )}

            {filled && (
              <div className="absolute -top-1.5 -end-1.5 w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-md shadow-success/30 animate-[pop-in_0.35s_ease-out]">
                <TickCircle size={14} variant="Bold" color="#FFFFFF" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
