import React from 'react';
import { DocumentText, ShieldTick, InfoCircle, Call, ArrowLeft2, ArrowRight2 } from 'iconsax-react';

export interface SettingsLegalSectionProps {
  readonly isArabic: boolean;
  readonly onTerms: () => void;
  readonly onSafety: () => void;
  readonly onSupport: () => void;
  readonly onPrivacy: () => void;
  readonly onAbout: () => void;
}

const rowClass = 'p-3.5 flex items-center justify-between cursor-pointer hover:bg-surface border-b border-border/60 transition-colors';

export const SettingsLegalSection: React.FC<SettingsLegalSectionProps> = ({
  isArabic, onTerms, onSafety, onSupport, onPrivacy, onAbout,
}) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
      <div className="p-3 bg-background/40 border-b border-border text-xs font-bold text-ink uppercase tracking-wider">
        {isArabic ? 'عن التطبيق والشروط' : 'About & Legal'}
      </div>

      <div onClick={onTerms} className={rowClass}>
        <div className="flex items-center gap-3">
          <DocumentText size={18} variant="Linear" color="#E57E25" className="text-primary" />
          <div className="text-sm font-semibold text-ink">
            {isArabic ? 'شروط الخدمة وسياسة الخصوصية' : 'Terms of Service & Privacy Policy'}
          </div>
        </div>
        <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
      </div>

      <div onClick={onSafety} className={rowClass}>
        <div className="flex items-center gap-3">
          <ShieldTick size={18} variant="Linear" color="#16A34A" className="text-green-600" />
          <div className="text-sm font-semibold text-ink">
            {isArabic ? 'الأمان' : 'Safety'}
          </div>
        </div>
        <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
      </div>

      <div onClick={onSupport} className={rowClass}>
        <div className="flex items-center gap-3">
          <Call size={18} variant="Linear" color="#E57E25" className="text-primary" />
          <div className="text-sm font-semibold text-ink">
            {isArabic ? 'الدعم والمساعدة' : 'Support'}
          </div>
        </div>
        <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
      </div>

      <div onClick={onPrivacy} className={rowClass}>
        <div className="flex items-center gap-3">
          <DocumentText size={18} variant="Linear" color="#E57E25" className="text-primary" />
          <div className="text-sm font-semibold text-ink">
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </div>
        </div>
        <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
      </div>

      <div onClick={onAbout} className={rowClass}>
        <div className="flex items-center gap-3">
          <InfoCircle size={18} variant="Linear" color="#E57E25" className="text-primary" />
          <div className="text-sm font-semibold text-ink">
            {isArabic ? 'حول التطبيق' : 'About'}
          </div>
        </div>
        <ChevronIcon size={18} variant="Linear" className="text-ink-muted" />
      </div>

      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldTick size={18} variant="Linear" color="#16A34A" className="text-green-600" />
          <div>
            <div className="text-sm font-semibold text-ink">Catch the Deals</div>
            <div className="text-xs text-ink-muted">Version 1.0.0 (Regional Edition)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
