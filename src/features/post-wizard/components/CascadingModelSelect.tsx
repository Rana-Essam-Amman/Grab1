import React, { useState, useEffect } from 'react';
import { CAR_BRANDS } from '@/data/brands/carBrands';
import { PHONE_BRANDS_REGISTRY } from '@/data/brands/phoneBrands';
import { OtherOptionInput } from './OtherOptionInput';
import { SearchableDropdown } from '@/shared/ui/SearchableDropdown';
import * as carHelpers from '../helpers/cascadingModelHelpers';
import * as phoneHelpers from '../helpers/phoneModelHelpers';
import { TV_BRANDS, TV_MODELS } from '@/data/brands/tv';
import { AUDIO_BRANDS, AUDIO_MODELS } from '@/data/brands/audio';
import { CAMERA_BRANDS, CAMERA_MODELS } from '@/data/brands/cameras';
import { LAPTOP_BRANDS, LAPTOP_MODELS } from '@/data/brands/laptops';
import { APPLIANCE_BRANDS, APPLIANCE_MODELS } from '@/data/brands/appliances';
import { makeModelHelpers } from '../helpers/genericModelHelpers';

const OTHER_VALUE = '__other__';

interface Props {
  readonly makeValue: string;
  readonly modelValue: string;
  readonly onMakeChange: (v: string) => void;
  readonly onModelChange: (v: string) => void;
  readonly isArabic: boolean;
  readonly hideMakeField?: boolean;
  readonly testId?: string;
  readonly dataSource?: 'cars' | 'phones' | 'tv' | 'audio' | 'cameras' | 'laptops' | 'appliances';
}

export const CascadingModelSelect: React.FC<Props> = ({ makeValue, modelValue, onMakeChange, onModelChange, isArabic, hideMakeField, testId, dataSource = 'cars' }) => {
  const sources = {
    cars: carHelpers,
    phones: phoneHelpers,
    tv: makeModelHelpers(TV_BRANDS, TV_MODELS),
    audio: makeModelHelpers(AUDIO_BRANDS, AUDIO_MODELS),
    cameras: makeModelHelpers(CAMERA_BRANDS, CAMERA_MODELS),
    laptops: makeModelHelpers(LAPTOP_BRANDS, LAPTOP_MODELS),
    appliances: makeModelHelpers(APPLIANCE_BRANDS, APPLIANCE_MODELS),
  };
  const brandsMap = {
    cars: CAR_BRANDS,
    phones: PHONE_BRANDS_REGISTRY,
    tv: TV_BRANDS,
    audio: AUDIO_BRANDS,
    cameras: CAMERA_BRANDS,
    laptops: LAPTOP_BRANDS,
    appliances: APPLIANCE_BRANDS,
  };
  const helpers = sources[dataSource];
  const brands = brandsMap[dataSource];
  const { getLocalModelOptions, normalizeToSlug, getBrandLabel, isCustomMake } = helpers;
  const customMake0 = isCustomMake(makeValue);
  const [showOtherMake, setShowOtherMake] = useState(customMake0 || makeValue === 'other');
  const [customMake, setCustomMake] = useState(customMake0 ? makeValue : '');
  const modelOptions = getLocalModelOptions(makeValue);
  const normModel = normalizeToSlug(makeValue, modelValue);
  const isModelCustom = Boolean(normModel && (!modelOptions.length || !modelOptions.some((m) => m.value === normModel)));
  const [showOtherModel, setShowOtherModel] = useState(isModelCustom || !modelOptions.length);
  const [customModel, setCustomModel] = useState(isModelCustom ? normModel : '');

  useEffect(() => { if (customMake0) { setShowOtherMake(true); setCustomMake(makeValue); } }, [customMake0, makeValue]);
  useEffect(() => { if (isModelCustom) { setShowOtherModel(true); setCustomModel(normModel); } }, [isModelCustom, normModel]);

  const modelTestId = hideMakeField ? testId : (testId ? `${testId}-model` : undefined);
  const otherLabel = isArabic ? 'أخرى — اكتب يدوياً' : 'Other — type manually';
  const brandOptions = brands.map((b) => (isArabic ? b.nameAr : b.nameEn));
  const selectedBrandLabel = getBrandLabel(makeValue, isArabic);

  const renderModelBlock = () => (
    <div className="flex flex-col gap-1.5 py-1.5">
      {!hideMakeField && <label className="text-xs font-bold text-ink-soft">{isArabic ? 'الموديل' : 'Model'} <span className="text-accent">*</span></label>}
      {modelOptions.length > 0 && (hideMakeField || !showOtherMake) ? (
        <>
          <select
            data-testid={modelTestId}
            value={showOtherModel ? OTHER_VALUE : normModel}
            onChange={(e) => {
              const v = e.target.value;
              if (v === OTHER_VALUE) { setShowOtherModel(true); onModelChange(customModel); }
              else { setShowOtherModel(false); onModelChange(v); }
            }}
            className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">{isArabic ? '-- اختر الموديل --' : '-- Select Model --'}</option>
            {modelOptions.map((m) => (<option key={m.value} value={m.value}>{isArabic ? m.labelAr : m.labelEn}</option>))}
            <option value={OTHER_VALUE}>{otherLabel}</option>
          </select>
          {showOtherModel && (<OtherOptionInput value={customModel} onChange={(v) => { setCustomModel(v); onModelChange(v); }} placeholder={isArabic ? 'اكتب اسم الموديل...' : 'Type model name...'} isArabic={isArabic} />)}
        </>
      ) : (
        <OtherOptionInput value={modelValue} onChange={onModelChange} placeholder={isArabic ? 'اكتب اسم الموديل...' : 'Type model...'} isArabic={isArabic} />
      )}
    </div>
  );

  if (hideMakeField) return renderModelBlock();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 py-1.5">
        <label className="text-xs font-bold text-ink-soft">{isArabic ? 'الماركة' : 'Make'} <span className="text-accent">*</span></label>
        <SearchableDropdown
          options={[...brandOptions, otherLabel]}
          value={showOtherMake ? otherLabel : selectedBrandLabel}
          onChange={(selected) => {
            const v = selected === otherLabel ? OTHER_VALUE : brands.find((b) => (isArabic ? b.nameAr : b.nameEn) === selected)?.slug ?? selected;
            onModelChange(''); setCustomModel('');
            if (v === OTHER_VALUE) { setShowOtherMake(true); setShowOtherModel(true); onMakeChange(customMake); }
            else { setShowOtherMake(false); onMakeChange(v); setShowOtherModel(getLocalModelOptions(v).length === 0); }
          }}
          placeholder={isArabic ? '-- اختر الماركة --' : '-- Select Make --'}
          isArabic={isArabic}
        />
        {showOtherMake && (<OtherOptionInput value={customMake} onChange={(v) => { setCustomMake(v); onMakeChange(v); }} placeholder={isArabic ? 'اكتب اسم الماركة...' : 'Type brand name...'} isArabic={isArabic} />)}
      </div>
      {renderModelBlock()}
    </div>
  );
};
