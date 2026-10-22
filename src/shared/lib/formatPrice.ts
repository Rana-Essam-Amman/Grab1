export function formatPrice(
  amount: string | number | null | undefined,
  currencyCode: string | null | undefined,
  isArabic: boolean
): string {
  if (amount === null || amount === undefined || amount === '') return '';

  const num = Number(amount);

  const formattedNumber = !isNaN(num)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)
    : String(amount);

  const currencyMap: Record<string, { ar: string; en: string }> = {
    JOD: { ar: 'دينار', en: 'JOD' },
    USD: { ar: 'دولار', en: 'USD' },
    SAR: { ar: 'ريال', en: 'SAR' },
    LBP: { ar: 'ليرة لبنانية', en: 'LBP' },
    SYP: { ar: 'ليرة سورية', en: 'SYP' },
    ILS: { ar: 'شيكل', en: 'ILS' },
    AED: { ar: 'درهم', en: 'AED' },
    EGP: { ar: 'جنيه', en: 'EGP' },
  };

  const code = (currencyCode || '').toUpperCase();
  const currencyLabel = currencyMap[code]
    ? isArabic
      ? currencyMap[code].ar
      : currencyMap[code].en
    : currencyCode || '';

  return `${formattedNumber} ${currencyLabel}`.trim();
}
