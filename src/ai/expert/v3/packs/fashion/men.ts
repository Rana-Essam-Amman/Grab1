import { goodsPack } from '../goods';

export const menPack = goodsPack({
  id: 'menPack',
  noun: 'قطعة رجالية',
  detect: /قميص|بدلة/,
  brands: [],
});
