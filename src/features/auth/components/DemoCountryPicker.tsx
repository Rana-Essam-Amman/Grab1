import React from 'react';
import type { MarketCode } from '@/shared/lib/marketGate';
import { CountryOption } from './CountryOption';

interface DemoCountryPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (code: MarketCode) => void;
  isArabic?: boolean;
}

const COUNTRIES: { code: MarketCode; ar: string; en: string }[] = [
  { code: 'JO', ar: 'الأردن', en: 'Jordan' },
  { code: 'SA', ar: 'السعودية', en: 'Saudi Arabia' },
  { code: 'PS', ar: 'فلسطين', en: 'Palestine' },
  { code: 'LB', ar: 'لبنان', en: 'Lebanon' },
  { code: 'SY', ar: 'سوريا', en: 'Syria' },
];

export const DemoCountryPicker: React.FC<DemoCountryPickerProps> = ({
  open, onClose, onSelect, isArabic = true,
}) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.80)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#1B2A4A',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          }}>
            {isArabic ? 'اختر الدولة' : 'Choose Country'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {COUNTRIES.map((c) => (
            <CountryOption
              key={c.code}
              code={c.code}
              ar={c.ar}
              en={c.en}
              isArabic={isArabic}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
