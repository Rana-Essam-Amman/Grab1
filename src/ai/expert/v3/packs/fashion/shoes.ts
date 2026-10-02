import { goodsPack } from '../goods';

export const shoesPack = goodsPack({
  id: 'shoesPack',
  noun: 'حذاء',
  detect: /حذاء|جزمة/,
  brands: [],
});
