import { goodsPack } from '../goods';

export const laptopsPack = goodsPack({
  id: 'laptopsPack',
  noun: 'لابتوب',
  detect: /لابتوب/,
  brands: ['أبل','لينوفو','ديل'],
});
