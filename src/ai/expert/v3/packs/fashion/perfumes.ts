import { goodsPack } from '../goods';

export const perfumesPack = goodsPack({
  id: 'perfumesPack',
  noun: 'عطر',
  detect: /عطر|برفان/,
  brands: [],
});
