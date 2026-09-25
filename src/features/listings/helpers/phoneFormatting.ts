export interface FormattedPhone {
  dialNumber: string;
  displayFormatted: string;
}

export function getFormattedLocalPhone(
  rawPhone: string,
  countryCode?: string
): FormattedPhone {
  if (!rawPhone) return { dialNumber: '', displayFormatted: '' };

  let cleaned = rawPhone.replace(/\D/g, '');

  const config: Record<string, { intlCode: string; localPrefix: string; length: number }> = {
    JO: { intlCode: '962', localPrefix: '0', length: 10 },
    LB: { intlCode: '961', localPrefix: '0', length: 8 },
    PS: { intlCode: '970', localPrefix: '0', length: 10 },
    SY: { intlCode: '963', localPrefix: '0', length: 10 },
    SA: { intlCode: '966', localPrefix: '0', length: 10 },
  };

  let detectedCountry = countryCode || 'JO';
  if (!countryCode || !config[countryCode]) {
    if (cleaned.startsWith('962')) detectedCountry = 'JO';
    else if (cleaned.startsWith('961')) detectedCountry = 'LB';
    else if (cleaned.startsWith('970') || cleaned.startsWith('972')) detectedCountry = 'PS';
    else if (cleaned.startsWith('963')) detectedCountry = 'SY';
    else if (cleaned.startsWith('966')) detectedCountry = 'SA';
    else {
      if (cleaned.length === 8 && cleaned.startsWith('3')) detectedCountry = 'LB';
      else if (cleaned.length === 9) {
        if (cleaned.startsWith('7')) detectedCountry = 'JO';
        else if (cleaned.startsWith('5')) detectedCountry = 'SA';
        else if (cleaned.startsWith('9')) detectedCountry = 'SY';
      }
    }
  }

  const cfg = config[detectedCountry] || config.JO;

  if (detectedCountry === 'PS' && cleaned.startsWith('972')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith(cfg.intlCode)) {
    cleaned = cleaned.slice(cfg.intlCode.length);
  }

  if (cleaned.startsWith('00')) {
    cleaned = cleaned.slice(2);
  }

  if (!cleaned.startsWith('0')) {
    cleaned = cfg.localPrefix + cleaned;
  }

  const dialNumber = '+' + cfg.intlCode + cleaned.slice(1);
  const displayFormatted = cleaned;

  return { dialNumber, displayFormatted };
}
