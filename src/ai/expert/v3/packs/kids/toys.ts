import { goodsPack } from '../goods';

export const toysPack = goodsPack({
  id: 'toysPack',
  noun: 'لعبة',
  detect: /لعبة|ألعاب/,
  brands: [],
});
