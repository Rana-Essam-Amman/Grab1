import { goodsPack } from '../goods';

export const livingPack = goodsPack({
  id: 'livingPack',
  noun: 'جلسة',
  detect: /كنبة|كنبه|جلسة/,
  brands: [],
});
