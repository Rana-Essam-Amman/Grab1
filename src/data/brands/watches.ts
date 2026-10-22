import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const WATCHES_BRANDS: readonly GenericBrand[] = [
  { slug: 'rolex', nameAr: 'رولكس', nameEn: 'Rolex' },
  { slug: 'omega', nameAr: 'أوميغا', nameEn: 'Omega' },
  { slug: 'seiko', nameAr: 'سيكو', nameEn: 'Seiko' },
  { slug: 'casio', nameAr: 'كاسيو', nameEn: 'Casio' },
  { slug: 'tag_heuer', nameAr: 'تاج هوير', nameEn: 'TAG Heuer' },
  { slug: 'breitling', nameAr: 'بريتلينغ', nameEn: 'Breitling' },
  { slug: 'patek_philippe', nameAr: 'باتيك فيليب', nameEn: 'Patek Philippe' },
  { slug: 'audemars_piguet', nameAr: 'أوديمار بيغيه', nameEn: 'Audemars Piguet' },
  { slug: 'iwc', nameAr: 'آي دبليو سي', nameEn: 'IWC' },
  { slug: 'tudor', nameAr: 'تيودور', nameEn: 'Tudor' },
  { slug: 'longines', nameAr: 'لونجين', nameEn: 'Longines' },
  { slug: 'tissot', nameAr: 'تيسو', nameEn: 'Tissot' },
  { slug: 'citizen', nameAr: 'سيتيزن', nameEn: 'Citizen' },
  { slug: 'hamilton', nameAr: 'هاملتون', nameEn: 'Hamilton' },
];

export const WATCHES_MODELS: Record<string, readonly GenericModel[]> = {
  rolex: [{ slug: 'submariner', nameAr: 'سابمارينر', nameEn: 'Submariner' }, { slug: 'daytona', nameAr: 'دايتونا', nameEn: 'Daytona' }, { slug: 'datejust', nameAr: 'ديتجست', nameEn: 'Datejust' }, { slug: 'gmt-master-ii', nameAr: 'جي إم تي ماستر 2', nameEn: 'GMT-Master II' }, { slug: 'explorer', nameAr: 'إكسبلورر', nameEn: 'Explorer' }],
  omega: [{ slug: 'speedmaster', nameAr: 'سبيدماستر', nameEn: 'Speedmaster' }, { slug: 'seamaster', nameAr: 'سيماستر', nameEn: 'Seamaster' }, { slug: 'constellation', nameAr: 'كونستليشن', nameEn: 'Constellation' }],
  seiko: [{ slug: 'prospex', nameAr: 'بروسبيكس', nameEn: 'Prospex' }, { slug: 'presage', nameAr: 'بريساج', nameEn: 'Presage' }, { slug: '5-sports', nameAr: '5 سبورتس', nameEn: '5 Sports' }],
  casio: [{ slug: 'g-shock', nameAr: 'جي شوك', nameEn: 'G-Shock' }, { slug: 'edifice', nameAr: 'إديفيس', nameEn: 'Edifice' }, { slug: 'vintage', nameAr: 'فينتيج', nameEn: 'Vintage' }],
  tag_heuer: [{ slug: 'carrera', nameAr: 'كاريرا', nameEn: 'Carrera' }, { slug: 'aquaracer', nameAr: 'أكواراسر', nameEn: 'Aquaracer' }, { slug: 'monaco', nameAr: 'موناكو', nameEn: 'Monaco' }],
  breitling: [{ slug: 'navitimer', nameAr: 'نافيتيمر', nameEn: 'Navitimer' }, { slug: 'superocean', nameAr: 'سوبرأوشن', nameEn: 'Superocean' }, { slug: 'chronomat', nameAr: 'كرونومات', nameEn: 'Chronomat' }],
  patek_philippe: [{ slug: 'nautilus', nameAr: 'نوتيلوس', nameEn: 'Nautilus' }, { slug: 'calatrava', nameAr: 'كالاترافا', nameEn: 'Calatrava' }, { slug: 'aquanaut', nameAr: 'أكوانوت', nameEn: 'Aquanaut' }],
  audemars_piguet: [{ slug: 'royal-oak', nameAr: 'رويال أوك', nameEn: 'Royal Oak' }, { slug: 'royal-oak-offshore', nameAr: 'رويال أوك أوفشور', nameEn: 'Royal Oak Offshore' }, { slug: 'code-1159', nameAr: 'كود 11.59', nameEn: 'Code 11.59' }],
  iwc: [{ slug: 'portugieser', nameAr: 'بورتوغيزر', nameEn: 'Portugieser' }, { slug: 'pilot', nameAr: 'بايلوت', nameEn: 'Pilot' }, { slug: 'portofino', nameAr: 'بورتوفينو', nameEn: 'Portofino' }],
  tudor: [{ slug: 'black-bay', nameAr: 'بلاك باي', nameEn: 'Black Bay' }, { slug: 'pelagos', nameAr: 'بيلاغوس', nameEn: 'Pelagos' }, { slug: 'royal', nameAr: 'رويال', nameEn: 'Royal' }],
  longines: [{ slug: 'hydroconquest', nameAr: 'هايدروكونكويست', nameEn: 'HydroConquest' }, { slug: 'master-collection', nameAr: 'ماستر كولكشن', nameEn: 'Master Collection' }, { slug: 'spirit', nameAr: 'سبيريت', nameEn: 'Spirit' }],
  tissot: [{ slug: 'prx', nameAr: 'بي آر إكس', nameEn: 'PRX' }, { slug: 'seastar', nameAr: 'سيستار', nameEn: 'Seastar' }, { slug: 'gentleman', nameAr: 'جنتلمان', nameEn: 'Gentleman' }],
  citizen: [{ slug: 'eco-drive', nameAr: 'إيكو درايف', nameEn: 'Eco-Drive' }, { slug: 'promaster', nameAr: 'بروماستر', nameEn: 'Promaster' }, { slug: 'tsuyosa', nameAr: 'تسويوسا', nameEn: 'Tsuyosa' }],
  hamilton: [{ slug: 'khaki-field', nameAr: 'كاكي فيلد', nameEn: 'Khaki Field' }, { slug: 'jazzmaster', nameAr: 'جازماستر', nameEn: 'Jazzmaster' }, { slug: 'ventura', nameAr: 'فنتورا', nameEn: 'Ventura' }],
};
