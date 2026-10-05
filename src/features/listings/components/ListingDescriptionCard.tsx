import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Lock1 } from 'iconsax-react';

export interface ListingDescriptionCardProps {
  description: string;
  isArabic: boolean;
  isAuthenticated: boolean;
  onNavigateToLogin: () => void;
}

export const ListingDescriptionCard: React.FC<ListingDescriptionCardProps> = React.memo(({ description, isArabic, isAuthenticated, onNavigateToLogin }) => {
  const descText = description || '';
  const phoneRegex = /((?:(?:\+|00)?\d{1,3}[\s-]*)?(?:\d[\s-]*){7,11}\d)/g;
  const renderDescription = () => {
    if (!descText) return null;
    if (!isAuthenticated) {
      const parts = descText.split(phoneRegex);
      if (parts.length === 1) return descText;
      return parts.map((part, index) => {
        if (part.match(/^(?:(?:\+|00)?\d{1,3}[\s-]*)?(?:\d[\s-]*){7,11}\d$/)) {
          return (
            <span key={index} onClick={(e) => { e.stopPropagation(); onNavigateToLogin(); }} className="bg-warning/15 text-primary border border-warning/40 px-1.5 py-0.5 rounded-md font-bold cursor-pointer hover:bg-warning/25 transition-colors inline-flex items-center gap-1 select-none mx-1 text-xs" title={isArabic ? 'سجل دخول لرؤية الرقم' : 'Sign in to show number'}>
              <Lock1 size={11} variant="Linear" />
              <span>{isArabic ? '[رقم مخفي - اضغط لرؤيته]' : '[Hidden Number - Click to Show]'}</span>
            </span>
          );
        }
        return part;
      });
    }
    return descText.replace(phoneRegex, (match) => {
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length < 7) return match;
      return isArabic ? ' [رقم محمي - استخدم أزرار التواصل] ' : ' [Protected Number - Use Contact Buttons] ';
    });
  };

  return (
    <Card variant="default" className="p-4">
      <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">{isArabic ? 'تفاصيل الإعلان' : 'Description'}</h3>
      <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line font-medium" dir="auto">{renderDescription()}</p>
    </Card>
  );
});

ListingDescriptionCard.displayName = 'ListingDescriptionCard';
