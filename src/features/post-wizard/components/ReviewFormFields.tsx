import React from 'react';
import { Button } from '@/shared/ui/Button';
import { Warning2 } from 'iconsax-react';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Badge } from '@/shared/ui/Badge';
import { ReviewPublishButton } from './ReviewPublishButton';

interface Props {
  isArabic: boolean;
  hasMissingParams: boolean;
  isPriceMissing: boolean;
  isCityMissing: boolean;
  hasMismatch: boolean;
  match?: { suggested?: boolean | string } | null;
  title: string;
  price: string;
  city: string;
  description: string;
  lockedCurrency: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onApplyCategory: () => void;
  onPublish: () => void;
}

export const ReviewFormFields: React.FC<Props> = ({
  isArabic, hasMissingParams, isPriceMissing, isCityMissing, hasMismatch, match,
  title, price, city, description, lockedCurrency, onTitleChange, onPriceChange,
  onCityChange, onDescChange, onApplyCategory, onPublish
}) => {
  return (
    <div className="flex flex-col gap-4">
      {hasMissingParams && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-danger text-red-900 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 font-extrabold text-xs text-danger">
            <Warning2 size={18} variant="Linear" color="#EF4444" className="text-danger shrink-0 animate-bounce" />
            <span>{isArabic ? 'رتبنا نص إعلانك، تفضل بلمسة تفاصيل أخيرة للنشر' : 'We arranged your listing note, please add final details to publish'}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {isPriceMissing && <span className="px-2.5 py-1 rounded-full bg-red-200 text-[10px] font-extrabold text-red-800">⚠️ {isArabic ? 'السعر غير مدمج' : 'Price missing'}</span>}
            {isCityMissing && <span className="px-2.5 py-1 rounded-full bg-red-200 text-[10px] font-extrabold text-red-800">⚠️ {isArabic ? 'المدينة مفقودة' : 'City missing'}</span>}
          </div>
        </div>
      )}

      {hasMismatch && match?.suggested && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs"><Warning2 size={16} variant="Linear" color="#D97706" /> <span>{isArabic ? 'ملاحظة ذكية' : 'Smart Notice'}</span></div>
          <Button type="button" variant="secondary" size="sm" onClick={onApplyCategory} className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
            {isArabic ? 'تحديث إلى القسم المقترح' : 'Switch to Suggested'}
          </Button>
        </div>
      )}

      <Input label={isArabic ? 'عنوان الإعلان *' : 'Listing Title *'} required value={title} onChange={onTitleChange} className="h-11 font-bold" />
      
      <div>
        <label className={`block text-xs font-bold mb-1.5 ${isPriceMissing ? 'text-danger' : 'text-ink'}`}>{isArabic ? `السعر (${lockedCurrency})` : `Price (${lockedCurrency})`}</label>
        <input type="number" value={price} onChange={onPriceChange} className={`w-full h-11 px-3.5 rounded-xl text-sm font-extrabold ${isPriceMissing ? 'border-2 border-danger' : 'border border-border'}`} />
      </div>

      <div>
        <label className={`block text-xs font-bold mb-1.5 ${isCityMissing ? 'text-danger' : 'text-ink'}`}>{isArabic ? 'المدينة' : 'City'}</label>
        <input type="text" value={city} onChange={onCityChange} className={`w-full h-11 px-3.5 rounded-xl text-sm font-bold ${isCityMissing ? 'border-2 border-danger' : 'border border-border'}`} />
      </div>

      <Textarea label={isArabic ? 'الوصف' : 'Description'} rows={6} value={description} onChange={onDescChange} />

      <ReviewPublishButton
        isArabic={isArabic}
        hasMissingParams={hasMissingParams}
        onClick={onPublish}
      />
    </div>
  );
};
