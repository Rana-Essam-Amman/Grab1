import React from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Combobox } from '@/shared/ui/Combobox';
import { AiReviewSectionCard } from '../components/AiReviewSectionCard';
import { usePostDetails } from '../hooks/usePostDetails';

export const PostDetailsScreen: React.FC = () => {
  const {
    title, setTitle,
    price, setPrice,
    description, setDescription,
    values, setField,
    fields,
    missingRequired,
    canContinue,
    handleContinue,
    isArabic
  } = usePostDetails();

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-canvas">
      <header className="sticky top-0 z-20 bg-[#1a2238] p-4 text-white font-bold text-lg shadow-sm">
        {isArabic ? 'تفاصيل الإعلان' : 'Listing Details'}
      </header>

      <div className="p-4 flex flex-col gap-3">
        <AiReviewSectionCard title={isArabic ? 'المعلومات الأساسية' : 'Basic Info'}>
          <div className="flex flex-col gap-4">
            <Input
              label={isArabic ? 'العنوان' : 'Title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isArabic ? 'مثلاً: آيفون 13 برو نظيف' : 'e.g. iPhone 13 Pro clean'}
            />
            <Input
              label={isArabic ? 'السعر' : 'Price'}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="0.00"
            />
            <Textarea
              label={isArabic ? 'الوصف' : 'Description'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isArabic ? 'اكتب تفاصيل الإعلان هنا...' : 'Write listing details here...'}
            />
          </div>
        </AiReviewSectionCard>

        {fields.length > 0 && (
          <AiReviewSectionCard title={isArabic ? 'المواصفات' : 'Specifications'}>
            <div className="flex flex-col gap-4">
              {fields.map(f => (
                <div key={f.key} data-testid={`field-${f.key}`} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-ink">
                    {isArabic ? f.labelAr : f.labelEn} {f.required && <span className="text-danger">*</span>}
                  </label>
                  {f.type === 'select' && f.options && f.options.length > 20 ? (
                    <Combobox
                      testId={`field-${f.key}`}
                      value={values[f.key] || ''}
                      options={f.options}
                      placeholder={isArabic ? 'اختر...' : 'Select...'}
                      searchPlaceholder={isArabic ? 'ابحث...' : 'Search...'}
                      emptyText={isArabic ? 'لا نتائج' : 'No results'}
                      onChange={(v) => {
                        setField(f.key, v);
                        if (f.key === 'make' || f.key === 'brand') setField('model', '');
                      }}
                    />
                  ) : f.type === 'select' ? (
                    <div className="relative">
                      <select
                        value={values[f.key] || ''}
                        onChange={(e) => {
                          setField(f.key, e.target.value);
                          if (f.key === 'make' || f.key === 'brand') setField('model', '');
                        }}
                        className="w-full h-11 px-3.5 rounded-xl bg-canvas text-ink border border-line focus:border-brand outline-none appearance-none text-sm cursor-pointer"
                      >
                        <option value="">{isArabic ? 'اختر...' : 'Select...'}</option>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ArrowDown2 size={16} className="absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted" />
                    </div>
                  ) : (
                    <Input
                      value={values[f.key] || ''}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  )}
                  {(values[f.key] === 'أخرى' || values[f.key] === 'Other') && (
                    <Input
                      placeholder={isArabic ? 'أدخل التفاصيل...' : 'Enter details...'}
                      value={values[`${f.key}_custom`] || ''}
                      onChange={(e) => setField(`${f.key}_custom`, e.target.value)}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </AiReviewSectionCard>
        )}

        {missingRequired.length > 0 && (
          <div className="rounded-2xl bg-danger/5 border border-danger/20 px-4 py-3">
            <p className="text-xs font-bold text-danger mb-1">
              {isArabic ? 'يرجى ملء الحقول المطلوبة:' : 'Required fields:'}
            </p>
            <p className="text-xs text-ink-soft">{missingRequired.join(' · ')}</p>
          </div>
        )}

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          fullWidth
        >
          {isArabic ? 'متابعة للمراجعة' : 'Continue to Review'}
        </Button>
        <div className="h-8"></div>
      </div>
    </div>
  );
};

