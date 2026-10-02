import { goodsPack } from '../goods';

export const womenPack = goodsPack({
  id: 'womenPack',
  noun: 'قطعة نسائية',
  detect: /فستان|عباية/,
  brands: [],
});
