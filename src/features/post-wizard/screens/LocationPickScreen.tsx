import { useUI } from '@/hooks/useUI';
import { useLocationPick } from '../hooks/useLocationPick';
import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { LocationFields } from '../components/LocationFields';
import { PostFlowHeader } from '../components/PostFlowHeader';

export const LocationPickScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const {
    cities,
    neighborhoods,
    selectedCity,
    selectedNeighborhood,
    site,
    customCity,
    customNeighborhood,
    handleCityChange,
    handleNeighborhoodChange,
    handleSiteChange,
    mapQuery,
    saveAndContinue,
    setCustomCity,
    setCustomNeighborhood,
  } = useLocationPick();

  const NextIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? "rtl" : "ltr"}>
      <PostFlowHeader
        step={4}
        titleAr="تحديد موقع السلعة"
        titleEn="Select Location"
        isArabic={isArabic}
        onBack={goBack}
      />
      <div className="p-4 flex flex-col gap-4 flex-1">
        <LocationFields
          isArabic={isArabic}
          selectedCity={selectedCity}
          cities={cities}
          selectedNeighborhood={selectedNeighborhood}
          neighborhoods={neighborhoods}
          site={site}
          mapQuery={mapQuery}
          customCity={customCity}
          customNeighborhood={customNeighborhood}
          onCityChange={handleCityChange}
          onNeighborhoodChange={handleNeighborhoodChange}
          onSiteChange={handleSiteChange}
          onCustomCityChange={setCustomCity}
          onCustomNeighborhoodChange={setCustomNeighborhood}
        />

        <div className="mt-auto pt-6">
          <Button variant="primary" fullWidth size="lg" onClick={saveAndContinue} className="gap-2">
            <span>{isArabic ? "متابعة إلى تفاصيل الإعلان" : "Continue to Listing Details"}</span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};
