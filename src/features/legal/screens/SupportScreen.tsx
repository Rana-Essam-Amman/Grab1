import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, Call } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { BrandMark } from '@/shared/components/BrandMark';

export const SupportScreen: React.FC = () => {
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
          {isArabic ? 'الدعم' : 'Support'}
        </h1>
        <BrandMark isArabic={isArabic} tone="dark" />
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs text-ink-soft leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Call size={20} variant="Bold" color="currentColor" />
          <span>{isArabic ? 'مركز المساعدة' : 'Help Center'}</span>
        </div>
        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '1. تواصل معنا' : '1. Contact Us'}
          </h2>
          <p>
            {isArabic
              ? 'فريقنا متاح دائماً لمساعدتك. يمكنك مراسلتنا عبر البريد الإلكتروني support@grabbthedeals.com أو الاتصال بنا مباشرة لأي استفسارات عاجلة تتعلق بحسابك.'
              : 'Our team is always available to help. You can reach us via email at support@grabbthedeals.com or call us directly for any urgent inquiries regarding your account.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '2. أسئلة شائعة' : '2. Frequently Asked Questions'}
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-bold text-ink">
                {isArabic ? 'س: كيف يمكنني نشر إعلان؟' : 'Q: How can I post an ad?'}
              </p>
              <p>
                {isArabic
                  ? 'ج: اضغط على زر "أضف إعلان" واتبع الخطوات السهلة مع مساعدة الذكاء الاصطناعي.'
                  : 'A: Click the "Post Ad" button and follow the easy steps with AI assistance.'}
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">
                {isArabic ? 'س: هل التطبيق مجاني؟' : 'Q: Is the app free?'}
              </p>
              <p>
                {isArabic
                  ? 'ج: نعم، النشر الأساسي مجاني، ونوفر خيارات مدفوعة لتمييز الإعلانات.'
                  : 'A: Yes, basic posting is free, and we offer paid options to feature ads.'}
              </p>
            </div>
            <div>
              <p className="font-bold text-ink">
                {isArabic ? 'س: كيف أحذف إعلاني؟' : 'Q: How do I delete my ad?'}
              </p>
              <p>
                {isArabic
                  ? 'ج: من خلال قسم "إعلاناتي"، اختر الإعلان واضغط على "حذف".'
                  : 'A: Through the "My Ads" section, select the ad and click "Delete".'}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '3. أبلغ عن مشكلة' : '3. Report a Problem'}
          </h2>
          <p>
            {isArabic
              ? 'إذا واجهت أي مشاكل تقنية أو لاحظت سلوكاً غير لائق، يرجى الإبلاغ فوراً لضمان سلامة مجتمعنا. نأخذ جميع التقارير بجدية تامة.'
              : 'If you encounter any technical issues or notice inappropriate behavior, please report it immediately to ensure our community\'s safety. We take all reports very seriously.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
