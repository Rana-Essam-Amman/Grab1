import { useUI } from '@/hooks/useUI';
import { useDraft } from '@/hooks/useDraft';
import React, { useCallback, useMemo, useState } from 'react';
import { categories } from '@/data/categories';
import { ArrowLeft, ArrowRight, MagicStar } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { BrandMark } from '@/shared/components/BrandMark';
import { useAiPublishFlow } from '../hooks/useAiPublishFlow';
import { CategorySearchBar } from '../components/CategorySearchBar';
import { searchCategories } from '@/data/searchIndex';

export const CategoryPickScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { postDraft } = useDraft();
  const initialQuery = (postDraft.noteText || '').split(/\s+/).slice(0, 6).join(' ');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const isSearching = query.trim().length > 0;
  const matches = useMemo(() => (isSearching ? searchCategories(query) : []), [query, isSearching]);
  const noMatch = isSearching && matches.length === 0;
  const visible = noMatch || !isSearching ? categories : matches;
  const { processPublishFlow } = useAiPublishFlow(setIsAnalyzing);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleSelect = useCallback(
    (categorySlug: string) => {
      const raw = postDraft.noteText || '';
      const photos = postDraft.photos || [];
      processPublishFlow(raw, photos, undefined, categorySlug);
    },
    [postDraft, processPublishFlow]
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} className="w-10 h-10 rounded-full bg-surface/15 text-white" disabled={isAnalyzing}>
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white">{isArabic ? 'اختر القسم المناسب' : 'Choose the right category'}</h2>
        </div>
        <BrandMark isArabic={isArabic} />
      </div>
      <div className="p-4">
        <p className="text-xs text-ink-muted mb-4">
          {isArabic ? 'لم نتمكن من تحديد القسم تلقائياً' : "We couldn't detect the category"}
        </p>
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <MagicStar size={32} variant="Bold" color="#E57E25" className="animate-spin" />
            <p className="text-sm font-bold text-ink">
              {isArabic ? 'جاري تجهيز الإعلان...' : 'Preparing your listing...'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <CategorySearchBar isArabic={isArabic} value={query} onChange={setQuery} />
            </div>
            {noMatch && (
              <p className="mb-2 text-xs text-ink-muted">
                {isArabic ? 'لا يوجد تطابق — اختر من الأقسام' : 'No match — pick from categories'}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visible.map((cat) => (
                <Card
                  key={cat.slug}
                  variant="interactive"
                  padding="none"
                  onClick={() => handleSelect(cat.slug)}
                  className="p-3.5 flex flex-col items-center text-center gap-2.5 transition-all group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-background overflow-hidden border border-border group-hover:scale-105 transition-transform flex items-center justify-center">
                    <img src={cat.asset} alt={cat.nameEn} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-ink group-hover:text-primary line-clamp-1">
                    {isArabic ? cat.nameAr : cat.nameEn}
                  </span>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
