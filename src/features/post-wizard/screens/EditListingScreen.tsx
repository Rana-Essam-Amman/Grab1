import React from 'react';
import { Button } from '@/shared/ui/Button';
import { MissingFieldsNotice } from '@/shared/ui/MissingFieldsNotice';
import { useUI } from '@/hooks/useUI';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { PostDetailsFormFields } from '../components/PostDetailsFormFields';
import { useEditListing } from '../hooks/useEditListing';
import { Lock } from 'iconsax-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { AdminImageEditor } from '../components/AdminImageEditor';
import { AdminActionsPanel } from '../components/AdminActionsPanel';

export const EditListingScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const {
    listing, title, setTitle, price, setPrice, description, setDescription,
    values, setField, fields, missingRequired, canSave, handleSave, submitAttempted,
    isSaving, saveError, images, setImages,
  } = useEditListing();
  const isAdmin = useIsAdmin();

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen bg-canvas" dir={isArabic ? 'rtl' : 'ltr'}>
        <PostFlowHeader step={5} titleAr="تعديل الإعلان" titleEn="Edit Listing" isArabic={isArabic} onBack={goBack} />
        <div className="p-6 text-center text-sm text-ink-muted">
          {isArabic ? 'الإعلان غير موجود' : 'Listing not found'}
        </div>
      </div>
    );
  }

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col min-h-screen bg-canvas">
      <PostFlowHeader
        step={5}
        titleAr="تعديل الإعلان"
        titleEn="Edit Listing"
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4 flex flex-col gap-3 pb-8">
        <div className="flex items-center gap-2 rounded-2xl bg-canvas border border-line px-4 py-3">
          <Lock size={16} variant="Bold" className="text-ink-muted shrink-0" />
          <div className="text-xs text-ink-muted">
            {isArabic
              ? 'القسم مقفل. لتفعيل تغييره احذف الإعلان وأنشئ واحداً جديداً.'
              : 'Category is locked. To change it, delete this ad and create a new one.'}
          </div>
        </div>

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
          submitAttempted={submitAttempted}
        />

        {isAdmin && (
          <>
            <AdminImageEditor
              images={images}
              setImages={setImages}
              ownerUserId={listing.userId}
              isArabic={isArabic}
            />
            <AdminActionsPanel
              listingId={listing.id}
              currentStatus={listing.status || 'active'}
              isPremium={Boolean(listing.isPremium)}
              isArabic={isArabic}
            />
          </>
        )}

        <MissingFieldsNotice isArabic={isArabic} fields={missingRequired} />

        {saveError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {saveError}
          </div>
        )}

        <Button onClick={handleSave} disabled={!canSave || isSaving} size="lg" fullWidth>
          {isSaving
            ? (isArabic ? 'جارٍ الحفظ...' : 'Saving...')
            : (isArabic ? 'حفظ التعديلات' : 'Save Changes')}
        </Button>
      </div>
    </div>
  );
};
