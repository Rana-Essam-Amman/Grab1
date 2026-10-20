// ⚠️ RULE-14-EXCEPTION: Static model taxonomy — Premium & Niche (config, capped at 500 lines)
// Premium/luxury brands with high-end positioning or low-volume presence in Jordan.
import type { CarModel } from './carModels.types';

export const NICHE_MODELS: Record<string, readonly CarModel[]> = {
  // ─── P1-3 (4 brands) ────────────────────────────────────────────────
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
  // ─── P5 (10 luxury brands) ──────────────────────────────────────────
  ferrari: [
    { slug: 'roma', nameAr: 'Roma', nameEn: 'Roma', trims: ['Standard', 'Spider'] },
    { slug: 'sf90', nameAr: 'SF90', nameEn: 'SF90', trims: ['Stradale', 'Spider', 'XX'] },
    { slug: '296', nameAr: '296', nameEn: '296', trims: ['GTB', 'GTS', 'Speciale'] },
    { slug: 'purosangue', nameAr: 'Purosangue', nameEn: 'Purosangue', trims: ['Standard'] },
    { slug: '812', nameAr: '812', nameEn: '812', trims: ['Superfast', 'GTS', 'Competizione'] },
  ],
  lamborghini: [
    { slug: 'huracan', nameAr: 'Huracán', nameEn: 'Huracán', trims: ['Evo', 'Evo Spyder', 'STO', 'Tecnica', 'Sterrato'] },
    { slug: 'aventador', nameAr: 'Aventador', nameEn: 'Aventador', trims: ['S', 'SVJ', 'Ultimae'] },
    { slug: 'urus', nameAr: 'Urus', nameEn: 'Urus', trims: ['Standard', 'S', 'Performante'] },
    { slug: 'revuelto', nameAr: 'Revuelto', nameEn: 'Revuelto', trims: ['Standard'] },
  ],
  maserati: [
    { slug: 'ghibli', nameAr: 'Ghibli', nameEn: 'Ghibli', trims: ['GT', 'Modena', 'Trofeo'] },
    { slug: 'levante', nameAr: 'Levante', nameEn: 'Levante', trims: ['GT', 'Modena', 'Trofeo'] },
    { slug: 'grecale', nameAr: 'Grecale', nameEn: 'Grecale', trims: ['GT', 'Modena', 'Trofeo'] },
    { slug: 'granturismo', nameAr: 'GranTurismo', nameEn: 'GranTurismo', trims: ['Modena', 'Trofeo', 'Folgore'] },
  ],
  bentley: [
    { slug: 'continental_gt', nameAr: 'Continental GT', nameEn: 'Continental GT', trims: ['V8', 'W12', 'Speed', 'Mulliner'] },
    { slug: 'bentayga', nameAr: 'Bentayga', nameEn: 'Bentayga', trims: ['V8', 'Hybrid', 'Speed', 'EWB'] },
    { slug: 'flying_spur', nameAr: 'Flying Spur', nameEn: 'Flying Spur', trims: ['V8', 'W12', 'Speed', 'Mulliner'] },
  ],
  'rolls-royce': [
    { slug: 'phantom', nameAr: 'Phantom', nameEn: 'Phantom', trims: ['Standard', 'Extended', 'EWB'] },
    { slug: 'ghost', nameAr: 'Ghost', nameEn: 'Ghost', trims: ['Standard', 'Extended', 'Black Badge'] },
    { slug: 'cullinan', nameAr: 'Cullinan', nameEn: 'Cullinan', trims: ['Standard', 'Black Badge'] },
    { slug: 'spectre', nameAr: 'Spectre', nameEn: 'Spectre', trims: ['Standard', 'Black Badge'] },
  ],
  'aston-martin': [
    { slug: 'vantage', nameAr: 'Vantage', nameEn: 'Vantage', trims: ['Standard', 'F1 Edition', 'Roadster'] },
    { slug: 'db11', nameAr: 'DB11', nameEn: 'DB11', trims: ['V8', 'V12', 'AMR'] },
    { slug: 'db12', nameAr: 'DB12', nameEn: 'DB12', trims: ['Standard', 'Volante'] },
    { slug: 'dbx', nameAr: 'DBX', nameEn: 'DBX', trims: ['Standard', '707'] },
  ],
  mclaren: [
    { slug: '720s', nameAr: '720S', nameEn: '720S', trims: ['Standard', 'Spider', 'Luxury'] },
    { slug: '750s', nameAr: '750S', nameEn: '750S', trims: ['Standard', 'Spider'] },
    { slug: 'artura', nameAr: 'Artura', nameEn: 'Artura', trims: ['Standard', 'Spider'] },
    { slug: 'gt', nameAr: 'GT', nameEn: 'GT', trims: ['Standard'] },
  ],
  lotus: [
    { slug: 'emira', nameAr: 'Emira', nameEn: 'Emira', trims: ['V6', 'i4', 'First Edition'] },
    { slug: 'eletre', nameAr: 'Eletre', nameEn: 'Eletre', trims: ['S', 'R'] },
    { slug: 'evija', nameAr: 'Evija', nameEn: 'Evija', trims: ['Standard'] },
  ],
};
