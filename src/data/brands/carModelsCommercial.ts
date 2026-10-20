// ⚠️ RULE-14-EXCEPTION: Static model taxonomy — Commercial & Legacy (config, capped at 500 lines)
// Trucks, startup EVs, American luxury, and legacy/obscure brands.
import type { CarModel } from './carModels.types';

export const COMMERCIAL_MODELS: Record<string, readonly CarModel[]> = {
  // ─── Trucks ──────────────────────────────────────────────────────────
  man: [
    { slug: 'tgx', nameAr: 'TGX', nameEn: 'TGX', trims: ['18.440', '18.480', '26.440', '26.480'] },
    { slug: 'tgs', nameAr: 'TGS', nameEn: 'TGS', trims: ['18.400', '26.400', '28.400', '33.400'] },
    { slug: 'tgl', nameAr: 'TGL', nameEn: 'TGL', trims: ['8.180', '12.180', '12.220'] },
  ],
  scania: [
    { slug: 'r_series', nameAr: 'R Series', nameEn: 'R Series', trims: ['R410', 'R450', 'R500', 'R580'] },
    { slug: 's_series', nameAr: 'S Series', nameEn: 'S Series', trims: ['S450', 'S500', 'S580', 'S730'] },
    { slug: 'g_series', nameAr: 'G Series', nameEn: 'G Series', trims: ['G360', 'G410', 'G450'] },
    { slug: 'p_series', nameAr: 'P Series', nameEn: 'P Series', trims: ['P280', 'P320', 'P360'] },
  ],
  iveco: [
    { slug: 'stralis', nameAr: 'Stralis', nameEn: 'Stralis', trims: ['AT440', 'AT480', 'XP'] },
    { slug: 'trakker', nameAr: 'Trakker', nameEn: 'Trakker', trims: ['AD260', 'AD380', 'AT380'] },
    { slug: 'daily', nameAr: 'Daily', nameEn: 'Daily', trims: ['35C', '50C', '70C'] },
  ],
  hino: [
    { slug: '500_series', nameAr: '500 Series', nameEn: '500 Series', trims: ['FC', 'FD', 'FE', 'FG', 'FL'] },
    { slug: '700_series', nameAr: '700 Series', nameEn: '700 Series', trims: ['SH', 'SS', 'SV', 'ZM'] },
    { slug: '300_series', nameAr: '300 Series', nameEn: '300 Series', trims: ['300', 'Dutro'] },
  ],
  fuso: [
    { slug: 'canter', nameAr: 'Canter', nameEn: 'Canter', trims: ['3.5T', '6.5T', '7.5T'] },
    { slug: 'fighter', nameAr: 'Fighter', nameEn: 'Fighter', trims: ['6M60', '6M61', '6M70'] },
    { slug: 'super_great', nameAr: 'Super Great', nameEn: 'Super Great', trims: ['FV', 'FS', 'FY'] },
  ],
  kamaz: [
    { slug: '5490', nameAr: '5490', nameEn: '5490', trims: ['Standard', 'Neo'] },
    { slug: '65115', nameAr: '65115', nameEn: '65115', trims: ['Standard', 'Tipper'] },
    { slug: '4308', nameAr: '4308', nameEn: '4308', trims: ['Standard', 'Crew'] },
  ],
  // ─── Startup EVs ─────────────────────────────────────────────────────
  smart: [
    { slug: 'fortwo', nameAr: 'Fortwo', nameEn: 'Fortwo', trims: ['Pure', 'Passion', 'Prime'] },
    { slug: 'forfour', nameAr: 'Forfour', nameEn: 'Forfour', trims: ['Pure', 'Passion', 'Prime'] },
    { slug: '1', nameAr: '#1', nameEn: '#1', trims: ['Pro', 'Premium', 'Brabus'] },
    { slug: '3', nameAr: '#3', nameEn: '#3', trims: ['Pro', 'Premium', 'Brabus'] },
  ],
  polestar: [
    { slug: '2', nameAr: 'Polestar 2', nameEn: 'Polestar 2', trims: ['Standard', 'Long Range', 'Performance'] },
    { slug: '3', nameAr: 'Polestar 3', nameEn: 'Polestar 3', trims: ['Dual Motor', 'Performance'] },
    { slug: '4', nameAr: 'Polestar 4', nameEn: 'Polestar 4', trims: ['Standard', 'Long Range', 'Dual Motor'] },
  ],
  rivian: [
    { slug: 'r1t', nameAr: 'R1T', nameEn: 'R1T', trims: ['Launch', 'Adventure', 'Explore'] },
    { slug: 'r1s', nameAr: 'R1S', nameEn: 'R1S', trims: ['Launch', 'Adventure', 'Explore'] },
    { slug: 'r2', nameAr: 'R2', nameEn: 'R2', trims: ['Standard', 'Long Range'] },
  ],
  // ─── American Luxury / Legacy ────────────────────────────────────────
  lincoln: [
    { slug: 'navigator', nameAr: 'Navigator', nameEn: 'Navigator', trims: ['Standard', 'Reserve', 'Black Label'] },
    { slug: 'aviator', nameAr: 'Aviator', nameEn: 'Aviator', trims: ['Standard', 'Reserve', 'Grand Touring'] },
    { slug: 'nautilus', nameAr: 'Nautilus', nameEn: 'Nautilus', trims: ['Standard', 'Reserve', 'Black Label'] },
    { slug: 'corsair', nameAr: 'Corsair', nameEn: 'Corsair', trims: ['Standard', 'Reserve', 'Grand Touring'] },
  ],
  hummer: [
    { slug: 'ev_pickup', nameAr: 'EV Pickup', nameEn: 'EV Pickup', trims: ['EV2', 'EV2X', 'Edition 1'] },
    { slug: 'ev_suv', nameAr: 'EV SUV', nameEn: 'EV SUV', trims: ['EV2', 'EV2X', 'Edition 1'] },
    { slug: 'h2', nameAr: 'H2', nameEn: 'H2', trims: ['Standard', 'SUT', 'Lux'] },
    { slug: 'h3', nameAr: 'H3', nameEn: 'H3', trims: ['Standard', 'Alpha', 'T'] },
  ],
  // ─── Legacy / Obscure ────────────────────────────────────────────────
  ssangyong: [
    { slug: 'tivoli', nameAr: 'Tivoli', nameEn: 'Tivoli', trims: ['Standard', 'Premium', 'Sport'] },
    { slug: 'korando', nameAr: 'Korando', nameEn: 'Korando', trims: ['Standard', 'Premium', 'Sport'] },
    { slug: 'rexton', nameAr: 'Rexton', nameEn: 'Rexton', trims: ['Standard', 'Premium', 'Sports'] },
    { slug: 'musso', nameAr: 'Musso', nameEn: 'Musso', trims: ['Standard', 'Premium', 'Grand Style'] },
  ],
  tata: [
    { slug: 'indica', nameAr: 'Indica', nameEn: 'Indica', trims: ['Base', 'LS', 'LX'] },
    { slug: 'indigo', nameAr: 'Indigo', nameEn: 'Indigo', trims: ['Base', 'LS', 'LX'] },
    { slug: 'nexon', nameAr: 'Nexon', nameEn: 'Nexon', trims: ['XE', 'XM', 'XT', 'XZ'] },
    { slug: 'harrier', nameAr: 'Harrier', nameEn: 'Harrier', trims: ['XE', 'XM', 'XT', 'XZ'] },
  ],
  plymouth: [
    { slug: 'prowler', nameAr: 'Prowler', nameEn: 'Prowler', trims: ['Standard'] },
    { slug: 'voyager', nameAr: 'Voyager', nameEn: 'Voyager', trims: ['Standard', 'SE'] },
    { slug: 'grand_voyager', nameAr: 'Grand Voyager', nameEn: 'Grand Voyager', trims: ['Standard', 'SE', 'LE'] },
  ],
  imperial: [
    { slug: 'crown', nameAr: 'Crown', nameEn: 'Crown', trims: ['Standard', 'LeBaron'] },
  ],
  ineos: [
    { slug: 'grenadier', nameAr: 'Grenadier', nameEn: 'Grenadier', trims: ['Standard', 'Trialmaster', 'Fieldmaster'] },
    { slug: 'quartermaster', nameAr: 'Quartermaster', nameEn: 'Quartermaster', trims: ['Standard', 'Trialmaster', 'Fieldmaster'] },
  ],
};
