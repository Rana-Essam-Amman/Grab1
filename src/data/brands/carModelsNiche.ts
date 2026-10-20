// ⚠️ RULE-14-EXCEPTION: Static model taxonomy — Premium & Niche (config, capped at 500 lines)
// Premium/luxury brands with high-end positioning or low-volume presence in Jordan.
import type { CarModel } from './carModels.types';

export const NICHE_MODELS: Record<string, readonly CarModel[]> = {
  infiniti: [
    { slug: 'q50', nameAr: 'Q50', nameEn: 'Q50', trims: ['Pure', 'Luxe', 'Sport', 'Red Sport'] },
    { slug: 'qx50', nameAr: 'QX50', nameEn: 'QX50', trims: ['Pure', 'Luxe', 'Essential', 'Sensory'] },
    { slug: 'qx60', nameAr: 'QX60', nameEn: 'QX60', trims: ['Pure', 'Luxe', 'Essential', 'Sensory'] },
    { slug: 'qx80', nameAr: 'QX80', nameEn: 'QX80', trims: ['Luxe', 'Premium Select', 'Sensory'] },
  ],
  cadillac: [
    { slug: 'ct4', nameAr: 'CT4', nameEn: 'CT4', trims: ['Luxury', 'Premium Luxury', 'Sport', 'V'] },
    { slug: 'ct5', nameAr: 'CT5', nameEn: 'CT5', trims: ['Luxury', 'Premium Luxury', 'Sport', 'V'] },
    { slug: 'escalade', nameAr: 'إسكاليد', nameEn: 'Escalade', trims: ['Luxury', 'Premium Luxury', 'Sport', 'Platinum'] },
    { slug: 'xt5', nameAr: 'XT5', nameEn: 'XT5', trims: ['Luxury', 'Premium Luxury', 'Sport'] },
  ],
  jaguar: [
    { slug: 'xe', nameAr: 'XE', nameEn: 'XE', trims: ['Base', 'Premium', 'R-Sport', 'S'] },
    { slug: 'xf', nameAr: 'XF', nameEn: 'XF', trims: ['Base', 'Premium', 'R-Sport', 'S'] },
    { slug: 'f_pace', nameAr: 'F-Pace', nameEn: 'F-Pace', trims: ['Base', 'Premium', 'R-Sport', 'SVR'] },
    { slug: 'e_pace', nameAr: 'E-Pace', nameEn: 'E-Pace', trims: ['Base', 'S', 'SE', 'R-Dynamic'] },
  ],
  'alfa-romeo': [
    { slug: 'giulia', nameAr: 'Giulia', nameEn: 'Giulia', trims: ['Base', 'Ti', 'Veloce', 'Quadrifoglio'] },
    { slug: 'stelvio', nameAr: 'Stelvio', nameEn: 'Stelvio', trims: ['Base', 'Ti', 'Veloce', 'Quadrifoglio'] },
    { slug: 'giulietta', nameAr: 'Giulietta', nameEn: 'Giulietta', trims: ['Base', 'Super', 'Veloce'] },
  ],
};
