import { goodsPack } from '../goods';

export const appliancePack = goodsPack({
  id: 'appliancePack',
  noun: 'جهاز منزلي',
  detect: /غسالة|براد|ثلاجة/,
  brands: [],
});
