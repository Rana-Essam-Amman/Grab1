import React from 'react';
import { Button } from '@/shared/ui/Button';
import { usePostDetails } from '../hooks/usePostDetails';
import { useUI } from '@/hooks/useUI';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { PostDetailsFormFields } from '../components/PostDetailsFormFields';

export const PostDetailsScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const {
    title, setTitle,
    price, setPrice,
    description, setDescription,
    values, setField,
    fields,
    missingRequired,
    canContinue,
    handleContinue,
  } = usePostDetails();

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-canvas">
      <PostFlowHeader
        step={5}
        titleAr="تفاصيل الإعلان"
        titleEn="Listing Details"
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4 flex flex-col gap-3">
        <PostDetailsFormFields
          isArabic={isArabic}
          title={title}
          setTitle={setTitle}
          price={price}
          setPrice={setPrice}
          description={description}
          setDescription={setDescription}
          values={values}
          setField={setField}
          fields={fields}
        />

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
