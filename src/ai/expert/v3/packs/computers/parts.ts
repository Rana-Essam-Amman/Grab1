import { goodsPack } from '../goods';

export const pcPartsPack = goodsPack({
  id: 'pcPartsPack',
  noun: 'قطعة كمبيوتر',
  detect: /رام|معالج/,
  brands: [],
});
