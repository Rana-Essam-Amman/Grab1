import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, ShieldTick } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { BrandMark } from '@/shared/components/BrandMark';

export const SafetyScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <div className="text-ink">
          <Button variant="ghost" size="icon" onClick={goBack}>
            <BackIcon size={18} variant="Linear" color="currentColor" />
          </Button>
        </div>
        <h1 className="text-base font-bold text-ink flex-1">
          {isArabic ? 'الأمان' : 'Safety'}
        </h1>
        <BrandMark isArabic={isArabic} tone="dark" />
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs text-ink-soft leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldTick size={20} variant="Bold" color="currentColor" />
          <span>{isArabic ? 'دليل الأمان' : 'Safety Guide'}</span>
        </div>
        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '1. المعاينة الآمنة' : '1. Safe Viewing'}
          </h2>
          <p>
            {isArabic
              ? 'احرص دائماً على مقابلة البائع أو المشتري في أماكن عامة ومزدحمة خلال النهار. لا تذهب بمفردك إذا كان ذلك ممكناً، وشارك موقعك مع شخص تثق به.'
              : 'Always make sure to meet the buyer or seller in public and crowded places during daylight. Don\'t go alone if possible, and share your location with someone you trust.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '2. الدفع الآمن' : '2. Secure Payment'}
          </h2>
          <p>
            {isArabic
              ? 'تجنب تحويل الأموال مسبقاً أو دفع عربون قبل فحص السلعة والتأكد من سلامتها. نوصي بالدفع عند الاستلام والمعاينة المباشرة لضمان حق الطرفين.'
              : 'Avoid transferring money in advance or paying a deposit before inspecting the item and ensuring its safety. We recommend payment upon receipt and direct inspection to ensure the rights of both parties.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '3. أبلغ عن احتيال' : '3. Report Fraud'}
          </h2>
          <p>
            {isArabic
              ? 'إذا اشتبهت في أي محاولة احتيال أو إعلان وهمي، استخدم ميزة "الإبلاغ" المتوفرة في كل إعلان. نحن نعمل بجد لحماية المستخدمين من أي ممارسات غير قانونية.'
              : 'If you suspect any fraud attempt or fake ad, use the "Report" feature available in every ad. We work hard to protect users from any illegal practices.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
