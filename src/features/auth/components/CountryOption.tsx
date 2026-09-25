import React from 'react';
import type { MarketCode } from '@/shared/lib/marketGate';

interface CountryOptionProps {
  code: MarketCode;
  ar: string;
  en: string;
  isArabic: boolean;
  onSelect: (code: MarketCode) => void;
}

export const CountryOption: React.FC<CountryOptionProps> = ({
  code, ar, en, isArabic, onSelect,
}) => (
  <button
    onClick={() => onSelect(code)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderRadius: '14px',
      background: '#F1F5F9',
      border: '2px solid #E2E8F0',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 600,
      color: '#0F172A',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      transition: 'all 0.15s',
    }}
  >
    <span>{isArabic ? ar : en}</span>
    <img
      src={`/assets/flags/${code.toLowerCase()}.png`}
      alt={code}
      style={{ width: '32px', height: '22px', objectFit: 'cover', borderRadius: '3px' }}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
      }}
    />
  </button>
);
