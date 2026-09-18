import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export const TermsScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <BackIcon size={18} />
        </Button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'شروط الخدمة والخصوصية' : 'Terms & Privacy'}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs text-ink-soft leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldCheck size={20} />
          <span>Catch the Deals — Community Standards</span>
        </div>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '1. نزاهة ومصداقية الإعلانات' : '1. Marketplace Integrity'}
          </h2>
          <p>
            {isArabic
              ? 'يجب أن تكون جميع السلع المعروضة حقيقية ومملوكة للمعلن أو لديه تفويض صريح ببيعها. يمنع منعاً باتاً نشر إعلانات وهمية، مضللة، أو تتضمن صوراً ليست للسلعة المعنية دون تنويه صريح.'
              : 'All listings must be genuine and accurately describe the item being offered. Misleading information, fake items, or copyright-infringing content are strictly prohibited.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '2. الخصوصية وأرقام الهواتف' : '2. Privacy & Contact Information'}
          </h2>
          <p>
            {isArabic
              ? 'نحن نحترم خصوصية المستخدمين ولا نشارك أرقام الهواتف أو البيانات الشخصية مع أي طرف ثالث لأغراض إعلانية خارجية. يتم استخدام رقم الهاتف فقط لتمكين التواصل المباشر بين البائع والمشتري.'
              : 'User phone numbers and identities are protected. We do not sell user data. Contacts are displayed solely for direct buyer-to-seller interactions.'}
          </p>
        </Card>

        <Card variant="default" padding="md">
          <h2 className="font-bold text-sm text-ink mb-1.5">
            {isArabic ? '3. المعاينة والفحص الآمن' : '3. Safety & In-Person Viewing'}
          </h2>
          <p>
            {isArabic
              ? 'ننصح دائماً بإجراء المعاينة في أماكن عامة معروفة، وفحص السلع وفحص المركبات لدى مراكز فحص معتمدة قبل تحويل أي مبالغ مالية.'
              : 'Always arrange inspection in public places and inspect high-value items or vehicles at certified centers before transferring funds.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
