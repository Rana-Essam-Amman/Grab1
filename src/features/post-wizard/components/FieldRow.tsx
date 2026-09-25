import React from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { CategoryFieldDef } from '@/data/categoryFields';

interface FieldRowProps {
  f: CategoryFieldDef;
  val: string;
  isArabic: boolean;
  values: Record<string, string>;
  setField: (k: string, v: string) => void;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  f,
  val,
  isArabic,
  values,
  setField,
}) => {
  const showCustomInput = f.type === 'select' && (val === 'أخرى' || val === 'Other');
  const label = isArabic ? f.labelAr : f.labelEn;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-ink-soft">
        {label} {f.required && <span className="text-danger">*</span>}
      </label>

      {f.type === 'select' ? (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <select
              value={val}
              onChange={(e) => setField(f.key, e.target.value)}
              className="w-full h-12 px-4 pe-10 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface appearance-none"
            >
              <option value="">{isArabic ? 'اختر...' : 'Select...'}</option>
              {f.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ArrowDown2
              size={14}
              variant="Linear"
              color="#64748B"
              className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {showCustomInput && (
            <input
              type="text"
              value={values[`${f.key}_custom`] || ''}
              onChange={(e) => setField(`${f.key}_custom`, e.target.value)}
              placeholder={isArabic ? 'اكتب القيمة المخصصة' : 'Enter custom value'}
              className="w-full h-12 px-4 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface"
            />
          )}
        </div>
      ) : (
        <input
          type={f.type === 'number' ? 'number' : 'text'}
          value={val}
          onChange={(e) => setField(f.key, e.target.value)}
          placeholder={f.placeholder || (isArabic ? `أدخل ${f.labelAr}` : `Enter ${f.labelEn}`)}
          className="w-full h-12 px-4 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface"
        />
      )}
    </div>
  );
};
