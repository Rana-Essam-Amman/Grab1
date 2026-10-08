import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, ShieldTick } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { BrandMark } from '@/shared/components/BrandMark';

export const PrivacyScreen: React.FC = () => {
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
          {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        <BrandMark isArabic={isArabic} tone="dark" />
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs text-ink-soft leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldTick size={20} variant="Bold" color="currentColor" />
          <span>{isArabic ? 'حماية بياناتك' : 'Protecting Your Data'}</span>
        </div>
        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '1. البيانات التي نجمعها' : '1. Data We Collect'}
          </h2>
          <p>
            {isArabic
              ? 'نقوم بجمع المعلومات الأساسية لتقديم تجربة أفضل، مثل رقم الهاتف، الموقع الجغرافي التقريبي لتسهيل البحث، ومعلومات الجهاز لضمان أمان الحساب ومنع الاحتيال.'
              : 'We collect essential information to provide a better experience, including your phone number, approximate location for search convenience, and device information to ensure account security and fraud prevention.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '2. كيف نستخدمها' : '2. How We Use It'}
          </h2>
          <p>
            {isArabic
              ? 'تُستخدم بياناتك حصراً لتمكين وظائف التطبيق، مثل التواصل بين البائع والمشتري، تخصيص الإعلانات، وتحليل الأداء لتحسين خدماتنا. نحن لا نبيع بياناتك لأطراف خارجية.'
              : 'Your data is used exclusively to enable app functionality, such as buyer-seller communication, ad personalization, and performance analysis to improve our services. We do not sell your data to third parties.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '3. حقوقك' : '3. Your Rights'}
          </h2>
          <p>
            {isArabic
              ? 'لديك الحق في الوصول إلى بياناتك، تصحيحها، أو طلب حذف حسابك وبياناتك المرتبطة به في أي وقت من خلال إعدادات الملف الشخصي أو التواصل مع فريق الدعم.'
              : 'You have the right to access your data, correct it, or request the deletion of your account and associated data at any time through profile settings or by contacting our support team.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
