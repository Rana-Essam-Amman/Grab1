import React, { useState } from 'react';
import { Send2, Location, Image as ImageIcon } from 'iconsax-react';
import { useUI } from '@/hooks/useUI';
import { useAiReview } from '../hooks/useAiReview';
import { usePostWizard } from '../hooks/usePostWizard';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { AiReviewCityDrawer } from '../components/AiReviewCityDrawer';
import { categories } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';
import { getListingFields } from '@/data/listingFields';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';

export const PostDetailsScreen: React.FC = () => {
  const { isArabic, goBack, activeCurrency, browseCountryCode } = useUI();
  const { postDraft } = usePostWizard();
  const cat = categories.find((c) => c.slug === postDraft.categorySlug);
  const sub = findSubcategoryBySlug(postDraft.subcategorySlug);
  const fields = getListingFields(postDraft.categorySlug, postDraft.subcategorySlug);

  const {
    title, price, city, neighborhood, description, photos,
    hasMissingParams, isPublishing, attributes, setAttributeValue,
    setTitle, setPrice, setCity, setDescription,
    handlePublish, error,
  } = useAiReview();

  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const coverPhoto = photos[0];
  const locationLabel = [neighborhood, city].filter(Boolean).join(', ') || (isArabic ? 'الموقع' : 'Location');

  return (
    <div className="flex flex-col min-h-screen bg-canvas pb-32" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={3}
        totalSteps={3}
        titleAr="تفاصيل الإعلان"
        titleEn="Listing Details"
        isArabic={isArabic}
        onBack={goBack}
        categoryAsset={cat?.asset}
        categoryNameAr={cat?.nameAr}
        categoryNameEn={cat?.nameEn}
        subcategoryNameAr={sub?.nameAr}
        subcategoryNameEn={sub?.nameEn}
      />

      <div className="p-4 flex flex-col gap-4">
        <div className="p-3 rounded-2xl border border-line bg-surface flex items-center gap-3 shadow-xs">
          <div className="w-16 h-16 rounded-xl bg-canvas overflow-hidden shrink-0 border border-line flex items-center justify-center">
            {coverPhoto ? <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-ink-muted" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-ink truncate">{title || (isArabic ? 'عنوان الإعلان' : 'Listing Title')}</h4>
            <div className="text-xs font-bold text-primary mt-0.5">{price ? `${price} ${activeCurrency}` : (isArabic ? 'السعر غير محدد' : 'Price not set')}</div>
            <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-1 truncate">
              <Location size={12} variant="Bold" className="text-accent" />
              <span>{locationLabel}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">{isArabic ? 'العنوان والسعر' : 'Title & Price'}</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{isArabic ? 'عنوان الإعلان' : 'Listing Title'}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isArabic ? 'أدخل عنواناً جذاباً...' : 'Enter title...'} className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-ink-soft">{isArabic ? `السعر (${activeCurrency})` : `Price (${activeCurrency})`}</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary" />
          </div>
        </div>

        {fields.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface p-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">{isArabic ? 'المواصفات والتفاصيل' : 'Specifications & Details'}</h3>
            {fields.map((field) => {
              const attrVal = attributes.find((a) => a.key === field.key)?.value || '';
              return <DynamicFieldRenderer key={field.key} field={field} value={attrVal} onChange={setAttributeValue} isArabic={isArabic} />;
            })}
          </div>
        )}

        <div className="rounded-2xl border border-line bg-surface p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">{isArabic ? 'الوصف' : 'Description'}</h3>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder={isArabic ? 'اكتب تفاصيل إضافية عن السلعة...' : 'Write additional details...'} className="w-full p-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary resize-none" />
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">{isArabic ? 'الموقع' : 'Location'}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">{locationLabel}</span>
            <button type="button" onClick={() => setIsCityDrawerOpen(true)} className="text-xs font-bold text-primary hover:underline cursor-pointer">{isArabic ? 'تغيير الموقع' : 'Change Location'}</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[440px] z-30 flex flex-col gap-2 pointer-events-none">
        {error && <div className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger shadow-md pointer-events-auto bg-white/90">{error}</div>}
        <button
          type="button"
          id="post-publish-btn"
          data-testid="post-details-publish-btn"
          onClick={handlePublish}
          disabled={hasMissingParams || isPublishing}
          className={`w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-primary to-primary-hover cursor-pointer pointer-events-auto ${!hasMissingParams && !isPublishing ? 'animate-[halo-pulse_2s_ease-in-out_infinite]' : ''}`}
        >
          <Send2 size={18} variant="Bold" color="#FFFFFF" />
          <span>{isPublishing ? (isArabic ? 'جاري النشر...' : 'Publishing...') : (isArabic ? 'انشر الإعلان الآن' : 'Publish Now')}</span>
        </button>
      </div>

      <AiReviewCityDrawer isArabic={isArabic} open={isCityDrawerOpen} onClose={() => setIsCityDrawerOpen(false)} browseCountryCode={browseCountryCode} currentCity={city} onSelect={(cityEn, cityAr) => setCity(isArabic ? cityAr : cityEn)} />
    </div>
  );
};
