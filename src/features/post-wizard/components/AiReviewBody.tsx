import React, { useState } from 'react';
import { MissingFieldsNotice } from '@/shared/ui/MissingFieldsNotice';
import { AiReviewPhotoHero } from './AiReviewPhotoHero';
import { AiReviewInlineEdit } from './AiReviewInlineEdit';
import { AiReviewSpecsChips } from './AiReviewSpecsChips';
import { AiReviewSectionCard } from './AiReviewSectionCard';
import { AiReviewLocationSection } from './AiReviewLocationSection';
import { AiReviewProgress } from './AiReviewProgress';

interface AiReviewBodyProps {
  readonly isArabic: boolean;
  readonly photos: readonly string[];
  readonly onAddPhotos: () => void;
  readonly onRemovePhoto: (index: number) => void;
  readonly title: string;
  readonly price: string;
  readonly city: string;
  readonly neighborhood: string;
  readonly description: string;
  readonly currency: string;
  readonly attributes: readonly {
    key: string; label: string; value: string;
    required?: boolean;
    type?: 'text' | 'number' | 'select' | 'textarea';
    options?: readonly string[]; placeholder?: string;
    confidence?: 'high' | 'medium' | 'low';
  }[];
  readonly onAttributeChange: (key: string, value: string) => void;
  readonly mapQuery: string;
  readonly onTitleChange: (v: string) => void;
  readonly onPriceChange: (v: string) => void;
  readonly onOpenCityPicker: () => void;
  readonly onOpenNeighborhoodPicker: () => void;
  readonly onDescriptionChange: (v: string) => void;
  readonly hasMissing: boolean;
  readonly missingRequiredLabels: readonly string[];
}

type EditField = 'title' | 'price' | 'description' | null;

export const AiReviewBody: React.FC<AiReviewBodyProps> = ({
  isArabic, photos, onAddPhotos, onRemovePhoto, title, price, city, neighborhood,
  description, currency, attributes, onAttributeChange, mapQuery, onTitleChange,
  onPriceChange, onOpenCityPicker, onOpenNeighborhoodPicker, onDescriptionChange,
  missingRequiredLabels,
}) => {
  const [editing, setEditing] = useState<EditField>(null);
  const stop = () => setEditing(null);
  const filledSpecs = attributes.filter((a) => a.value?.trim()).length;
  const completedCount = [title, price, description].filter((v) => v?.trim()).length + filledSpecs;
  const totalCount = 3 + attributes.length;

  return (
    <div className="flex flex-col min-w-0 pb-32 bg-canvas">
      <AiReviewPhotoHero isArabic={isArabic} photos={photos} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />
      <div className="flex flex-col px-4 pt-4 gap-3">
        <AiReviewProgress isArabic={isArabic} completed={completedCount} total={totalCount} />
        
        <AiReviewSectionCard title={isArabic ? 'عنوان الإعلان' : 'Listing Title'}>
          <AiReviewInlineEdit value={title} placeholder={isArabic ? 'أضف عنواناً' : 'Add a title'} editing={editing === 'title'} variant="title" onChange={onTitleChange} onStartEdit={() => setEditing('title')} onStopEdit={stop} />
        </AiReviewSectionCard>

        <AiReviewSectionCard title={isArabic ? 'السعر' : 'Price'}>
          <AiReviewInlineEdit value={price} placeholder="0" editing={editing === 'price'} variant="price" currency={currency} onChange={onPriceChange} onStartEdit={() => setEditing('price')} onStopEdit={stop} />
        </AiReviewSectionCard>

        {attributes.length > 0 && (
          <AiReviewSectionCard title={isArabic ? 'التفاصيل' : 'Details'} trailing={`${filledSpecs}/${attributes.length}`}>
            <AiReviewSpecsChips isArabic={isArabic} attributes={attributes} onAttributeChange={onAttributeChange} />
          </AiReviewSectionCard>
        )}

        <AiReviewSectionCard title={isArabic ? 'الوصف' : 'Description'}>
          <AiReviewInlineEdit value={description} placeholder={isArabic ? 'أضف وصفاً...' : 'Add description...'} editing={editing === 'description'} variant="description" onChange={onDescriptionChange} onStartEdit={() => setEditing('description')} onStopEdit={stop} />
        </AiReviewSectionCard>

        <AiReviewSectionCard title={isArabic ? 'الموقع' : 'Location'}>
          <AiReviewLocationSection isArabic={isArabic} city={city} neighborhood={neighborhood} mapQuery={mapQuery} onOpenCityPicker={onOpenCityPicker} onOpenNeighborhoodPicker={onOpenNeighborhoodPicker} />
        </AiReviewSectionCard>

        <MissingFieldsNotice isArabic={isArabic} fields={missingRequiredLabels} className="mb-2" />
      </div>
    </div>
  );
};
