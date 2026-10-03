import { goodsPack } from '../goods';

export const bagsPack = goodsPack({
  id: 'bagsPack',
  noun: 'حقيبة',
  detect: /حقيبة|شنطة/,
  brands: [],
});
