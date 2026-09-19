import { useUI } from '@/hooks/useUI';
import { useLocationPick } from '../hooks/useLocationPick';
import React, { useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { LocationFields } from '../components/LocationFields';

export const LocationPickScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { 
    cities, neighborhoods, selectedCity, selectedNeighborhood, site, 
    handleCityChange, handleNeighborhoodChange, handleSiteChange, mapQuery, saveAndContinue 
  } = useLocationPick();

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const NextIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3 bg-brand sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} className="w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer flex items-center justify-center p-0" aria-label={isArabic ? 'رجوع' : 'Back'}>
          <BackIcon size={18} variant="Linear" color="#FFFFFF" className="text-white" />
        </Button>
        <div>
          <div className="text-xs font-semibold text-white/70">{isArabic ? 'الخطوة 4 من 6' : 'Step 4 of 6'}</div>
          <h2 className="text-lg font-bold text-white">{isArabic ? 'تحديد موقع السلعة' : 'Select Location'}</h2>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        <LocationFields
          isArabic={isArabic}
          selectedCity={selectedCity}
          cities={cities}
          selectedNeighborhood={selectedNeighborhood}
          neighborhoods={neighborhoods}
          site={site}
          mapQuery={mapQuery}
          onCityChange={handleCityChange}
          onNeighborhoodChange={handleNeighborhoodChange}
          onSiteChange={handleSiteChange}
        />

        <div className="mt-auto pt-6">
          <Button variant="primary" fullWidth size="lg" onClick={saveAndContinue} className="gap-2">
            <span>{isArabic ? 'متابعة إلى صياغة الإعلان بالذكاء' : 'Continue to AI Drafter'}</span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};

