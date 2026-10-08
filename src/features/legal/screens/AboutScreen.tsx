import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, InfoCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { BrandMark } from '@/shared/components/BrandMark';

export const AboutScreen: React.FC = () => {
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
          {isArabic ? 'حول' : 'About'}
        </h1>
        <BrandMark isArabic={isArabic} tone="dark" />
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs text-ink-soft leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <InfoCircle size={20} variant="Bold" color="currentColor" />
          <span>{isArabic ? 'معلومات عنا' : 'About Us'}</span>
        </div>
        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '1. ما هو FOX Marketplace' : '1. What is FOX Marketplace'}
          </h2>
          <p>
            {isArabic
              ? 'FOX Marketplace هي منصة إعلانات مبوبة ذكية تهدف لتسهيل عمليات البيع والشراء باستخدام تقنيات الذكاء الاصطناعي لتقديم تجربة مستخدم سلسة وآمنة.'
              : 'FOX Marketplace is a smart classifieds platform aimed at facilitating buying and selling operations using AI technologies to provide a smooth and secure user experience.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '2. مهمتنا' : '2. Our Mission'}
          </h2>
          <p>
            {isArabic
              ? 'مهمتنا هي تمكين الأفراد والمؤسسات من عرض سلعهم وخدماتهم بسهولة، وتوفير بيئة تجارية شفافة وموثوقة لجميع مستخدمينا في المنطقة.'
              : 'Our mission is to empower individuals and organizations to display their goods and services easily, providing a transparent and reliable commercial environment for all our users in the region.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '3. الإصدار' : '3. Version'}
          </h2>
          <p>
            {isArabic
              ? 'الإصدار (v0.1.0 — تجريبي). نحن نعمل باستمرار على تحديث وتحسين التطبيق لإضافة ميزات جديدة ومبتكرة.'
              : 'Version (v0.1.0 — Beta). We are constantly working on updating and improving the app to add new and innovative features.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
