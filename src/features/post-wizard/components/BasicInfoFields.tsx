import React from 'react';

interface BasicInfoFieldsProps {
  isArabic: boolean;
  title: string;
  setTitle: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  isArabic,
  title,
  setTitle,
  price,
  setPrice,
  description,
  setDescription,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-ink-soft">
          {isArabic ? 'العنوان' : 'Title'} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isArabic ? 'مثال: تويوتا كامري 2022 بحالة ممتازة' : 'e.g., Toyota Camry 2022 excellent condition'}
          className="w-full h-12 px-4 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface"
        />
        {title.trim().length > 0 && title.trim().length < 5 && (
          <span className="text-[11px] text-danger mt-1 block">
            {isArabic ? 'يجب أن يكون العنوان 5 أحرف على الأقل' : 'Title must be at least 5 characters'}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-ink-soft">
          {isArabic ? 'السعر' : 'Price'} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder={isArabic ? 'أدخل السعر' : 'Enter price'}
          className="w-full h-12 px-4 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-ink-soft">
          {isArabic ? 'الوصف' : 'Description'} <span className="text-danger">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isArabic ? 'اكتب تفاصيل السلعة وحالتها ومميزاتها...' : 'Write listing details, condition, features...'}
          className="w-full py-3 min-h-[100px] px-4 rounded-2xl bg-canvas border border-line text-sm text-ink outline-none transition-colors focus:border-primary focus:bg-surface"
        />
        {description.trim().length > 0 && description.trim().length < 10 && (
          <span className="text-[11px] text-danger mt-1 block">
            {isArabic ? 'يجب أن يكون الوصف 10 أحرف على الأقل' : 'Description must be at least 10 characters'}
          </span>
        )}
      </div>
    </div>
  );
};
