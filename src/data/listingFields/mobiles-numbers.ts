import type { ListingField } from './types';
import { DIGITS_OPTIONS, NETWORK_OPTIONS, MOBILE_SELLER_TYPE } from './mobiles-options';

export const MOBILES_NUMBERS_FIELDS: ListingField[] = [
    { key: 'numberType', labelAr: 'نوع الرقم', labelEn: 'Number Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'vip', labelAr: 'مميز / VIP', labelEn: 'VIP / Special' }, { value: 'gold', labelAr: 'ذهبي', labelEn: 'Gold' }, { value: 'regular', labelAr: 'عادي', labelEn: 'Regular' },
    ]},
    { key: 'digits', labelAr: 'عدد الأرقام', labelEn: 'Number of Digits', type: 'select', allowOther: true, required: true, options: DIGITS_OPTIONS },
    { key: 'network', labelAr: 'الشبكة', labelEn: 'Network', type: 'select', allowOther: true, required: true, options: NETWORK_OPTIONS },
    { key: 'transferStatus', labelAr: 'حالة التنازل والتوثيق', labelEn: 'Transfer Status', type: 'select', allowOther: true, required: false, options: [
      { value: 'ready', labelAr: 'جاهز للتنازل الفوري', labelEn: 'Ready for Transfer' }, { value: 'needs_auth', labelAr: 'بحاجة توثيق', labelEn: 'Needs Auth' },
    ]},
    { key: 'price', labelAr: 'السعر المطلوب', labelEn: 'Requested Price', type: 'number', required: false },
    { key: 'repeatedDigits', labelAr: 'أرقام مكررة', labelEn: 'Repeated Digits', type: 'select', allowOther: true, required: false, options: [
      { value: 'all_same', labelAr: 'كل الأرقام مكررة', labelEn: 'All Same Digits' },
      { value: 'triple_sequence', labelAr: 'ثلاثي متتالي', labelEn: 'Triple Sequence' },
      { value: 'pair_sequence', labelAr: 'ثنائي متتالي', labelEn: 'Pair Sequence' },
      { value: 'palindrome', labelAr: 'يُقرأ من الاتجاهين', labelEn: 'Palindrome' },
      { value: 'none', labelAr: 'بدون نمط خاص', labelEn: 'No Special Pattern' },
    ]},
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: false, required: false, options: MOBILE_SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ];
