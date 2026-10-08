import { useUI } from '@/hooks/useUI';
import React from 'react';
import { ArrowLeft, ArrowRight, DollarCircle, TickCircle } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { BrandMark } from '@/shared/components/BrandMark';

interface MarketRowProps {
  readonly code: string;
  readonly isArabic: boolean;
}

const MarketRow: React.FC<MarketRowProps> = ({ code, isArabic }) => {
  const pkg = MONETIZATION_MATRIX.packages[code];
  if (!pkg) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/60 last:border-b-0">
      <span className="text-xs font-bold text-ink">{code}</span>
      <span className="text-xs text-ink-soft">
        {isArabic ? `Turbo ${pkg.turboAdCost} ${pkg.currencySymbol}` : `Turbo ${pkg.turboAdCost} ${pkg.currency}`}
      </span>
      <span className="text-xs font-bold text-primary">
        {isArabic ? `مميز ${pkg.featuredAdCost} ${pkg.currencySymbol}` : `Featured ${pkg.featuredAdCost} ${pkg.currency}`}
      </span>
    </div>
  );
};

export const PricingScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const markets = ['JO', 'SA', 'LB', 'PS', 'SY'];

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={goBack} aria-label={isArabic ? 'رجوع' : 'Back'}>
          <BackIcon size={18} variant="Linear" color="currentColor" className="text-ink" />
        </Button>
        <h1 className="text-base font-bold text-ink flex-1">
          {isArabic ? 'الأسعار' : 'Pricing'}
        </h1>
        <BrandMark isArabic={isArabic} tone="dark" />
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-2 py-4">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
            <DollarCircle size={32} variant="Bold" color="#E57E25" />
          </div>
          <h2 className="text-2xl font-black text-ink">
            {isArabic ? '0% عمولة على البيع' : '0% commission on sales'}
          </h2>
          <p className="text-sm text-ink-soft max-w-xs">
            {isArabic
              ? 'احتفظ بكامل ثمن سلعتك — FOX لا يأخذ نسبة.'
              : 'Keep the full price of your item — FOX takes zero cut.'}
          </p>
        </div>

        <Card variant="default" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <TickCircle size={20} variant="Bold" color="#10B981" />
            <h3 className="font-bold text-sm text-ink">
              {isArabic ? 'مجاناً للأبد' : 'Free forever'}
            </h3>
          </div>
          <ul className="flex flex-col gap-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">·</span>
              <span>
                {isArabic
                  ? `${MONETIZATION_MATRIX.freeLimits.generalCategoryLimit} إعلانات نشطة مجانية (${MONETIZATION_MATRIX.freeLimits.premiumCategoryLimit} للسيارات والعقارات)`
                  : `${MONETIZATION_MATRIX.freeLimits.generalCategoryLimit} free active ads (${MONETIZATION_MATRIX.freeLimits.premiumCategoryLimit} for motors & real estate)`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">·</span>
              <span>
                {isArabic
                  ? `حتى ${MONETIZATION_MATRIX.freeLimits.photoLimit} صور لكل إعلان`
                  : `Up to ${MONETIZATION_MATRIX.freeLimits.photoLimit} photos per listing`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success font-bold">·</span>
              <span>
                {isArabic
                  ? `${MONETIZATION_MATRIX.freeLimits.bumpDailyLimit} رفعات يومياً`
                  : `${MONETIZATION_MATRIX.freeLimits.bumpDailyLimit} bumps per day`}
              </span>
            </li>
          </ul>
        </Card>

        <Card variant="default" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <DollarCircle size={20} variant="Bold" color="#E57E25" />
            <h3 className="font-bold text-sm text-ink">
              {isArabic ? 'ترقيات اختيارية' : 'Optional upgrades'}
            </h3>
          </div>
          <p className="text-xs text-ink-soft mb-3">
            {isArabic
              ? 'لمن يريد بيعاً أسرع — بدون إلزام.'
              : 'For faster sales — completely optional.'}
          </p>
          <div className="flex flex-col">
            {markets.map((code) => (
              <MarketRow key={code} code={code} isArabic={isArabic} />
            ))}
          </div>
        </Card>

        <Card variant="default" padding="md">
          <h3 className="font-bold text-sm text-ink mb-2">
            {isArabic ? 'لماذا 0%؟' : 'Why 0%?'}
          </h3>
          <p className="text-xs text-ink-soft leading-relaxed">
            {isArabic
              ? 'نؤمن أن البائع يجب أن يحتفظ بكامل ثمن سلعته. نعتمد على ترقيات اختيارية، لا على نسبة من بيعك.'
              : 'Sellers should keep the full price of their item. We earn from optional upgrades, not from a cut of your sale.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
